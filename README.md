# Project README

## Tech Stack and Database Choice

### Tech Stack:
- **Node.js with Express.js**: Node.js provides a lightweight and efficient runtime environment for server-side applications, while Express.js simplifies the process of building robust APIs with its minimalist framework.
- **MongoDB**: MongoDB was chosen as the database due to its flexibility, scalability, and ability to handle unstructured data effectively. It's well-suited for applications with evolving data requirements.

### Design Decisions and Challenges:
- **Choice of CSV Parser**: The `csv-parser` package was selected for parsing CSV files due to its ease of use and efficiency in handling large datasets.
- **Error Handling**: An `ErrorResponse` class was implemented for consistent error responses throughout the application. This helps in maintaining a standardized error handling mechanism.
- **Logging**: Logging functionality using `logger` was incorporated to facilitate monitoring and debugging of the application. It logs errors and important events, providing insights into the application's behavior.
- **External APIs**: Integration with external APIs (Weather API and Distance API) was necessary to retrieve weather information and calculate distances. Asynchronous requests using `axios` were made to these APIs, enhancing the functionality of the application.
- **Pagination**: Pagination logic was implemented to manage large datasets efficiently and improve API response times. This ensures a better user experience by breaking down results into manageable chunks.

## Setup Instructions:

### Prerequisites:
- Node.js and npm should be installed on your system.
- MongoDB server should be running locally or accessible remotely.

### Steps:
1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Install dependencies by running `npm install`.
4. Ensure MongoDB is running.
5. Create a `.env` file in the root directory and specify environment variables like `PORT`, `MONGODB_URI`, etc. (if required).
6. Place your `events.csv` file in the project directory.
7. Run the server using `npm start` or `node app.js`.
8. Use appropriate API endpoints to interact with the application.

## API Endpoints:

- **Upload Events from CSV**: `GET /api/upload`
  - Description: Endpoint to load events data from CSV file into the database.
- **Create Event**: `POST /api/create`
  - Description: Endpoint to create a new event.
- **Find Events**: `POST /api/find`
  - Description: Endpoint to find events based on user's location, date, and pagination parameters.

## Sample Usage:
https://www.postman.com/speeding-escape-826459/workspace/api-collection/documentation/19481980-1982feca-a7c4-460d-a55a-b7fb18823650
