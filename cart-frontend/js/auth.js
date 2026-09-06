/* =========================================================
   CART — AUTHENTICATION
   Login • Register • Logout • Forgot Password • Profile
========================================================= */

"use strict";

const API_URL = "https://cart-backend-8xew.onrender.com";
const TOKEN_KEY = "nc_token";
const USER_KEY = "nc_user";

/* =========================================================
   HELPERS
========================================================= */

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
}

function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
        return null;
    }
}

function saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function showMessage(message, type = "error") {
    const box =
        document.getElementById("authMessage") ||
        document.getElementById("loginMessage") ||
        document.getElementById("registerMessage");

    if (!box) return;

    box.textContent = message;
    box.className = `auth-message ${type}`;
    box.style.display = "block";
}

function hideMessage() {
    const box =
        document.getElementById("authMessage") ||
        document.getElementById("loginMessage") ||
        document.getElementById("registerMessage");

    if (box) {
        box.style.display = "none";
        box.textContent = "";
    }
}

async function apiRequest(endpoint, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    const token = getToken();

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            "Something went wrong. Please try again."
        );
    }

    return data;
}

/* =========================================================
   LOGIN
========================================================= */

async function loginUser(email, password, rememberMe = false) {
    const data = await apiRequest("/api/login", {
        method: "POST",
        body: JSON.stringify({
            email: email.trim(),
            password
        })
    });

    const token = data.token || data.access_token;

    if (!token) {
        throw new Error("Login succeeded but no authentication token was returned.");
    }

    setToken(token);

    const user = data.user || data.account || {
        email: email.trim()
    };

    saveUser(user);

    if (rememberMe) {
        localStorage.setItem("nc_remember", "true");
    } else {
        localStorage.removeItem("nc_remember");
    }

    return data;
}

function initLogin() {
    const form =
        document.getElementById("loginForm") ||
        document.querySelector('form[data-form="login"]');

    if (!form) return;

    const emailInput =
        document.getElementById("email") ||
        document.getElementById("loginEmail") ||
        form.querySelector('input[type="email"]');

    const passwordInput =
        document.getElementById("password") ||
        document.getElementById("loginPassword") ||
        form.querySelector('input[type="password"]');

    const rememberInput =
        document.getElementById("rememberMe") ||
        form.querySelector('input[type="checkbox"]');

    const submitButton =
        document.getElementById("loginButton") ||
        form.querySelector('button[type="submit"]');

    if (!emailInput || !passwordInput) return;

    /* Restore remembered email */
    const remembered = localStorage.getItem("nc_remember");

    if (remembered === "true") {
        const savedUser = getUser();

        if (savedUser && savedUser.email) {
            emailInput.value = savedUser.email;
        }

        if (rememberInput) {
            rememberInput.checked = true;
        }
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        hideMessage();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberInput ? rememberInput.checked : false;

        if (!email) {
            showMessage("Please enter your email address.");
            emailInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showMessage("Please enter a valid email address.");
            emailInput.focus();
            return;
        }

        if (!password) {
            showMessage("Please enter your password.");
            passwordInput.focus();
            return;
        }

        const originalText = submitButton
            ? submitButton.innerHTML
            : "Login";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = "Signing in...";
        }

        try {
            await loginUser(email, password, rememberMe);

            showMessage("Login successful. Welcome back! 🎉", "success");

            setTimeout(() => {
                const params = new URLSearchParams(window.location.search);
                const redirect = params.get("redirect");

                if (redirect) {
                    window.location.href = redirect;
                } else {
                    window.location.href = "index.html";
                }
            }, 700);

        } catch (error) {
            showMessage(error.message || "Login failed. Please check your details.");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        }
    });
}

/* =========================================================
   REGISTER
========================================================= */

async function registerUser(name, email, password) {
    const data = await apiRequest("/api/register", {
        method: "POST",
        body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password
        })
    });

    const token = data.token || data.access_token;

    if (token) {
        setToken(token);
    }

    if (data.user) {
        saveUser(data.user);
    }

    return data;
}

function initRegister() {
    const form =
        document.getElementById("registerForm") ||
        document.querySelector('form[data-form="register"]');

    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        hideMessage();

        const nameInput =
            document.getElementById("name") ||
            document.getElementById("registerName") ||
            form.querySelector('input[name="name"]');

        const emailInput =
            document.getElementById("email") ||
            document.getElementById("registerEmail") ||
            form.querySelector('input[type="email"]');

        const passwordInput =
            document.getElementById("password") ||
            document.getElementById("registerPassword") ||
            form.querySelector('input[name="password"]');

        const confirmInput =
            document.getElementById("confirmPassword") ||
            form.querySelector('input[name="confirmPassword"]');

        const submitButton =
            document.getElementById("registerButton") ||
            form.querySelector('button[type="submit"]');

        if (!nameInput || !emailInput || !passwordInput) return;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmInput
            ? confirmInput.value
            : password;

        if (!name) {
            showMessage("Please enter your full name.");
            nameInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showMessage("Please enter a valid email address.");
            emailInput.focus();
            return;
        }

        if (password.length < 6) {
            showMessage("Password must be at least 6 characters.");
            passwordInput.focus();
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.");
            if (confirmInput) confirmInput.focus();
            return;
        }

        const originalText = submitButton
            ? submitButton.innerHTML
            : "Create Account";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = "Creating account...";
        }

        try {
            await registerUser(name, email, password);

            showMessage(
                "Account created successfully! Welcome to CART 🎉",
                "success"
            );

            setTimeout(() => {
                window.location.href = "index.html";
            }, 900);

        } catch (error) {
            showMessage(
                error.message ||
                "Registration failed. Please try again."
            );
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        }
    });
}

/* =========================================================
   LOGOUT
========================================================= */

async function logoutUser() {
    try {
        if (getToken()) {
            await apiRequest("/api/logout", {
                method: "POST"
            });
        }
    } catch (error) {
        console.warn("Logout API request failed:", error);
    }

    clearAuth();
    window.location.href = "index.html";
}

function initLogout() {
    document.querySelectorAll("[data-logout]").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            logoutUser();
        });
    });

    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function (event) {
            event.preventDefault();
            logoutUser();
        });
    }
}

/* =========================================================
   CURRENT USER
========================================================= */

async function loadCurrentUser() {
    const token = getToken();

    if (!token) return null;

    try {
        const data = await apiRequest("/api/me", {
            method: "GET"
        });

        const user = data.user || data;

        if (user) {
            saveUser(user);
        }

        return user;

    } catch (error) {
        console.warn("Could not load current user:", error);
        return null;
    }
}

/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

function initPasswordToggle() {
    const toggle = document.getElementById("togglePassword");

    const passwordInput =
        document.getElementById("password") ||
        document.getElementById("loginPassword");

    if (!toggle || !passwordInput) return;

    toggle.addEventListener("click", function () {
        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword
            ? "text"
            : "password";

        toggle.setAttribute(
            "aria-label",
            isPassword
                ? "Hide password"
                : "Show password"
        );

        if (isPassword) {
            toggle.innerHTML = "🙈";
        } else {
            toggle.innerHTML = "👁";
        }
    });
}

/* =========================================================
   FORGOT PASSWORD
========================================================= */

async function requestPasswordReset(email) {
    return await apiRequest("/api/forgot-password", {
        method: "POST",
        body: JSON.stringify({
            email: email.trim()
        })
    });
}

function initForgotPassword() {
    const link =
        document.getElementById("forgotPassword") ||
        document.querySelector('a[href*="forgot"]');

    if (!link) return;

    link.addEventListener("click", async function (event) {
        const emailInput =
            document.getElementById("email") ||
            document.getElementById("loginEmail");

        if (!emailInput) return;

        const email = emailInput.value.trim();

        if (!email) {
            event.preventDefault();
            showMessage("Enter your email first, then click Forgot password.");
            emailInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            event.preventDefault();
            showMessage("Please enter a valid email address.");
            emailInput.focus();
            return;
        }

        event.preventDefault();

        try {
            await requestPasswordReset(email);

            showMessage(
                "If that email is registered, password reset instructions have been sent.",
                "success"
            );

        } catch (error) {
            showMessage(
                error.message ||
                "Unable to request password reset."
            );
        }
    });
}

/* =========================================================
   ACCOUNT UI
========================================================= */

function updateAccountUI() {
    const user = getUser();

    document.querySelectorAll("[data-user-name]").forEach(element => {
        element.textContent = user?.name || "Account";
    });

    document.querySelectorAll("[data-user-email]").forEach(element => {
        element.textContent = user?.email || "";
    });

    document.querySelectorAll("[data-auth-login]").forEach(element => {
        element.style.display = user ? "none" : "";
    });

    document.querySelectorAll("[data-auth-logout]").forEach(element => {
        element.style.display = user ? "" : "none";
    });
}

/* =========================================================
   VALIDATION
========================================================= */

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", async function () {
    initLogin();
    initRegister();
    initLogout();
    initPasswordToggle();
    initForgotPassword();

    updateAccountUI();

    if (getToken()) {
        await loadCurrentUser();
        updateAccountUI();
    }
});

/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.CartAuth = {
    getToken,
    getUser,
    setToken,
    clearAuth,
    loginUser,
    registerUser,
    logoutUser,
    loadCurrentUser,
    requestPasswordReset
};