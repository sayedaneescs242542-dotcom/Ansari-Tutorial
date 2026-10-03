const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Course = require("../models/Course");
const Announcement = require("../models/Announcement");
const { defaultCourses, defaultAnnouncements } = require("../config/defaultData");

// In-Memory Fast Cache for Home Page (TTL: 60s)
let homeCache = null;
let homeCacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000;

// Home Page Route
router.get("/", async (req, res) => {
    const now = Date.now();

    // Serve from in-memory cache if fresh
    if (homeCache && (now - homeCacheTimestamp < CACHE_TTL_MS)) {
        return res.render("index", {
            title: "Ansari Tutorial - Premium Coaching for School, Commerce, Science, Arts & CA",
            featuredCourses: homeCache.featuredCourses,
            latestAnnouncements: homeCache.latestAnnouncements,
            totalCourses: homeCache.totalCourses,
        });
    }

    try {
        let featuredCourses = [];
        let latestAnnouncements = [];
        let totalCourses = 0;

        if (mongoose.connection.readyState === 1) {
            // Execute all queries concurrently with lean() for maximum speed
            const [coursesRes, announcementsRes, countRes] = await Promise.all([
                Course.find({}).limit(6).lean(),
                Announcement.find({}).sort({ createdAt: -1 }).limit(3).lean(),
                Course.countDocuments(),
            ]);
            featuredCourses = coursesRes;
            latestAnnouncements = announcementsRes;
            totalCourses = countRes;
        }

        if (!featuredCourses || featuredCourses.length === 0) {
            featuredCourses = defaultCourses;
            totalCourses = defaultCourses.length;
        }

        if (!latestAnnouncements || latestAnnouncements.length === 0) {
            latestAnnouncements = defaultAnnouncements;
        }

        // Update cache
        homeCache = { featuredCourses, latestAnnouncements, totalCourses };
        homeCacheTimestamp = now;

        res.render("index", {
            title: "Ansari Tutorial - Premium Coaching for School, Commerce, Science, Arts & CA",
            featuredCourses,
            latestAnnouncements,
            totalCourses,
        });
    } catch (error) {
        res.render("index", {
            title: "Ansari Tutorial - Premium Coaching for School, Commerce, Science, Arts & CA",
            featuredCourses: defaultCourses,
            latestAnnouncements: defaultAnnouncements,
            totalCourses: defaultCourses.length,
        });
    }
});

// About Page Route
router.get("/about", (req, res) => {
    res.render("about", { title: "About Us - Ansari Tutorial" });
});

// UML & System Modeling Diagrams Route
router.get("/uml-diagrams", (req, res) => {
    res.render("uml", { 
        title: "System Modeling & UML Diagrams - Ansari Tutorial",
        pdfPath: "/docs/Ansari_Tutorial_UML_Report.pdf"
    });
});

// Shortcut redirect
router.get("/uml", (req, res) => {
    res.redirect("/uml-diagrams");
});

module.exports = router;