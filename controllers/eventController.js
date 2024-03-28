import Events from "../models/EventModel.js";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import ErrorResponse from "../utils/errorHandler.js";
import logger from "../utils/logger.js";
import axios from "axios";

const loadEventsFromCSV = async (req, res, next) => {
  try {
    const filePath = path.join("./events.csv"); // Path to your CSV file

    if (!fs.existsSync(filePath)) {
      return next(new ErrorResponse("File not found", 404));
    }

    // Clear existing data from the database
    await Events.deleteMany();

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row) => {
        const {
          event_name: eventName,
          city_name: cityName,
          date,
          time,
          latitude,
          longitude,
        } = row;

        const newEvent = new Events({
          eventName,
          cityName,
          date: new Date(date),
          time,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        });

        // Save event to the database
        await newEvent.save();
      })
      .on("end", () => {
        res.status(201).json({ message: "Data loaded successfully" });
      });
  } catch (error) {
    logger.error(`Error loading data from CSV: ${error.message}`);
    return next(new ErrorResponse(`Server Error : ${error.message}`, 500));
  }
};

const createEvent = async (req, res, next) => {
  const { eventName, cityName, date, time, latitude, longitude } = req.body;

  if (!eventName || !cityName || !date || !time || !latitude || !longitude) {
    return next(new ErrorResponse("Please provide all the fileds", 401));
  }

  try {
    const createdEvent = await Events.create({
      eventName,
      cityName,
      date,
      time,
      latitude,
      longitude,
    });

    if (!createdEvent) {
      return next(new ErrorResponse("Unable to create an event", 401));
    }
    res.status(200).json({
      success: true,
      res: createdEvent,
    });
  } catch (error) {
    return next(new ErrorResponse(`Server Error : ${error.message}`, 500));
  }
};

const findEvents = async (req, res) => {
  try {
    const { latitude, longitude, date, page } = req.body;

    if (!latitude || !longitude || !date) {
      return res.status(400).json({
        error: "Latitude, longitude, and date are required parameters",
      });
    }

    // Parse specified date
    const specifiedDate = new Date(date);

    // Calculate date range (14 days from the specified date)
    const endDate = new Date(specifiedDate);
    endDate.setDate(endDate.getDate() + 14);

    // Query events from the database
    const events = await Events.find({
      date: { $gte: specifiedDate, $lte: endDate },
    });

    // Calculate distance, retrieve weather information, and add to each event
    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        // Make request to Weather API to retrieve weather information
        const weatherResponse = await axios.get(
          `https://gg-backend-assignment.azurewebsites.net/api/Weather?code=${process.env.WEATHER_API_CODE}==&city=Port%20${event.cityName}&date=${event.date}`
        );

        // Make request to Distance API to calculate distance between user and event location
        const distanceResponse = await axios.get(
          `https://gg-backend-assignment.azurewebsites.net/api/Distance?code=${process.env.DISTANCE_API_CODE}==&latitude1=${latitude}&longitude1=${longitude}&latitude2=${event.latitude}&longitude2=${event.longitude}`
        );

        // Extract weather information and distance from the responses
        const weather = weatherResponse.data.weather;
        const eventDistance = distanceResponse.data.distance;

        // Return event details with distance and weather
        return {
          eventName: event.eventName,
          city: event.cityName,
          date: event.date,
          weather,
          distance: eventDistance,
        };
      })
    );

    // Sort events by the earliest event after the specified date
    eventsWithDetails.sort((a, b) => a.date - b.date);

    const totalEvents = events.length;

    // Calculate total number of pages
    const pageSize = 10;
    const totalPages = Math.ceil(totalEvents / pageSize);

    // Paginate the response with a page size of 10
    const pageNumber = parseInt(req.body.page) || 1;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEvents = eventsWithDetails.slice(startIndex, endIndex);

    res.status(200).json({
      events: paginatedEvents,
      page,
      pageSize,
      totalEvents,
      totalPages,
    });
  } catch (error) {
    console.error("Error finding events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { loadEventsFromCSV, findEvents, createEvent };
