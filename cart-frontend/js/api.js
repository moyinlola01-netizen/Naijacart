/* =========================================================
   CART — CENTRAL API CONNECTION
   Frontend ↔ Flask Backend ↔ SQLite
========================================================= */

"use strict";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL = "https://cart-backend-8xew.onrender.com";
const TOKEN_KEY = "nc_token";
const USER_KEY = "nc_user";

/* Keep these globally available for older scripts */
window.API_URL = API_URL;
window.API_BASE_URL = API_URL;


/* =========================================================
   TOKEN HELPERS
========================================================= */

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}


function setToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
}


function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}


function getStoredUser() {
    try {
        return JSON.parse(
            localStorage.getItem(USER_KEY)
        );
    } catch {
        return null;
    }
}


function setStoredUser(user) {
    if (user) {
        localStorage.setItem(
            USER_KEY,
            JSON.stringify(user)
        );
    }
}


function removeStoredUser() {
    localStorage.removeItem(USER_KEY);
}


/* =========================================================
   REQUEST HELPER
========================================================= */

async function apiRequest(
    endpoint,
    options = {}
) {

    const token = getToken();

    const headers = {
        Accept: "application/json",
        ...(options.headers || {})
    };


    /*
     * Only add JSON content type when
     * sending a JSON body.
     */

    if (
        options.body &&
        !(options.body instanceof FormData)
    ) {
        headers["Content-Type"] =
            "application/json";
    }


    if (token) {
        headers["Authorization"] =
            `Bearer ${token}`;
    }


    let response;


    try {

        response = await fetch(
            `${API_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );

    } catch (error) {

        throw new Error(
            "Unable to connect to the Cart server. Make sure the Flask backend is running."
        );
    }


    let data = null;


    try {

        data = await response.json();

    } catch {

        data = null;
    }


    /*
     * Token expired / invalid
     */

    if (response.status === 401) {

        removeToken();
        removeStoredUser();
    }


    if (!response.ok) {

        const message =
            data?.message ||
            data?.error ||
            `Request failed with status ${response.status}.`;

        const error =
            new Error(message);

        error.status =
            response.status;

        error.data =
            data;

        throw error;
    }


    return data;
}


/* =========================================================
   GET
========================================================= */

async function apiGet(endpoint) {

    return apiRequest(
        endpoint,
        {
            method: "GET"
        }
    );
}


/* =========================================================
   POST
========================================================= */

async function apiPost(
    endpoint,
    body = {}
) {

    return apiRequest(
        endpoint,
        {
            method: "POST",
            body: JSON.stringify(body)
        }
    );
}


/* =========================================================
   PUT
========================================================= */

async function apiPut(
    endpoint,
    body = {}
) {

    return apiRequest(
        endpoint,
        {
            method: "PUT",
            body: JSON.stringify(body)
        }
    );
}


/* =========================================================
   DELETE
========================================================= */

async function apiDelete(endpoint) {

    return apiRequest(
        endpoint,
        {
            method: "DELETE"
        }
    );
}


/* =========================================================
   AUTHENTICATION
========================================================= */

async function registerUser(userData) {

    const response =
        await apiPost(
            "/api/auth/register",
            {
                name:
                    userData.name ||
                    userData.full_name ||
                    "",

                email:
                    userData.email ||
                    "",

                phone:
                    userData.phone ||
                    "",

                password:
                    userData.password ||
                    ""
            }
        );


    /*
     * Save authentication information
     * only if backend returned it.
     */

    const token =
        response?.token ||
        response?.data?.token;


    const user =
        response?.user ||
        response?.data?.user;


    if (token) {
        setToken(token);
    }


    if (user) {
        setStoredUser(user);
    }


    return response;
}


async function loginUser(
    email,
    password
) {

    const response =
        await apiPost(
            "/api/auth/login",
            {
                email,
                password
            }
        );


    const token =
        response?.token ||
        response?.data?.token;


    const user =
        response?.user ||
        response?.data?.user;


    if (token) {
        setToken(token);
    }


    if (user) {
        setStoredUser(user);
    }


    return response;
}


async function logoutUser() {

    try {

        if (getToken()) {

            await apiPost(
                "/api/auth/logout"
            );
        }

    } catch (error) {

        /*
         * Even if the server request fails,
         * local authentication must still be
         * cleared.
         */

        console.warn(
            "Server logout failed:",
            error.message
        );

    } finally {

        removeToken();
        removeStoredUser();
    }


    return {
        success: true
    };
}


async function getCurrentUser() {

    const response =
        await apiGet(
            "/api/auth/me"
        );


    const user =
        response?.user ||
        response?.data?.user ||
        response?.data ||
        null;


    if (user) {
        setStoredUser(user);
    }


    return response;
}


/* =========================================================
   EMAIL VERIFICATION
========================================================= */

async function verifyEmail(token) {

    return apiPost(
        "/api/auth/verify-email",
        {
            token
        }
    );
}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

async function forgotPassword(email) {

    return apiPost(
        "/api/auth/forgot-password",
        {
            email
        }
    );
}


/* =========================================================
   RESET PASSWORD
========================================================= */

async function resetPassword(
    token,
    password
) {

    return apiPost(
        "/api/auth/reset-password",
        {
            token,
            password
        }
    );
}


/* =========================================================
   PROFILE
========================================================= */

async function getProfile() {

    return apiGet(
        "/api/auth/profile"
    );
}


async function updateProfile(
    profileData
) {

    return apiPut(
        "/api/auth/profile",
        profileData
    );
}


async function changePassword(
    currentPassword,
    newPassword
) {

    return apiPut(
        "/api/auth/password",
        {
            current_password:
                currentPassword,

            new_password:
                newPassword
        }
    );
}


/* =========================================================
   PRODUCTS
========================================================= */

async function getProducts(
    params = {}
) {

    const searchParams =
        new URLSearchParams();


    Object.entries(params)
        .forEach(
            ([key, value]) => {

                if (
                    value !== undefined &&
                    value !== null &&
                    value !== ""
                ) {

                    searchParams.set(
                        key,
                        value
                    );
                }

            }
        );


    const query =
        searchParams.toString();


    return apiGet(
        `/api/products${
            query
                ? `?${query}`
                : ""
        }`
    );
}


async function getProduct(
    productId
) {

    return apiGet(
        `/api/products/${encodeURIComponent(productId)}`
    );
}


async function searchProducts(
    search
) {

    return apiGet(
        `/api/products/search?q=${encodeURIComponent(search)}`
    );
}


async function getProductsByCategory(
    category
) {

    return apiGet(
        `/api/products/category/${encodeURIComponent(category)}`
    );
}


/* =========================================================
   CART
========================================================= */

async function getCart() {

    return apiGet(
        "/api/cart"
    );
}


async function addToCart(
    productId,
    quantity = 1,
    size = null
) {

    const body = {
        product_id:
            Number(productId),

        quantity:
            Number(quantity)
    };


    if (size) {
        body.size = size;
    }


    return apiPost(
        "/api/cart",
        body
    );
}


async function updateCartItem(
    itemId,
    quantity
) {

    return apiPut(
        `/api/cart/${encodeURIComponent(itemId)}`,
        {
            quantity:
                Number(quantity)
        }
    );
}


async function removeCartItem(
    itemId
) {

    return apiDelete(
        `/api/cart/${encodeURIComponent(itemId)}`
    );
}


async function clearCart() {

    return apiDelete(
        "/api/cart"
    );
}


/* =========================================================
   WISHLIST
========================================================= */

async function getWishlist() {

    return apiGet(
        "/api/wishlist"
    );
}


async function addToWishlist(
    productId
) {

    return apiPost(
        "/api/wishlist",
        {
            product_id:
                Number(productId)
        }
    );
}


async function removeFromWishlist(
    productId
) {

    return apiDelete(
        `/api/wishlist/${encodeURIComponent(productId)}`
    );
}


async function checkWishlist(
    productId
) {

    return apiGet(
        `/api/wishlist/check/${encodeURIComponent(productId)}`
    );
}


/* =========================================================
   ADDRESSES
========================================================= */

async function getAddresses() {

    return apiGet(
        "/api/addresses"
    );
}


async function createAddress(
    addressData
) {

    return apiPost(
        "/api/addresses",
        addressData
    );
}


async function updateAddress(
    addressId,
    addressData
) {

    return apiPut(
        `/api/addresses/${encodeURIComponent(addressId)}`,
        addressData
    );
}


async function deleteAddress(
    addressId
) {

    return apiDelete(
        `/api/addresses/${encodeURIComponent(addressId)}`
    );
}


async function setDefaultAddress(
    addressId
) {

    return apiPut(
        `/api/addresses/${encodeURIComponent(addressId)}/default`,
        {}
    );
}


/* =========================================================
   ORDERS
========================================================= */

async function getOrders() {

    return apiGet(
        "/api/orders"
    );
}


async function getOrder(
    orderId
) {

    return apiGet(
        `/api/orders/${encodeURIComponent(orderId)}`
    );
}


async function createOrder(
    orderData
) {

    return apiPost(
        "/api/orders",
        orderData
    );
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

async function getNotifications() {

    return apiGet(
        "/api/notifications"
    );
}


async function markNotificationRead(
    notificationId
) {

    return apiPut(
        `/api/notifications/${encodeURIComponent(notificationId)}/read`,
        {}
    );
}


async function markAllNotificationsRead() {

    return apiPut(
        "/api/notifications/read-all",
        {}
    );
}


/* =========================================================
   ADMIN — DASHBOARD
========================================================= */

async function getAdminDashboard() {

    return apiGet(
        "/api/admin/dashboard"
    );
}


/* =========================================================
   ADMIN — PRODUCTS
========================================================= */

async function getAdminProducts() {

    return apiGet(
        "/api/admin/products"
    );
}


async function createAdminProduct(
    productData
) {

    return apiPost(
        "/api/admin/products",
        productData
    );
}


async function updateAdminProduct(
    productId,
    productData
) {

    return apiPut(
        `/api/admin/products/${encodeURIComponent(productId)}`,
        productData
    );
}


async function deleteAdminProduct(
    productId
) {

    return apiDelete(
        `/api/admin/products/${encodeURIComponent(productId)}`
    );
}


/* =========================================================
   ADMIN — ORDERS
========================================================= */

async function getAdminOrders() {

    return apiGet(
        "/api/admin/orders"
    );
}


async function updateAdminOrderStatus(
    orderId,
    status
) {

    return apiPut(
        `/api/admin/orders/${encodeURIComponent(orderId)}/status`,
        {
            status
        }
    );
}


/* =========================================================
   ADMIN — USERS
========================================================= */

async function getAdminUsers() {

    return apiGet(
        "/api/admin/users"
    );
}


/* =========================================================
   ADMIN — CATEGORIES
========================================================= */

async function getAdminCategories() {

    return apiGet(
        "/api/admin/categories"
    );
}


async function createAdminCategory(
    categoryData
) {

    return apiPost(
        "/api/admin/categories",
        categoryData
    );
}


async function updateAdminCategory(
    categoryId,
    categoryData
) {

    return apiPut(
        `/api/admin/categories/${encodeURIComponent(categoryId)}`,
        categoryData
    );
}


async function deleteAdminCategory(
    categoryId
) {

    return apiDelete(
        `/api/admin/categories/${encodeURIComponent(categoryId)}`
    );
}


/* =========================================================
   ADMIN — ANALYTICS
========================================================= */

async function getAdminAnalytics() {

    return apiGet(
        "/api/admin/analytics"
    );
}


/* =========================================================
   SERVER HEALTH
========================================================= */

async function checkServer() {

    return apiGet(
        "/api/health"
    );
}


/* =========================================================
   UTILITY HELPERS
========================================================= */

function isLoggedIn() {

    return Boolean(
        getToken()
    );
}


function getUser() {

    return getStoredUser();
}


function isAdmin() {

    const user =
        getStoredUser();

    return (
        user &&
        String(user.role)
            .toLowerCase() ===
            "admin"
    );
}


/* =========================================================
   UNIFIED CART COUNT
========================================================= */

async function updateCartCount() {

    let count = 0;


    /*
     * First try the server cart for
     * logged-in users.
     */

    if (getToken()) {

        try {

            const response =
                await getCart();


            const items =
                response?.items ||
                response?.data?.items ||
                response?.cart ||
                response?.data?.cart ||
                [];


            if (Array.isArray(items)) {

                count =
                    items.reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            Number(
                                item.quantity ||
                                0
                            ),
                        0
                    );
            }


        } catch {

            /*
             * Fall back to local cart.
             */
        }
    }


    /*
     * Local cart fallback.
     */

    if (count === 0) {

        try {

            const localCart =
                JSON.parse(
                    localStorage.getItem(
                        "nc_cart"
                    )
                ) || [];


            if (
                Array.isArray(
                    localCart
                )
            ) {

                count =
                    localCart.reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            Number(
                                item.quantity ||
                                0
                            ),
                        0
                    );
            }

        } catch {

            count = 0;
        }
    }


    document
        .querySelectorAll(
            ".cart-count, #cart-count"
        )
        .forEach(
            element => {

                element.textContent =
                    count > 99
                        ? "99+"
                        : count;
            }
        );


    return count;
}


/* =========================================================
   GLOBAL API OBJECT
========================================================= */

window.CartAPI = {

    /* Core */
    apiRequest,
    apiGet,
    apiPost,
    apiPut,
    apiDelete,

    /* Token */
    getToken,
    setToken,
    removeToken,

    /* User */
    getUser,
    setStoredUser,
    removeStoredUser,
    isLoggedIn,
    isAdmin,

    /* Authentication */
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,

    /* Email */
    verifyEmail,

    /* Password */
    forgotPassword,
    resetPassword,

    /* Profile */
    getProfile,
    updateProfile,
    changePassword,

    /* Products */
    getProducts,
    getProduct,
    searchProducts,
    getProductsByCategory,

    /* Cart */
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,

    /* Wishlist */
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlist,

    /* Addresses */
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,

    /* Orders */
    getOrders,
    getOrder,
    createOrder,

    /* Notifications */
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,

    /* Admin */
    getAdminDashboard,
    getAdminProducts,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
    getAdminOrders,
    updateAdminOrderStatus,
    getAdminUsers,
    getAdminCategories,
    createAdminCategory,
    updateAdminCategory,
    deleteAdminCategory,
    getAdminAnalytics,

    /* Server */
    checkServer,

    /* UI */
    updateCartCount
};


/* =========================================================
   BACKWARD COMPATIBILITY
   Older files can temporarily use this name.
   We will remove old references when those files
   are replaced.
========================================================= */

window.NaijaCartAPI = window.CartAPI;


/* =========================================================
   AUTO UPDATE CART COUNT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();

    }
);