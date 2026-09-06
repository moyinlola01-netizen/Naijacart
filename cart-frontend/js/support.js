/* =========================================================
   CART — SUPPORT PAGE JAVASCRIPT
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initCounts();
    initSearch();
    initSupportForm();
    initNewsletter();
    initSmoothScroll();
});


/* =========================================================
   STORAGE KEYS
========================================================= */

const CART_KEY = "nc_cart";
const WISHLIST_KEY = "nc_wishlist";
const NEWSLETTER_KEY = "nc_newsletter";
const SUPPORT_MESSAGES_KEY = "nc_support_messages";


/* =========================================================
   SAFE STORAGE
========================================================= */

function getStorageArray(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key));

        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}


/* =========================================================
   CART + WISHLIST COUNTS
========================================================= */

function initCounts() {
    const cart = getStorageArray(CART_KEY);
    const wishlist = getStorageArray(WISHLIST_KEY);

    const cartCount =
        document.getElementById("cartCount");

    const wishlistCount =
        document.getElementById("wishlistCount");


    /* -------------------------
       CART
    ------------------------- */

    if (cartCount) {
        let total = 0;

        cart.forEach(item => {
            const quantity =
                Number(item.quantity) || 1;

            total += quantity;
        });

        cartCount.textContent = total;

        cartCount.style.display =
            total > 0 ? "flex" : "none";
    }


    /* -------------------------
       WISHLIST
    ------------------------- */

    if (wishlistCount) {
        const total = wishlist.length;

        wishlistCount.textContent = total;

        wishlistCount.style.display =
            total > 0 ? "flex" : "none";
    }
}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

function initSearch() {
    const form =
        document.getElementById("globalSearchForm");

    const input =
        document.getElementById("globalSearch");


    if (!form || !input) {
        return;
    }


    form.addEventListener("submit", event => {

        event.preventDefault();

        const search =
            input.value.trim();


        if (!search) {
            input.focus();
            return;
        }


        window.location.href =
            `shop.html?search=${encodeURIComponent(search)}`;
    });
}


/* =========================================================
   SUPPORT FORM
========================================================= */

function initSupportForm() {

    const form =
        document.getElementById("supportForm");


    if (!form) {
        return;
    }


    form.addEventListener("submit", event => {

        event.preventDefault();


        const fullName =
            document.getElementById("fullName")?.value.trim() || "";

        const email =
            document.getElementById("email")?.value.trim() || "";

        const orderNumber =
            document.getElementById("orderNumber")?.value.trim() || "";

        const issue =
            document.getElementById("issue")?.value || "";

        const message =
            document.getElementById("message")?.value.trim() || "";


        /* -------------------------
           VALIDATION
        ------------------------- */

        if (!fullName) {
            showToast("Please enter your full name.");
            document.getElementById("fullName")?.focus();
            return;
        }


        if (!email) {
            showToast("Please enter your email address.");
            document.getElementById("email")?.focus();
            return;
        }


        if (!isValidEmail(email)) {
            showToast("Please enter a valid email address.");
            document.getElementById("email")?.focus();
            return;
        }


        if (!issue) {
            showToast("Please select an issue.");
            document.getElementById("issue")?.focus();
            return;
        }


        if (!message) {
            showToast("Please tell us how we can help.");
            document.getElementById("message")?.focus();
            return;
        }


        if (message.length < 10) {
            showToast(
                "Please provide a little more detail."
            );

            document.getElementById("message")?.focus();

            return;
        }


        /* -------------------------
           SAVE SUPPORT MESSAGE
        ------------------------- */

        const supportMessages =
            getStorageArray(SUPPORT_MESSAGES_KEY);


        const supportRequest = {

            id:
                `SUP-${Date.now()}`,

            fullName,

            email,

            orderNumber,

            issue,

            message,

            status: "Pending",

            createdAt:
                new Date().toISOString()
        };


        supportMessages.push(supportRequest);


        localStorage.setItem(
            SUPPORT_MESSAGES_KEY,
            JSON.stringify(supportMessages)
        );


        /* -------------------------
           RESET FORM
        ------------------------- */

        form.reset();


        /* -------------------------
           SUCCESS MESSAGE
        ------------------------- */

        showToast(
            "Message sent successfully. We'll get back to you soon 💚"
        );
    });
}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


/* =========================================================
   NEWSLETTER
========================================================= */

function initNewsletter() {

    const form =
        document.getElementById("newsletterForm");

    const input =
        document.getElementById("newsletterEmail");


    if (!form || !input) {
        return;
    }


    form.addEventListener("submit", event => {

        event.preventDefault();


        const email =
            input.value.trim();


        if (!email) {
            showToast(
                "Please enter your email address."
            );

            input.focus();

            return;
        }


        if (!isValidEmail(email)) {
            showToast(
                "Please enter a valid email address."
            );

            input.focus();

            return;
        }


        const subscribers =
            getStorageArray(NEWSLETTER_KEY);


        const normalizedEmail =
            email.toLowerCase();


        if (!subscribers.includes(normalizedEmail)) {

            subscribers.push(normalizedEmail);

            localStorage.setItem(
                NEWSLETTER_KEY,
                JSON.stringify(subscribers)
            );

            showToast(
                "You're subscribed! Welcome to CART 💚"
            );

        } else {

            showToast(
                "You're already subscribed to CART."
            );

        }


        input.value = "";
    });
}


/* =========================================================
   SMOOTH ANCHOR SCROLL
========================================================= */

function initSmoothScroll() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");


            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(targetId);


            if (!target) {
                return;
            }


            event.preventDefault();


            const header =
                document.querySelector(".site-header");


            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;


            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                20;


            window.scrollTo({

                top: targetPosition,

                behavior: "smooth"

            });

        });

    });
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        document.getElementById("supportToast");


    if (!toast) {
        alert(message);
        return;
    }


    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(
        window.supportToastTimer
    );


    window.supportToastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3500);
}


/* =========================================================
   UPDATE COUNTS WHEN CART/WISHLIST CHANGES
========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key === CART_KEY ||
            event.key === WISHLIST_KEY
        ) {
            initCounts();
        }

    }
);


/* =========================================================
   PAGE VISIBILITY UPDATE
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (!document.hidden) {
            initCounts();
        }

    }
);