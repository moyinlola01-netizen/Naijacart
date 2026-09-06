/* =========================================================
   CART — SHOPPING CART FUNCTIONALITY
   CART E-COMMERCE
========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const CART_KEY = "nc_cart";
const WISHLIST_KEY = "nc_wishlist";
const NEWSLETTER_KEY = "nc_newsletter";


/* =========================================================
   PRODUCTS
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
        image: "skin care",
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
        image: "smart watch",
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
        image: "storage set",
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
        image: "table lamp",
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
        image: "wall decoration",
        rating: 4.5,
        review_count: 11,
        stock: 25
    }
];


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        initCart();
    }
);


function initCart() {
    cleanCart();
    renderCart();
    updateCounts();

    initSearch();
    initQuantityButtons();
    initCartActions();
    initCoupon();
    initNewsletter();
    initSmoothScroll();
    initStorageSync();
}


/* =========================================================
   CART STORAGE
========================================================= */

function getCart() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(CART_KEY) || "[]"
        );

        if (!Array.isArray(saved)) {
            return [];
        }

        return saved;

    } catch (error) {
        console.error(
            "Cart storage error:",
            error
        );

        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );
}


/* =========================================================
   FIND PRODUCT
========================================================= */

function findProduct(item) {
    if (!item) {
        return null;
    }

    const id =
        item.id ??
        item.productId ??
        item.product_id;

    if (
        id !== undefined &&
        id !== null &&
        id !== "" &&
        !Number.isNaN(Number(id))
    ) {
        const product =
            PRODUCTS.find(
                function (product) {
                    return Number(product.id) ===
                        Number(id);
                }
            );

        if (product) {
            return product;
        }
    }

    const name = String(
        item.name ??
        item.title ??
        ""
    )
        .trim()
        .toLowerCase();

    if (name) {
        return (
            PRODUCTS.find(
                function (product) {
                    return product.name
                        .toLowerCase() === name;
                }
            ) || null
        );
    }

    return null;
}


/* =========================================================
   NORMALIZE CART ITEM
========================================================= */

function normalizeCartItem(item) {
    const product =
        findProduct(item);

    if (!product) {
        return null;
    }

    let quantity = Number(
        item.quantity ??
        item.qty ??
        1
    );

    if (
        !Number.isFinite(quantity) ||
        quantity < 1
    ) {
        quantity = 1;
    }

    quantity =
        Math.floor(quantity);

    if (product.stock > 0) {
        quantity =
            Math.min(
                quantity,
                product.stock
            );
    }

    return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        old_price: product.old_price,
        discount: product.discount,
        image: product.image,
        rating: product.rating,
        review_count: product.review_count,
        stock: product.stock,
        quantity: quantity
    };
}


/* =========================================================
   CLEAN INVALID CART
========================================================= */

function cleanCart() {
    const oldCart =
        getCart();

    const newCart = [];

    oldCart.forEach(
        function (item) {
            const product =
                normalizeCartItem(item);

            if (!product) {
                return;
            }

            const existing =
                newCart.find(
                    function (cartItem) {
                        return cartItem.id ===
                            product.id;
                    }
                );

            if (existing) {
                existing.quantity +=
                    product.quantity;

                existing.quantity =
                    Math.min(
                        existing.quantity,
                        existing.stock
                    );

            } else {
                newCart.push(product);
            }
        }
    );

    saveCart(newCart);

    return newCart;
}


/* =========================================================
   PRICE
========================================================= */

function formatPrice(value) {
    const amount =
        Number(value) || 0;

    return (
        "₦" +
        amount.toLocaleString("en-NG")
    );
}


/* =========================================================
   SAFE HTML
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
   IMAGE
========================================================= */

function getImageCandidates(imageName) {
    const filename =
        String(imageName || "").trim();

    if (!filename) {
        return [];
    }

    const encoded =
        encodeURIComponent(filename);

    return [
        "images/products/" +
            encoded +
            ".jpg",

        "images/products/" +
            encoded +
            ".png",

        "images/products/" +
            encoded +
            ".jpeg",

        "images/products/" +
            encoded +
            ".webp"
    ];
}


function setProductImage(
    img,
    imageName
) {
    if (!img) {
        return;
    }

    const candidates =
        getImageCandidates(imageName);

    if (!candidates.length) {
        return;
    }

    let index = 0;

    img.src =
        candidates[index];

    img.onerror =
        function () {
            index++;

            if (
                index <
                candidates.length
            ) {
                img.src =
                    candidates[index];

            } else {
                img.onerror = null;

                img.src =
                    "images/placeholder.jpg";
            }
        };
}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {
    const container =
        document.getElementById(
            "cart-items"
        );

    const emptyState =
        document.getElementById(
            "emptyCart"
        );

    if (!container) {
        return;
    }

    const cart =
        cleanCart();

    container.innerHTML = "";

    if (cart.length === 0) {
        if (emptyState) {
            emptyState.hidden = false;
        }

        updateSummary([]);
        updateHeroCount(0);

        return;
    }

    if (emptyState) {
        emptyState.hidden = true;
    }

    cart.forEach(
        function (item) {
            container.insertAdjacentHTML(
                "beforeend",
                createCartItem(item)
            );
        }
    );

    const images =
        container.querySelectorAll(
            ".cart-item-image img"
        );

    images.forEach(
        function (img, index) {
            const item =
                cart[index];

            if (item) {
                setProductImage(
                    img,
                    item.image
                );
            }
        }
    );

    updateSummary(cart);

    updateHeroCount(
        getTotalQuantity(cart)
    );
}


/* =========================================================
   CART ITEM
========================================================= */

function createCartItem(item) {
    const total =
        item.price *
        item.quantity;

    const savings =
        Math.max(
            0,
            (
                item.old_price -
                item.price
            ) * item.quantity
        );

    const stockText =
        item.stock > 0
            ? item.stock +
              " available"
            : "Out of stock";

    return `
        <article
            class="cart-item"
            data-id="${item.id}"
        >

            <a
                class="cart-item-image"
                href="product.html?id=${item.id}"
            >

                <img
                    src="${
                        getImageCandidates(
                            item.image
                        )[0] || ""
                    }"
                    alt="${escapeHTML(item.name)}"
                    loading="lazy"
                >

                ${
                    item.discount > 0
                        ? `
                            <span class="cart-discount">
                                -${item.discount}%
                            </span>
                        `
                        : ""
                }

            </a>


            <div class="cart-item-info">

                <span class="cart-item-category">
                    ${escapeHTML(item.category)}
                </span>


                <h3>
                    <a
                        href="product.html?id=${item.id}"
                    >
                        ${escapeHTML(item.name)}
                    </a>
                </h3>


                <div class="cart-item-rating">

                    <span class="stars">
                        ${createStars(item.rating)}
                    </span>

                    <span>
                        ${Number(item.rating).toFixed(1)}
                    </span>

                    <span class="review-count">
                        (${item.review_count})
                    </span>

                </div>


                <div class="cart-item-price">

                    <strong>
                        ${formatPrice(item.price)}
                    </strong>

                    ${
                        item.old_price >
                        item.price
                            ? `
                                <del>
                                    ${formatPrice(
                                        item.old_price
                                    )}
                                </del>
                            `
                            : ""
                    }

                </div>


                ${
                    savings > 0
                        ? `
                            <span class="cart-saving">
                                You save
                                ${formatPrice(savings)}
                            </span>
                        `
                        : ""
                }


                <span class="cart-stock">
                    ${escapeHTML(stockText)}
                </span>

            </div>


            <div class="cart-item-actions">

                <div class="quantity-control">

                    <button
                        type="button"
                        class="quantity-btn decrease"
                        data-action="decrease"
                        data-id="${item.id}"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>


                    <span class="quantity-value">
                        ${item.quantity}
                    </span>


                    <button
                        type="button"
                        class="quantity-btn increase"
                        data-action="increase"
                        data-id="${item.id}"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>


                <button
                    type="button"
                    class="remove-item"
                    data-action="remove"
                    data-id="${item.id}"
                >
                    Remove
                </button>

            </div>


            <div class="cart-item-total">

                <span>
                    Item total
                </span>

                <strong>
                    ${formatPrice(total)}
                </strong>

            </div>

        </article>
    `;
}


/* =========================================================
   STARS
========================================================= */

function createStars(rating) {
    const value =
        Number(rating) || 0;

    let stars = "";

    for (
        let i = 1;
        i <= 5;
        i++
    ) {
        if (
            i <=
            Math.round(value)
        ) {
            stars += "★";
        } else {
            stars += "☆";
        }
    }

    return stars;
}


/* =========================================================
   QUANTITY CONTROLS
========================================================= */

function initQuantityButtons() {
    document.addEventListener(
        "click",
        function (event) {
            const button =
                event.target.closest(
                    "[data-action='increase'], " +
                    "[data-action='decrease']"
                );

            if (!button) {
                return;
            }

            const id =
                Number(
                    button.dataset.id
                );

            if (!id) {
                return;
            }

            const cart =
                getCart();

            const item =
                cart.find(
                    function (product) {
                        return Number(
                            product.id
                        ) === id;
                    }
                );

            if (!item) {
                return;
            }

            const product =
                PRODUCTS.find(
                    function (product) {
                        return product.id === id;
                    }
                );

            if (!product) {
                return;
            }

            let quantity =
                Number(
                    item.quantity
                ) || 1;

            if (
                button.dataset.action ===
                "increase"
            ) {
                if (
                    quantity >=
                    product.stock
                ) {
                    showToast(
                        "Only " +
                        product.stock +
                        " available in stock."
                    );

                    return;
                }

                quantity++;

            } else {
                quantity--;

                if (
                    quantity <= 0
                ) {
                    removeItem(id);
                    return;
                }
            }

            item.quantity =
                quantity;

            saveCart(cart);

            renderCart();
            updateCounts();
        }
    );
}


/* =========================================================
   REMOVE ITEM
========================================================= */

function initCartActions() {
    document.addEventListener(
        "click",
        function (event) {
            const button =
                event.target.closest(
                    "[data-action='remove']"
                );

            if (!button) {
                return;
            }

            const id =
                Number(
                    button.dataset.id
                );

            if (!id) {
                return;
            }

            removeItem(id);
        }
    );
}


function removeItem(id) {
    const cart =
        getCart();

    const item =
        cart.find(
            function (product) {
                return Number(
                    product.id
                ) === Number(id);
            }
        );

    const updatedCart =
        cart.filter(
            function (product) {
                return Number(
                    product.id
                ) !== Number(id);
            }
        );

    saveCart(updatedCart);

    renderCart();
    updateCounts();

    if (item) {
        showToast(
            item.name +
            " removed from your cart."
        );
    }
}


/* =========================================================
   SUMMARY
========================================================= */

function updateSummary(cart) {
    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );

    const deliveryElement =
        document.getElementById(
            "cartDelivery"
        );

    const discountElement =
        document.getElementById(
            "cartDiscount"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );

    let subtotal = 0;
    let savings = 0;

    cart.forEach(
        function (item) {
            subtotal +=
                item.price *
                item.quantity;

            savings +=
                Math.max(
                    0,
                    (
                        item.old_price -
                        item.price
                    ) * item.quantity
                );
        }
    );

    const delivery = 0;

    if (subtotalElement) {
        subtotalElement.textContent =
            formatPrice(subtotal);
    }

    if (deliveryElement) {
        deliveryElement.textContent =
            "Free";
    }

    if (discountElement) {
        discountElement.textContent =
            savings > 0
                ? "-" +
                  formatPrice(savings)
                : formatPrice(0);
    }

    if (totalElement) {
        totalElement.textContent =
            formatPrice(
                subtotal +
                delivery
            );
    }
}


/* =========================================================
   COUNTS
========================================================= */

function getTotalQuantity(cart) {
    return cart.reduce(
        function (total, item) {
            return (
                total +
                (
                    Number(
                        item.quantity
                    ) || 0
                )
            );
        },
        0
    );
}


function updateCounts() {
    const cart =
        cleanCart();

    const totalQuantity =
        getTotalQuantity(cart);

    const countElements = [
        document.getElementById(
            "cartCount"
        ),
        document.getElementById(
            "cart-count"
        ),
        document.getElementById(
            "headerCartCount"
        )
    ];

    countElements.forEach(
        function (element) {
            if (!element) {
                return;
            }

            element.textContent =
                totalQuantity;

            element.hidden =
                totalQuantity === 0;
        }
    );

    const heroCount =
        document.getElementById(
            "heroCartCount"
        );

    if (heroCount) {
        heroCount.textContent =
            totalQuantity;
    }

    const wishlist =
        getWishlist();

    const wishlistCount =
        document.getElementById(
            "wishlistCount"
        );

    if (wishlistCount) {
        wishlistCount.textContent =
            wishlist.length;

        wishlistCount.hidden =
            wishlist.length === 0;
    }
}


function updateHeroCount(count) {
    const element =
        document.getElementById(
            "heroCartCount"
        );

    if (element) {
        element.textContent =
            count;
    }
}


/* =========================================================
   WISHLIST
========================================================= */

function getWishlist() {
    try {
        const saved =
            JSON.parse(
                localStorage.getItem(
                    WISHLIST_KEY
                ) || "[]"
            );

        return Array.isArray(saved)
            ? saved
            : [];

    } catch (error) {
        return [];
    }
}


/* =========================================================
   SEARCH
========================================================= */

function initSearch() {
    const form =
        document.getElementById(
            "shopSearchForm"
        ) ||
        document.getElementById(
            "searchForm"
        );

    const input =
        document.getElementById(
            "shopSearchInput"
        ) ||
        document.getElementById(
            "searchInput"
        );

    if (!form || !input) {
        return;
    }

    form.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();

            const query =
                input.value.trim();

            if (!query) {
                window.location.href =
                    "shop.html";

                return;
            }

            window.location.href =
                "shop.html?search=" +
                encodeURIComponent(query);
        }
    );
}


/* =========================================================
   COUPON
========================================================= */

function initCoupon() {
    const form =
        document.getElementById(
            "couponForm"
        );

    const input =
        document.getElementById(
            "couponInput"
        );

    if (!form || !input) {
        return;
    }

    form.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();

            const code =
                input.value
                    .trim()
                    .toUpperCase();

            if (!code) {
                showToast(
                    "Enter a coupon code first."
                );

                return;
            }

            showToast(
                "Coupon will be checked at checkout."
            );
        }
    );
}


/* =========================================================
   NEWSLETTER
========================================================= */

function initNewsletter() {
    const form =
        document.getElementById(
            "cartNewsletter"
        ) ||
        document.getElementById(
            "newsletterForm"
        );

    const input =
        document.getElementById(
            "newsletterEmail"
        );

    if (!form || !input) {
        return;
    }

    form.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();

            const email =
                input.value.trim();

            if (!isValidEmail(email)) {
                showToast(
                    "Please enter a valid email address."
                );

                return;
            }

            let subscribers = [];

            try {
                subscribers =
                    JSON.parse(
                        localStorage.getItem(
                            NEWSLETTER_KEY
                        ) || "[]"
                    );

            } catch (error) {
                subscribers = [];
            }

            if (
                !Array.isArray(
                    subscribers
                )
            ) {
                subscribers = [];
            }

            const exists =
                subscribers.some(
                    function (saved) {
                        return String(saved)
                            .toLowerCase() ===
                            email.toLowerCase();
                    }
                );

            if (exists) {
                showToast(
                    "You are already subscribed."
                );

                return;
            }

            subscribers.push(email);

            localStorage.setItem(
                NEWSLETTER_KEY,
                JSON.stringify(
                    subscribers
                )
            );

            input.value = "";

            showToast(
                "You're subscribed to CART updates."
            );
        }
    );
}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );
}


/* =========================================================
   SMOOTH SCROLL
========================================================= */

function initSmoothScroll() {
    document.addEventListener(
        "click",
        function (event) {
            const link =
                event.target.closest(
                    'a[href^="#"]'
                );

            if (!link) {
                return;
            }

            const targetId =
                link.getAttribute(
                    "href"
                );

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(
                    targetId
                );

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    );
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {
    let toast =
        document.getElementById(
            "cartToast"
        ) ||
        document.getElementById(
            "toast"
        );

    if (!toast) {
        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "cartToast";

        toast.className =
            "cart-toast";

        document.body.appendChild(
            toast
        );
    }

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        showToast.timeout
    );

    showToast.timeout =
        setTimeout(
            function () {
                toast.classList.remove(
                    "show"
                );
            },
            2800
        );
}


/* =========================================================
   STORAGE SYNC
========================================================= */

function initStorageSync() {
    window.addEventListener(
        "storage",
        function (event) {
            if (
                event.key === CART_KEY ||
                event.key === WISHLIST_KEY
            ) {
                cleanCart();
                renderCart();
                updateCounts();
            }
        }
    );

    document.addEventListener(
        "visibilitychange",
        function () {
            if (!document.hidden) {
                cleanCart();
                renderCart();
                updateCounts();
            }
        }
    );
}


/* =========================================================
   PUBLIC REFRESH
========================================================= */

window.refreshCart =
    function () {
        cleanCart();
        renderCart();
        updateCounts();
    };


/* =========================================================
   END
========================================================= */