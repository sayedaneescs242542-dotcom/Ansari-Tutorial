const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/student/login");
});

router.get("/student", (req, res) => {
    res.redirect("/student/login");
});

router.get("/admin", (req, res) => {
    res.redirect("/admin/login");
});

module.exports = router;