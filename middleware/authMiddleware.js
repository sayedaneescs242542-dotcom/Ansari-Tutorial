// Authentication Middlewares for Student and Admin sessions

const isStudentLoggedIn = (req, res, next) => {
    if (req.session && req.session.student) {
        return next();
    }
    req.session.error = "Please log in to access the student portal.";
    return res.redirect("/student/login");
};

const isStudentLoggedOut = (req, res, next) => {
    if (req.session && req.session.student) {
        return res.redirect("/student/dashboard");
    }
    next();
};

const isAdminLoggedIn = (req, res, next) => {
    if (req.session && req.session.admin) {
        return next();
    }
    req.session.error = "Admin authorization required. Please log in.";
    return res.redirect("/admin/login");
};

const isAdminLoggedOut = (req, res, next) => {
    if (req.session && req.session.admin) {
        return res.redirect("/admin/dashboard");
    }
    next();
};

module.exports = {
    isStudentLoggedIn,
    isStudentLoggedOut,
    isAdminLoggedIn,
    isAdminLoggedOut,
};
