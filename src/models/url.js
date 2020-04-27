const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const urlSchema = new mongoose.Schema({
    original_url: String,
    short_url: Number
});

// Add autoIncrement plugin
autoIncrement.initialize(mongoose.connection);

urlSchema.plugin(autoIncrement.plugin, {
    model: "Url",
    field: "short_url",
    startAt: 1
});

module.exports = mongoose.model("Url", urlSchema);