/* =========================================================
   CART — FORGOT PASSWORD
   Password Recovery
========================================================= */

"use strict";

const API_URL = "https://cart-backend-8xew.onrender.com";
const PROFILE_KEY = "nc_profile";
const RESET_TOKEN_KEY = "nc_reset_token";


/* =========================================================
   START
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initForgotPassword();
    loadSavedEmail();
});


/* =========================================================
   FORGOT PASSWORD FORM
========================================================= */

function initForgotPassword() {

    const form = document.getElementById(
        "forgotPasswordForm"
    );

    if (!form) {
        return;
    }

    form.addEventListener("submit", async event => {

        event.preventDefault();

        clearMessage();

        const emailInput =
            document.getElementById("email");

        const button =
            document.getElementById("resetButton");

        const email =
            emailInput?.value.trim().toLowerCase();

        if (!email) {
            showMessage(
                "Please enter your email address.",
                "error"
            );
            return;
        }

        if (!isValidEmail(email)) {
            showMessage(
                "Please enter a valid email address.",
                "error"
            );
            return;
        }


        /* =============================================
           SAVE EMAIL LOCALLY
        ============================================== */

        saveEmail(email);


        /* =============================================
           LOADING
        ============================================== */

        setLoading(
            button,
            true,
            "Sending Reset Request..."
        );


        try {

            const response = await fetch(
                `${API_URL}/api/auth/forgot-password`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: JSON.stringify({
                        email: email
                    })
                }
            );


            const data = await readJSON(response);


            /* =========================================
               SERVER ERROR
            ========================================== */

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Unable to process your request."
                );

            }


            /* =========================================
               SUCCESS
            ========================================== */

            showMessage(
                data.message ||
                "If an account exists with this email, password reset instructions have been sent.",
                "success"
            );


            /*
             * Some development versions of the backend
             * return the reset token directly.
             *
             * If it exists, save it automatically.
             */

            const resetToken =
                data.reset_token ||
                data.resetToken ||
                data.token;


            if (resetToken) {

                localStorage.setItem(
                    RESET_TOKEN_KEY,
                    resetToken
                );

            }


            showToast(
                "Reset request sent successfully."
            );


            /*
             * If the backend returned a token,
             * go directly to the reset page.
             *
             * Otherwise give the user a short message
             * and open the reset page.
             */

            setTimeout(() => {

                window.location.href =
                    "password-security.html";

            }, 1800);


        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );


            showMessage(
                error.message ||
                "Something went wrong. Please try again.",
                "error"
            );


        } finally {

            setLoading(
                button,
                false
            );

        }

    });

}


/* =========================================================
   LOAD SAVED EMAIL
========================================================= */

function loadSavedEmail() {

    const emailInput =
        document.getElementById("email");

    if (!emailInput) {
        return;
    }


    try {

        const profile =
            JSON.parse(
                localStorage.getItem(
                    PROFILE_KEY
                ) || "{}"
            );


        const email =
            profile.email ||
            profile.email_address ||
            "";


        if (
            email &&
            !emailInput.value
        ) {

            emailInput.value =
                email;

        }

    } catch (error) {

        console.warn(
            "Unable to load saved email."
        );

    }

}


/* =========================================================
   SAVE EMAIL
========================================================= */

function saveEmail(email) {

    try {

        const profile =
            JSON.parse(
                localStorage.getItem(
                    PROFILE_KEY
                ) || "{}"
            );


        profile.email = email;


        localStorage.setItem(
            PROFILE_KEY,
            JSON.stringify(profile)
        );

    } catch (error) {

        console.warn(
            "Unable to save email."
        );

    }

}


/* =========================================================
   VALIDATE EMAIL
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


/* =========================================================
   SHOW MESSAGE
========================================================= */

function showMessage(
    message,
    type = "error"
) {

    const element =
        document.getElementById(
            "forgotMessage"
        );

    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        "form-message";


    element.classList.add(
        type
    );

}


/* =========================================================
   CLEAR MESSAGE
========================================================= */

function clearMessage() {

    const element =
        document.getElementById(
            "forgotMessage"
        );

    if (!element) {
        return;
    }


    element.textContent =
        "";

    element.className =
        "form-message";

}


/* =========================================================
   BUTTON LOADING
========================================================= */

function setLoading(
    button,
    loading,
    loadingText = "Please wait..."
) {

    if (!button) {
        return;
    }


    if (loading) {

        button.dataset.originalText =
            button.innerHTML;

        button.disabled =
            true;

        button.innerHTML =
            loadingText;

        button.classList.add(
            "loading"
        );

    } else {

        button.disabled =
            false;


        if (
            button.dataset.originalText
        ) {

            button.innerHTML =
                button.dataset.originalText;

        }


        button.classList.remove(
            "loading"
        );

    }

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
        document.getElementById(
            "forgotToast"
        );

    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.forgotToastTimer
    );


    window.forgotToastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3500);

}


/* =========================================================
   ENTER KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            document.activeElement?.tagName === "INPUT"
        ) {

            const form =
                document.activeElement.closest(
                    "form"
                );

            if (form) {
                return;
            }

        }

    }
);