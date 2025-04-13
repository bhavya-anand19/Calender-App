const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: String, required: true },  // ✅ Changed
    end: { type: String, required: true },    // ✅ Changed
    color: { type: String, required: true },
    extendedProps: {
        category: { type: String, required: true },
    },
});


module.exports = mongoose.model("Event", EventSchema);
