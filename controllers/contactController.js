const mongoose = require("mongoose");
const Contact = require("../models/Contact");

// Fallback in-memory contacts store for resilient offline capability
const fallbackContacts = [];

// Render Contact Us Page
exports.getContactPage = (req, res) => {
    res.render("contact", { title: "Contact Us - Ansari Tutorial | Andheri (West)" });
};

// Handle Contact Form Submission
exports.postContactForm = async (req, res) => {
    const returnUrl = req.get("Referrer") || "/";

    try {
        const { name, email, phone, subject, message, course } = req.body;

        const effectiveSubject = subject || (course ? `Demo Class Inquiry: ${course}` : "General Inquiry");
        const effectiveEmail = (email && email.trim()) ? email.trim().toLowerCase() : `${phone || 'student'}@inquiry.ansaritutorial.com`;
        const effectiveMessage = (message && message.trim()) ? message.trim() : `Inquiry for ${course || effectiveSubject}. Please contact back.`;

        const contactData = {
            name: name ? name.trim() : "Prospective Student",
            email: effectiveEmail,
            phone: phone ? phone.trim() : "",
            subject: effectiveSubject,
            message: effectiveMessage,
            status: "New",
        };

        if (mongoose.connection.readyState === 1) {
            const newContact = new Contact(contactData);
            await newContact.save();
        } else {
            contactData._id = "cnt_" + Date.now();
            contactData.createdAt = new Date();
            fallbackContacts.unshift(contactData);
        }

        req.session.success = "Thank you for reaching out to Ansari Tutorial! Your request has been recorded. Our counseling coordinator will contact you shortly.";
        res.redirect(returnUrl);
    } catch (error) {
        console.error("Contact Submit Error:", error.message);
        req.session.error = "Could not submit inquiry. Please verify your details or call us directly at 7666875408.";
        res.redirect(returnUrl);
    }
};

module.exports.fallbackContacts = fallbackContacts;
