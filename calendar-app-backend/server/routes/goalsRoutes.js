const express = require("express");
const router = express.Router();
const Goal = require("../models/Goals-models");

router.get("/", async (req, res) => {
    const goals = await Goal.find();
    res.json(goals);
});

module.exports = router;
