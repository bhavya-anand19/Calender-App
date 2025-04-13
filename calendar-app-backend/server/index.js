// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connect
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err.message));

// Root Route
app.get("/", (req, res) => res.send("Calendar API Running"));

//Routes
const eventRoutes = require("./routes/eventRoutes");
app.use("/api/events", eventRoutes);

//Server Listen
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
