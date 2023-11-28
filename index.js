const dotenv = require("dotenv");
const envFile =
  process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev";
dotenv.config({ path: envFile });
// Dependency
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT;
const db = require("./src/configs/db");
const route = require("./src/routes");
const app = express();

// Config
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect DB
db.connect();
route(app);

// Running server
app.listen(port, console.log("Server is running at port", port));
