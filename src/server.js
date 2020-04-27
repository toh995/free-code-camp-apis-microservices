const express = require("express");
const cors = require("cors");

require("sexy-require");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Enable CORS so that the API is remotely testable by freeCodeCamp
app.use(cors({ optionSuccessStatus: 200 }));

// Mount API routers
const timestampRouter = require("/src/routers/timestamp");
const whoamiRouter = require("/src/routers/whoami");

app.use("/api",
    timestampRouter,
    whoamiRouter
);

const listener = app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${listener.address().port}...`);
});