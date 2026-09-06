/* =========================================================
   CART — PROFILE PAGE
   profile.js
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", initProfile);


/* =========================================================
   INITIALIZE
========================================================= */

async function initProfile() {

    if (!window.CartAPI) {
        console.error("CartAPI is not available.");
        return;
    }

    if (!CartAPI.isLoggedIn()) {
        window.location.href =
            "login.html?redirect=profile.html";
        return;
    }

    setupProfileEvents();

    await loadProfile();
    updateProfileCartCount();
}


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile() {

    try {

        const result =
            await CartAPI.getCurrentUser();

        const user =
            result?.user ||
            result?.data?.user ||
            result?.data ||
            result;

        if (!user) {
            throw new Error("User information not found.");
        }

        CartAPI.saveUser(user);

        renderProfile(user);

        await loadProfileStats();

    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

        const storedUser =
            CartAPI.getUser();

        if (storedUser) {
            renderProfile(storedUser);
        } else {
            showProfileMessage(
                "Unable to load your profile.",
                "error"
            );
        }
    }
}


/* =========================================================
   RENDER PROFILE
========================================================= */

function renderProfile(user) {

    const name =
        user.name ||
        user.full_name ||
        user.username ||
        "User";

    const email =
        user.email ||
        "";

    const phone =
        user.phone ||
        "";

    const role =
        user.role ||
        "customer";

    const verified =
        user.is_verified ||
        user.verified ||
        false;


    setText(
        [
            "#profileName",
            "#userName",
            "[data-profile-name]",
            "[data-user-name]"
        ],
        name
    );


    setText(
        [
            "#profileEmail",
            "#userEmail",
            "[data-profile-email]",
            "[data-user-email]"
        ],
        email
    );


    setText(
        [
            "#profilePhone",
            "#userPhone",
            "[data-profile-phone]"
        ],
        phone || "Not added"
    );


    setText(
        [
            "#profileRole",
            "#userRole",
            "[data-profile-role]"
        ],
        role === "admin"
            ? "Administrator"
            : "Customer"
    );


    setText(
        [
            "#profileVerified",
            "[data-profile-verified]"
        ],
        verified
            ? "Verified"
            : "Not verified"
    );


    setText(
        [
            "#memberSince",
            "#profileMemberSince",
            "[data-member-since]"
        ],
        formatDate(
            user.created_at ||
            user.joined_at ||
            user.createdAt
        )
    );


    /*
     * Avatar initials
     */

    const initials =
        getInitials(name);


    document
        .querySelectorAll(
            "#profileAvatar, #userAvatar, [data-profile-avatar]"
        )
        .forEach(element => {

            if (
                element.tagName === "IMG"
            ) {

                if (user.avatar) {

                    element.src =
                        user.avatar;

                    element.alt =
                        name;

                } else {

                    element.style.display =
                        "none";
                }

            } else {

                element.textContent =
                    initials;
            }
        });


    /*
     * Show admin link only to admin.
     */

    document
        .querySelectorAll(
            "[data-admin], .admin-link"
        )
        .forEach(element => {

            if (
                role === "admin"
            ) {

                element.style.display =
                    "";

            } else {

                element.style.display =
                    "none";
            }
        });
}


/* =========================================================
   PROFILE STATISTICS
========================================================= */

async function loadProfileStats() {

    try {

        const result =
            await CartAPI.getOrders();

        const orders =
            Array.isArray(result)
                ? result
                : (
                    result?.orders ||
                    result?.data?.orders ||
                    result?.data ||
                    []
                );


        const orderCount =
            Array.isArray(orders)
                ? orders.length
                : 0;


        setText(
            [
                "#orderCount",
                "#ordersCount",
                "[data-order-count]"
            ],
            orderCount
        );


        /*
         * Cart count
         */

        try {

            const cart =
                await CartAPI.getCart();

            const items =
                cart?.items ||
                cart?.data?.items ||
                (
                    Array.isArray(cart)
                        ? cart
                        : []
                );


            const cartCount =
                Array.isArray(items)
                    ? items.reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            Number(
                                item.quantity ||
                                1
                            ),
                        0
                    )
                    : 0;


            setText(
                [
                    "#cartCount",
                    "#cartItemsCount",
                    "[data-cart-count]"
                ],
                cartCount
            );

        } catch (error) {

            updateProfileCartCount();
        }


        /*
         * Wishlist
         */

        try {

            const wishlist =
                await CartAPI.getWishlist();

            const items =
                wishlist?.items ||
                wishlist?.data?.items ||
                (
                    Array.isArray(wishlist)
                        ? wishlist
                        : []
                );


            setText(
                [
                    "#wishlistCount",
                    "#wishCount",
                    "[data-wishlist-count]"
                ],
                Array.isArray(items)
                    ? items.length
                    : 0
            );

        } catch (error) {

            const localWishlist =
                getLocalWishlist();

            setText(
                [
                    "#wishlistCount",
                    "#wishCount",
                    "[data-wishlist-count]"
                ],
                localWishlist.length
            );
        }
    } catch (error) {

        console.error(
            "Profile statistics error:",
            error
        );
    }
}


/* =========================================================
   PROFILE EVENTS
========================================================= */

function setupProfileEvents() {

    /*
     * Logout
     */

    document
        .querySelectorAll(
            "#logoutBtn, [data-logout], .logout-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                handleLogout
            );
        });


    /*
     * Admin dashboard
     */

    document
        .querySelectorAll(
            "#adminBtn, [data-admin-link]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const user =
                        CartAPI.getUser();

                    if (
                        user?.role ===
                        "admin"
                    ) {

                        window.location.href =
                            "admin.html";

                    } else {

                        showProfileMessage(
                            "You do not have administrator access.",
                            "error"
                        );
                    }
                }
            );
        });


    /*
     * Orders
     */

    document
        .querySelectorAll(
            "#ordersBtn, [data-orders-link]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {
                    window.location.href =
                        "orders.html";
                }
            );
        });


    /*
     * Addresses
     */

    document
        .querySelectorAll(
            "#addressesBtn, [data-addresses-link]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {
                    window.location.href =
                        "addresses.html";
                }
            );
        });


    /*
     * Wishlist
     */

    document
        .querySelectorAll(
            "#wishlistBtn, [data-wishlist-link]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {
                    window.location.href =
                        "wishlist.html";
                }
            );
        });


    /*
     * Account page
     */

    document
        .querySelectorAll(
            "#accountBtn, [data-account-link]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {
                    window.location.href =
                        "account.html";
                }
            );
        });
}


/* =========================================================
   LOGOUT
========================================================= */

async function handleLogout(event) {

    if (event) {
        event.preventDefault();
    }


    try {

        await CartAPI.logoutUser();

    } catch (error) {

        console.warn(
            "Logout request failed:",
            error
        );

    } finally {

        CartAPI.clearAuth();

        window.location.href =
            "login.html";
    }
}


/* =========================================================
   CART COUNT
========================================================= */

async function updateProfileCartCount() {

    try {

        const result =
            await CartAPI.getCart();

        const items =
            result?.items ||
            result?.data?.items ||
            (
                Array.isArray(result)
                    ? result
                    : []
            );


        const count =
            Array.isArray(items)
                ? items.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        Number(
                            item.quantity ||
                            1
                        ),
                    0
                )
                : 0;


        document
            .querySelectorAll(
                "#cartCount, #cart-count, .cart-count, [data-cart-count]"
            )
            .forEach(element => {

                element.textContent =
                    count > 99
                        ? "99+"
                        : count;
            });

    } catch (error) {

        const localCart =
            getLocalCart();

        const count =
            localCart.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item.quantity ||
                        1
                    ),
                0
            );


        document
            .querySelectorAll(
                "#cartCount, #cart-count, .cart-count, [data-cart-count]"
            )
            .forEach(element => {

                element.textContent =
                    count > 99
                        ? "99+"
                        : count;
            });
    }
}


/* =========================================================
   LOCAL CART
========================================================= */

function getLocalCart() {

    try {

        const cart =
            JSON.parse(
                localStorage.getItem(
                    "nc_cart"
                ) || "[]"
            );

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        return [];
    }
}


/* =========================================================
   LOCAL WISHLIST
========================================================= */

function getLocalWishlist() {

    const keys = [
        "nc_wishlist",
        "wishlist",
        "cart_wishlist"
    ];


    for (const key of keys) {

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(
                        key
                    ) || "[]"
                );


            if (
                Array.isArray(data)
            ) {

                return data;
            }

        } catch (error) {
            continue;
        }
    }


    return [];
}


/* =========================================================
   HELPERS
========================================================= */

function setText(
    selectors,
    value
) {

    const selector =
        selectors.join(", ");


    document
        .querySelectorAll(
            selector
        )
        .forEach(element => {

            element.textContent =
                value ?? "";
        });
}


function getInitials(name) {

    return String(name)
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(
            word =>
                word
                    .charAt(0)
                    .toUpperCase()
        )
        .join("") || "U";
}


function formatDate(dateValue) {

    if (!dateValue) {
        return "—";
    }


    const date =
        new Date(
            dateValue
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";
    }


    return date.toLocaleDateString(
        "en-NG",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}


function showProfileMessage(
    message,
    type = "info"
) {

    let box =
        document.querySelector(
            "#profileMessage, .profile-message"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "profileMessage";

        document.body.prepend(
            box
        );
    }


    box.textContent =
        message;

    box.className =
        `profile-message ${type}`;


    setTimeout(
        () => {

            if (box) {
                box.textContent =
                    "";
            }

        },
        4000
    );
}


/* =========================================================
   GLOBAL
========================================================= */

window.CartProfile = {
    init: initProfile,
    loadProfile,
    renderProfile,
    handleLogout
};