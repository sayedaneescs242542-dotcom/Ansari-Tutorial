const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
dotenv.config();

const { connectDB, isConnected } = require("./config/db");

const app = express();

// Connect to MongoDB (Atlas with resilient fallback)
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "ansari_tutorial_secret_key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 // 24 hours
        }
    })
);

// Global Template Locals
app.use((req, res, next) => {
    res.locals.title = "Ansari Tutorial - Excellence in Education";
    res.locals.student = req.session.student || null;
    res.locals.admin = req.session.admin || null;
    res.locals.success = req.session.success || null;
    res.locals.error = req.session.error || null;
    res.locals.currentPath = req.path;
    res.locals.isDbConnected = isConnected();

    delete req.session.success;
    delete req.session.error;

    next();
});

// View Engine Setup with View Caching
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.enable("view cache");

// High-speed Static Assets with 7-Day Browser Caching
app.use(
    express.static(path.join(__dirname, "public"), {
        maxAge: "7d",
        etag: true,
    })
);

// Route Handlers
const indexRoutes = require("./routes/index");
const courseRoutes = require("./routes/courseRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const contactRoutes = require("./routes/contactRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/", indexRoutes);
app.use("/courses", courseRoutes);
app.use("/admission", admissionRoutes);
app.use("/contact", contactRoutes);
app.use("/announcements", announcementRoutes);
app.use("/student", studentRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

// Portal quick redirect
app.get("/login", (req, res) => res.redirect("/student/login"));
app.get("/register", (req, res) => res.redirect("/student/register"));

// Database Seed Trigger Route (for easy reset & setup)
const Admin = require("./models/Admin");
const Course = require("./models/Course");
const Announcement = require("./models/Announcement");

app.get("/seed", async (req, res) => {
    try {
        // 1. Seed Admin
        const adminEmail = "admin@ansaritutorial.com";
        let existingAdmin = await Admin.findOne({ email: adminEmail });
        if (!existingAdmin) {
            existingAdmin = new Admin({
                name: "Faisal Ansari (Founder)",
                email: adminEmail,
                password: "admin123",
                role: "Super Admin",
            });
            await existingAdmin.save();
        }

        // 2. Seed Initial Courses from defaultData
        const { defaultCourses, defaultAnnouncements } = require("./config/defaultData");
        const courseCount = await Course.countDocuments();
        if (courseCount === 0) {
            const coursesToInsert = defaultCourses.map(c => {
                const { _id, ...rest } = c;
                return rest;
            });
            await Course.insertMany(coursesToInsert);
        }

        // 3. Seed Initial Announcements from defaultData
        const noticeCount = await Announcement.countDocuments();
        if (noticeCount === 0) {
            const announcementsToInsert = defaultAnnouncements.map(a => {
                const { _id, ...rest } = a;
                return rest;
            });
            await Announcement.insertMany(announcementsToInsert);
        }

        req.session.success = "Database initialized / verified with default courses and notices!";
        res.redirect(req.session.admin ? "/admin/dashboard" : "/");
    } catch (err) {
        req.session.error = "Seed error: " + err.message;
        res.redirect("/");
    }
});

// Dedicated 404 Error Handler
app.use((req, res) => {
    res.status(404).render("404", {
        title: "404 - Page Not Found | Ansari Tutorial"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Ansari Tutorial Server running at http://localhost:${PORT}`);
});