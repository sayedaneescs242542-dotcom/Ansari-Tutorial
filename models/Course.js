const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["School", "Commerce", "Science", "Arts", "Professional"],
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
            required: true, // e.g. "1 Year", "6 Months"
        },
        fee: {
            type: String,
            required: true, // e.g. "₹25,000 / Year"
        },
        subjects: [
            {
                type: String,
            },
        ],
        highlightBadge: {
            type: String,
            default: "Popular Choice",
        },
        iconClass: {
            type: String,
            default: "fas fa-graduation-cap",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
