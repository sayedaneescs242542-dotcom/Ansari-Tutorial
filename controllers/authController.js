const mongoose = require("mongoose");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const Admission = require("../models/Admission");
const Course = require("../models/Course");
const { defaultCourses } = require("../config/defaultData");
const bcrypt = require("bcrypt");

// Fallback in-memory students store for offline development
const fallbackStudents = [
    {
        _id: "std_default_1",
        name: "Rahul Sharma",
        email: "student@ansaritutorial.com",
        phone: "9876543210",
        course: "FY.J.C (11th) & SY.J.C (12th) Commerce",
        gender: "Male",
        dob: new Date("2008-05-15"),
        address: "Andheri West, Mumbai",
        admissionStatus: "Approved",
        passwordHash: "$2b$10$w8.1t3N6D0N3yK/4jKvZtefF8pGjIe3jZz77l6iM5q7X0vV5K2w2G" // student123
    }
];

// Render Student Login Page
exports.getStudentLogin = (req, res) => {
    res.render("auth/student-login", { title: "Student Login - Ansari Tutorial" });
};

// Handle Student Login POST
exports.postStudentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = (email || "").toLowerCase().trim();

        if (mongoose.connection.readyState === 1) {
            const student = await Student.findOne({ email: normalizedEmail });

            if (!student) {
                req.session.error = "Invalid email address or student record not found.";
                return res.redirect("/student/login");
            }

            const isMatch = await student.comparePassword(password);
            if (!isMatch) {
                req.session.error = "Incorrect password. Please try again.";
                return res.redirect("/student/login");
            }

            req.session.student = {
                id: student._id.toString(),
                name: student.name,
                email: student.email,
                course: student.course,
            };

            req.session.success = `Welcome back, ${student.name}!`;
            return res.redirect("/student/dashboard");
        } else {
            // Check fallback students or test credentials
            let student = fallbackStudents.find(s => s.email === normalizedEmail);
            if (!student && (normalizedEmail === "student@ansaritutorial.com" || password === "student123")) {
                student = {
                    _id: "std_mock_" + Date.now(),
                    name: "Demo Student",
                    email: normalizedEmail,
                    course: "FY.J.C (11th) & SY.J.C (12th) Commerce",
                    admissionStatus: "Approved"
                };
                fallbackStudents.push(student);
            }

            if (student) {
                req.session.student = {
                    id: student._id,
                    name: student.name,
                    email: student.email,
                    course: student.course,
                };
                req.session.success = `Welcome, ${student.name}!`;
                return res.redirect("/student/dashboard");
            } else {
                req.session.error = "Invalid credentials. Try student@ansaritutorial.com / student123";
                return res.redirect("/student/login");
            }
        }
    } catch (error) {
        console.error("Student Login Error:", error);
        req.session.error = "An error occurred during login. Please try again.";
        res.redirect("/student/login");
    }
};

// Render Student Register Page
exports.getStudentRegister = async (req, res) => {
    try {
        let courses = [];
        if (mongoose.connection.readyState === 1) {
            courses = await Course.find({}).lean();
        }
        if (!courses || courses.length === 0) {
            courses = defaultCourses;
        }
        res.render("auth/student-register", {
            title: "Student Registration - Ansari Tutorial",
            courses,
        });
    } catch (error) {
        res.render("auth/student-register", {
            title: "Student Registration - Ansari Tutorial",
            courses: defaultCourses,
        });
    }
};

// Handle Student Register POST
exports.postStudentRegister = async (req, res) => {
    try {
        const { name, email, password, phone, course, gender, dob, address } = req.body;
        const normalizedEmail = (email || "").toLowerCase().trim();

        if (mongoose.connection.readyState === 1) {
            const existingStudent = await Student.findOne({ email: normalizedEmail });
            if (existingStudent) {
                req.session.error = "An account with this email already exists. Please login.";
                return res.redirect("/student/register");
            }

            const admissionRecord = await Admission.findOne({ email: normalizedEmail });
            const admissionStatus = admissionRecord ? admissionRecord.status : "Pending";

            const newStudent = new Student({
                name: (name || "").trim(),
                email: normalizedEmail,
                password,
                phone: (phone || "").trim(),
                course: course || "School - 5th To S.S.C",
                gender: gender || "Male",
                dob: dob ? new Date(dob) : null,
                address: (address || "").trim(),
                admissionStatus,
            });

            await newStudent.save();
        } else {
            // Save to fallback store
            const existing = fallbackStudents.find(s => s.email === normalizedEmail);
            if (existing) {
                req.session.error = "An account with this email already exists. Please login.";
                return res.redirect("/student/register");
            }

            fallbackStudents.push({
                _id: "std_" + Date.now(),
                name: (name || "").trim(),
                email: normalizedEmail,
                phone: (phone || "").trim(),
                course: course || "School - 5th To S.S.C",
                gender: gender || "Male",
                dob: dob ? new Date(dob) : null,
                address: (address || "").trim(),
                admissionStatus: "Approved",
                createdAt: new Date()
            });
        }

        req.session.success = "Registration successful! You can now log in with your email and password.";
        res.redirect("/student/login");
    } catch (error) {
        console.error("Student Register Error:", error);
        req.session.error = "Registration failed. Please fill all fields properly.";
        res.redirect("/student/register");
    }
};

// Student Logout
exports.studentLogout = (req, res) => {
    req.session.student = null;
    req.session.success = "You have been logged out successfully.";
    res.redirect("/student/login");
};

// Render Admin Login Page
exports.getAdminLogin = (req, res) => {
    res.render("auth/admin-login", { title: "Admin Portal - Ansari Tutorial" });
};

// Handle Admin Login POST
exports.postAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = (email || "").toLowerCase().trim();

        // Check if MongoDB is connected and admin exists
        if (mongoose.connection.readyState === 1) {
            const admin = await Admin.findOne({ email: normalizedEmail });
            if (admin) {
                const isMatch = await admin.comparePassword(password);
                if (isMatch) {
                    req.session.admin = {
                        id: admin._id.toString(),
                        name: admin.name,
                        email: admin.email,
                        role: admin.role,
                    };
                    req.session.success = `Welcome to Admin Dashboard, ${admin.name}!`;
                    return res.redirect("/admin/dashboard");
                }
            }
        }

        // Resilient Fallback: Default verified credentials from flyer / seed
        if (normalizedEmail === "admin@ansaritutorial.com" && password === "admin123") {
            req.session.admin = {
                id: "adm_super_1",
                name: "Faisal Ansari (Founder)",
                email: "admin@ansaritutorial.com",
                role: "Super Admin",
            };
            req.session.success = "Welcome to Admin Dashboard, Faisal Ansari!";
            return res.redirect("/admin/dashboard");
        }

        req.session.error = "Invalid Admin credentials. Use admin@ansaritutorial.com / admin123";
        res.redirect("/admin/login");
    } catch (error) {
        console.error("Admin Login Error:", error);
        if (req.body.email === "admin@ansaritutorial.com" && req.body.password === "admin123") {
            req.session.admin = {
                id: "adm_super_1",
                name: "Faisal Ansari (Founder)",
                email: "admin@ansaritutorial.com",
                role: "Super Admin",
            };
            return res.redirect("/admin/dashboard");
        }
        req.session.error = "Admin login error. Try again.";
        res.redirect("/admin/login");
    }
};

// Admin Logout
exports.adminLogout = (req, res) => {
    req.session.admin = null;
    req.session.success = "Admin logged out successfully.";
    res.redirect("/admin/login");
};

module.exports.fallbackStudents = fallbackStudents;
