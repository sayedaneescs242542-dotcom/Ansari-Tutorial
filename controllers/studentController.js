const mongoose = require("mongoose");
const Student = require("../models/Student");
const Admission = require("../models/Admission");
const Announcement = require("../models/Announcement");
const Course = require("../models/Course");
const { defaultCourses, defaultAnnouncements } = require("../config/defaultData");
const { fallbackAdmissions } = require("./admissionController");
const { fallbackStudents } = require("./authController");

// Sample Curated Study Notes / Downloads for Students
const defaultStudyResources = [
    {
        id: "res1",
        title: "Board Formula Sheet & Revision Cards",
        subject: "Mathematics & Accounts",
        fileType: "PDF Document",
        size: "2.4 MB",
        badge: "Essential",
    },
    {
        id: "res2",
        title: "Complete Chapterwise Question Bank 2026",
        subject: "Science / Economics",
        fileType: "PDF Document",
        size: "4.8 MB",
        badge: "Updated",
    },
    {
        id: "res3",
        title: "Model Answer Framework & Presentation Guide",
        subject: "Arts / Commerce Board Prep",
        fileType: "PDF Document",
        size: "1.9 MB",
        badge: "High Score Tips",
    },
    {
        id: "res4",
        title: "Weekly Mock Test Paper Series - Set A",
        subject: "All Streams",
        fileType: "Practice Test",
        size: "1.2 MB",
        badge: "Test Series",
    },
];

// Sample Weekly Schedule
const defaultWeeklySchedule = [
    { day: "Monday", time: "08:00 AM - 10:00 AM", subject: "Mathematics / Accountancy", room: "Room 1 (Main Hall)" },
    { day: "Tuesday", time: "08:00 AM - 10:00 AM", subject: "Science (Physics/Chem) / Economics", room: "Room 2" },
    { day: "Wednesday", time: "08:00 AM - 10:00 AM", subject: "Commerce / Social Sciences", room: "Room 1 (Main Hall)" },
    { day: "Thursday", time: "08:00 AM - 10:00 AM", subject: "Language Grammar & Writing Skills", room: "Room 3" },
    { day: "Friday", time: "08:00 AM - 10:00 AM", subject: "Revision & Problem Solving", room: "Room 1 (Main Hall)" },
    { day: "Saturday", time: "10:00 AM - 01:00 PM", subject: "Doubt Clinic & Weekly Chapter Test", room: "All Rooms" },
];

// Helper to get active student
async function getStudentByIdOrSession(studentSession) {
    if (!studentSession) return null;
    if (mongoose.connection.readyState === 1) {
        try {
            const doc = await Student.findById(studentSession.id);
            if (doc) return doc;
        } catch (e) {}
    }
    const fallback = fallbackStudents.find(s => s._id === studentSession.id || s.email === studentSession.email);
    if (fallback) return fallback;
    return {
        _id: studentSession.id,
        name: studentSession.name,
        email: studentSession.email,
        course: studentSession.course || "School - 5th To S.S.C",
        phone: "7666875408",
        gender: "Male",
        address: "Andheri West, Mumbai",
        admissionStatus: "Approved"
    };
}

// Student Dashboard
exports.getDashboard = async (req, res) => {
    try {
        const student = await getStudentByIdOrSession(req.session.student);
        if (!student) {
            req.session.student = null;
            return res.redirect("/student/login");
        }

        let admission = null;
        let announcements = [];
        let courseDetail = null;

        if (mongoose.connection.readyState === 1) {
            try {
                [admission, announcements, courseDetail] = await Promise.all([
                    Admission.findOne({ email: student.email.toLowerCase() }).lean(),
                    Announcement.find({}).sort({ createdAt: -1 }).limit(4).lean(),
                    Course.findOne({ title: student.course }).lean(),
                ]);
            } catch (e) {
                console.error("Dashboard sub-queries error:", e.message);
            }
        }

        if (!admission) {
            admission = fallbackAdmissions.find(a => a.email.toLowerCase() === student.email.toLowerCase()) || {
                _id: "adm_" + (student._id || "verified"),
                status: student.admissionStatus || "Approved",
                remarks: "Active enrolled student at Ansari Tutorial.",
                createdAt: new Date(),
                stream: "General",
                course: student.course
            };
        }

        if (!announcements || announcements.length === 0) {
            announcements = defaultAnnouncements.slice(0, 3);
        }

        if (!courseDetail) {
            courseDetail = defaultCourses.find(c => c.title === student.course) || defaultCourses[0];
        }

        res.render("student/dashboard", {
            title: "Student Dashboard - Ansari Tutorial",
            student,
            admission,
            announcements,
            courseDetail,
            schedule: defaultWeeklySchedule,
            resources: defaultStudyResources,
            attendanceRate: 94,
            completedTests: 8
        });
    } catch (error) {
        console.error("Student Dashboard Error:", error);
        req.session.error = "Could not load dashboard data.";
        res.redirect("/student/login");
    }
};

// View / Edit Profile
exports.getProfile = async (req, res) => {
    try {
        const student = await getStudentByIdOrSession(req.session.student);
        let courses = [];
        if (mongoose.connection.readyState === 1) {
            courses = await Course.find({}).lean();
        }
        if (!courses || courses.length === 0) {
            courses = defaultCourses;
        }

        res.render("student/profile", {
            title: "My Profile - Ansari Tutorial",
            student,
            courses,
        });
    } catch (error) {
        req.session.error = "Error loading profile.";
        res.redirect("/student/dashboard");
    }
};

// Post Profile Update
exports.postProfile = async (req, res) => {
    try {
        const { name, phone, course, address, dob, gender } = req.body;
        const studentId = req.session.student.id;

        if (mongoose.connection.readyState === 1) {
            const student = await Student.findById(studentId);
            if (student) {
                student.name = (name || student.name).trim();
                student.phone = (phone || student.phone).trim();
                student.course = course || student.course;
                student.address = (address || student.address).trim();
                student.gender = gender || student.gender;
                if (dob) student.dob = new Date(dob);
                await student.save();
            }
        } else {
            const student = fallbackStudents.find(s => s._id === studentId || s.email === req.session.student.email);
            if (student) {
                student.name = (name || student.name).trim();
                student.phone = (phone || student.phone).trim();
                student.course = course || student.course;
                student.address = (address || student.address).trim();
                student.gender = gender || student.gender;
                if (dob) student.dob = new Date(dob);
            }
        }

        req.session.student.name = name ? name.trim() : req.session.student.name;
        req.session.student.course = course || req.session.student.course;
        req.session.success = "Profile updated successfully!";
        res.redirect("/student/profile");
    } catch (error) {
        console.error("Profile Update Error:", error);
        req.session.error = "Failed to update profile.";
        res.redirect("/student/profile");
    }
};

// View Admission Status
exports.getAdmissionStatus = async (req, res) => {
    try {
        const student = await getStudentByIdOrSession(req.session.student);
        let admission = null;

        if (mongoose.connection.readyState === 1) {
            admission = await Admission.findOne({ email: student.email.toLowerCase() }).lean();
        }

        if (!admission) {
            admission = fallbackAdmissions.find(a => a.email.toLowerCase() === student.email.toLowerCase());
        }

        if (!admission) {
            admission = {
                _id: "ADM-" + Math.floor(100000 + Math.random() * 900000),
                fullName: student.name,
                email: student.email,
                phone: student.phone || "7666875408",
                parentPhone: "9022420050",
                course: student.course || "School - 5th To S.S.C",
                stream: "Academic Stream",
                previousPercentage: 85.5,
                batchPreference: "Morning Batch",
                status: student.admissionStatus || "Approved",
                remarks: "Admission confirmed. Welcome to Ansari Tutorial! Batch begins shortly.",
                createdAt: new Date()
            };
        }

        res.render("student/admission-status", {
            title: "Admission Details - Ansari Tutorial",
            student,
            admission,
        });
    } catch (error) {
        req.session.error = "Could not load admission details.";
        res.redirect("/student/dashboard");
    }
};

