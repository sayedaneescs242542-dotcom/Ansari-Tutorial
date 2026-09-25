// Ansari Tutorial - Client Side Interactive Scripts

document.addEventListener("DOMContentLoaded", function () {
    // 1. Auto-dismiss alert notifications after 5 seconds safely
    const alerts = document.querySelectorAll(".alert-dismissible");
    alerts.forEach(function (alert) {
        setTimeout(function () {
            try {
                if (typeof bootstrap !== "undefined" && bootstrap.Alert) {
                    const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
                    if (bsAlert) bsAlert.close();
                } else {
                    alert.style.transition = "opacity 0.5s ease";
                    alert.style.opacity = "0";
                    setTimeout(() => alert.remove(), 500);
                }
            } catch (e) {
                alert.remove();
            }
        }, 5000);
    });

    // 2. Real-time Search Filter for Admin & Student Tables
    const searchInputs = document.querySelectorAll(".table-search-input");
    searchInputs.forEach(function (searchInput) {
        const targetTableId = searchInput.getAttribute("data-table");
        const table = document.getElementById(targetTableId);
        if (table) {
            searchInput.addEventListener("keyup", function () {
                const query = searchInput.value.toLowerCase().trim();
                const rows = table.querySelectorAll("tbody tr");
                rows.forEach(function (row) {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(query)) {
                        row.style.display = "";
                    } else {
                        row.style.display = "none";
                    }
                });
            });
        }
    });

    // 3. Confirm Delete Dialog Helper
    const deleteButtons = document.querySelectorAll(".btn-delete-confirm");
    deleteButtons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            if (!confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
                e.preventDefault();
            }
        });
    });

    // 4. Edit Course Modal Populate
    const editCourseModal = document.getElementById("editCourseModal");
    if (editCourseModal) {
        editCourseModal.addEventListener("show.bs.modal", function (event) {
            const button = event.relatedTarget;
            if (!button) return;
            document.getElementById("edit-course-id").value = button.getAttribute("data-id") || "";
            document.getElementById("edit-course-title").value = button.getAttribute("data-title") || "";
            document.getElementById("edit-course-category").value = button.getAttribute("data-category") || "School";
            document.getElementById("edit-course-description").value = button.getAttribute("data-description") || "";
            document.getElementById("edit-course-duration").value = button.getAttribute("data-duration") || "";
            document.getElementById("edit-course-fee").value = button.getAttribute("data-fee") || "";
            document.getElementById("edit-course-subjects").value = button.getAttribute("data-subjects") || "";
            document.getElementById("edit-course-badge").value = button.getAttribute("data-badge") || "";
        });
    }

    // 5. Edit Student Modal Populate
    const editStudentModal = document.getElementById("editStudentModal");
    if (editStudentModal) {
        editStudentModal.addEventListener("show.bs.modal", function (event) {
            const button = event.relatedTarget;
            if (!button) return;
            document.getElementById("edit-student-id").value = button.getAttribute("data-id") || "";
            document.getElementById("edit-student-name").value = button.getAttribute("data-name") || "";
            document.getElementById("edit-student-email").value = button.getAttribute("data-email") || "";
            document.getElementById("edit-student-phone").value = button.getAttribute("data-phone") || "";
            document.getElementById("edit-student-course").value = button.getAttribute("data-course") || "";
            document.getElementById("edit-student-status").value = button.getAttribute("data-status") || "Approved";
            document.getElementById("edit-student-address").value = button.getAttribute("data-address") || "";
        });
    }

    // 6. Edit Announcement Modal Populate
    const editNoticeModal = document.getElementById("editNoticeModal");
    if (editNoticeModal) {
        editNoticeModal.addEventListener("show.bs.modal", function (event) {
            const button = event.relatedTarget;
            if (!button) return;
            document.getElementById("edit-notice-id").value = button.getAttribute("data-id") || "";
            document.getElementById("edit-notice-title").value = button.getAttribute("data-title") || "";
            document.getElementById("edit-notice-category").value = button.getAttribute("data-category") || "Notice";
            document.getElementById("edit-notice-content").value = button.getAttribute("data-content") || "";
            document.getElementById("edit-notice-audience").value = button.getAttribute("data-audience") || "All";
            const isImportant = button.getAttribute("data-important") === "true";
            document.getElementById("edit-notice-important").checked = isImportant;
        });
    }

    // 7. Back To Top Floating Button Handler
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (backToTopBtn) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        backToTopBtn.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});
