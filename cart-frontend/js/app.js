/* =========================================================
   CART — HOMEPAGE APP
   Featured Products
   Cart + Wishlist
   Local product fallback
========================================================= */

"use strict";


/* =========================================================
   STORAGE
========================================================= */

const CART_KEY = "nc_cart";
const WISHLIST_KEY = "nc_wishlist";


/* =========================================================
   20 PRODUCTS
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
   CART HELPERS
========================================================= */

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_KEY));
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}


function updateCartCount() {
    const cart = getCart();

    const count = cart.reduce((total, item) => {
        return total + Number(item.quantity || 1);
    }, 0);

    document.querySelectorAll(
        "#cartCount, .cart-count, [data-cart-count]"
    ).forEach(element => {
        element.textContent = count;
    });
}


/* =========================================================
   WISHLIST HELPERS
========================================================= */

function getWishlist() {
    try {
        const wishlist = JSON.parse(
            localStorage.getItem(WISHLIST_KEY)
        );

        return Array.isArray(wishlist) ? wishlist : [];
    } catch (error) {
        return [];
    }
}


function saveWishlist(wishlist) {
    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
    );

    updateWishlistCount();
}


function updateWishlistCount() {
    const wishlist = getWishlist();

    document.querySelectorAll(
        "#wishlistCount, .wishlist-count, [data-wishlist-count]"
    ).forEach(element => {
        element.textContent = wishlist.length;
    });
}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {
    return "₦" + Number(price).toLocaleString("en-NG");
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   IMAGE PATH
========================================================= */

function getImagePath(product) {
    const filename = encodeURIComponent(product.image);

    return `images/products/${filename}.jpg`;
}


/* =========================================================
   IMAGE FALLBACK
========================================================= */

function setImageFallback(image, product) {

    const extensions = [
        "jpg",
        "png",
        "jpeg",
        "webp"
    ];

    let current = 0;

    image.src =
        `images/products/${encodeURIComponent(product.image)}.${extensions[current]}`;

    image.onerror = function () {

        current++;

        if (current < extensions.length) {

            this.src =
                `images/products/${encodeURIComponent(product.image)}.${extensions[current]}`;

        } else {

            this.onerror = null;

            this.src =
                "images/products/placeholder.jpg";
        }
    };
}


/* =========================================================
   STARS
========================================================= */

function getStars(rating) {

    const fullStars = Math.floor(Number(rating));
    const hasHalf = Number(rating) % 1 >= 0.5;

    let stars = "";

    for (let i = 0; i < fullStars; i++) {
        stars += "★";
    }

    if (hasHalf && fullStars < 5) {
        stars += "★";
    }

    while (stars.length < 5) {
        stars += "☆";
    }

    return stars;
}


/* =========================================================
   PRODUCT CARD
========================================================= */

function createProductCard(product) {

    const card = document.createElement("article");

    card.className =
        "product-card featured-product-card";

    card.dataset.productId = product.id;

    const wishlist = getWishlist();

    const isWishlisted =
        wishlist.includes(product.id) ||
        wishlist.includes(String(product.id));

    card.innerHTML = `
        <div class="product-image-wrap">

            <a
                href="product.html?id=${product.id}"
                class="product-image-link"
                aria-label="View ${escapeHTML(product.name)}"
            >

                <img
                    class="product-image"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                >

            </a>

            ${
                product.discount
                    ? `
                        <span class="product-discount">
                            -${product.discount}%
                        </span>
                    `
                    : ""
            }

            <button
                type="button"
                class="wishlist-btn ${isWishlisted ? "active" : ""}"
                data-action="wishlist"
                data-id="${product.id}"
                aria-label="Add ${escapeHTML(product.name)} to wishlist"
            >
                ${isWishlisted ? "♥" : "♡"}
            </button>

        </div>


        <div class="product-info">

            <span class="product-category">
                ${escapeHTML(product.category)}
            </span>


            <a
                href="product.html?id=${product.id}"
                class="product-name"
            >
                ${escapeHTML(product.name)}
            </a>


            <div class="product-rating">

                <span class="stars">
                    ${getStars(product.rating)}
                </span>

                <span class="rating-number">
                    ${Number(product.rating).toFixed(1)}
                </span>

                <span class="review-count">
                    (${Number(product.review_count || 0)})
                </span>

            </div>


            <div class="product-price-row">

                <span class="product-price">
                    ${formatPrice(product.price)}
                </span>

                ${
                    product.old_price
                        ? `
                            <span class="product-old-price">
                                ${formatPrice(product.old_price)}
                            </span>
                        `
                        : ""
                }

            </div>


            <div class="product-stock">

                ${
                    Number(product.stock) > 0
                        ? `
                            <span class="in-stock">
                                In Stock
                            </span>
                        `
                        : `
                            <span class="out-stock">
                                Out of Stock
                            </span>
                        `
                }

            </div>


            <button
                type="button"
                class="add-to-cart-btn"
                data-action="cart"
                data-id="${product.id}"
                ${
                    Number(product.stock) <= 0
                        ? "disabled"
                        : ""
                }
            >
                <span>🛒</span>
                Add to Cart
            </button>

        </div>
    `;


    const image =
        card.querySelector(".product-image");

    setImageFallback(image, product);


    return card;
}


/* =========================================================
   RENDER FEATURED PRODUCTS
========================================================= */

function renderFeaturedProducts() {

    const container =
        document.querySelector("#featuredProducts") ||
        document.querySelector(".featured-products-grid") ||
        document.querySelector(".products-grid");

    if (!container) {
        console.warn(
            "Featured Products container was not found."
        );

        return;
    }


    /*
       Remove old loading message.
    */

    const loading =
        container.querySelector(".loading-products");

    if (loading) {
        loading.remove();
    }


    /*
       Clear existing generated products.
    */

    container.innerHTML = "";


    /*
       Homepage displays the first 5 featured products.
    */

    const featuredProducts =
        PRODUCTS.slice(0, 5);


    featuredProducts.forEach(product => {

        container.appendChild(
            createProductCard(product)
        );

    });
}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(productId) {

    const product =
        PRODUCTS.find(
            item => Number(item.id) === Number(productId)
        );

    if (!product) {
        return;
    }


    let cart = getCart();


    const existing =
        cart.find(
            item =>
                Number(item.id) === Number(product.id)
        );


    if (existing) {

        existing.quantity =
            Number(existing.quantity || 1) + 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            old_price: product.old_price,
            image: product.image,
            quantity: 1
        });

    }


    saveCart(cart);

    showToast(
        `${product.name} added to cart`
    );
}


/* =========================================================
   TOGGLE WISHLIST
========================================================= */

function toggleWishlist(productId) {

    let wishlist = getWishlist();

    const numericId = Number(productId);

    const index =
        wishlist.findIndex(
            id => Number(id) === numericId
        );


    if (index !== -1) {

        wishlist.splice(index, 1);

        showToast("Removed from wishlist");

    } else {

        wishlist.push(numericId);

        showToast("Added to wishlist");

    }


    saveWishlist(wishlist);

    updateWishlistButtons();
}


/* =========================================================
   UPDATE WISHLIST BUTTONS
========================================================= */

function updateWishlistButtons() {

    const wishlist = getWishlist();

    document.querySelectorAll(
        '[data-action="wishlist"]'
    ).forEach(button => {

        const id =
            Number(button.dataset.id);

        const active =
            wishlist.some(
                wishlistId =>
                    Number(wishlistId) === id
            );


        button.classList.toggle(
            "active",
            active
        );

        button.textContent =
            active ? "♥" : "♡";

    });
}


/* =========================================================
   BUTTON EVENTS
========================================================= */

function attachProductButtons() {

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-action]"
                );

            if (!button) {
                return;
            }


            const action =
                button.dataset.action;

            const id =
                button.dataset.id;


            if (action === "cart") {

                event.preventDefault();

                addToCart(id);

            }


            if (action === "wishlist") {

                event.preventDefault();

                toggleWishlist(id);

            }

        }
    );
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    let toast =
        document.querySelector(
            "#cartToast"
        );


    if (!toast) {

        toast =
            document.createElement("div");

        toast.id = "cartToast";

        toast.className = "cart-toast";

        document.body.appendChild(toast);
    }


    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(
        window.cartToastTimer
    );


    window.cartToastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);
}


/* =========================================================
   NEWSLETTER
========================================================= */

function setupNewsletter() {

    const forms =
        document.querySelectorAll(
            ".newsletter-form, #newsletterForm"
        );


    forms.forEach(form => {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const input =
                    form.querySelector(
                        "input[type='email']"
                    );

                if (!input || !input.value.trim()) {

                    showToast(
                        "Please enter your email"
                    );

                    return;
                }


                showToast(
                    "Thanks for subscribing!"
                );

                form.reset();

            }
        );

    });
}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const searchInputs =
        document.querySelectorAll(
            'input[type="search"], .search-input'
        );


    searchInputs.forEach(input => {

        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key !== "Enter") {
                    return;
                }


                const query =
                    input.value.trim();


                if (!query) {
                    return;
                }


                window.location.href =
                    `shop.html?search=${encodeURIComponent(query)}`;

            }
        );

    });
}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        updateWishlistCount();

        renderFeaturedProducts();

        attachProductButtons();

        setupNewsletter();

        setupSearch();

        updateWishlistButtons();

    }
);