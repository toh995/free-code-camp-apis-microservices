const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

require("sexy-require");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Enable CORS so that the API is remotely testable by freeCodeCamp
app.use(cors({ optionSuccessStatus: 200 }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure routes
const apiRouter = express.Router();
const viewRouter = express.Router();

const paths = [
    "/exercise",
    "/fileanalyse",
    "/shorturl",
    "/whoami",
    "/timestamp"
];

for (const path of paths) {
    // Mount to apiRouter
    const router = require(`.${path}/router`);
    apiRouter.use(path, router);

    // Mount to viewRouter
    viewRouter.use(path, express.static(`${__dirname}${path}/public`));
    viewRouter.get(path, (req, res) => {
        res.sendFile(`${__dirname}${path}/views/index.html`);
    });
}

// Mount homepage to viewRouter
viewRouter.use("/", (req, res) => {
    res.sendFile(`${__dirname}/home.html`);
});

// Mount apiRouter and viewRouter to the app
app.use("/api", apiRouter);
app.use("/", viewRouter);

// Not found middleware
app.use((req, res, next) => {
    return next({ status: 404, message: "not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    let errCode, errMessage

    if (err.errors) {
        // mongoose validation error
        errCode = 400;
        const keys = Object.keys(err.errors);
        // report the first validation error
        errMessage = err.errors[keys[0]].message;
    } else {
        // generic or custom error
        errCode = err.status || 500;
        errMessage = err.message || "Internal Server Error";
    }
    
    res.status(errCode)
        .type("txt")
        .send(errMessage);
});

// Connect to DB
const mongooseConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose.connect(process.env.MONGO_URI, mongooseConnectOptions);

// Set up server to listen
const listener = app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${listener.address().port}...`);
});