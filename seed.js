const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

dotenv.config();

const Admin = require("./models/Admin");
const Course = require("./models/Course");
const Announcement = require("./models/Announcement");
const { defaultCourses, defaultAnnouncements } = require("./config/defaultData");

const seedData = async () => {
    try {
        const atlasUri = process.env.MONGO_URI;
        const localUri = "mongodb://127.0.0.1:27017/ansariTutorial";

        if (atlasUri) {
            try {
                console.log("📡 Attempting connection to MongoDB Atlas...");
                await mongoose.connect(atlasUri, { serverSelectionTimeoutMS: 5000 });
                console.log("✅ Connected to MongoDB Atlas!");
            } catch (err) {
                console.log("⚠️ MongoDB Atlas connection failed. Falling back to local MongoDB...");
                await mongoose.connect(localUri);
                console.log("✅ Connected to Local MongoDB!");
            }
        } else {
            await mongoose.connect(localUri);
            console.log("✅ Connected to Local MongoDB!");
        }

        // 1. Seed Admin User
        const adminEmail = "admin@ansaritutorial.com";
        const existingAdmin = await Admin.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const admin = new Admin({
                name: "Sir (Faisal Ansari) - Graduate in English",
                email: adminEmail,
                password: "admin123",
                role: "Super Admin",
            });
            await admin.save();
            console.log("✅ Default Admin Created: admin@ansaritutorial.com / admin123");
        } else {
            console.log("ℹ️ Default Admin already exists.");
        }

        // 2. Seed Verified Courses from Center Pamphlet
        await Course.deleteMany({});
        await Course.insertMany(defaultCourses.map(c => {
            const { _id, ...rest } = c;
            return rest;
        }));
        console.log("✅ All Verified Courses Seeded Successfully!");

        // 3. Seed Verified Announcements
        await Announcement.deleteMany({});
        await Announcement.insertMany(defaultAnnouncements.map(a => {
            const { _id, ...rest } = a;
            return rest;
        }));
        console.log("✅ All Verified Announcements Seeded Successfully!");

        console.log("🎉 Seeding Completed Successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error.message);
        process.exit(1);
    }
};

seedData();