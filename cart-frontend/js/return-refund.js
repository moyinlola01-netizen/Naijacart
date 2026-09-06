/* =========================================================
   CART — RETURNS & REFUNDS
========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", () => {

    initCounts();
    initSearch();
    initNewsletter();
    initSmoothScroll();
    initFAQ();

});


/* =========================================================
   STORAGE
========================================================= */

const CART_KEY = "nc_cart";
const WISHLIST_KEY = "nc_wishlist";
const NEWSLETTER_KEY = "nc_newsletter";


function getStorageArray(key) {

    try {

        const value = localStorage.getItem(key);

        if (!value) {
            return [];
        }

        const parsed = JSON.parse(value);

        return Array.isArray(parsed) ? parsed : [];

    } catch (error) {

        console.error(`Unable to read ${key}:`, error);

        return [];

    }

}


/* =========================================================
   HEADER COUNTS
========================================================= */

function initCounts() {

    updateCounts();

    window.addEventListener("storage", updateCounts);

    document.addEventListener("visibilitychange", () => {

        if (!document.hidden) {
            updateCounts();
        }

    });

}


function updateCounts() {

    const cartCount = document.getElementById("cartCount");
    const wishlistCount = document.getElementById("wishlistCount");

    const cart = getStorageArray(CART_KEY);
    const wishlist = getStorageArray(WISHLIST_KEY);


    let totalCartItems = 0;

    cart.forEach(item => {

        const quantity = Number(item.quantity) || 1;

        totalCartItems += quantity;

    });


    if (cartCount) {

        cartCount.textContent = totalCartItems;

        cartCount.style.display =
            totalCartItems > 0 ? "flex" : "none";

    }


    if (wishlistCount) {

        wishlistCount.textContent = wishlist.length;

        wishlistCount.style.display =
            wishlist.length > 0 ? "flex" : "none";

    }

}


/* =========================================================
   SEARCH
========================================================= */

function initSearch() {

    const form = document.getElementById("globalSearchForm");
    const input = document.getElementById("globalSearch");

    if (!form || !input) {
        return;
    }


    form.addEventListener("submit", event => {

        event.preventDefault();

        const query = input.value.trim();

        if (!query) {
            return;
        }

        window.location.href =
            `shop.html?search=${encodeURIComponent(query)}`;

    });

}


/* =========================================================
   NEWSLETTER
========================================================= */

function initNewsletter() {

    const form = document.getElementById("newsletterForm");
    const emailInput = document.getElementById("newsletterEmail");

    if (!form || !emailInput) {
        return;
    }


    form.addEventListener("submit", event => {

        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();

        if (!isValidEmail(email)) {

            showToast("Please enter a valid email address.");

            return;

        }


        let subscribers =
            getStorageArray(NEWSLETTER_KEY);


        if (subscribers.includes(email)) {

            showToast("You're already subscribed.");

            return;

        }


        subscribers.push(email);

        localStorage.setItem(
            NEWSLETTER_KEY,
            JSON.stringify(subscribers)
        );


        emailInput.value = "";

        showToast(
            "You're subscribed! Welcome to the CART community."
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
   SMOOTH SCROLL
========================================================= */

function initSmoothScroll() {

    document.querySelectorAll('a[href^="#"]').forEach(link => {

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
                header ? header.offsetHeight : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                15;


            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });

}


/* =========================================================
   FAQ
========================================================= */

function initFAQ() {

    const faqItems =
        document.querySelectorAll(".faq-list details");

    faqItems.forEach(item => {

        item.addEventListener("toggle", () => {

            if (!item.open) {
                return;
            }

            faqItems.forEach(otherItem => {

                if (
                    otherItem !== item &&
                    otherItem.open
                ) {
                    otherItem.removeAttribute("open");
                }

            });

        });

    });

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

    const toast =
        document.getElementById("returnsToast");

    if (!toast) {
        return;
    }


    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}