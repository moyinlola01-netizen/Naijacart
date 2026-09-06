/* =========================================================
   NAIJACART — REGISTER PAGE
   register.js
========================================================= */

"use strict";


document.addEventListener(
    "DOMContentLoaded",
    initRegister
);


/* =========================================================
   INITIALIZE
========================================================= */

function initRegister() {

    setupRegisterForm();
    setupPasswordToggles();
    updateCartCount();

}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

    let cart = [];

    try {

        cart = JSON.parse(
            localStorage.getItem("nc_cart") || "[]"
        );

    } catch {

        cart = [];

    }


    if (!Array.isArray(cart)) {
        cart = [];
    }


    const count =
        cart.reduce(
            (total, item) => {

                return total +
                    Number(
                        item.quantity || 1
                    );

            },
            0
        );


    document
        .querySelectorAll(
            "#cartCount, .cart-count"
        )
        .forEach(
            element => {

                element.textContent =
                    count;

            }
        );
}


/* =========================================================
   REGISTER FORM
========================================================= */

function setupRegisterForm() {

    const form =
        document.getElementById(
            "registerForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        handleRegisterSubmit
    );
}


/* =========================================================
   SUBMIT REGISTRATION
========================================================= */

async function handleRegisterSubmit(event) {

    event.preventDefault();


    const form =
        event.currentTarget;


    const name =
        getValue(
            form,
            [
                "name",
                "fullName",
                "full_name"
            ]
        );


    const email =
        getValue(
            form,
            [
                "email"
            ]
        ).toLowerCase();


    const phone =
        getValue(
            form,
            [
                "phone",
                "phoneNumber"
            ]
        );


    const password =
        getValue(
            form,
            [
                "password"
            ]
        );


    const confirmPassword =
        getValue(
            form,
            [
                "confirmPassword",
                "confirm_password"
            ]
        );


    clearRegisterMessage();


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!name) {

        showRegisterMessage(
            "Please enter your full name.",
            "error"
        );

        return;
    }


    if (!isValidEmail(email)) {

        showRegisterMessage(
            "Please enter a valid email address.",
            "error"
        );

        return;
    }


    if (
        phone &&
        !isValidNigerianPhone(phone)
    ) {

        showRegisterMessage(
            "Please enter a valid Nigerian phone number.",
            "error"
        );

        return;
    }


    if (password.length < 8) {

        showRegisterMessage(
            "Password must be at least 8 characters.",
            "error"
        );

        return;
    }


    if (password !== confirmPassword) {

        showRegisterMessage(
            "Passwords do not match.",
            "error"
        );

        return;
    }


    /* =====================================================
       BUTTON STATE
    ===================================================== */

    const submitButton =
        form.querySelector(
            'button[type="submit"]'
        );


    const originalText =
        submitButton
            ? submitButton.textContent.trim()
            : "Create Account";


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Creating account...";
    }


    try {

        const result =
            await CartAPI.registerUser(
                name,
                email,
                phone,
                password
            );


        const data =
            result?.data ||
            result;


        const token =
            data?.token;


        const user =
            data?.user;


        if (token) {

            CartAPI.setToken(
                token
            );
        }


        if (user) {

            CartAPI.saveUser(
                user
            );
        }


        showRegisterMessage(
            result?.message ||
            "Account created successfully!",
            "success"
        );


        setTimeout(
            () => {

                if (
                    result?.requires_verification ||
                    result?.email_verification_required ||
                    data?.requires_verification
                ) {

                    window.location.href =
                        "login.html?verified=pending";

                    return;
                }


                window.location.href =
                    "index.html";

            },
            1200
        );


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        showRegisterMessage(
            error?.message ||
            "Registration failed. Please try again.",
            "error"
        );


        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                originalText;
        }
    }
}


/* =========================================================
   PASSWORD TOGGLES
========================================================= */

function setupPasswordToggles() {

    const buttons =
        document.querySelectorAll(
            ".register-password-toggle"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const wrapper =
                        button.closest(
                            ".register-password-wrapper"
                        );


                    if (!wrapper) {
                        return;
                    }


                    const input =
                        wrapper.querySelector(
                            "input"
                        );


                    if (!input) {
                        return;
                    }


                    if (
                        input.type ===
                        "password"
                    ) {

                        input.type =
                            "text";

                        button.textContent =
                            "Hide";

                        button.setAttribute(
                            "aria-label",
                            "Hide password"
                        );

                    } else {

                        input.type =
                            "password";

                        button.textContent =
                            "Show";

                        button.setAttribute(
                            "aria-label",
                            "Show password"
                        );
                    }

                }
            );

        }
    );
}


/* =========================================================
   GET FORM VALUE
========================================================= */

function getValue(
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
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


/* =========================================================
   NIGERIAN PHONE VALIDATION
========================================================= */

function isValidNigerianPhone(phone) {

    const cleaned =
        String(phone)
            .replace(
                /[\s\-()]/g,
                ""
            );


    return /^(\+234|0)\d{10}$/
        .test(cleaned);
}


/* =========================================================
   REGISTER MESSAGE
========================================================= */

function showRegisterMessage(
    message,
    type = "info"
) {

    let messageBox =
        document.getElementById(
            "registerMessage"
        );


    if (!messageBox) {

        messageBox =
            document.createElement(
                "div"
            );

        messageBox.id =
            "registerMessage";


        messageBox.className =
            "register-message";


        const card =
            document.querySelector(
                ".register-card"
            );


        if (card) {

            const header =
                card.querySelector(
                    ".register-card-header"
                );


            if (header) {

                header.after(
                    messageBox
                );

            } else {

                card.prepend(
                    messageBox
                );
            }

        } else {

            document.body.prepend(
                messageBox
            );
        }
    }


    messageBox.textContent =
        message;


    messageBox.className =
        `register-message ${type}`;


    messageBox.style.display =
        "block";
}


/* =========================================================
   CLEAR MESSAGE
========================================================= */

function clearRegisterMessage() {

    const messageBox =
        document.getElementById(
            "registerMessage"
        );


    if (messageBox) {

        messageBox.textContent =
            "";

        messageBox.className =
            "register-message";

        messageBox.style.display =
            "none";
    }
}


/* =========================================================
   GLOBAL
========================================================= */

window.CartRegister = {

    init:
        initRegister,

    submit:
        handleRegisterSubmit

};