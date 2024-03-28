import mongoose from "mongoose";

const EventSchema = mongoose.Schema({
  eventName: {
    type: String,
    required: [true, "please provide event name"],
  },
  cityName: {
    type: String,
    required: [true, "please provide city name"],
  },
  date: {
    type: Date,
    required: [true, "please provide data"],
  },
  time: {
    type: String,
    required: [true, "please provide time"],
  },
  latitude: {
    type: Number,
    required: [true, "please provide latitude"],
  },
  longitude: {
    type: Number,
    required: [true, "please provide longitude"],
  },
});

const Events = mongoose.model("Events", EventSchema);
export default Events;
