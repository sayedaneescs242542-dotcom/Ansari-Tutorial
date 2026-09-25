const mongoose = require("mongoose");
const Course = require("../models/Course");
const { defaultCourses } = require("../config/defaultData");

// In-Memory Fast Cache for Courses (TTL: 60s)
let coursesCache = {};
let coursesCacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000;

// Render Public Courses Page
exports.getCourses = async (req, res) => {
    const categoryFilter = req.query.category || "All";
    const now = Date.now();

    if (coursesCache[categoryFilter] && (now - coursesCacheTimestamp < CACHE_TTL_MS)) {
        return res.render("courses", {
            title: "Courses Offered - Ansari Tutorial",
            courses: coursesCache[categoryFilter],
            currentCategory: categoryFilter,
        });
    }

    try {
        let courses = [];

        if (mongoose.connection.readyState === 1) {
            let query = {};
            if (categoryFilter !== "All") {
                query.category = categoryFilter;
            }
            courses = await Course.find(query).sort({ category: 1, title: 1 }).lean();
        }
        
        if (!courses || courses.length === 0) {
            courses = categoryFilter === "All" 
                ? defaultCourses 
                : defaultCourses.filter(c => c.category.toLowerCase() === categoryFilter.toLowerCase());
        }

        coursesCache[categoryFilter] = courses;
        coursesCacheTimestamp = now;

        res.render("courses", {
            title: "Courses Offered - Ansari Tutorial",
            courses,
            currentCategory: categoryFilter,
        });
    } catch (error) {
        console.error("Courses Load Error:", error.message);
        const filteredFallback = categoryFilter === "All" 
            ? defaultCourses 
            : defaultCourses.filter(c => c.category.toLowerCase() === categoryFilter.toLowerCase());

        res.render("courses", {
            title: "Courses Offered - Ansari Tutorial",
            courses: filteredFallback,
            currentCategory: categoryFilter,
        });
    }
};
