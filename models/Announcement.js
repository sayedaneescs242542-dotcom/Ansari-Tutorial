const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["Notice", "Exam", "Holiday", "Admission"],
            default: "Notice",
        },
        isImportant: {
            type: Boolean,
            default: false,
        },
        targetAudience: {
            type: String,
            default: "All",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
