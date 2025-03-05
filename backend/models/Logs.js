
const mongoose = require("mongoose")

const logSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      required: true,
      index: true, // Index for faster queries on timestamp
    },
    level: {
      type: String,
      required: true,
      enum: ["info", "warning", "error", "debug", "critical"],
      index: true, // Index for faster filtering by log level
    },
    service: {
      type: String,
      required: true,
      index: true, // Index for faster filtering by service
    },
    action: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    details: {
      user: String,
      ip: String,
      userAgent: String,
      statusCode: Number,
      duration: Number,
      requestId: String,
      additionalInfo: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
)

// Add a text index for full-text search on message and service
logSchema.index({ message: "text", service: "text" })

// Add a compound index for common query patterns
logSchema.index({ service: 1, level: 1, timestamp: -1 })

const Log = mongoose.model("Logs", logSchema)

module.exports = Log