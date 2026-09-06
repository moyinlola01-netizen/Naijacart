/* =========================================================
   CART — PREMIUM E-COMMERCE ORDERS PAGE
   Frontend ↔ Flask Backend
========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const API_URL = "https://cart-backend-8xew.onrender.com";

const TOKEN_KEY = "nc_token";
const CART_KEY = "nc_cart";
const WISHLIST_KEY = "nc_wishlist";


/* =========================================================
   20 APPROVED PRODUCTS
   DO NOT CHANGE IMAGE NAMES
========================================================= */

const PRODUCTS = [
    {
        id: 1,
        name: "Body Care Set",
        category: "Beauty",
        price: 15000,
        old_price: 18000,
        discount: 17,
        image: "body-care",
        rating: 4.5,
        review_count: 18,
        stock: 25
    },

    {
        id: 2,
        name: "Classic Denim Jacket",
        category: "Fashion",
        price: 32000,
        old_price: 40000,
        discount: 20,
        image: "denim-jacket",
        rating: 4.6,
        review_count: 21,
        stock: 15
    },

    {
        id: 3,
        name: "Premium Dinner Set",
        category: "Home",
        price: 25000,
        old_price: 30000,
        discount: 17,
        image: "dinner-set",
        rating: 4.5,
        review_count: 24,
        stock: 20
    },

    {
        id: 4,
        name: "Wireless Earbuds",
        category: "Electronics",
        price: 22000,
        old_price: 28000,
        discount: 21,
        image: "earbuds",
        rating: 4.4,
        review_count: 32,
        stock: 25
    },

    {
        id: 5,
        name: "Daily Face Care Kit",
        category: "Beauty",
        price: 18000,
        old_price: 22000,
        discount: 18,
        image: "face-care",
        rating: 4.5,
        review_count: 16,
        stock: 20
    },

    {
        id: 6,
        name: "Complete Hair Care Set",
        category: "Beauty",
        price: 16000,
        old_price: 20000,
        discount: 20,
        image: "hair-care",
        rating: 4.4,
        review_count: 14,
        stock: 22
    },

    {
        id: 7,
        name: "Leather Handbag",
        category: "Fashion",
        price: 28000,
        old_price: 35000,
        discount: 20,
        image: "handbag",
        rating: 4.6,
        review_count: 19,
        stock: 18
    },

    {
        id: 8,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 35000,
        old_price: 42000,
        discount: 17,
        image: "headphones",
        rating: 4.7,
        review_count: 27,
        stock: 14
    },

    {
        id: 9,
        name: "Premium Hoodie",
        category: "Fashion",
        price: 24000,
        old_price: 30000,
        discount: 20,
        image: "hoodie",
        rating: 4.5,
        review_count: 17,
        stock: 20
    },

    {
        id: 10,
        name: "Luxury Perfume",
        category: "Beauty",
        price: 30000,
        old_price: 38000,
        discount: 21,
        image: "perfume",
        rating: 4.7,
        review_count: 29,
        stock: 16
    },

    {
        id: 11,
        name: "Decorative Throw Pillow",
        category: "Home",
        price: 12000,
        old_price: 15000,
        discount: 20,
        image: "pillow",
        rating: 4.4,
        review_count: 12,
        stock: 30
    },

    {
        id: 12,
        name: "Fast Charge Power Bank",
        category: "Electronics",
        price: 20000,
        old_price: 25000,
        discount: 20,
        image: "powerbank",
        rating: 4.5,
        review_count: 23,
        stock: 24
    },

    {
        id: 13,
        name: "Skin Care Essentials",
        category: "Beauty",
        price: 19000,
        old_price: 24000,
        discount: 21,
        image: "skincare",
        rating: 4.6,
        review_count: 20,
        stock: 18
    },

    {
        id: 14,
        name: "Smart Watch",
        category: "Electronics",
        price: 18000,
        old_price: 22000,
        discount: 18,
        image: "smartwatch",
        rating: 4.3,
        review_count: 18,
        stock: 15
    },

    {
        id: 15,
        name: "Classic Sneakers",
        category: "Fashion",
        price: 30000,
        old_price: 38000,
        discount: 21,
        image: "sneakers",
        rating: 4.6,
        review_count: 25,
        stock: 20
    },

    {
        id: 16,
        name: "Wireless Bluetooth Speaker",
        category: "Electronics",
        price: 25000,
        old_price: 30000,
        discount: 17,
        image: "speaker",
        rating: 4.5,
        review_count: 24,
        stock: 20
    },

    {
        id: 17,
        name: "Storage Set",
        category: "Home",
        price: 14000,
        old_price: 18000,
        discount: 22,
        image: "storage-set",
        rating: 4.4,
        review_count: 15,
        stock: 28
    },

    {
        id: 18,
        name: "Modern Table Lamp",
        category: "Home",
        price: 17000,
        old_price: 22000,
        discount: 23,
        image: "table-lamp",
        rating: 4.5,
        review_count: 13,
        stock: 17
    },

    {
        id: 19,
        name: "Classic Wristwatch",
        category: "Fashion",
        price: 27000,
        old_price: 34000,
        discount: 21,
        image: "wristwatch",
        rating: 4.6,
        review_count: 22,
        stock: 15
    },

    {
        id: 20,
        name: "Wall Decoration",
        category: "Home",
        price: 13000,
        old_price: 17000,
        discount: 24,
        image: "wall-decoration",
        rating: 4.5,
        review_count: 11,
        stock: 25
    }
];


/* =========================================================
   STATE
========================================================= */

let allOrders = [];

let currentFilter = "all";
let currentSearch = "";
let currentSort = "newest";


/* =========================================================
   DOM HELPERS
========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return document.querySelectorAll(selector);
}


/* =========================================================
   TOKEN
========================================================= */

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}


/* =========================================================
   CART
========================================================= */

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_KEY));

        if (Array.isArray(cart)) {
            return cart;
        }

        return [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}


/* =========================================================
   WISHLIST
========================================================= */

function getWishlist() {
    try {
        const wishlist = JSON.parse(
            localStorage.getItem(WISHLIST_KEY)
        );

        if (Array.isArray(wishlist)) {
            return wishlist;
        }

        return [];
    } catch (error) {
        return [];
    }
}

function saveWishlist(wishlist) {
    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
    );
}


/* =========================================================
   FORMATTERS
========================================================= */

function formatPrice(value) {
    const amount = Number(value) || 0;

    return "₦" + amount.toLocaleString("en-NG");
}


function formatDate(value) {

    if (!value) {
        return "Date unavailable";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


function formatShortDate(value) {

    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short"
    });
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   IMAGE HELPERS
========================================================= */

function imageCandidates(filename) {

    const safeName = encodeURIComponent(filename);

    return [
        `images/products/${safeName}.jpg`,
        `images/products/${safeName}.png`,
        `images/products/${safeName}.jpeg`,
        `images/products/${safeName}.webp`
    ];
}


function setProductImage(img, filename) {

    if (!img) {
        return;
    }

    const candidates = imageCandidates(filename);

    let index = 0;

    function tryNext() {

        if (index >= candidates.length) {
            img.style.display = "none";
            return;
        }

        img.src = candidates[index];

        index++;

        img.onerror = tryNext;
    }

    tryNext();
}


/* =========================================================
   PRODUCT FINDER
========================================================= */

function findProduct(id) {

    return PRODUCTS.find(
        product => Number(product.id) === Number(id)
    );
}


/* =========================================================
   PRODUCT DATA NORMALIZER
========================================================= */

function normalizeProduct(product) {

    if (!product) {
        return null;
    }

    return {
        id: Number(product.id),
        name: product.name || "Product",
        category: product.category || "General",
        price: Number(product.price) || 0,
        old_price:
            Number(product.old_price || product.price) || 0,
        discount: Number(product.discount) || 0,
        image: product.image || "",
        rating: Number(product.rating) || 0,
        review_count:
            Number(product.review_count) || 0,
        stock: Number(product.stock) || 0
    };
}


/* =========================================================
   STATUS NORMALIZER
========================================================= */

function normalizeStatus(order) {

    const raw = String(
        order?.status ||
        order?.order_status ||
        order?.state ||
        ""
    )
        .trim()
        .toLowerCase();

    if (
        raw.includes("cancel") ||
        raw.includes("reject")
    ) {
        return "cancelled";
    }

    if (
        raw.includes("deliver") ||
        raw.includes("complete")
    ) {
        return "delivered";
    }

    if (
        raw.includes("ship") ||
        raw.includes("transit") ||
        raw.includes("way")
    ) {
        return "shipped";
    }

    return "processing";
}


/* =========================================================
   STATUS LABEL
========================================================= */

function statusLabel(status) {

    const labels = {
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled"
    };

    return labels[status] || "Processing";
}


/* =========================================================
   ORDER ID
========================================================= */

function getOrderId(order) {

    return (
        order?.order_number ||
        order?.order_no ||
        order?.reference ||
        order?.order_reference ||
        (order?.id ? `CART-${String(order.id).padStart(5, "0")}` : "CART-ORDER")
    );
}


/* =========================================================
   ORDER DATE
========================================================= */

function getOrderDate(order) {

    return (
        order?.created_at ||
        order?.ordered_at ||
        order?.date ||
        order?.created ||
        null
    );
}


/* =========================================================
   ORDER TOTAL
========================================================= */

function getOrderTotal(order) {

    return Number(
        order?.total ??
        order?.grand_total ??
        order?.amount ??
        order?.total_amount ??
        0
    );
}


/* =========================================================
   ORDER ITEMS
========================================================= */

function getOrderItems(order) {

    const possibleItems =
        order?.items ||
        order?.order_items ||
        order?.products ||
        [];

    if (!Array.isArray(possibleItems)) {
        return [];
    }

    return possibleItems.map(item => {

        const productId =
            item.product_id ||
            item.productId ||
            item.id;

        const localProduct =
            findProduct(productId);

        const product =
            localProduct ||
            normalizeProduct({
                id: productId,
                name:
                    item.name ||
                    item.product_name ||
                    "Product",
                category:
                    item.category ||
                    "General",
                price:
                    item.price ||
                    item.unit_price ||
                    0,
                old_price:
                    item.old_price ||
                    item.price ||
                    0,
                image:
                    item.image ||
                    "",
                rating:
                    item.rating ||
                    0,
                review_count:
                    item.review_count ||
                    0
            });

        return {
            ...product,
            quantity:
                Number(
                    item.quantity ||
                    item.qty ||
                    item.count ||
                    1
                ) || 1,

            size:
                item.size ||
                null,

            color:
                item.color ||
                null
        };
    });
}


/* =========================================================
   ORDER NORMALIZER
========================================================= */

function normalizeOrder(order) {

    const status = normalizeStatus(order);

    const items = getOrderItems(order);

    let total = getOrderTotal(order);

    if (!total && items.length) {

        total = items.reduce(
            (sum, item) =>
                sum +
                (Number(item.price) || 0) *
                (Number(item.quantity) || 1),
            0
        );
    }

    return {
        ...order,

        id:
            order?.id ||
            order?.order_id ||
            Date.now(),

        order_number: getOrderId(order),

        created_at: getOrderDate(order),

        status,

        total,

        items,

        payment_status:
            order?.payment_status ||
            order?.paymentStatus ||
            "Paid",

        shipping_address:
            order?.shipping_address ||
            order?.address ||
            null
    };
}


/* =========================================================
   LOAD ORDERS
========================================================= */

async function loadOrders() {

    const token = getToken();

    if (!token) {

        allOrders = [];

        renderStats();
        renderFilters();
        renderOrders();

        return;
    }

    showLoading();

    try {

        const response = await fetch(
            `${API_URL}/api/orders`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.status === 401) {

            allOrders = [];

            renderStats();
            renderFilters();
            renderOrders();

            showToast(
                "Please log in to view your orders."
            );

            return;
        }

        if (!response.ok) {
            throw new Error(
                `Orders request failed: ${response.status}`
            );
        }

        const data = await response.json();

        let orders = [];

        if (Array.isArray(data)) {
            orders = data;
        } else if (Array.isArray(data.orders)) {
            orders = data.orders;
        } else if (Array.isArray(data.data)) {
            orders = data.data;
        }

        allOrders = orders.map(normalizeOrder);

        renderStats();
        renderFilters();
        renderOrders();

    } catch (error) {

        console.error(
            "Unable to load orders:",
            error
        );

        allOrders = [];

        renderStats();
        renderFilters();
        renderOrders();

        showToast(
            "Your orders could not be loaded right now."
        );
    }
}


/* =========================================================
   LOADING
========================================================= */

function showLoading() {

    const container = $("#ordersList");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="orders-loading">
            Loading your orders...
        </div>
    `;

    const empty = $("#ordersEmpty");
    const noMatch = $("#ordersNoMatch");

    if (empty) {
        empty.style.display = "none";
    }

    if (noMatch) {
        noMatch.style.display = "none";
    }
}


/* =========================================================
   STATS
========================================================= */

function renderStats() {

    const total = allOrders.length;

    const processing =
        allOrders.filter(
            order => order.status === "processing"
        ).length;

    const shipped =
        allOrders.filter(
            order => order.status === "shipped"
        ).length;

    const delivered =
        allOrders.filter(
            order => order.status === "delivered"
        ).length;

    if ($("#totalOrders")) {
        $("#totalOrders").textContent = total;
    }

    if ($("#processingOrders")) {
        $("#processingOrders").textContent = processing;
    }

    if ($("#shippedOrders")) {
        $("#shippedOrders").textContent = shipped;
    }

    if ($("#deliveredOrders")) {
        $("#deliveredOrders").textContent = delivered;
    }
}


/* =========================================================
   FILTER COUNTS
========================================================= */

function renderFilters() {

    const counts = {
        all: allOrders.length,

        processing:
            allOrders.filter(
                order => order.status === "processing"
            ).length,

        shipped:
            allOrders.filter(
                order => order.status === "shipped"
            ).length,

        delivered:
            allOrders.filter(
                order => order.status === "delivered"
            ).length,

        cancelled:
            allOrders.filter(
                order => order.status === "cancelled"
            ).length
    };

    $all(".order-filter").forEach(button => {

        const filter =
            button.dataset.orderFilter;

        const count =
            button.querySelector(
                ".order-tab-count"
            );

        if (count) {
            count.textContent =
                counts[filter] ?? 0;
        }
    });
}


/* =========================================================
   FILTER + SEARCH + SORT
========================================================= */

function getVisibleOrders() {

    let orders = [...allOrders];

    if (currentFilter !== "all") {

        orders = orders.filter(
            order =>
                order.status === currentFilter
        );
    }

    if (currentSearch) {

        const query =
            currentSearch.toLowerCase().trim();

        orders = orders.filter(order => {

            const orderNumber =
                String(
                    order.order_number || ""
                ).toLowerCase();

            const itemsText =
                order.items
                    .map(item => item.name)
                    .join(" ")
                    .toLowerCase();

            return (
                orderNumber.includes(query) ||
                itemsText.includes(query)
            );
        });
    }

    orders.sort((a, b) => {

        const dateA =
            new Date(
                a.created_at || 0
            ).getTime();

        const dateB =
            new Date(
                b.created_at || 0
            ).getTime();

        const totalA =
            Number(a.total) || 0;

        const totalB =
            Number(b.total) || 0;

        if (currentSort === "oldest") {
            return dateA - dateB;
        }

        if (currentSort === "highest") {
            return totalB - totalA;
        }

        if (currentSort === "lowest") {
            return totalA - totalB;
        }

        return dateB - dateA;
    });

    return orders;
}


/* =========================================================
   RENDER ORDERS
========================================================= */

function renderOrders() {

    const container = $("#ordersList");
    const empty = $("#ordersEmpty");
    const noMatch = $("#ordersNoMatch");

    if (!container) {
        return;
    }

    const visibleOrders =
        getVisibleOrders();

    if (empty) {
        empty.style.display = "none";
    }

    if (noMatch) {
        noMatch.style.display = "none";
    }

    if (!allOrders.length) {

        container.innerHTML = "";

        if (empty) {
            empty.style.display = "block";
        }

        updateResultsCount(0);

        return;
    }

    if (!visibleOrders.length) {

        container.innerHTML = "";

        if (noMatch) {
            noMatch.style.display = "block";
        }

        updateResultsCount(0);

        return;
    }

    container.innerHTML =
        visibleOrders
            .map(renderOrderCard)
            .join("");

    updateResultsCount(
        visibleOrders.length
    );
}


/* =========================================================
   RESULTS COUNT
========================================================= */

function updateResultsCount(count) {

    const element =
        $("#ordersResultsCount");

    if (!element) {
        return;
    }

    element.textContent =
        `${count} ${count === 1 ? "order" : "orders"} found`;
}


/* =========================================================
   ORDER CARD
========================================================= */

function renderOrderCard(order) {

    const status =
        normalizeStatus(order);

    const statusText =
        statusLabel(status);

    const orderNumber =
        escapeHTML(order.order_number);

    const orderDate =
        formatDate(order.created_at);

    const total =
        formatPrice(order.total);

    const items =
        Array.isArray(order.items)
            ? order.items
            : [];

    const itemsHTML =
        items.length
            ? items
                .map(renderOrderItem)
                .join("")
            : renderFallbackOrderItem(order);

    const timeline =
        renderTimeline(status);

    const deliveryText =
        getDeliveryText(status);

    const safeOrderId =
        encodeURIComponent(
            order.id
        );

    return `
        <article
            class="order-card"
            data-order-id="${escapeHTML(order.id)}"
        >

            <div class="order-card-header">

                <div class="order-card-meta">

                    <div class="order-number">
                        <small>Order Number</small>
                        <strong>#${orderNumber}</strong>
                    </div>

                    <div class="order-date">
                        <small>Placed</small>
                        <span>${escapeHTML(orderDate)}</span>
                    </div>

                </div>

                <span class="order-status ${status}">
                    ${statusText}
                </span>

            </div>


            <div class="order-items">

                ${itemsHTML}

            </div>


            <div class="order-tracking">

                <div class="order-tracking-top">

                    <div class="delivery-info">

                        <div class="delivery-icon">
                            🚚
                        </div>

                        <div class="delivery-text">

                            <small>Delivery Status</small>

                            <strong>
                                ${escapeHTML(deliveryText)}
                            </strong>

                        </div>

                    </div>

                    <a
                        href="order-details.html?id=${safeOrderId}#tracking"
                        class="track-link"
                    >
                        Track Order →
                    </a>

                </div>

                <div class="order-timeline">

                    ${timeline}

                </div>

            </div>


            <div class="order-card-footer">

                <div class="order-payment">

                    <div class="payment-detail">

                        <small>Payment</small>

                        <span>
                            ${escapeHTML(
                                String(
                                    order.payment_status ||
                                    "Paid"
                                )
                            )}
                        </span>

                    </div>

                    <div class="total-detail">

                        <small>Total</small>

                        <strong>
                            ${total}
                        </strong>

                    </div>

                </div>


                <div class="order-actions">

                    <a
                        href="order-details.html?id=${safeOrderId}"
                        class="order-button"
                    >
                        View Details
                    </a>

                    <a
                        href="order-details.html?id=${safeOrderId}#tracking"
                        class="order-button primary"
                    >
                        Track Order
                    </a>

                    <button
                        type="button"
                        class="order-button orange"
                        data-buy-again="${safeOrderId}"
                    >
                        Buy Again
                    </button>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   ORDER ITEM
========================================================= */

function renderOrderItem(item) {

    const product =
        normalizeProduct(item);

    if (!product) {
        return "";
    }

    const quantity =
        Number(item.quantity) || 1;

    const lineTotal =
        product.price * quantity;

    const productId =
        encodeURIComponent(product.id);

    const details = [];

    details.push(
        `Qty: ${quantity}`
    );

    if (item.size) {
        details.push(
            `Size: ${escapeHTML(item.size)}`
        );
    }

    if (item.color) {
        details.push(
            `Color: ${escapeHTML(item.color)}`
        );
    }

    return `
        <div class="order-item">

            <a
                href="product.html?id=${productId}"
                class="order-item-image"
                aria-label="${escapeHTML(product.name)}"
            >
                <img
                    data-product-image="${escapeHTML(product.image)}"
                    src=""
                    alt="${escapeHTML(product.name)}"
                >
            </a>


            <div class="order-item-info">

                <div class="order-item-category">
                    ${escapeHTML(product.category)}
                </div>

                <h3>
                    <a href="product.html?id=${productId}">
                        ${escapeHTML(product.name)}
                    </a>
                </h3>

                <div class="order-item-details">

                    ${details
                        .map(
                            detail =>
                                `<span>${detail}</span>`
                        )
                        .join("")
                    }

                </div>

            </div>


            <div class="order-item-price">

                <strong>
                    ${formatPrice(lineTotal)}
                </strong>

                ${
                    quantity > 1
                        ? `<small>${formatPrice(product.price)} each</small>`
                        : ""
                }

            </div>

        </div>
    `;
}


/* =========================================================
   FALLBACK ORDER ITEM
========================================================= */

function renderFallbackOrderItem(order) {

    return `
        <div class="order-item">

            <div class="order-item-image">
                <div
                    style="
                        width:100%;
                        height:100%;
                        display:grid;
                        place-items:center;
                        font-size:28px;
                    "
                >
                    📦
                </div>
            </div>

            <div class="order-item-info">

                <div class="order-item-category">
                    CART ORDER
                </div>

                <h3>
                    Order items
                </h3>

                <div class="order-item-details">
                    <span>
                        ${escapeHTML(
                            String(
                                order.items_count ||
                                order.item_count ||
                                "Multiple"
                            )
                        )} item(s)
                    </span>
                </div>

            </div>

            <div class="order-item-price">
                <strong>
                    ${formatPrice(order.total)}
                </strong>
            </div>

        </div>
    `;
}


/* =========================================================
   TIMELINE
========================================================= */

function renderTimeline(status) {

    const steps = [
        {
            key: "processing",
            label: "Ordered"
        },

        {
            key: "processing",
            label: "Processing"
        },

        {
            key: "shipped",
            label: "Shipped"
        },

        {
            key: "delivered",
            label: "Delivered"
        }
    ];

    const orderLevel = {
        processing: 1,
        shipped: 2,
        delivered: 3,
        cancelled: 0
    };

    const level =
        orderLevel[status] ?? 1;

    return steps
        .map((step, index) => {

            let completed = false;
            let current = false;

            if (status === "cancelled") {

                completed =
                    index === 0;

            } else {

                if (index < level) {
                    completed = true;
                }

                if (
                    status === "processing" &&
                    index === 1
                ) {
                    current = true;
                }

                if (
                    status === "shipped" &&
                    index === 2
                ) {
                    current = true;
                }

                if (
                    status === "delivered" &&
                    index === 3
                ) {
                    current = true;
                    completed = true;
                }
            }

            return `
                <div
                    class="
                        timeline-step
                        ${completed ? "completed" : ""}
                        ${current ? "current" : ""}
                    "
                >

                    <div class="timeline-dot"></div>

                    <span>
                        ${escapeHTML(step.label)}
                    </span>

                </div>
            `;
        })
        .join("");
}


/* =========================================================
   DELIVERY TEXT
========================================================= */

function getDeliveryText(status) {

    if (status === "delivered") {
        return "Delivered successfully";
    }

    if (status === "shipped") {
        return "Your order is on the way";
    }

    if (status === "cancelled") {
        return "This order was cancelled";
    }

    return "Your order is being prepared";
}


/* =========================================================
   IMAGE INITIALIZER
========================================================= */

function initializeOrderImages() {

    $all(
        "[data-product-image]"
    ).forEach(img => {

        const filename =
            img.dataset.productImage;

        setProductImage(
            img,
            filename
        );
    });
}


/* =========================================================
   FILTER BUTTONS
========================================================= */

function initializeFilters() {

    $all(
        "[data-order-filter]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentFilter =
                    button.dataset.orderFilter ||
                    "all";

                $all(
                    ".order-filter"
                ).forEach(
                    filterButton => {
                        filterButton.classList.toggle(
                            "active",
                            filterButton === button
                        );
                    }
                );

                renderOrders();
            }
        );
    });
}


/* =========================================================
   STAT FILTER BUTTONS
========================================================= */

function initializeStatCards() {

    $all(
        "[data-stat-filter]"
    ).forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const filter =
                    card.dataset.statFilter ||
                    "all";

                currentFilter = filter;

                $all(
                    ".order-filter"
                ).forEach(button => {

                    button.classList.toggle(
                        "active",
                        button.dataset.orderFilter ===
                            filter
                    );
                });

                renderOrders();

                const history =
                    document.querySelector(
                        ".orders-history"
                    );

                if (history) {

                    history.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        );
    });
}


/* =========================================================
   SEARCH
========================================================= */

function initializeSearch() {

    const input =
        $("#orderSearch");

    if (!input) {
        return;
    }

    input.addEventListener(
        "input",
        event => {

            currentSearch =
                event.target.value;

            renderOrders();
        }
    );
}


/* =========================================================
   SORT
========================================================= */

function initializeSort() {

    const select =
        $("#ordersSort");

    if (!select) {
        return;
    }

    select.addEventListener(
        "change",
        event => {

            currentSort =
                event.target.value;

            renderOrders();
        }
    );
}


/* =========================================================
   CLEAR SEARCH / FILTER
========================================================= */

function clearOrdersFilters() {

    currentFilter = "all";
    currentSearch = "";

    const input =
        $("#orderSearch");

    if (input) {
        input.value = "";
    }

    $all(
        ".order-filter"
    ).forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.orderFilter ===
                "all"
        );
    });

    renderOrders();
}


/* =========================================================
   CLEAR BUTTONS
========================================================= */

function initializeClearButtons() {

    $all(
        "[data-clear-orders]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            clearOrdersFilters
        );
    });
}


/* =========================================================
   BUY AGAIN
========================================================= */

function initializeBuyAgain() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-buy-again]"
                );

            if (!button) {
                return;
            }

            const encodedId =
                button.dataset.buyAgain;

            if (!encodedId) {
                return;
            }

            let orderId;

            try {
                orderId =
                    decodeURIComponent(
                        encodedId
                    );
            } catch (error) {
                orderId = encodedId;
            }

            const order =
                allOrders.find(
                    item =>
                        String(item.id) ===
                        String(orderId)
                );

            if (!order) {

                showToast(
                    "Order details could not be found."
                );

                return;
            }

            const cart =
                getCart();

            const items =
                Array.isArray(order.items)
                    ? order.items
                    : [];

            if (!items.length) {

                showToast(
                    "There are no products to add from this order."
                );

                return;
            }

            let added = 0;

            items.forEach(item => {

                const product =
                    findProduct(item.id) ||
                    item;

                if (!product) {
                    return;
                }

                const quantity =
                    Number(item.quantity) || 1;

                const existing =
                    cart.find(
                        cartItem =>
                            Number(
                                cartItem.id
                            ) ===
                            Number(product.id)
                    );

                if (existing) {

                    existing.quantity =
                        Number(
                            existing.quantity || 0
                        ) + quantity;

                } else {

                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: quantity,
                        size: item.size || null,
                        color: item.color || null
                    });
                }

                added++;
            });

            saveCart(cart);

            updateHeaderCounts();

            showToast(
                added === 1
                    ? "Product added to cart."
                    : `${added} products added to cart.`
            );
        }
    );
}


/* =========================================================
   HEADER COUNTS
========================================================= */

function getCartCount() {

    const cart =
        getCart();

    return cart.reduce(
        (total, item) =>
            total +
            (Number(item.quantity) || 1),
        0
    );
}


function updateHeaderCounts() {

    const cartCount =
        getCartCount();

    const wishlistCount =
        getWishlist().length;

    $all(
        ".cart-count"
    ).forEach(element => {

        element.textContent =
            cartCount;
    });

    $all(
        ".wishlist-count"
    ).forEach(element => {

        element.textContent =
            wishlistCount;
    });
}


/* =========================================================
   HEADER SEARCH
========================================================= */

function initializeHeaderSearch() {

    const form =
        $("#shopSearchForm");

    const input =
        $("#shopSearchInput");

    if (!form || !input) {
        return;
    }

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const query =
                input.value.trim();

            if (!query) {

                window.location.href =
                    "shop.html";

                return;
            }

            window.location.href =
                `shop.html?search=${encodeURIComponent(query)}`;
        }
    );
}


/* =========================================================
   NEWSLETTER
========================================================= */

function initializeNewsletter() {

    const form =
        $("#newsletterForm");

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const input =
                form.querySelector(
                    "input[type='email']"
                );

            if (!input) {
                return;
            }

            const email =
                input.value.trim();

            if (!email) {
                return;
            }

            showToast(
                "Thanks for subscribing to CART!"
            );

            form.reset();
        }
    );
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;

function showToast(message) {

    const toast =
        $("#ordersToast");

    if (!toast) {
        return;
    }

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );
}


/* =========================================================
   LOGIN HANDLING
========================================================= */

function initializeAccountLink() {

    const token =
        getToken();

    const account =
        document.querySelector(
            ".account-action"
        );

    if (!account) {
        return;
    }

    if (token) {

        account.href =
            "profile.html";

    } else {

        account.href =
            "login.html";
    }
}


/* =========================================================
   URL FILTER
========================================================= */

function initializeURLState() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const filter =
        params.get("filter");

    const search =
        params.get("search");

    if (
        filter &&
        [
            "all",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ].includes(filter)
    ) {
        currentFilter = filter;
    }

    if (search) {
        currentSearch = search;

        const input =
            $("#orderSearch");

        if (input) {
            input.value = search;
        }
    }

    $all(
        ".order-filter"
    ).forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.orderFilter ===
                currentFilter
        );
    });
}


/* =========================================================
   SHOP AGAIN PRODUCTS
========================================================= */

function renderShopAgainProducts() {

    const grid =
        $("#ordersProductGrid");

    if (!grid) {
        return;
    }

    /*
       Pick a balanced selection from all
       four categories.
    */

    const selectedProducts = [
        PRODUCTS[7],   // headphones
        PRODUCTS[14],  // sneakers
        PRODUCTS[9],   // perfume
        PRODUCTS[2]    // dinner set
    ];

    grid.innerHTML =
        selectedProducts
            .map(renderShopAgainProduct)
            .join("");

    initializeShopAgainImages();
}


/* =========================================================
   SHOP AGAIN PRODUCT CARD
========================================================= */

function renderShopAgainProduct(product) {

    const wishlist =
        getWishlist();

    const isWishlisted =
        wishlist.some(
            item =>
                Number(item) ===
                Number(product.id)
        );

    return `
        <article
            class="orders-product-card"
            data-product-card="${product.id}"
        >

            <div class="orders-product-image">

                <a href="product.html?id=${product.id}">

                    <img
                        data-shop-image="${escapeHTML(product.image)}"
                        src=""
                        alt="${escapeHTML(product.name)}"
                    >

                </a>

                ${
                    product.discount
                        ? `
                            <span class="orders-product-discount">
                                -${product.discount}%
                            </span>
                        `
                        : ""
                }

                <button
                    type="button"
                    class="
                        orders-product-wishlist
                        ${isWishlisted ? "active" : ""}
                    "
                    data-wishlist-id="${product.id}"
                    aria-label="Add to wishlist"
                >
                    ${isWishlisted ? "♥" : "♡"}
                </button>

            </div>


            <div class="orders-product-content">

                <div class="orders-product-category">
                    ${escapeHTML(product.category)}
                </div>

                <h3>
                    <a href="product.html?id=${product.id}">
                        ${escapeHTML(product.name)}
                    </a>
                </h3>

                <div class="orders-product-rating">

                    <span class="stars">
                        ${renderStars(product.rating)}
                    </span>

                    <span>
                        ${product.rating}
                        (${product.review_count})
                    </span>

                </div>

                <div class="orders-product-prices">

                    <strong>
                        ${formatPrice(product.price)}
                    </strong>

                    ${
                        product.old_price
                            ? `
                                <del>
                                    ${formatPrice(product.old_price)}
                                </del>
                            `
                            : ""
                    }

                </div>

                <button
                    type="button"
                    class="orders-product-add"
                    data-add-product="${product.id}"
                >
                    Add to Cart
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   STAR RATING
========================================================= */

function renderStars(rating) {

    const value =
        Number(rating) || 0;

    let stars = "";

    for (let i = 1; i <= 5; i++) {

        stars +=
            i <= Math.round(value)
                ? "★"
                : "☆";
    }

    return stars;
}


/* =========================================================
   SHOP AGAIN IMAGES
========================================================= */

function initializeShopAgainImages() {

    $all(
        "[data-shop-image]"
    ).forEach(img => {

        const filename =
            img.dataset.shopImage;

        setProductImage(
            img,
            filename
        );
    });
}


/* =========================================================
   ADD PRODUCT TO CART
========================================================= */

function initializeAddToCart() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-add-product]"
                );

            if (!button) {
                return;
            }

            const productId =
                Number(
                    button.dataset.addProduct
                );

            const product =
                findProduct(productId);

            if (!product) {
                return;
            }

            const cart =
                getCart();

            const existing =
                cart.find(
                    item =>
                        Number(item.id) ===
                        productId
                );

            if (existing) {

                existing.quantity =
                    Number(
                        existing.quantity || 0
                    ) + 1;

            } else {

                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }

            saveCart(cart);

            updateHeaderCounts();

            showToast(
                `${product.name} added to cart.`
            );
        }
    );
}


/* =========================================================
   WISHLIST TOGGLE
========================================================= */

function initializeWishlist() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-wishlist-id]"
                );

            if (!button) {
                return;
            }

            const productId =
                Number(
                    button.dataset.wishlistId
                );

            let wishlist =
                getWishlist();

            const existingIndex =
                wishlist.findIndex(
                    item =>
                        Number(item) ===
                        productId
                );

            if (existingIndex >= 0) {

                wishlist.splice(
                    existingIndex,
                    1
                );

                button.classList.remove(
                    "active"
                );

                button.textContent =
                    "♡";

                showToast(
                    "Removed from wishlist."
                );

            } else {

                wishlist.push(
                    productId
                );

                button.classList.add(
                    "active"
                );

                button.textContent =
                    "♥";

                showToast(
                    "Added to wishlist."
                );
            }

            saveWishlist(
                wishlist
            );

            updateHeaderCounts();
        }
    );
}


/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

function initializeSmoothLinks() {

    $all(
        "a[href]"
    ).forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const href =
                    link.getAttribute(
                        "href"
                    );

                if (
                    !href ||
                    href.startsWith("#") ||
                    href.startsWith("http") ||
                    href.startsWith("mailto:") ||
                    href.startsWith("tel:")
                ) {
                    return;
                }

                /*
                   Let the browser handle normal
                   navigation.
                */
            }
        );
    });
}


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeURLState();

        initializeFilters();

        initializeStatCards();

        initializeSearch();

        initializeSort();

        initializeClearButtons();

        initializeBuyAgain();

        initializeHeaderSearch();

        initializeNewsletter();

        initializeAccountLink();

        initializeAddToCart();

        initializeWishlist();

        initializeSmoothLinks();

        updateHeaderCounts();

        renderShopAgainProducts();

        loadOrders();
    }
);