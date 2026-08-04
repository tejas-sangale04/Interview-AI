const mongoose = require("mongoose")

const apiCounterSchema = new mongoose.Schema({
    apiKey: {
        type: String,
        required: true,
        unique: true,
        default: "openai_global"
    },
    totalRequests: {
        type: Number,
        default: 0
    },
    limit: {
        type: Number,
        default: 20
    },
    lastRequestAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
})

const apiCounterModel = mongoose.model("apiCounters", apiCounterSchema)

module.exports = apiCounterModel
