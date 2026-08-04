// routes/test.routes.js

const express = require("express");
const router = express.Router();

const { searchJobs } = require("../services/crust.services");

router.get("/crust", async (req, res) => {

    try {

        const jobs = await searchJobs({
            keywords: "Software Engineer",
            location: "Nashik, Maharashtra, India"
        });
        console.log(JSON.stringify(jobs, null, 2));
        res.json(jobs);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message
        });
    }

});

module.exports = router;