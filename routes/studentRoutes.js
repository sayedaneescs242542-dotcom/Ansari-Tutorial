const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const studentController = require("../controllers/studentController");
const { isStudentLoggedIn, isStudentLoggedOut } = require("../middleware/authMiddleware");

// Auth Routes
router.get("/login", isStudentLoggedOut, authController.getStudentLogin);
router.post("/login", isStudentLoggedOut, authController.postStudentLogin);

router.get("/register", isStudentLoggedOut, authController.getStudentRegister);
router.post("/register", isStudentLoggedOut, authController.postStudentRegister);

router.get("/logout", isStudentLoggedIn, authController.studentLogout);

// Protected Dashboard Routes
router.get("/dashboard", isStudentLoggedIn, studentController.getDashboard);
router.get("/profile", isStudentLoggedIn, studentController.getProfile);
router.post("/profile", isStudentLoggedIn, studentController.postProfile);
router.get("/admission-details", isStudentLoggedIn, studentController.getAdmissionStatus);

module.exports = router;