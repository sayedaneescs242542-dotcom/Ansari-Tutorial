const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);

let isDbConnected = false;

const syncDatabaseDefaults = async () => {
    try {
        const Admin = require("../models/Admin");
        const Course = require("../models/Course");
        const Announcement = require("../models/Announcement");
        const {
            defaultCourses,
            defaultAnnouncements
        } = require("./defaultData");

        const adminEmail = "admin@ansaritutorial.com";

        const adminExists = await Admin.findOne({
            email: adminEmail
        });

        if (!adminExists) {
            const admin = new Admin({
                name: "Faisal Ansari (Founder)",
                email: adminEmail,
                password: "admin123",
                role: "Super Admin"
            });

            await admin.save();

            console.log(
                "✅ Default Admin Created"
            );
        }

        const courseCount = await Course.countDocuments();

        if (courseCount === 0) {
            const coursesToInsert = defaultCourses.map(course => {
                const { _id, ...rest } = course;
                return rest;
            });

            await Course.insertMany(coursesToInsert);

            console.log(
                "✅ Default Courses Created"
            );
        }

        const announcementCount =
            await Announcement.countDocuments();

        if (announcementCount === 0) {
            const announcementsToInsert =
                defaultAnnouncements.map(announcement => {
                    const { _id, ...rest } = announcement;
                    return rest;
                });

            await Announcement.insertMany(
                announcementsToInsert
            );

            console.log(
                "✅ Default Announcements Created"
            );
        }

    } catch (error) {
        console.log(
            "⚠️ Database sync error:",
            error.message
        );
    }
};

const connectDB = async () => {

    const mongoURI =
        process.env.MONGO_URI ||
        process.env.MONGODB_URI;

    if (!mongoURI) {
        console.error(
            "❌ MONGO_URI is missing from environment variables."
        );

        isDbConnected = false;

        return false;
    }

    try {

        console.log(
            "📡 Connecting to MongoDB Atlas..."
        );

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000
        });

        isDbConnected = true;

        console.log(
            "✅ MongoDB Atlas Connected Successfully!"
        );

        console.log(
            "📂 Database:",
            mongoose.connection.name
        );

        console.log(
            "🌐 MongoDB Host:",
            mongoose.connection.host
        );

        await syncDatabaseDefaults();

        return true;

    } catch (error) {

        isDbConnected = false;

        console.error(
            "❌ MongoDB Atlas Connection Error:"
        );

        console.error(
            error.message
        );

        return false;
    }
};

const isConnected = () => {
    return (
        isDbConnected &&
        mongoose.connection.readyState === 1
    );
};

module.exports = {
    connectDB,
    isConnected
};