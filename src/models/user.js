const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const exerciseSchema = new mongoose.Schema({
    description: String,
    duration: Number,
    date: String
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        dropDups: true
    },
    log: [exerciseSchema]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);