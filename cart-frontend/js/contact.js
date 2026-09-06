// ============================================================
// CART E-COMMERCE — CONTACT PAGE
// Frontend ↔ Flask API
// ============================================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const contactForm =
        document.getElementById("contactForm");

    const contactMessage =
        document.getElementById("contactMessage");

    const contactSubmit =
        document.getElementById("contactSubmit");


    // ============================================================
    // SHOW MESSAGE
    // ============================================================

    function showMessage(message, type = "error") {

        if (!contactMessage) return;

        contactMessage.textContent = message;

        contactMessage.className =
            `form-message ${type}`;

        contactMessage.style.display = "block";

    }


    // ============================================================
    // CLEAR MESSAGE
    // ============================================================

    function clearMessage() {

        if (!contactMessage) return;

        contactMessage.textContent = "";

        contactMessage.className =
            "form-message";

        contactMessage.style.display = "none";

    }


    // ============================================================
    // EMAIL VALIDATION
    // ============================================================

    function validEmail(email) {

        const pattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return pattern.test(email);

    }


    // ============================================================
    // SAFE ELEMENT VALUE
    // ============================================================

    function getValue(id) {

        const element =
            document.getElementById(id);

        return element
            ? element.value.trim()
            : "";

    }


    // ============================================================
    // LOCAL BACKUP
    // ============================================================

    function saveLocalCopy(contactData) {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(
                        "cart_contact_messages"
                    )
                ) || [];


            saved.push(contactData);


            localStorage.setItem(
                "cart_contact_messages",
                JSON.stringify(saved)
            );


            return true;

        } catch (error) {

            console.error(
                "Unable to save local contact copy:",
                error
            );

            return false;

        }

    }


    // ============================================================
    // CONTACT FORM
    // ============================================================

    if (!contactForm) {
        return;
    }


    contactForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearMessage();


            // ====================================================
            // GET FORM VALUES
            // ====================================================

            const name =
                getValue("contactName");

            const email =
                getValue("contactEmail");

            const subjectElement =
                document.getElementById(
                    "contactSubject"
                );

            const subject =
                subjectElement
                    ? subjectElement.value.trim()
                    : "";

            const orderNumber =
                getValue("contactOrder");

            const message =
                getValue("contactText");


            // ====================================================
            // VALIDATION
            // ====================================================

            if (name.length < 2) {

                showMessage(
                    "Please enter your full name."
                );

                return;

            }


            if (!validEmail(email)) {

                showMessage(
                    "Please enter a valid email address."
                );

                return;

            }


            if (!subject) {

                showMessage(
                    "Please select a subject."
                );

                return;

            }


            if (message.length < 10) {

                showMessage(
                    "Please enter a message with at least 10 characters."
                );

                return;

            }


            // ====================================================
            // LOADING STATE
            // ====================================================

            const originalText =
                contactSubmit
                    ? contactSubmit.textContent
                    : "Send Message";


            if (contactSubmit) {

                contactSubmit.disabled = true;

                contactSubmit.textContent =
                    "Sending...";

            }


            // ====================================================
            // CONTACT DATA
            // ====================================================

            const contactData = {

                name: name,

                email: email,

                subject: subject,

                order_number:
                    orderNumber,

                message: message

            };


            try {

                let backendSuccess = false;


                // ==================================================
                // SEND TO BACKEND
                // ==================================================

                if (
                    window.CartAPI &&
                    typeof window.CartAPI.apiRequest ===
                    "function"
                ) {

                    try {

                        await window.CartAPI.apiRequest(
                            "/contact",
                            {
                                method: "POST",
                                body:
                                    JSON.stringify(
                                        contactData
                                    )
                            }
                        );


                        backendSuccess = true;

                    } catch (apiError) {

                        console.warn(
                            "Contact API unavailable:",
                            apiError
                        );

                    }

                }


                // ==================================================
                // LOCAL BACKUP
                // ==================================================

                saveLocalCopy({

                    ...contactData,

                    id: Date.now(),

                    created_at:
                        new Date().toISOString(),

                    status:
                        backendSuccess
                            ? "submitted"
                            : "pending"

                });


                // ==================================================
                // SUCCESS
                // ==================================================

                if (backendSuccess) {

                    showMessage(
                        "Your message has been sent successfully! Our support team will get back to you soon.",
                        "success"
                    );

                } else {

                    showMessage(
                        "Your message has been saved. Our support system is currently unavailable, but your message was kept on this device.",
                        "success"
                    );

                }


                contactForm.reset();


            } catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );


                showMessage(
                    "Something went wrong. Please try again."
                );


            } finally {

                if (contactSubmit) {

                    contactSubmit.disabled = false;

                    contactSubmit.textContent =
                        originalText;

                }

            }

        }
    );

});