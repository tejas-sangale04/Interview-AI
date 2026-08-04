const apiCounterModel = require("../models/apiCounter.model")

/**
 * Global rate limiting configuration
 * Total limit across ALL users for the OpenAI API key
 */
const GLOBAL_API_LIMIT = 20

/**
 * @description Get or create the global API counter
 */
async function getGlobalCounter() {
    let counter = await apiCounterModel.findOne({ apiKey: "openai_global" })
    
    if (!counter) {
        counter = await apiCounterModel.create({
            apiKey: "openai_global",
            totalRequests: 0,
            limit: GLOBAL_API_LIMIT,
            lastRequestAt: null
        })
    }
    
    return counter
}

/**
 * @description Middleware to check if global API limit has been reached
 */
async function checkGlobalApiLimit(req, res, next) {
    try {
        const counter = await getGlobalCounter()

        if (counter.totalRequests >= counter.limit) {
            return res.status(429).json({
                message: `API limit reached. Maximum ${counter.limit} requests allowed. Please contact support for additional access.`,
                usage: {
                    current: counter.totalRequests,
                    limit: counter.limit,
                    remaining: 0
                }
            })
        }

        // Pass counter to request for later update
        req.apiCounter = counter
        next()
    } catch (error) {
        console.error("Global rate limit check error:", error)
        return res.status(500).json({
            message: "Error checking API limit.",
            error: error.message
        })
    }
}

/**
 * @description Increment global API usage count
 */
async function incrementGlobalApiUsage() {
    try {
        await apiCounterModel.findOneAndUpdate(
            { apiKey: "openai_global" },
            {
                $inc: { totalRequests: 1 },
                $set: { lastRequestAt: new Date() }
            },
            { upsert: true }
        )
    } catch (error) {
        console.error("Error incrementing global API usage:", error)
    }
}

/**
 * @description Get global API usage statistics
 */
async function getGlobalApiUsage() {
    try {
        const counter = await getGlobalCounter()
        
        return {
            used: counter.totalRequests,
            limit: counter.limit,
            remaining: Math.max(0, counter.limit - counter.totalRequests),
            lastRequestAt: counter.lastRequestAt
        }
    } catch (error) {
        console.error("Error getting global API usage:", error)
        throw error
    }
}

/**
 * @description Reset global API counter (admin use only)
 */
async function resetGlobalApiCounter() {
    try {
        await apiCounterModel.findOneAndUpdate(
            { apiKey: "openai_global" },
            {
                $set: {
                    totalRequests: 0,
                    lastRequestAt: null
                }
            }
        )
        return { success: true, message: "Global API counter reset successfully" }
    } catch (error) {
        console.error("Error resetting global API counter:", error)
        throw error
    }
}

module.exports = {
    checkGlobalApiLimit,
    incrementGlobalApiUsage,
    getGlobalApiUsage,
    resetGlobalApiCounter,
    GLOBAL_API_LIMIT
}
