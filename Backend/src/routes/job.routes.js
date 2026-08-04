const express = require("express");
const router = express.Router();
const { searchJobs } = require("../services/crust.services");

/**
 * POST /api/jobs/search
 * Search for jobs based on role and location
 */
router.post("/search", async (req, res) => {
    try {
        const { role, location, page = 1 } = req.body;

        // Validation
        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role/keywords is required"
            });
        }

        if (!location) {
            return res.status(400).json({
                success: false,
                message: "Location is required"
            });
        }

        // Search jobs using Crust API
        const result = await searchJobs({
            keywords: role,
            location: location,
            page: page
        });

        // Add LinkedIn search URLs to each job
        const jobsWithUrls = (result.jobs || []).map(job => {
            // Construct LinkedIn job search URL using title and company
            const searchQuery = encodeURIComponent(`${job.title} ${job.company}`);
            const locationQuery = encodeURIComponent(job.location || location);
            const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}&location=${locationQuery}`;
            
            return {
                ...job,
                url: job.jobUrl || linkedInUrl // Use jobUrl if available, otherwise use constructed URL
            };
        });

        res.json({
            success: true,
            data: {
                jobs: jobsWithUrls,
                totalResults: jobsWithUrls.length,
                page: page,
                searchParams: {
                    role,
                    location
                }
            }
        });

    } catch (err) {
        console.error("Job search error:", err.message);
        res.status(500).json({
            success: false,
            message: "Failed to search jobs",
            error: err.message
        });
    }
});

/**
 * GET /api/jobs/search (query params version)
 */
router.get("/search", async (req, res) => {
    try {
        const { role, location, page = 1 } = req.query;

        if (!role || !location) {
            return res.status(400).json({
                success: false,
                message: "Both role and location are required"
            });
        }

        const result = await searchJobs({
            keywords: role,
            location: location,
            page: parseInt(page)
        });

        // Add LinkedIn search URLs to each job
        const jobsWithUrls = (result.jobs || []).map(job => {
            // Construct LinkedIn job search URL using title and company
            const searchQuery = encodeURIComponent(`${job.title} ${job.company}`);
            const locationQuery = encodeURIComponent(job.location || location);
            const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}&location=${locationQuery}`;
            
            return {
                ...job,
                url: job.jobUrl || linkedInUrl
            };
        });

        res.json({
            success: true,
            data: {
                jobs: jobsWithUrls,
                totalResults: jobsWithUrls.length,
                page: parseInt(page),
                searchParams: {
                    role,
                    location
                }
            }
        });

    } catch (err) {
        console.error("Job search error:", err.message);
        res.status(500).json({
            success: false,
            message: "Failed to search jobs",
            error: err.message
        });
    }
});

module.exports = router;
