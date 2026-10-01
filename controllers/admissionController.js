const mongoose = require("mongoose");
const Admission = require("../models/Admission");
const Course = require("../models/Course");
const { defaultCourses } = require("../config/defaultData");

exports.getAdmissionForm = async (req, res) => {
    try {
        let courses = [];

        if (mongoose.connection.readyState === 1) {
            courses = await Course.find().lean();
        }

        if (!courses || courses.length === 0) {
            courses = defaultCourses;
        }

        res.render("admission", {
            title: "Online Admission Form - Ansari Tutorial | Andheri West",
            courses,
            selectedCourse: req.query.course || ""
        });

    } catch (error) {
        console.error("Admission Form Error:", error.message);

        res.render("admission", {
            title: "Online Admission Form - Ansari Tutorial | Andheri West",
            courses: defaultCourses,
            selectedCourse: req.query.course || ""
        });
    }
};

exports.postAdmissionForm = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            parentPhone,
            course,
            stream,
            previousPercentage,
            gender,
            dob,
            address,
            batchPreference
        } = req.body;

        let effectiveStream = stream;

        if (!effectiveStream) {
            const courseLower = (course || "").toLowerCase();

            if (
                courseLower.includes("school") ||
                courseLower.includes("5th") ||
                courseLower.includes("s.s.c")
            ) {
                effectiveStream = "School";

            } else if (
                courseLower.includes("commerce") ||
                courseLower.includes("b.com") ||
                courseLower.includes("bms") ||
                courseLower.includes("baf")
            ) {
                effectiveStream = "Commerce";

            } else if (
                courseLower.includes("science") ||
                courseLower.includes("neet") ||
                courseLower.includes("jee")
            ) {
                effectiveStream = "Science";

            } else if (
                courseLower.includes("arts") ||
                courseLower.includes("b.a")
            ) {
                effectiveStream = "Arts";

            } else if (
                courseLower.includes("professional") ||
                courseLower.includes("ca") ||
                courseLower.includes("cma") ||
                courseLower.includes("cfa")
            ) {
                effectiveStream = "Professional";

            } else {
                effectiveStream = "General";
            }
        }

        const admissionData = {
            fullName: (fullName || "").trim(),
            email: (email || "").toLowerCase().trim(),
            phone: (phone || "").trim(),
            parentPhone: (parentPhone || "").trim(),
            course: (course || "School - 5th To S.S.C").trim(),
            stream: effectiveStream,
            previousPercentage: parseFloat(previousPercentage) || 0,
            gender: gender || "Male",
            dob: dob || "2008-01-01",
            address: (address || "").trim(),
            batchPreference: batchPreference || "Flexible",
            status: "Pending",
            remarks:
                "Application received. Our counseling team will contact you shortly."
        };

        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB is not connected.");
        }

        const newAdmission = new Admission(admissionData);

        await newAdmission.save();

        console.log(
            "✅ Admission saved to MongoDB:",
            newAdmission._id
        );

        req.session.success =
            "Your online admission application has been submitted successfully! Application ID has been recorded. Our counseling coordinator will contact you shortly.";

        res.redirect("/admission");

    } catch (error) {
        console.error(
            "❌ Admission Submit Error:",
            error.message
        );

        req.session.error =
            "Application submission encountered an issue. Please verify all fields or call us directly at 7666875408.";

        res.redirect("/admission");
    }
};