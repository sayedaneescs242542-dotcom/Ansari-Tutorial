const mongoose = require("mongoose");
const dns = require("dns");

// Optimize DNS lookup for MongoDB Atlas SRV connection strings on Windows
try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
    // fallback
}

// Disable buffering so unhandled/offline queries fail fast to fallbacks
mongoose.set("bufferCommands", false);

let isDbConnected = false;
let retryTimer = null;

const syncDatabaseDefaults = async () => {
    try {
        const Admin = require("../models/Admin");
        const Course = require("../models/Course");
        const Announcement = require("../models/Announcement");
        const { defaultCourses, defaultAnnouncements } = require("./defaultData");

        // 1. Seed Default Admin if missing
        const adminEmail = "admin@ansaritutorial.com";
        const adminExists = await Admin.findOne({ email: adminEmail });
        if (!adminExists) {
            const admin = new Admin({
                name: "Sir (Faisal Ansari) - Graduate in English",
                email: adminEmail,
                password: "admin123",
                role: "Super Admin",
            });
            await admin.save();
            console.log("✅ Database Default Admin Initialized: admin@ansaritutorial.com");
        }

        // 2. Seed Courses if empty
        const courseCount = await Course.countDocuments();
        if (courseCount === 0) {
            const coursesToInsert = defaultCourses.map(c => {
                const { _id, ...rest } = c;
                return rest;
            });
            await Course.insertMany(coursesToInsert);
            console.log("✅ Database Courses Initialized (School, Commerce, Science, Arts, CA/CMA/CFA)!");
        }

        // 3. Seed Announcements if empty
        const noticeCount = await Announcement.countDocuments();
        if (noticeCount === 0) {
            const noticesToInsert = defaultAnnouncements.map(a => {
                const { _id, ...rest } = a;
                return rest;
            });
            await Announcement.insertMany(noticesToInsert);
            console.log("✅ Database Announcements Initialized!");
        }
    } catch (syncErr) {
        console.log("ℹ️ Database sync note: " + syncErr.message);
    }
};

const connectDB = async () => {
    const atlasUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    const localUri = "mongodb://127.0.0.1:27017/ansariTutorial";

    if (atlasUri) {
        try {
            console.log("📡 Connecting to MongoDB Atlas...");
            await mongoose.connect(atlasUri, { 
                serverSelectionTimeoutMS: 5000,
                autoSelectFamily: false
            });
            isDbConnected = true;
            console.log("✅ MongoDB Atlas Connected Successfully!");
            if (retryTimer) {
                clearInterval(retryTimer);
                retryTimer = null;
            }
            await syncDatabaseDefaults();
            return true;
        } catch (err) {
            console.log("⚠️ MongoDB Atlas connection notice: IP address not yet whitelisted on Atlas.");
            console.log("👉 Action: In MongoDB Atlas (cloud.mongodb.com) -> Network Access -> Add IP Address -> Add '0.0.0.0/0' (Allow anywhere) or your current IP.");
        }
    }

    try {
        await mongoose.connect(localUri, { 
            serverSelectionTimeoutMS: 2000,
            autoSelectFamily: false
        });
        isDbConnected = true;
        console.log("✅ Connected to Local MongoDB!");
        if (retryTimer) {
            clearInterval(retryTimer);
            retryTimer = null;
        }
        await syncDatabaseDefaults();
        return true;
    } catch (localErr) {
        isDbConnected = false;
        console.log("ℹ️ Website active in High-Speed Resilient Fallback Mode (using official center brochure catalog).");

        // Start background auto-reconnect retry every 20 seconds
        if (!retryTimer) {
            retryTimer = setInterval(async () => {
                if (!isDbConnected && mongoose.connection.readyState !== 1) {
                    console.log("🔄 Background check: Retrying MongoDB Atlas connection...");
                    await connectDB();
                }
            }, 20000);
        }
        return false;
    }
};

const isConnected = () => isDbConnected && mongoose.connection.readyState === 1;

module.exports = {
    connectDB,
    isConnected
};