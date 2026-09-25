const mongoose = require("mongoose");
const Announcement = require("../models/Announcement");
const { defaultAnnouncements } = require("../config/defaultData");

// Render Public Announcements / Notice Board
exports.getAnnouncements = async (req, res) => {
    try {
        let announcements = [];
        if (mongoose.connection.readyState === 1) {
            announcements = await Announcement.find({}).sort({ createdAt: -1 });
        }

        if (!announcements || announcements.length === 0) {
            announcements = defaultAnnouncements;
        }

        res.render("announcements", {
            title: "Notices & Announcements - Ansari Tutorial",
            announcements,
        });
    } catch (error) {
        console.error("Announcements Error:", error.message);
        res.render("announcements", {
            title: "Notices & Announcements - Ansari Tutorial",
            announcements: defaultAnnouncements,
        });
    }
};
