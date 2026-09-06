/* =========================================================
   CART — PASSWORD & SECURITY
   Forgot Password • Reset Password • Change Password
========================================================= */

"use strict";

const API_URL = "https://cart-backend-8xew.onrender.com";
const TOKEN_KEY = "nc_token";
const PROFILE_KEY = "nc_profile";


/* =========================================================
   START
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initPasswordToggles();
    initPasswordStrength();
    initChangePassword();
    initForgotPassword();
    initResetPassword();
    loadAccountEmail();
});


/* =========================================================
   HELPERS
========================================================= */

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}


function getProfile() {
    try {
        return JSON.parse(
            localStorage.getItem(PROFILE_KEY) || "{}"
        );
    } catch {
        return {};
    }
}


function setMessage(id, message, type = "error") {
    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = "form-message";

    if (type === "success") {
        element.classList.add("success");
    } else {
        element.classList.add("error");
    }
}


function clearMessage(id) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = "";
        element.className = "form-message";
    }
}


function setButtonLoading(button, loading, loadingText = "Please wait...") {
    if (!button) {
        return;
    }

    if (loading) {
        button.dataset.originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = loadingText;
        button.classList.add("loading");
    } else {
        button.disabled = false;

        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }

        button.classList.remove("loading");
    }
}


/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

function initPasswordToggles() {
    document.querySelectorAll(".password-toggle").forEach(button => {

        button.addEventListener("click", () => {

            const targetId =
                button.getAttribute("data-target");

            const input =
                document.getElementById(targetId);

            if (!input) {
                return;
            }

            if (input.type === "password") {
                input.type = "text";

                button.textContent = "🙈";
                button.setAttribute(
                    "aria-label",
                    "Hide password"
                );
            } else {
                input.type = "password";

                button.textContent = "👁";
                button.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }

        });

    });
}


/* =========================================================
   PASSWORD STRENGTH
========================================================= */

function initPasswordStrength() {
    const password =
        document.getElementById("newPassword");

    const fill =
        document.getElementById("strengthFill");

    const text =
        document.getElementById("strengthText");

    if (!password || !fill || !text) {
        return;
    }

    password.addEventListener("input", () => {

        const value = password.value;

        if (!value) {
            fill.style.width = "0%";
            text.textContent = "Enter password";
            return;
        }

        const score = getPasswordScore(value);

        if (score <= 1) {
            fill.style.width = "25%";
            text.textContent = "Weak";
            fill.className = "weak";
        } else if (score === 2) {
            fill.style.width = "50%";
            text.textContent = "Fair";
            fill.className = "fair";
        } else if (score === 3) {
            fill.style.width = "75%";
            text.textContent = "Good";
            fill.className = "good";
        } else {
            fill.style.width = "100%";
            text.textContent = "Strong";
            fill.className = "strong";
        }

    });
}


function getPasswordScore(password) {
    let score = 0;

    if (password.length >= 8) {
        score++;
    }

    if (/[a-z]/.test(password)) {
        score++;
    }

    if (/[A-Z]/.test(password)) {
        score++;
    }

    if (/[0-9]/.test(password)) {
        score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }

    return Math.min(score, 4);
}


function isStrongEnough(password) {
    return (
        password.length >= 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password)
    );
}


/* =========================================================
   CHANGE PASSWORD
========================================================= */

function initChangePassword() {
    const form =
        document.getElementById("changePasswordForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async event => {

        event.preventDefault();

        clearMessage("passwordMessage");

        const currentPassword =
            document.getElementById("currentPassword")?.value.trim();

        const newPassword =
            document.getElementById("newPassword")?.value;

        const confirmPassword =
            document.getElementById("confirmPassword")?.value;

        const button =
            form.querySelector("button[type='submit']");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage(
                "passwordMessage",
                "Please fill in all password fields."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage(
                "passwordMessage",
                "Your new passwords do not match."
            );
            return;
        }

        if (!isStrongEnough(newPassword)) {
            setMessage(
                "passwordMessage",
                "Use at least 8 characters with uppercase, lowercase and a number."
            );
            return;
        }

        if (currentPassword === newPassword) {
            setMessage(
                "passwordMessage",
                "Your new password must be different from your current password."
            );
            return;
        }

        const token = getToken();

        if (!token) {
            setMessage(
                "passwordMessage",
                "Please log in before changing your password."
            );

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);

            return;
        }

        setButtonLoading(
            button,
            true,
            "Updating Password..."
        );

        try {

            /*
             * Main endpoint used by the CART backend.
             */
            let response = await fetch(
                `${API_URL}/api/auth/change-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        current_password: currentPassword,
                        new_password: newPassword
                    })
                }
            );

            let data = await readJSON(response);

            /*
             * Some backend versions may use /api/change-password.
             * Try that endpoint if the first one is unavailable.
             */
            if (
                response.status === 404 ||
                response.status === 405
            ) {
                response = await fetch(
                    `${API_URL}/api/change-password`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            current_password: currentPassword,
                            new_password: newPassword
                        })
                    }
                );

                data = await readJSON(response);
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Unable to change your password."
                );
            }

            setMessage(
                "passwordMessage",
                data.message ||
                "Your password has been changed successfully.",
                "success"
            );

            form.reset();

            const fill =
                document.getElementById("strengthFill");

            const strengthText =
                document.getElementById("strengthText");

            if (fill) {
                fill.style.width = "0%";
            }

            if (strengthText) {
                strengthText.textContent = "Enter password";
            }

            showToast(
                "Password updated successfully."
            );

        } catch (error) {

            setMessage(
                "passwordMessage",
                error.message ||
                "Something went wrong. Please try again."
            );

        } finally {
            setButtonLoading(button, false);
        }

    });
}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

function initForgotPassword() {
    const form =
        document.getElementById("forgotPasswordForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async event => {

        event.preventDefault();

        clearMessage("forgotMessage");

        const email =
            document.getElementById("resetEmail")?.value
                .trim()
                .toLowerCase();

        const button =
            form.querySelector("button[type='submit']");

        if (!email) {
            setMessage(
                "forgotMessage",
                "Please enter your email address."
            );
            return;
        }

        if (!isValidEmail(email)) {
            setMessage(
                "forgotMessage",
                "Please enter a valid email address."
            );
            return;
        }

        setButtonLoading(
            button,
            true,
            "Sending Request..."
        );

        try {

            const response = await fetch(
                `${API_URL}/api/auth/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email
                    })
                }
            );

            const data = await readJSON(response);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Unable to process your request."
                );
            }

            setMessage(
                "forgotMessage",
                data.message ||
                "If an account exists with that email, password reset instructions have been sent.",
                "success"
            );

            /*
             * If the backend returns a reset token for
             * development/testing, save it so the reset
             * form can use it automatically.
             */
            const resetToken =
                data.reset_token ||
                data.resetToken ||
                data.token;

            if (resetToken) {
                localStorage.setItem(
                    "nc_reset_token",
                    resetToken
                );

                const tokenInput =
                    document.getElementById("resetToken");

                if (tokenInput) {
                    tokenInput.value = resetToken;
                }
            }

            showToast(
                "Password reset request sent."
            );

        } catch (error) {

            setMessage(
                "forgotMessage",
                error.message ||
                "Unable to send reset request."
            );

        } finally {
            setButtonLoading(button, false);
        }

    });
}


/* =========================================================
   RESET PASSWORD
========================================================= */

function initResetPassword() {
    const form =
        document.getElementById("resetPasswordForm");

    if (!form) {
        return;
    }

    const savedToken =
        localStorage.getItem("nc_reset_token");

    const tokenInput =
        document.getElementById("resetToken");

    if (
        savedToken &&
        tokenInput &&
        !tokenInput.value
    ) {
        tokenInput.value = savedToken;
    }

    form.addEventListener("submit", async event => {

        event.preventDefault();

        clearMessage("resetMessage");

        const token =
            document.getElementById("resetToken")?.value.trim();

        const newPassword =
            document.getElementById("resetNewPassword")?.value;

        const confirmPassword =
            document.getElementById("resetConfirmPassword")?.value;

        const button =
            form.querySelector("button[type='submit']");

        if (!token) {
            setMessage(
                "resetMessage",
                "Please enter your reset token."
            );
            return;
        }

        if (!newPassword || !confirmPassword) {
            setMessage(
                "resetMessage",
                "Please enter and confirm your new password."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage(
                "resetMessage",
                "Your passwords do not match."
            );
            return;
        }

        if (!isStrongEnough(newPassword)) {
            setMessage(
                "resetMessage",
                "Use at least 8 characters with uppercase, lowercase and a number."
            );
            return;
        }

        setButtonLoading(
            button,
            true,
            "Resetting Password..."
        );

        try {

            const response = await fetch(
                `${API_URL}/api/auth/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token: token,
                        new_password: newPassword
                    })
                }
            );

            const data = await readJSON(response);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Unable to reset your password."
                );
            }

            setMessage(
                "resetMessage",
                data.message ||
                "Your password has been reset successfully.",
                "success"
            );

            localStorage.removeItem(
                "nc_reset_token"
            );

            form.reset();

            showToast(
                "Password reset successfully."
            );

            /*
             * Give the user time to see the success message,
             * then take them to login.
             */
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1800);

        } catch (error) {

            setMessage(
                "resetMessage",
                error.message ||
                "Unable to reset your password."
            );

        } finally {
            setButtonLoading(button, false);
        }

    });
}


/* =========================================================
   LOAD ACCOUNT EMAIL
========================================================= */

function loadAccountEmail() {
    const profile = getProfile();

    const email =
        profile.email ||
        profile.email_address ||
        "";

    const input =
        document.getElementById("resetEmail");

    if (
        input &&
        email &&
        !input.value
    ) {
        input.value = email;
    }
}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* =========================================================
   READ JSON SAFELY
========================================================= */

async function readJSON(response) {
    try {
        return await response.json();
    } catch {
        return {};
    }
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {
    const toast =
        document.getElementById("securityToast");

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        window.securityToastTimer
    );

    window.securityToastTimer =
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3500);
}


/* =========================================================
   ENTER KEY SUPPORT
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key !== "Enter") {
        return;
    }

    const active =
        document.activeElement;

    if (
        active &&
        active.tagName === "INPUT"
    ) {
        const form =
            active.closest("form");

        if (form) {
            // Normal browser form submission handles it.
            return;
        }
    }

});


/* =========================================================
   PAGE EXIT PROTECTION
========================================================= */

window.addEventListener("beforeunload", () => {
    /*
     * Nothing sensitive is intentionally stored here.
     */
});