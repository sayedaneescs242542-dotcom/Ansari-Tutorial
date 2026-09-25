const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        parentPhone: {
            type: String,
            required: true,
            trim: true
        },
        course: {
            type: String,
            required: true,
            trim: true
        },
        stream: {
            type: String,
            enum: ["School", "Commerce", "Science", "Arts", "Professional", "General"],
            default: "General",
            trim: true
        },
        previousPercentage: {
            type: Number,
            required: true
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true
        },
        dob: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        },
        batchPreference: {
            type: String,
            enum: ["Morning Batch", "Evening Batch", "Weekend Batch", "Flexible"],
            default: "Flexible"
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending"
        },
        remarks: {
            type: String,
            default: "Application submitted successfully. Counseling scheduled."
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Admission", admissionSchema);