// Official Ansari Tutorial Data (Verified from Official Center Brochure)

const defaultCourses = [
    {
        _id: "c1",
        title: "School - 5th to S.S.C",
        category: "School",
        description: "Comprehensive concept-based coaching for 5th to 10th SSC Board students. Special attention to slow learners, regular tests, and strong academic foundation.",
        duration: "1 Academic Year",
        fee: "Affordable with Easy Installments",
        subjects: ["Mathematics", "Science", "English", "Social Studies", "Hindi/Marathi"],
        highlightBadge: "Top Success Rate",
        iconClass: "fas fa-school",
    },
    {
        _id: "c2",
        title: "Commerce - FY.J.C (11th) & S.Y.J.C (12th)",
        category: "Commerce",
        description: "Specialized Junior College commerce coaching covering Accounts, Economics, and Board preparation with in-depth problem-solving techniques.",
        duration: "1 Academic Year",
        fee: "Affordable with Easy Installments",
        subjects: ["Book-Keeping & Accountancy", "Economics", "O.C.M.", "Secretarial Practice", "English", "Maths/IT"],
        highlightBadge: "High Recommendation",
        iconClass: "fas fa-chart-line",
    },
    {
        _id: "c3",
        title: "B.Com Degree (FY, SY & TY B.com)",
        category: "Commerce",
        description: "University of Mumbai degree coaching for First, Second, and Third Year B.Com with complete syllabus coverage and previous year paper practice.",
        duration: "Semester Pattern (3 Years)",
        fee: "Affordable with Easy Installments",
        subjects: ["Financial Accounting", "Cost Accounting", "Business Economics", "Commerce", "Direct & Indirect Tax"],
        highlightBadge: "Degree College Batch",
        iconClass: "fas fa-graduation-cap",
    },
    {
        _id: "c4",
        title: "BMS Degree (FY, SY & TY B.MS)",
        category: "Commerce",
        description: "Bachelor of Management Studies degree coaching covering Management, Finance, Marketing, and Quantitative Techniques.",
        duration: "Semester Pattern (3 Years)",
        fee: "Affordable with Easy Installments",
        subjects: ["Principles of Management", "Financial Management", "Marketing", "Business Statistics", "HRM"],
        highlightBadge: "Professional Degree",
        iconClass: "fas fa-briefcase",
    },
    {
        _id: "c5",
        title: "BAF Degree (FY, SY & TY B.AF)",
        category: "Commerce",
        description: "Bachelor of Accounting & Finance degree coaching with specialized focus on Financial Accounting, Taxation, Auditing, and Costing.",
        duration: "Semester Pattern (3 Years)",
        fee: "Affordable with Easy Installments",
        subjects: ["Financial Accounting", "Cost Accounting", "Auditing", "Taxation", "Management Accounting"],
        highlightBadge: "Accounts Specialized",
        iconClass: "fas fa-file-invoice-dollar",
    },
    {
        _id: "c6",
        title: "Science - FY.J.C & S.Y.J.C (NEET, JEE & MH-CET)",
        category: "Science",
        description: "Rigorous Junior College Science coaching integrated with entrance exam preparation (NEET, JEE, MH-CET). Concept clarity and weekly mock series.",
        duration: "1 to 2 Years",
        fee: "Affordable with Easy Installments",
        subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Entrance Test Series"],
        highlightBadge: "NEET / JEE / MH-CET",
        iconClass: "fas fa-microscope",
    },
    {
        _id: "c7",
        title: "Arts - FY.J.C (11th) & S.Y.J.C (12th)",
        category: "Arts",
        description: "Comprehensive Junior College Arts stream coaching with strong conceptual guidance, English language clarity, and high-scoring exam techniques.",
        duration: "1 Academic Year",
        fee: "Affordable with Easy Installments",
        subjects: ["History", "Political Science", "Geography", "Economics", "English", "Psychology/Sociology"],
        highlightBadge: "Core Arts Stream",
        iconClass: "fas fa-book-open",
    },
    {
        _id: "c8",
        title: "B.A Degree (FY.B.A, S.Y.B.A, TY.B.A)",
        category: "Arts",
        description: "Bachelor of Arts degree coaching led by Sir (Graduate in English) with special emphasis on literature, communication, and humanities.",
        duration: "Semester Pattern (3 Years)",
        fee: "Affordable with Easy Installments",
        subjects: ["English Literature", "History", "Political Science", "Sociology", "Communication Skills"],
        highlightBadge: "English Specialization",
        iconClass: "fas fa-landmark",
    },
    {
        _id: "c9",
        title: "Professional Courses: CA, CMA & CFA",
        category: "Professional",
        description: "Professional coaching for CA Foundation, CMA Foundation, and CFA aspirants led by experienced faculty with on-the-spot doubt resolution.",
        duration: "Foundation & Intermediate",
        fee: "Affordable with Easy Installments",
        subjects: ["Principles of Accounting", "Business Law", "Quantitative Aptitude", "Business Economics", "Taxation"],
        highlightBadge: "Elite Professional",
        iconClass: "fas fa-user-tie",
    },
];

const defaultAnnouncements = [
    {
        _id: "a1",
        title: "Admissions Open for School, College & Degree Batches (2026-27)",
        content: "Admissions are officially open for 5th-SSC School, 11th & 12th Commerce, Science (NEET/JEE/CET), Arts, B.Com, BMS, BAF, B.A & CA/CMA/CFA. Visit our Andheri West center today!",
        category: "Admission",
        isImportant: true,
        targetAudience: "All Students & Parents",
        createdAt: new Date(),
    },
    {
        _id: "a2",
        title: "Free Demo Classes Available - Experience Before You Decide!",
        content: "Book your free demo class for any school, college or degree subject. On-the-spot doubt solving and special attention to slow learners.",
        category: "Notice",
        isImportant: true,
        targetAudience: "New Admissions",
        createdAt: new Date(),
    },
    {
        _id: "a3",
        title: "Flexible & Easy Fee Payment Installments",
        content: "Quality education that fits your budget! All courses feature affordable fees with monthly and quarterly installment options.",
        category: "Fee Notice",
        isImportant: false,
        targetAudience: "Parents & Students",
        createdAt: new Date(),
    },
];

const instituteInfo = {
    name: "Ansari Tutorial",
    tagline: "FUN + LEARNING",
    motto: "It's your time to learn, grow and achieve So, grab the opportunity now.",
    establishedYear: 2019,
    founder: {
        name: "Faisal Ansari",
        title: "Founder & Lead Faculty",
        qualification: "Graduate in English (10th Pass, 12th Pass, B.A. Graduate in English)",
        experience: "Educator & Mentor since 2019",
        philosophy: "Fun + Learning with Special Attention to Slow Learners"
    },
    contact: {
        phone1: "7666875408",
        phone2: "9022420050",
        phoneFormatted: "7666875408 / 9022420050",
        whatsapp: "7666875408",
        email: "info@ansaritutorial.com",
        address: "Behind Aqsa Masjid, Opp. Tashkent Bakery Lane, Andheri (West), Mumbai - 400 058.",
        area: "Andheri (West), Mumbai",
        pincode: "400058",
        landmark: "Behind Aqsa Masjid, Opp. Tashkent Bakery Lane"
    },
    features: [
        {
            title: "Experienced Faculty",
            desc: "Learn from skilled and dedicated teachers.",
            icon: "fas fa-chalkboard-teacher"
        },
        {
            title: "Quality Teaching",
            desc: "Concept-based learning for better understanding.",
            icon: "fas fa-book-reader"
        },
        {
            title: "Special Attention to Slow Learners",
            desc: "We focus on every student's progress and learning pace.",
            icon: "fas fa-user-friends"
        },
        {
            title: "Free Demo Class",
            desc: "Experience our teaching before you decide.",
            icon: "fas fa-play-circle"
        },
        {
            title: "Affordable Fees with Easy Payment",
            desc: "Quality education that fits your budget with installment plans.",
            icon: "fas fa-hand-holding-usd"
        },
        {
            title: "On the Spot Doubt Solving",
            desc: "Get your doubts cleared instantly during and after lectures.",
            icon: "fas fa-lightbulb"
        }
    ],
    admissionSteps: [
        {
            step: 1,
            title: "1. Enquiry",
            desc: "Contact us or visit our centre in Andheri West.",
            icon: "fas fa-file-alt"
        },
        {
            step: 2,
            title: "2. Counselling",
            desc: "Get personalized guidance as per your goals and stream.",
            icon: "fas fa-comments"
        },
        {
            step: 3,
            title: "3. Admission",
            desc: "Complete your admission with easy payment options.",
            icon: "fas fa-user-check"
        },
        {
            step: 4,
            title: "4. Start Learning",
            desc: "Begin your journey towards success with Fun + Learning.",
            icon: "fas fa-trophy"
        }
    ]
};

module.exports = {
    defaultCourses,
    defaultAnnouncements,
    instituteInfo
};
