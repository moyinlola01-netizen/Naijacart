/* =========================================================
   CART — RESET PASSWORD
   reset-password.js
========================================================= */

"use strict";

document.addEventListener(
    "DOMContentLoaded",
    initResetPassword
);


/* =========================================================
   INITIALIZE
========================================================= */

function initResetPassword() {

    const form =
        document.getElementById(
            "resetPasswordForm"
        );

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        handleResetPassword
    );


    setupPasswordToggles();
}


/* =========================================================
   RESET PASSWORD
========================================================= */

async function handleResetPassword(event) {

    event.preventDefault();


    const form =
        event.currentTarget;


    const params =
        new URLSearchParams(
            window.location.search
        );


    const token =
        params.get("token") ||
        getInputValue(
            form,
            [
                "token",
                "resetToken"
            ]
        );


    const password =
        getInputValue(
            form,
            [
                "password",
                "newPassword"
            ]
        );


    const confirmPassword =
        getInputValue(
            form,
            [
                "confirmPassword",
                "confirm_password",
                "password_confirmation"
            ]
        );


    clearMessage();


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!token) {

        showMessage(
            "This password reset link is invalid or incomplete.",
            "error"
        );

        return;
    }


    if (
        password.length < 8
    ) {

        showMessage(
            "Password must be at least 8 characters.",
            "error"
        );

        return;
    }


    if (
        password !== confirmPassword
    ) {

        showMessage(
            "Passwords do not match.",
            "error"
        );

        return;
    }


    const button =
        form.querySelector(
            'button[type="submit"]'
        );


    const originalText =
        button
            ? button.textContent
            : "Reset Password";


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Resetting...";
    }


    try {

        /*
         * Uses the current Cart API.
         */

        const result =
            await CartAPI.resetPassword(
                token,
                password
            );


        showMessage(
            result?.message ||
            "Your password has been reset successfully.",
            "success"
        );


        /*
         * Remove old authentication data.
         */

        CartAPI.clearAuth();


        setTimeout(
            () => {

                window.location.href =
                    "login.html";

            },
            1500
        );


    } catch (error) {

        console.error(
            "Password reset error:",
            error
        );


        showMessage(
            error?.message ||
            "Unable to reset your password. The link may have expired.",
            "error"
        );


        if (button) {

            button.disabled =
                false;

            button.textContent =
                originalText;
        }
    }
}


/* =========================================================
   PASSWORD TOGGLES
========================================================= */

function setupPasswordToggles() {

    document
        .querySelectorAll(
            "[data-password-toggle], .password-toggle"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const targetId =
                        button.dataset.target;


                    let input =
                        targetId
                            ? document.getElementById(
                                targetId
                            )
                            : button
                                .closest(
                                    ".password-field"
                                )
                                ?.querySelector(
                                    "input"
                                );


                    if (!input) {
                        return;
                    }


                    const showing =
                        input.type ===
                        "text";


                    input.type =
                        showing
                            ? "password"
                            : "text";


                    button.setAttribute(
                        "aria-label",
                        showing
                            ? "Show password"
                            : "Hide password"
                    );
                }
            );
        });
}


/* =========================================================
   GET INPUT VALUE
========================================================= */

function getInputValue(
    form,
    names
) {

    for (
        const name of names
    ) {

        const input =
            form.querySelector(
                `[name="${name}"]`
            ) ||
            document.getElementById(
                name
            );


        if (input) {

            return String(
                input.value || ""
            ).trim();
        }
    }


    return "";
}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    message,
    type = "info"
) {

    let box =
        document.getElementById(
            "resetPasswordMessage"
        ) ||
        document.querySelector(
            ".reset-password-message"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "resetPasswordMessage";


        const form =
            document.getElementById(
                "resetPasswordForm"
            );


        if (form) {

            form.prepend(
                box
            );

        } else {

            document.body.prepend(
                box
            );
        }
    }


    box.textContent =
        message;

    box.className =
        `reset-password-message ${type}`;

    box.style.display =
        "block";
}


/* =========================================================
   CLEAR MESSAGE
========================================================= */

function clearMessage() {

    const box =
        document.getElementById(
            "resetPasswordMessage"
        ) ||
        document.querySelector(
            ".reset-password-message"
        );


    if (box) {

        box.textContent =
            "";

        box.style.display =
            "none";
    }
}


/* =========================================================
   GLOBAL
========================================================= */

window.CartResetPassword = {
    init: initResetPassword,
    submit: handleResetPassword
};