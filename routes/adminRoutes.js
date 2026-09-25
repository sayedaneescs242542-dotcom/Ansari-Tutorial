const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const { isAdminLoggedIn, isAdminLoggedOut } = require("../middleware/authMiddleware");

// Admin Auth
router.get("/login", isAdminLoggedOut, authController.getAdminLogin);
router.post("/login", isAdminLoggedOut, authController.postAdminLogin);
router.get("/logout", isAdminLoggedIn, authController.adminLogout);

// Protected Admin Portal Routes
router.get("/dashboard", isAdminLoggedIn, adminController.getDashboard);

// Manage Students
router.get("/students", isAdminLoggedIn, adminController.getStudents);
router.post("/students/add", isAdminLoggedIn, adminController.postAddStudent);
router.post("/students/edit", isAdminLoggedIn, adminController.postEditStudent);
router.post("/students/delete/:id", isAdminLoggedIn, adminController.deleteStudent);

// Manage Admissions
router.get("/admissions", isAdminLoggedIn, adminController.getAdmissions);
router.post("/admissions/update-status/:id", isAdminLoggedIn, adminController.updateAdmissionStatus);
router.post("/admissions/delete/:id", isAdminLoggedIn, adminController.deleteAdmission);

// Manage Courses
router.get("/courses", isAdminLoggedIn, adminController.getCourses);
router.post("/courses/add", isAdminLoggedIn, adminController.postAddCourse);
router.post("/courses/edit", isAdminLoggedIn, adminController.postEditCourse);
router.post("/courses/delete/:id", isAdminLoggedIn, adminController.deleteCourse);

// Manage Announcements
router.get("/announcements", isAdminLoggedIn, adminController.getAnnouncements);
router.post("/announcements/add", isAdminLoggedIn, adminController.postAddAnnouncement);
router.post("/announcements/edit", isAdminLoggedIn, adminController.postEditAnnouncement);
router.post("/announcements/delete/:id", isAdminLoggedIn, adminController.deleteAnnouncement);

// Manage Contacts
router.get("/contacts", isAdminLoggedIn, adminController.getContacts);
router.post("/contacts/reply/:id", isAdminLoggedIn, adminController.markContactReplied);
router.post("/contacts/delete/:id", isAdminLoggedIn, adminController.deleteContact);

module.exports = router;