/* =========================================================
   CART FAQ JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   STORAGE
========================================================= */

const CART_KEY = "nc_cart";
const WISHLIST_KEY = "nc_wishlist";
const NEWSLETTER_KEY = "nc_newsletter";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initHeaderSearch();

    initFAQSearch();

    initFAQCategories();

    initFAQAnswers();

    initClearSearch();

    initNewsletter();

    updateCounts();

});


/* =========================================================
   HEADER SEARCH
========================================================= */

function initHeaderSearch() {

    const form =
        document.getElementById("faqHeaderSearch");

    const input =
        document.getElementById("faqHeaderSearchInput");

    if (!form || !input) {
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const value =
            input.value.trim();

        const faqSearch =
            document.getElementById("faqSearch");

        if (!faqSearch) {
            return;
        }

        faqSearch.value = value;

        faqSearch.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );


        document.querySelector(".faq-main")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    });

}


/* =========================================================
   FAQ SEARCH
========================================================= */

function initFAQSearch() {

    const search =
        document.getElementById("faqSearch");

    if (!search) {
        return;
    }

    search.addEventListener("input", function () {

        const value =
            search.value
                .trim()
                .toLowerCase();

        filterFAQs();

    });

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function initFAQCategories() {

    const buttons =
        document.querySelectorAll(".faq-category");

    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            buttons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            filterFAQs();

        });

    });

}


/* =========================================================
   FILTER FAQS
========================================================= */

function filterFAQs() {

    const search =
        document.getElementById("faqSearch");

    const searchValue =
        search
            ? search.value.trim().toLowerCase()
            : "";


    const activeButton =
        document.querySelector(
            ".faq-category.active"
        );


    const selectedCategory =
        activeButton
            ? activeButton.dataset.category
            : "all";


    const cards =
        document.querySelectorAll(".faq-card");


    let visibleCount = 0;


    cards.forEach(function (card) {

        const category =
            card.dataset.category || "";

        const question =
            card.querySelector("h3")
                ?.textContent
                .toLowerCase() || "";

        const answer =
            card.querySelector(".faq-answer")
                ?.textContent
                .toLowerCase() || "";


        const matchesSearch =
            !searchValue ||
            question.includes(searchValue) ||
            answer.includes(searchValue);


        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;


        if (
            matchesSearch &&
            matchesCategory
        ) {

            card.style.display = "flex";

            visibleCount++;

        } else {

            card.style.display = "none";

            card.classList.remove("open");

        }

    });


    updateFAQGroups();

    updateResultCount(
        visibleCount,
        searchValue,
        selectedCategory
    );


    const empty =
        document.getElementById("faqEmpty");

    if (empty) {

        if (visibleCount === 0) {
            empty.classList.add("show");
        } else {
            empty.classList.remove("show");
        }

    }

}


/* =========================================================
   UPDATE GROUP VISIBILITY
========================================================= */

function updateFAQGroups() {

    const groups =
        document.querySelectorAll(".faq-group");


    groups.forEach(function (group) {

        const visibleCards =
            group.querySelectorAll(
                ".faq-card[style*='display: flex']"
            );


        let hasVisible = false;


        group.querySelectorAll(".faq-card")
            .forEach(function (card) {

                if (
                    card.style.display !== "none"
                ) {
                    hasVisible = true;
                }

            });


        group.style.display =
            hasVisible ? "" : "none";

    });

}


/* =========================================================
   RESULT COUNT
========================================================= */

function updateResultCount(
    count,
    searchValue,
    category
) {

    const result =
        document.getElementById(
            "faqResultCount"
        );

    if (!result) {
        return;
    }


    if (count === 0) {

        result.textContent =
            "No questions found";

        return;

    }


    if (searchValue) {

        result.textContent =
            `${count} question${count === 1 ? "" : "s"} found`;

        return;

    }


    if (category !== "all") {

        result.textContent =
            `${count} question${count === 1 ? "" : "s"} in this category`;

        return;

    }


    result.textContent =
        `Showing all ${count} questions`;

}


/* =========================================================
   ANSWER TOGGLE
========================================================= */

function initFAQAnswers() {

    const buttons =
        document.querySelectorAll(
            ".faq-view-answer"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const card =
                    button.closest(".faq-card");

                if (!card) {
                    return;
                }


                const isOpen =
                    card.classList.contains("open");


                /* Close other cards in the same group */

                const group =
                    card.closest(".faq-group");

                if (group) {

                    group.querySelectorAll(
                        ".faq-card.open"
                    ).forEach(function (openCard) {

                        if (openCard !== card) {

                            openCard.classList.remove(
                                "open"
                            );

                            const openButton =
                                openCard.querySelector(
                                    ".faq-view-answer"
                                );

                            if (openButton) {

                                const text =
                                    openButton.querySelector(
                                        "span"
                                    );

                                if (text) {
                                    text.textContent =
                                        "View answer";
                                }

                            }

                        }

                    });

                }


                if (isOpen) {

                    card.classList.remove("open");

                    const text =
                        button.querySelector("span");

                    if (text) {
                        text.textContent =
                            "View answer";
                    }

                } else {

                    card.classList.add("open");

                    const text =
                        button.querySelector("span");

                    if (text) {
                        text.textContent =
                            "Hide answer";
                    }

                }

            }
        );

    });

}


/* =========================================================
   CLEAR SEARCH
========================================================= */

function initClearSearch() {

    const button =
        document.getElementById(
            "faqClearSearch"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            const search =
                document.getElementById(
                    "faqSearch"
                );


            if (search) {
                search.value = "";
            }


            document.querySelectorAll(
                ".faq-category"
            ).forEach(function (item) {

                item.classList.remove("active");

            });


            const all =
                document.querySelector(
                    '.faq-category[data-category="all"]'
                );


            if (all) {
                all.classList.add("active");
            }


            filterFAQs();


            document.querySelector(
                ".faq-main"
            )?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}


/* =========================================================
   NEWSLETTER
========================================================= */

function initNewsletter() {

    const form =
        document.getElementById(
            "faqNewsletterForm"
        );


    const input =
        document.getElementById(
            "faqNewsletterEmail"
        );


    if (!form || !input) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                input.value
                    .trim()
                    .toLowerCase();


            if (!isValidEmail(email)) {

                showToast(
                    "Please enter a valid email address."
                );

                return;

            }


            let subscribers =
                getStorageArray(
                    NEWSLETTER_KEY
                );


            if (
                subscribers.includes(email)
            ) {

                showToast(
                    "This email is already subscribed."
                );

                return;

            }


            subscribers.push(email);


            localStorage.setItem(
                NEWSLETTER_KEY,
                JSON.stringify(subscribers)
            );


            input.value = "";


            showToast(
                "You're subscribed to CART updates!"
            );

        }
    );

}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   STORAGE HELPER
========================================================= */

function getStorageArray(key) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {
            return [];
        }


        const parsed =
            JSON.parse(value);


        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        return [];

    }

}


/* =========================================================
   HEADER COUNTS
========================================================= */

function updateCounts() {

    /*
       The special FAQ header does not use the
       normal cart/wishlist number counters.

       This function is kept so the page remains
       compatible with the rest of the CART system.
    */

    getStorageArray(CART_KEY);

    getStorageArray(WISHLIST_KEY);

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

    const toast =
        document.getElementById("faqToast");


    if (!toast) {
        return;
    }


    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(function () {

            toast.classList.remove("show");

        }, 3000);

}


/* =========================================================
   STORAGE UPDATES
========================================================= */

window.addEventListener(
    "storage",
    function () {

        updateCounts();

    }
);