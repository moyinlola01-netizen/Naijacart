/* =========================================================
   SHIPPING & RETURNS — PAGE JAVASCRIPT
   Cart project
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initCounts();
    initSearch();
    initNewsletter();
    initSmoothScroll();
    initActiveSection();
});


/* =========================================================
   STORAGE
========================================================= */

const CART_KEY = "nc_cart";
const WISHLIST_KEY = "nc_wishlist";


function getStorage(key) {
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
    const cart = getStorage(CART_KEY);
    const wishlist = getStorage(WISHLIST_KEY);

    const cartCount = document.getElementById("cartCount");
    const wishlistCount = document.getElementById("wishlistCount");

    if (cartCount) {
        let totalItems = 0;

        cart.forEach(item => {
            const quantity = Number(item.quantity) || 1;
            totalItems += quantity;
        });

        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? "flex" : "none";
    }

    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.style.display =
            wishlist.length > 0 ? "flex" : "none";
    }
}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

function initSearch() {
    const form = document.getElementById("globalSearchForm");
    const input = document.getElementById("globalSearch");

    if (!form || !input) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const search = input.value.trim();

        if (!search) {
            input.focus();
            return;
        }

        window.location.href =
            `shop.html?search=${encodeURIComponent(search)}`;
    });
}


/* =========================================================
   NEWSLETTER
========================================================= */

function initNewsletter() {
    const form = document.getElementById("newsletterForm");
    const emailInput = document.getElementById("newsletterEmail");

    if (!form || !emailInput) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            showToast("Please enter your email address.");
            emailInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showToast("Please enter a valid email address.");
            emailInput.focus();
            return;
        }

        const subscribers =
            getNewsletterSubscribers();

        if (!subscribers.includes(email.toLowerCase())) {
            subscribers.push(email.toLowerCase());

            localStorage.setItem(
                "nc_newsletter",
                JSON.stringify(subscribers)
            );
        }

        emailInput.value = "";

        showToast(
            "You're subscribed! Welcome to the CART family 💚"
        );
    });
}


function getNewsletterSubscribers() {
    try {
        const data =
            JSON.parse(localStorage.getItem("nc_newsletter"));

        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}


function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {
    const toast = document.getElementById("shippingToast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.shippingToastTimer);

    window.shippingToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}


/* =========================================================
   SMOOTH SCROLL
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

            if (!target) return;

            event.preventDefault();

            const header =
                document.querySelector(".site-header");

            const headerHeight =
                header ? header.offsetHeight : 0;

            const top =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                headerHeight -
                20;

            window.scrollTo({
                top,
                behavior: "smooth"
            });
        });
    });
}


/* =========================================================
   ACTIVE SIDEBAR SECTION
========================================================= */

function initActiveSection() {
    const sections =
        document.querySelectorAll(
            ".shipping-content section[id]"
        );

    const sidebarLinks =
        document.querySelectorAll(
            '.shipping-sidebar a[href^="#"]'
        );

    if (!sections.length || !sidebarLinks.length) {
        return;
    }

    const linkMap = {};

    sidebarLinks.forEach(link => {
        const id =
            link.getAttribute("href");

        if (id) {
            linkMap[id] = link;
        }

        link.addEventListener("click", () => {
            sidebarLinks.forEach(item =>
                item.classList.remove("active")
            );

            link.classList.add("active");
        });
    });

    const observer =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id =
                        `#${entry.target.id}`;

                    sidebarLinks.forEach(link =>
                        link.classList.remove("active")
                    );

                    if (linkMap[id]) {
                        linkMap[id].classList.add("active");
                    }
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px",
                threshold: 0
            }
        );

    sections.forEach(section =>
        observer.observe(section)
    );
}


/* =========================================================
   FAQ
========================================================= */

function initFAQ() {
    const faqItems =
        document.querySelectorAll(
            ".faq-list details"
        );

    faqItems.forEach(item => {
        item.addEventListener("toggle", () => {
            if (!item.open) return;

            faqItems.forEach(other => {
                if (other !== item) {
                    other.removeAttribute("open");
                }
            });
        });
    });
}


/* =========================================================
   SCROLL REVEAL
========================================================= */

function initRevealAnimation() {
    const elements =
        document.querySelectorAll(
            ".shipping-card, .service-card, .location-card, " +
            ".process-card, .return-item, .refund-box, " +
            ".issue-card"
        );

    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
        elements.forEach(element => {
            element.classList.add("visible");
        });

        return;
    }

    elements.forEach(element => {
        element.classList.add("reveal-item");
    });

    const observer =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.08
            }
        );

    elements.forEach(element =>
        observer.observe(element)
    );
}


/* =========================================================
   BACK TO TOP
========================================================= */

function createBackToTop() {
    const button =
        document.createElement("button");

    button.type = "button";
    button.className = "back-to-top";
    button.setAttribute(
        "aria-label",
        "Back to top"
    );

    button.innerHTML = "↑";

    document.body.appendChild(button);

    window.addEventListener(
        "scroll",
        () => {
            if (window.scrollY > 500) {
                button.classList.add("show");
            } else {
                button.classList.remove("show");
            }
        },
        { passive: true }
    );

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* =========================================================
   INITIALIZE OPTIONAL FEATURES
========================================================= */

initFAQ();
initRevealAnimation();
createBackToTop();