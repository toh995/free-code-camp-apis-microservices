const express = require("express");
const cors = require("cors");

const app = express();

// Enable CORS so that the API is remotely testable by freeCodeCamp
app.use(cors({ optionsSuccessStatus: 200 }));