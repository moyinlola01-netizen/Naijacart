"use strict";

/* =========================================================
   CART — ACCOUNT PAGE
   Profile + Orders + Security + Shopping Snapshot
========================================================= */

const API_URL = "https://cart-backend-8xew.onrender.com";

const TOKEN_KEY = "nc_token";
const CART_KEY = "nc_cart";
const WISHLIST_KEY = "nc_wishlist";
const ORDERS_KEY = "nc_orders";
const PROFILE_KEY = "nc_profile";

let currentUser = null;
let orders = [];


/* =========================================================
   HELPERS
========================================================= */

function getToken() {
    return localStorage.getItem(TOKEN_KEY) || "";
}


function getJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        return JSON.parse(value);
    } catch (error) {
        console.error(`Could not read ${key}:`, error);
        return fallback;
    }
}


function saveJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Could not save ${key}:`, error);
    }
}


function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getInitial(name) {
    const text = String(name || "Shopper").trim();

    return text
        ? text.charAt(0).toUpperCase()
        : "S";
}


function showToast(message, type = "success") {
    const toast = document.getElementById("accountToast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;
    toast.classList.remove("show", "success", "error");

    toast.classList.add("show", type);

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}


/* =========================================================
   API HELPER
========================================================= */

async function apiRequest(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Something went wrong. Please try again."
        );
    }

    return data;
}


/* =========================================================
   UPDATE PAGE USER INFORMATION
========================================================= */

function updateUserDisplay(user) {
    if (!user) {
        return;
    }

    const name =
        user.full_name ||
        user.name ||
        "Shopper";

    const email =
        user.email ||
        "Sign in to view your account";

    const initial = getInitial(name);

    const heroUserName =
        document.getElementById("heroUserName");

    const memberName =
        document.getElementById("memberName");

    const memberEmail =
        document.getElementById("memberEmail");

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const memberAvatar =
        document.getElementById("memberAvatar");

    const profileAvatar =
        document.getElementById("profileAvatar");

    const profileMemberDate =
        document.getElementById("profileMemberDate");


    if (heroUserName) {
        heroUserName.textContent = name;
    }

    if (memberName) {
        memberName.textContent = name;
    }

    if (memberEmail) {
        memberEmail.textContent = email;
    }

    if (profileName) {
        profileName.textContent = name;
    }

    if (profileEmail) {
        profileEmail.textContent = email;
    }

    if (memberAvatar) {
        memberAvatar.textContent = initial;
    }

    if (profileAvatar) {
        profileAvatar.textContent = initial;
    }

    if (profileMemberDate) {
        if (user.created_at) {
            const date = new Date(user.created_at);

            if (!Number.isNaN(date.getTime())) {
                profileMemberDate.textContent =
                    `CART member since ${date.toLocaleDateString(
                        "en-NG",
                        {
                            month: "long",
                            year: "numeric"
                        }
                    )}`;
            } else {
                profileMemberDate.textContent =
                    "CART member";
            }
        } else {
            profileMemberDate.textContent =
                "CART member";
        }
    }
}


/* =========================================================
   LOAD ACCOUNT
========================================================= */

async function loadAccountData() {
    const token = getToken();

    const savedProfile =
        getJSON(PROFILE_KEY, null);

    if (savedProfile) {
        currentUser = savedProfile;
        updateUserDisplay(currentUser);
    }

    if (!token) {
        return;
    }

    try {
        const data =
            await apiRequest("/api/auth/me");

        if (data.success && data.data) {
            currentUser =
                data.data.user ||
                data.user ||
                currentUser;

            if (currentUser) {
                saveJSON(
                    PROFILE_KEY,
                    currentUser
                );

                updateUserDisplay(currentUser);
            }
        }

    } catch (error) {
        console.error(
            "Could not load account:",
            error
        );
    }
}


/* =========================================================
   EDIT PROFILE MODAL
========================================================= */

function setupProfileModal() {
    const modal =
        document.getElementById("profileModal");

    const editButton =
        document.getElementById("editProfileButton");

    const form =
        document.getElementById("profileForm");

    if (!modal || !editButton || !form) {
        console.error(
            "Profile modal elements not found."
        );

        return;
    }


    function openModal() {
        const nameInput =
            document.getElementById("editName");

        const emailInput =
            document.getElementById("editEmail");

        const phoneInput =
            document.getElementById("editPhone");

        if (nameInput) {
            nameInput.value =
                currentUser?.full_name ||
                currentUser?.name ||
                "";
        }

        if (emailInput) {
            emailInput.value =
                currentUser?.email ||
                "";
        }

        if (phoneInput) {
            phoneInput.value =
                currentUser?.phone ||
                "";
        }

        modal.classList.add("open");
        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );
    }


    function closeModal() {
        modal.classList.remove("open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );
    }


    editButton.addEventListener(
        "click",
        openModal
    );


    modal
        .querySelectorAll("[data-close-modal]")
        .forEach(element => {

            element.addEventListener(
                "click",
                closeModal
            );

        });


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const nameInput =
                document.getElementById("editName");

            const emailInput =
                document.getElementById("editEmail");

            const phoneInput =
                document.getElementById("editPhone");

            const submitButton =
                form.querySelector(
                    ".modal-submit"
                );


            const name =
                nameInput?.value.trim() || "";

            const email =
                emailInput?.value.trim().toLowerCase() ||
                "";

            const phone =
                phoneInput?.value.trim() || "";


            if (name.length < 2) {
                showToast(
                    "Please enter your full name.",
                    "error"
                );

                return;
            }


            if (
                !email ||
                !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
            ) {
                showToast(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent =
                    "Saving...";
            }


            try {

                const token = getToken();

                if (token) {

                    const data =
                        await apiRequest(
                            "/api/auth/profile",
                            {
                                method: "PUT",
                                body: JSON.stringify({
                                    name,
                                    email,
                                    phone
                                })
                            }
                        );


                    if (
                        data.success &&
                        data.data &&
                        data.data.user
                    ) {
                        currentUser =
                            data.data.user;
                    }

                } else {

                    currentUser = {
                        ...(currentUser || {}),
                        full_name: name,
                        email,
                        phone
                    };

                }


                if (!currentUser) {
                    currentUser = {
                        full_name: name,
                        email,
                        phone
                    };
                }


                currentUser.full_name =
                    currentUser.full_name ||
                    name;

                currentUser.email =
                    currentUser.email ||
                    email;

                currentUser.phone =
                    phone;


                saveJSON(
                    PROFILE_KEY,
                    currentUser
                );

                updateUserDisplay(
                    currentUser
                );

                closeModal();

                showToast(
                    "Profile updated successfully.",
                    "success"
                );


            } catch (error) {

                console.error(
                    "Profile update failed:",
                    error
                );

                showToast(
                    error.message ||
                    "Could not update your profile.",
                    "error"
                );

            } finally {

                if (submitButton) {
                    submitButton.disabled = false;

                    submitButton.innerHTML =
                        `Save Changes <span>→</span>`;
                }

            }

        }
    );
}


/* =========================================================
   SHOPPING COUNTS
========================================================= */

function updateShoppingSnapshot() {
    const cart =
        getJSON(CART_KEY, []);

    const wishlist =
        getJSON(WISHLIST_KEY, []);


    let cartCount = 0;

    if (Array.isArray(cart)) {
        cartCount = cart.reduce(
            (total, item) =>
                total +
                Number(
                    item.quantity || 1
                ),
            0
        );
    }


    let wishlistCount = 0;

    if (Array.isArray(wishlist)) {
        wishlistCount =
            wishlist.length;
    }


    const headerCartCount =
        document.getElementById(
            "headerCartCount"
        );

    const headerWishlistCount =
        document.getElementById(
            "headerWishlistCount"
        );

    const cartTotal =
        document.getElementById(
            "cartTotal"
        );

    const wishlistTotal =
        document.getElementById(
            "wishlistTotal"
        );


    if (headerCartCount) {
        headerCartCount.textContent =
            cartCount;
    }

    if (headerWishlistCount) {
        headerWishlistCount.textContent =
            wishlistCount;
    }

    if (cartTotal) {
        cartTotal.textContent =
            cartCount;
    }

    if (wishlistTotal) {
        wishlistTotal.textContent =
            wishlistCount;
    }
}


/* =========================================================
   LOAD ORDERS
========================================================= */

async function loadOrders() {
    const savedOrders =
        getJSON(ORDERS_KEY, []);

    if (Array.isArray(savedOrders)) {
        orders = savedOrders;
    }

    const token = getToken();

    if (!token) {
        renderOrders();
        return;
    }

    try {

        const data =
            await apiRequest("/api/orders");

        if (
            data.success &&
            Array.isArray(data.orders)
        ) {
            orders = data.orders;

            saveJSON(
                ORDERS_KEY,
                orders
            );
        }

    } catch (error) {

        console.error(
            "Could not load orders:",
            error
        );

    }

    renderOrders();
}


/* =========================================================
   ORDER STATISTICS
========================================================= */

function updateOrderStatistics() {
    const counts = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0
    };


    orders.forEach(order => {

        const status =
            String(
                order.status || "pending"
            ).toLowerCase();

        if (
            Object.prototype.hasOwnProperty
                .call(counts, status)
        ) {
            counts[status]++;
        }

    });


    const pending =
        document.getElementById(
            "pendingOrders"
        );

    const processing =
        document.getElementById(
            "processingOrders"
        );

    const shipped =
        document.getElementById(
            "shippedOrders"
        );

    const delivered =
        document.getElementById(
            "deliveredOrders"
        );


    if (pending) {
        pending.textContent =
            counts.pending;
    }

    if (processing) {
        processing.textContent =
            counts.processing;
    }

    if (shipped) {
        shipped.textContent =
            counts.shipped;
    }

    if (delivered) {
        delivered.textContent =
            counts.delivered;
    }
}


/* =========================================================
   RENDER RECENT ORDERS
========================================================= */

function renderOrders() {
    const container =
        document.getElementById(
            "recentOrders"
        );

    if (!container) {
        return;
    }


    updateOrderStatistics();


    if (!orders.length) {

        container.innerHTML = `
            <div class="no-orders">

                <div class="no-orders-icon">
                    📦
                </div>

                <h3>
                    No orders yet
                </h3>

                <p>
                    Your recent purchases will appear here.
                </p>

                <a href="shop.html">
                    Start Shopping
                </a>

            </div>
        `;

        return;
    }


    const recentOrders =
        orders.slice(0, 4);


    container.innerHTML =
        recentOrders.map(order => {

            const orderNumber =
                order.order_number ||
                `#${order.id || ""}`;

            const status =
                String(
                    order.status ||
                    "pending"
                ).toLowerCase();

            const total =
                Number(
                    order.total || 0
                ).toLocaleString(
                    "en-NG",
                    {
                        style: "currency",
                        currency: "NGN",
                        maximumFractionDigits: 0
                    }
                );


            let dateText = "";

            if (order.created_at) {
                const date =
                    new Date(
                        order.created_at
                    );

                if (
                    !Number.isNaN(
                        date.getTime()
                    )
                ) {
                    dateText =
                        date.toLocaleDateString(
                            "en-NG",
                            {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            }
                        );
                }
            }


            return `
                <a
                    href="orders.html"
                    class="recent-order"
                >

                    <div class="recent-order-icon">
                        📦
                    </div>

                    <div class="recent-order-info">

                        <strong>
                            ${escapeHTML(orderNumber)}
                        </strong>

                        <small>
                            ${escapeHTML(dateText)}
                        </small>

                    </div>

                    <span class="recent-order-status">
                        ${escapeHTML(
                            status.charAt(0).toUpperCase() +
                            status.slice(1)
                        )}
                    </span>

                    <strong class="recent-order-total">
                        ${escapeHTML(total)}
                    </strong>

                </a>
            `;

        }).join("");
}


/* =========================================================
   SECURITY
========================================================= */

function setupSecurity() {
    const securityButton =
        document.getElementById(
            "securityButton"
        );

    const passwordSetting =
        document.getElementById(
            "passwordSetting"
        );


    if (securityButton) {
        securityButton.addEventListener(
            "click",
            openSecurityModal
        );
    }


    if (passwordSetting) {
        passwordSetting.addEventListener(
            "click",
            openSecurityModal
        );
    }
}


/* =========================================================
   SECURITY MODAL
========================================================= */

function openSecurityModal() {

    let modal =
        document.getElementById(
            "securityModal"
        );


    if (modal) {

        modal.classList.add("open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

        return;
    }


    modal =
        document.createElement("div");

    modal.id =
        "securityModal";

    modal.className =
        "account-modal open";

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-security-close
        ></div>


        <div class="modal-box">

            <button
                type="button"
                class="modal-close"
                id="closeSecurityModal"
                aria-label="Close"
            >
                ×
            </button>


            <span class="modal-kicker">
                ACCOUNT SECURITY
            </span>


            <h2>
                Password & Security
            </h2>


            <p>
                Change your CART password and keep your account secure.
            </p>


            <div
                class="security-status-box"
                style="
                    padding:16px;
                    margin:20px 0;
                    border-radius:12px;
                    background:var(--green-light);
                "
            >

                <strong>
                    ✓ Your account is protected
                </strong>

                <p style="margin:6px 0 0;">
                    Use a password that you do not share with anyone.
                </p>

            </div>


            <form id="securityPasswordForm">

                <label>
                    Current Password

                    <input
                        type="password"
                        id="currentPassword"
                        placeholder="Enter current password"
                        autocomplete="current-password"
                        required
                    >
                </label>


                <label>
                    New Password

                    <input
                        type="password"
                        id="newPassword"
                        placeholder="Enter new password"
                        autocomplete="new-password"
                        minlength="8"
                        required
                    >
                </label>


                <label>
                    Confirm New Password

                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm new password"
                        autocomplete="new-password"
                        minlength="8"
                        required
                    >
                </label>


                <button
                    type="submit"
                    class="modal-submit"
                    id="changePasswordButton"
                >
                    Change Password
                    <span>→</span>
                </button>

            </form>


            <div
                class="security-logout-area"
                style="
                    margin-top:20px;
                    padding-top:20px;
                    border-top:1px solid var(--border);
                "
            >

                <button
                    type="button"
                    id="securityLogoutButton"
                    class="outline-button"
                    style="width:100%;"
                >
                    Sign Out
                    <span>→</span>
                </button>

            </div>

        </div>
    `;


    document.body.appendChild(modal);

    document.body.classList.add(
        "modal-open"
    );


    setupSecurityModalEvents();
}


/* =========================================================
   SECURITY MODAL EVENTS
========================================================= */

function setupSecurityModalEvents() {

    const modal =
        document.getElementById(
            "securityModal"
        );

    if (!modal) {
        return;
    }


    const closeButton =
        document.getElementById(
            "closeSecurityModal"
        );

    const overlay =
        modal.querySelector(
            "[data-security-close]"
        );

    const form =
        document.getElementById(
            "securityPasswordForm"
        );

    const logoutButton =
        document.getElementById(
            "securityLogoutButton"
        );


    function closeModal() {
        modal.classList.remove("open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );
    }


    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeModal
        );
    }


    if (overlay) {
        overlay.addEventListener(
            "click",
            closeModal
        );
    }


    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const currentPassword =
                    document.getElementById(
                        "currentPassword"
                    )?.value || "";


                const newPassword =
                    document.getElementById(
                        "newPassword"
                    )?.value || "";


                const confirmPassword =
                    document.getElementById(
                        "confirmPassword"
                    )?.value || "";


                const button =
                    document.getElementById(
                        "changePasswordButton"
                    );


                if (!currentPassword) {
                    showToast(
                        "Please enter your current password.",
                        "error"
                    );

                    return;
                }


                if (newPassword.length < 8) {
                    showToast(
                        "New password must be at least 8 characters.",
                        "error"
                    );

                    return;
                }


                if (newPassword !== confirmPassword) {
                    showToast(
                        "The new passwords do not match.",
                        "error"
                    );

                    return;
                }


                if (
                    currentPassword ===
                    newPassword
                ) {
                    showToast(
                        "Your new password must be different from your current password.",
                        "error"
                    );

                    return;
                }


                const token = getToken();


                if (!token) {
                    showToast(
                        "Please log in again before changing your password.",
                        "error"
                    );

                    return;
                }


                if (button) {
                    button.disabled = true;

                    button.innerHTML =
                        "Changing...";
                }


                try {

                    const data =
                        await apiRequest(
                            "/api/auth/change-password",
                            {
                                method: "PUT",
                                body: JSON.stringify({
                                    current_password:
                                        currentPassword,

                                    new_password:
                                        newPassword
                                })
                            }
                        );


                    if (data.success) {

                        form.reset();

                        showToast(
                            "Password changed successfully.",
                            "success"
                        );

                        setTimeout(
                            closeModal,
                            1000
                        );
                    }


                } catch (error) {

                    console.error(
                        "Password change failed:",
                        error
                    );

                    showToast(
                        error.message ||
                        "Could not change your password.",
                        "error"
                    );

                } finally {

                    if (button) {

                        button.disabled = false;

                        button.innerHTML =
                            `Change Password <span>→</span>`;
                    }

                }

            }
        );

    }


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async () => {

                await logoutUser();

            }
        );

    }
}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {
    const logoutButton =
        document.getElementById(
            "logoutButton"
        );

    if (!logoutButton) {
        return;
    }

    logoutButton.addEventListener(
        "click",
        logoutUser
    );
}


async function logoutUser() {

    const token = getToken();


    try {

        if (token) {

            await apiRequest(
                "/api/logout",
                {
                    method: "POST"
                }
            );

        }

    } catch (error) {

        console.warn(
            "Logout API request failed:",
            error
        );

    } finally {

        localStorage.removeItem(
            TOKEN_KEY
        );

        localStorage.removeItem(
            PROFILE_KEY
        );

        window.location.href =
            "index.html";

    }
}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        const profileModal =
            document.getElementById(
                "profileModal"
            );


        const securityModal =
            document.getElementById(
                "securityModal"
            );


        if (
            profileModal &&
            profileModal.classList.contains(
                "open"
            )
        ) {

            profileModal.classList.remove(
                "open"
            );

            profileModal.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.classList.remove(
                "modal-open"
            );

        }


        if (
            securityModal &&
            securityModal.classList.contains(
                "open"
            )
        ) {

            securityModal.classList.remove(
                "open"
            );

            securityModal.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.classList.remove(
                "modal-open"
            );

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "CART Account JS loaded successfully."
        );


        updateShoppingSnapshot();

        setupProfileModal();

        setupSecurity();

        setupLogout();

        await loadAccountData();

        await loadOrders();

    }
);