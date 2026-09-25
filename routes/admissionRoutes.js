const express = require("express");
const router = express.Router();
const admissionController = require("../controllers/admissionController");

router.get("/", admissionController.getAdmissionForm);
router.post("/", admissionController.postAdmissionForm);

module.exports = router;