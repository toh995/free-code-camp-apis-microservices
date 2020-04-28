const express = require("express");
const User = require("./models/user");
const moment = require("moment");
const lodash = require("lodash");
const Helpers = require("/helpers");

const router = express.Router();

router.post("/new-user", async (req, res, next) => {
    const { username } = req.body;

    const user = new User({ username });
    try {
        await user.save();
    } catch (err) {
        next(err);
        return;
    }

    const retObj = lodash.pick(user, ["username", "_id"]);
    res.json(retObj);
});

router.get("/users", async (req, res, next) => {
    let users;
    try {
        users = await User.find().exec();
    } catch (err) {
        next(err);
        return;
    }

    if (!user) {
        const err = new Error("Could not find users!");
        next(err);
        return;
    }

    users = users.map(user => lodash.pick(user, ["username", "_id"]));
    res.json(users);
});

router.post("/add", async (req, res, next) => {
    let { userId, description, duration, date } = req.body;

    // Validate duration
    if (!Helpers.isNumeric(duration)) {
        const err = new Error(`ERROR: "duration" must be a numeric value!`);
        next(err);
        return;
    }
    duration = +duration;

    // Format and validate date
    date = date ? moment(date, "YYYY-MM-DD") : moment();
    if (isNaN(date)) {
        const err = new Error("ERROR: could not parse the date!")
        next(err);
        return;
    }
    date = date.format("ddd MMM DD YYYY");

    // Update the existing user record
    const newExercise = {
        description,
        duration,
        date
    };

    const update = {
        $push: {
            log: newExercise
        }
    };

    let user;
    try {
        user = await User.findByIdAndUpdate(userId, update, { new: true }).exec();
    } catch (err) {
        next(err);
        return;
    }

    if (!user) {
        const err = new Error("Could not find user!");
        next(err);
        return;
    }

    // Return appropriate JSON after updating
    const retObj = lodash.assign({}, newExercise, lodash.pick(user, ["username", "_id"]));
    res.json(retObj)
});

router.get("/log", async (req, res, next) => {
    let { userId, from, to, limit } = req.query;

    // Validate limit
    if (limit && !Helpers.isNumeric(limit)) {
        const err = new Error("ERROR: limit must be a numeric value!");
        next(err);
        return;
    }

    // Format and validate from and to
    if (from) {
        from = moment(from, "YYYY-MM-DD");
        if (isNaN(from)) {
            const err = new Error("ERROR: could not parse the date!");
            next(err);
            return;
        }
    }

    if (to) {
        to = moment(to, "YYYY-MM-DD");
        if (isNaN(to)) {
            const err = new Error("ERROR: could not parse the date!");
            next(err);
            return;
        }
    }

    // Get the user record
    let user;
    try {
        user = await User.findById(userId).exec();
    } catch (err) {
        next(err);
        return;
    }

    if (!user) {
        const err = new Error("Could not find user!");
        next(err);
        return;
    }

    if (limit) {
        limit = +limit;
        user.log = user.log.slice(0, limit);
    }

    // Filter the log
    let log = user.log;

    if (from) {
        log = log.filter(exercise => moment(exercise.date, "ddd MMM DD YYYY").isAfter(from));
    }
    if (to) {
        log = log.filter(exercise => moment(exercise.date, 'ddd MMM DD YYYY').isBefore(to));
    }

    let retObj = {
        count: log.length,
        log
    };
    retObj = lodash.assign(retObj, lodash.pick(user, ["username", "_id"]));
    res.json(retObj);
});

module.exports = router;