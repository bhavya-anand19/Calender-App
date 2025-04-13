const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
    title: String,
    color: String,
    tasks: [String]
});

module.exports = mongoose.model("Goal", GoalSchema);
