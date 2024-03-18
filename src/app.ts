import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes";
import { Pool, Client } from "pg";
// import {Connector} from '@google-cloud/cloud-sql-connector';

const port = process.env.PORT || 5000;

const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASE,
  port: Number(process.env.DBPORT || 5001),
});


// Create Express server new Express Instance
const app = express();

// Express configuration
app.use(cors()); // Enable CORS
app.use(helmet()); // Enable Helmet
app.use(morgan("dev")); // Enable Morgan
app.use(express.json()); // <=== Enable JSON body parser

// Connect PostgreSQL DB
(async () => {
  const client = await pool.connect();
  try {
    const response = await client.query("SELECT current_user");
    const { rows } = response;
    const currentUser = rows[0]["current_user"];
    console.log(currentUser); // postgres
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
});

// (async () => {
//   try {
//     const response = await pool.query("SELECT current_user");
//     const {rows} = response;
//     const currentUser = rows[0]['current_user'];
//     console.log(currentUser);  // postgres
// } catch (err) {
//     console.log(err);
// }
// })();

// Use routes
app.use("/", router);

// Start Express server
app.listen(port, () => {
  // Callback function when server is successfully started
  console.log(`Server started at http://localhost:${port}`);
});

// Export Express app
export default app;
