const Student = require("../models/Student");
const Admission = require("../models/Admission");
const Course = require("../models/Course");
const Announcement = require("../models/Announcement");
const Contact = require("../models/Contact");

// Admin Dashboard KPI & Summary
exports.getDashboard = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const pendingAdmissions = await Admission.countDocuments({ status: "Pending" });
        const totalCourses = await Course.countDocuments();
        const totalAnnouncements = await Announcement.countDocuments();
        const newContacts = await Contact.countDocuments({ status: "New" });

        const recentAdmissions = await Admission.find().sort({ createdAt: -1 }).limit(5);
        const recentStudents = await Student.find().sort({ createdAt: -1 }).limit(5);

        res.render("admin/dashboard", {
            title: "Admin Dashboard - Ansari Tutorial",
            stats: {
                totalStudents,
                pendingAdmissions,
                totalCourses,
                totalAnnouncements,
                newContacts,
            },
            recentAdmissions,
            recentStudents,
        });
    } catch (error) {
        console.error("Admin Dashboard Error:", error);
        req.session.error = "Error loading admin dashboard stats.";
        res.render("admin/dashboard", {
            title: "Admin Dashboard - Ansari Tutorial",
            stats: { totalStudents: 0, pendingAdmissions: 0, totalCourses: 0, totalAnnouncements: 0, newContacts: 0 },
            recentAdmissions: [],
            recentStudents: [],
        });
    }
};

// --- MANAGE STUDENTS ---
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        const courses = await Course.find();
        res.render("admin/students", {
            title: "Manage Students - Ansari Tutorial",
            students,
            courses,
        });
    } catch (error) {
        req.session.error = "Error fetching students list.";
        res.redirect("/admin/dashboard");
    }
};

exports.postAddStudent = async (req, res) => {
    try {
        const { name, email, password, phone, course, address, gender } = req.body;
        const existing = await Student.findOne({ email: email.toLowerCase() });
        if (existing) {
            req.session.error = "Student with this email already exists.";
            return res.redirect("/admin/students");
        }

        const student = new Student({
            name,
            email: email.toLowerCase(),
            password,
            phone,
            course,
            address,
            gender: gender || "Male",
            admissionStatus: "Approved",
        });
        await student.save();
        req.session.success = "Student added successfully!";
        res.redirect("/admin/students");
    } catch (error) {
        console.error("Add Student Error:", error);
        req.session.error = "Failed to add student.";
        res.redirect("/admin/students");
    }
};

exports.postEditStudent = async (req, res) => {
    try {
        const { id, name, email, phone, course, address, admissionStatus } = req.body;
        await Student.findByIdAndUpdate(id, {
            name,
            email: email.toLowerCase(),
            phone,
            course,
            address,
            admissionStatus,
        });
        req.session.success = "Student record updated!";
        res.redirect("/admin/students");
    } catch (error) {
        req.session.error = "Failed to update student.";
        res.redirect("/admin/students");
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await Student.findByIdAndDelete(id);
        req.session.success = "Student record deleted.";
        res.redirect("/admin/students");
    } catch (error) {
        req.session.error = "Failed to delete student.";
        res.redirect("/admin/students");
    }
};

// --- MANAGE ADMISSIONS ---
exports.getAdmissions = async (req, res) => {
    try {
        const admissions = await Admission.find().sort({ createdAt: -1 });
        res.render("admin/admissions", {
            title: "Manage Admissions - Ansari Tutorial",
            admissions,
        });
    } catch (error) {
        req.session.error = "Error fetching admissions.";
        res.redirect("/admin/dashboard");
    }
};

exports.updateAdmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        const admission = await Admission.findByIdAndUpdate(
            id,
            { status, remarks },
            { new: true }
        );

        // Sync with Student record if student exists with same email
        if (admission) {
            await Student.findOneAndUpdate(
                { email: admission.email.toLowerCase() },
                { admissionStatus: status }
            );
        }

        req.session.success = `Admission status updated to ${status}!`;
        res.redirect("/admin/admissions");
    } catch (error) {
        req.session.error = "Failed to update admission status.";
        res.redirect("/admin/admissions");
    }
};

exports.deleteAdmission = async (req, res) => {
    try {
        const { id } = req.params;
        await Admission.findByIdAndDelete(id);
        req.session.success = "Admission application deleted.";
        res.redirect("/admin/admissions");
    } catch (error) {
        req.session.error = "Failed to delete admission application.";
        res.redirect("/admin/admissions");
    }
};

// --- MANAGE COURSES ---
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.render("admin/courses", {
            title: "Manage Courses - Ansari Tutorial",
            courses,
        });
    } catch (error) {
        req.session.error = "Error loading courses.";
        res.redirect("/admin/dashboard");
    }
};

exports.postAddCourse = async (req, res) => {
    try {
        const { title, category, description, duration, fee, subjects, highlightBadge, iconClass } = req.body;
        const subjectsArray = typeof subjects === "string" ? subjects.split(",").map(s => s.trim()) : subjects;

        const course = new Course({
            title,
            category,
            description,
            duration,
            fee,
            subjects: subjectsArray,
            highlightBadge: highlightBadge || "Popular",
            iconClass: iconClass || "fas fa-book-open",
        });

        await course.save();
        req.session.success = "New Course added successfully!";
        res.redirect("/admin/courses");
    } catch (error) {
        console.error("Add Course Error:", error);
        req.session.error = "Failed to create course.";
        res.redirect("/admin/courses");
    }
};

exports.postEditCourse = async (req, res) => {
    try {
        const { id, title, category, description, duration, fee, subjects, highlightBadge, iconClass } = req.body;
        const subjectsArray = typeof subjects === "string" ? subjects.split(",").map(s => s.trim()) : subjects;

        await Course.findByIdAndUpdate(id, {
            title,
            category,
            description,
            duration,
            fee,
            subjects: subjectsArray,
            highlightBadge,
            iconClass,
        });

        req.session.success = "Course updated successfully!";
        res.redirect("/admin/courses");
    } catch (error) {
        req.session.error = "Failed to update course.";
        res.redirect("/admin/courses");
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await Course.findByIdAndDelete(id);
        req.session.success = "Course deleted successfully.";
        res.redirect("/admin/courses");
    } catch (error) {
        req.session.error = "Failed to delete course.";
        res.redirect("/admin/courses");
    }
};

// --- MANAGE ANNOUNCEMENTS ---
exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.render("admin/announcements", {
            title: "Manage Announcements - Ansari Tutorial",
            announcements,
        });
    } catch (error) {
        req.session.error = "Error loading announcements.";
        res.redirect("/admin/dashboard");
    }
};

exports.postAddAnnouncement = async (req, res) => {
    try {
        const { title, content, category, isImportant, targetAudience } = req.body;
        const announcement = new Announcement({
            title,
            content,
            category,
            isImportant: isImportant === "on" || isImportant === "true" || isImportant === true,
            targetAudience: targetAudience || "All",
        });

        await announcement.save();
        req.session.success = "Announcement published!";
        res.redirect("/admin/announcements");
    } catch (error) {
        console.error("Add Announcement Error:", error);
        req.session.error = "Failed to add announcement.";
        res.redirect("/admin/announcements");
    }
};

exports.postEditAnnouncement = async (req, res) => {
    try {
        const { id, title, content, category, isImportant, targetAudience } = req.body;
        await Announcement.findByIdAndUpdate(id, {
            title,
            content,
            category,
            isImportant: isImportant === "on" || isImportant === "true" || isImportant === true,
            targetAudience: targetAudience || "All",
        });

        req.session.success = "Announcement updated!";
        res.redirect("/admin/announcements");
    } catch (error) {
        req.session.error = "Failed to edit announcement.";
        res.redirect("/admin/announcements");
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        await Announcement.findByIdAndDelete(id);
        req.session.success = "Announcement deleted.";
        res.redirect("/admin/announcements");
    } catch (error) {
        req.session.error = "Failed to delete announcement.";
        res.redirect("/admin/announcements");
    }
};

// --- MANAGE CONTACT ENQUIRIES ---
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.render("admin/contacts", {
            title: "Contact Enquiries - Ansari Tutorial",
            contacts,
        });
    } catch (error) {
        req.session.error = "Error loading contact enquiries.";
        res.redirect("/admin/dashboard");
    }
};

exports.markContactReplied = async (req, res) => {
    try {
        const { id } = req.params;
        await Contact.findByIdAndUpdate(id, { status: "Replied" });
        req.session.success = "Enquiry marked as replied.";
        res.redirect("/admin/contacts");
    } catch (error) {
        req.session.error = "Failed to update status.";
        res.redirect("/admin/contacts");
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        await Contact.findByIdAndDelete(id);
        req.session.success = "Contact enquiry deleted.";
        res.redirect("/admin/contacts");
    } catch (error) {
        req.session.error = "Failed to delete enquiry.";
        res.redirect("/admin/contacts");
    }
};
