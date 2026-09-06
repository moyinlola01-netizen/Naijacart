/* =========================================================
   CART — PREMIUM WISHLIST
   Wishlist functionality + local products
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initWishlist();
    initSearch();
    initSorting();
    initNewsletter();
    initHeroButtons();
    initStorageSync();
});


/* =========================================================
   STORAGE
========================================================= */

const WISHLIST_KEY = "nc_wishlist";
const CART_KEY = "nc_cart";
const TOKEN_KEY = "nc_token";

function getArray(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

function saveArray(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


/* =========================================================
   PRODUCTS
========================================================= */

const PRODUCTS = [
    {
        id: 1,
        name: "Body Care Set",
        category: "Beauty",
        price: 15000,
        oldPrice: 18000,
        discount: 17,
        image: "body-care",
        rating: 4.5,
        reviews: 18,
        stock: 25
    },
    {
        id: 2,
        name: "Classic Denim Jacket",
        category: "Fashion",
        price: 32000,
        oldPrice: 40000,
        discount: 20,
        image: "denim-jacket",
        rating: 4.6,
        reviews: 21,
        stock: 15
    },
    {
        id: 3,
        name: "Premium Dinner Set",
        category: "Home",
        price: 25000,
        oldPrice: 30000,
        discount: 17,
        image: "dinner-set",
        rating: 4.5,
        reviews: 24,
        stock: 20
    },
    {
        id: 4,
        name: "Wireless Earbuds",
        category: "Electronics",
        price: 22000,
        oldPrice: 28000,
        discount: 21,
        image: "earbuds",
        rating: 4.4,
        reviews: 32,
        stock: 25
    },
    {
        id: 5,
        name: "Daily Face Care Kit",
        category: "Beauty",
        price: 18000,
        oldPrice: 22000,
        discount: 18,
        image: "face-care",
        rating: 4.5,
        reviews: 16,
        stock: 20
    },
    {
        id: 6,
        name: "Complete Hair Care Set",
        category: "Beauty",
        price: 16000,
        oldPrice: 20000,
        discount: 20,
        image: "hair-care",
        rating: 4.4,
        reviews: 14,
        stock: 22
    },
    {
        id: 7,
        name: "Leather Handbag",
        category: "Fashion",
        price: 28000,
        oldPrice: 35000,
        discount: 20,
        image: "handbag",
        rating: 4.6,
        reviews: 19,
        stock: 18
    },
    {
        id: 8,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 35000,
        oldPrice: 42000,
        discount: 17,
        image: "headphones",
        rating: 4.7,
        reviews: 27,
        stock: 14
    },
    {
        id: 9,
        name: "Premium Hoodie",
        category: "Fashion",
        price: 24000,
        oldPrice: 30000,
        discount: 20,
        image: "hoodie",
        rating: 4.5,
        reviews: 17,
        stock: 20
    },
    {
        id: 10,
        name: "Luxury Perfume",
        category: "Beauty",
        price: 30000,
        oldPrice: 38000,
        discount: 21,
        image: "perfume",
        rating: 4.7,
        reviews: 29,
        stock: 16
    },
    {
        id: 11,
        name: "Decorative Throw Pillow",
        category: "Home",
        price: 12000,
        oldPrice: 15000,
        discount: 20,
        image: "pillow",
        rating: 4.4,
        reviews: 12,
        stock: 30
    },
    {
        id: 12,
        name: "Fast Charge Power Bank",
        category: "Electronics",
        price: 20000,
        oldPrice: 25000,
        discount: 20,
        image: "powerbank",
        rating: 4.5,
        reviews: 23,
        stock: 24
    },
    {
        id: 13,
        name: "Skin Care Essentials",
        category: "Beauty",
        price: 19000,
        oldPrice: 24000,
        discount: 21,
        image: "skin care",
        rating: 4.6,
        reviews: 20,
        stock: 18
    },
    {
        id: 14,
        name: "Smart Watch",
        category: "Electronics",
        price: 18000,
        oldPrice: 22000,
        discount: 18,
        image: "smart watch",
        rating: 4.3,
        reviews: 18,
        stock: 15
    },
    {
        id: 15,
        name: "Classic Sneakers",
        category: "Fashion",
        price: 30000,
        oldPrice: 38000,
        discount: 21,
        image: "sneakers",
        rating: 4.6,
        reviews: 25,
        stock: 20
    },
    {
        id: 16,
        name: "Wireless Bluetooth Speaker",
        category: "Electronics",
        price: 25000,
        oldPrice: 30000,
        discount: 17,
        image: "speaker",
        rating: 4.5,
        reviews: 24,
        stock: 20
    },
    {
        id: 17,
        name: "Storage Set",
        category: "Home",
        price: 14000,
        oldPrice: 18000,
        discount: 22,
        image: "storage set",
        rating: 4.4,
        reviews: 15,
        stock: 28
    },
    {
        id: 18,
        name: "Modern Table Lamp",
        category: "Home",
        price: 17000,
        oldPrice: 22000,
        discount: 23,
        image: "table lamp",
        rating: 4.5,
        reviews: 13,
        stock: 17
    },
    {
        id: 19,
        name: "Classic Wristwatch",
        category: "Fashion",
        price: 27000,
        oldPrice: 34000,
        discount: 21,
        image: "wristwatch",
        rating: 4.6,
        reviews: 22,
        stock: 15
    },
    {
        id: 20,
        name: "Wall Decoration",
        category: "Home",
        price: 13000,
        oldPrice: 17000,
        discount: 24,
        image: "wall decoration",
        rating: 4.5,
        reviews: 11,
        stock: 25
    }
];


/* =========================================================
   HELPERS
========================================================= */

function formatPrice(value) {
    return "₦" + Number(value).toLocaleString("en-NG");
}


function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getProductImage(product) {
    const base =
        `images/products/${encodeURIComponent(product.image)}`;

    return `
        <img
            src="${base}.jpg"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
            onerror="
                if (!this.dataset.tryPng) {
                    this.dataset.tryPng = '1';
                    this.src='${base}.png';
                } else if (!this.dataset.tryJpg) {
                    this.dataset.tryJpg = '1';
                    this.src='${base}.jpeg';
                } else if (!this.dataset.tryWebp) {
                    this.dataset.tryWebp = '1';
                    this.src='${base}.webp';
                }
            "
        >
    `;
}


function getStars(rating) {
    const rounded = Math.round(Number(rating) || 0);

    let stars = "";

    for (let i = 1; i <= 5; i++) {
        stars += i <= rounded ? "★" : "☆";
    }

    return stars;
}


function getWishlistIds() {
    const wishlist = getArray(WISHLIST_KEY);

    return wishlist
        .map(item => {
            if (
                item &&
                typeof item === "object"
            ) {
                return Number(item.id);
            }

            return Number(item);
        })
        .filter(id => Number.isFinite(id) && id > 0);
}


function isInWishlist(id) {
    return getWishlistIds().includes(Number(id));
}


/* =========================================================
   INIT WISHLIST
========================================================= */

function initWishlist() {
    renderWishlist();
    updateCounts();
}


/* =========================================================
   RENDER
========================================================= */

function renderWishlist() {
    const grid =
        document.getElementById("wishlistGrid");

    const emptyState =
        document.getElementById("emptyWishlist");

    const loginState =
        document.getElementById("loginWishlist");

    if (!grid) return;

    const wishlistIds =
        getWishlistIds();

    let wishlistProducts =
        PRODUCTS.filter(product =>
            wishlistIds.includes(Number(product.id))
        );


    /* SEARCH */

    const searchInput =
        document.getElementById("wishlistSearch");

    const searchTerm =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

    if (searchTerm) {
        wishlistProducts =
            wishlistProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
    }


    /* SORT */

    const sortSelect =
        document.getElementById("wishlistSort");

    if (sortSelect) {
        const sortValue =
            sortSelect.value;

        if (sortValue === "price-low") {
            wishlistProducts.sort(
                (a, b) => a.price - b.price
            );
        }

        if (sortValue === "price-high") {
            wishlistProducts.sort(
                (a, b) => b.price - a.price
            );
        }

        if (sortValue === "rating") {
            wishlistProducts.sort(
                (a, b) => b.rating - a.rating
            );
        }

        if (sortValue === "discount") {
            wishlistProducts.sort(
                (a, b) => b.discount - a.discount
            );
        }

        if (sortValue === "name") {
            wishlistProducts.sort(
                (a, b) =>
                    a.name.localeCompare(b.name)
            );
        }
    }


    /* EMPTY */

    if (wishlistProducts.length === 0) {

        grid.innerHTML = "";

        if (emptyState) {
            emptyState.style.display = "block";
        }

        if (loginState) {
            loginState.style.display = "block";
        }

    } else {

        if (emptyState) {
            emptyState.style.display = "none";
        }

        if (loginState) {
            loginState.style.display = "none";
        }

        grid.innerHTML =
            wishlistProducts
                .map(createProductCard)
                .join("");
    }


    updateWishlistSummary(
        wishlistProducts.length
    );

    updateHeroCount();
}


/* =========================================================
   PRODUCT CARD
========================================================= */

function createProductCard(product) {

    const savings =
        Math.max(
            0,
            Number(product.oldPrice) -
            Number(product.price)
        );

    return `
        <article
            class="wishlist-product-card"
            data-product-id="${product.id}"
        >

            <div class="wishlist-product-image">

                <a
                    href="product.html?id=${product.id}"
                >
                    ${getProductImage(product)}
                </a>

                <span class="wishlist-discount">
                    -${product.discount}%
                </span>

                <button
                    class="wishlist-remove"
                    type="button"
                    aria-label="Remove ${escapeHTML(product.name)}"
                    data-remove-wishlist="${product.id}"
                    title="Remove from wishlist"
                >
                    ♥
                </button>

            </div>


            <div class="wishlist-product-info">

                <span class="wishlist-product-category">
                    ${escapeHTML(product.category)}
                </span>


                <a
                    href="product.html?id=${product.id}"
                    class="wishlist-product-name"
                >
                    ${escapeHTML(product.name)}
                </a>


                <div class="wishlist-product-rating">

                    <span class="wishlist-stars">
                        ${getStars(product.rating)}
                    </span>

                    <span class="wishlist-review-count">
                        ${product.rating} · ${product.reviews} reviews
                    </span>

                </div>


                <div class="wishlist-price-row">

                    <span class="wishlist-price">
                        ${formatPrice(product.price)}
                    </span>

                    <span class="wishlist-old-price">
                        ${formatPrice(product.oldPrice)}
                    </span>

                </div>


                <div class="wishlist-save">
                    Save ${formatPrice(savings)}
                </div>


                <div class="wishlist-card-actions">

                    <button
                        type="button"
                        class="wishlist-add-cart"
                        data-add-cart="${product.id}"
                    >
                        Add to Cart
                    </button>

                    <a
                        href="product.html?id=${product.id}"
                        class="wishlist-view"
                        title="View Product"
                        aria-label="View ${escapeHTML(product.name)}"
                    >
                        →
                    </a>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   CLICK HANDLING
========================================================= */

document.addEventListener("click", event => {

    const removeButton =
        event.target.closest(
            "[data-remove-wishlist]"
        );

    if (removeButton) {

        const id =
            Number(
                removeButton.dataset.removeWishlist
            );

        removeFromWishlist(id);

        return;
    }


    const addButton =
        event.target.closest(
            "[data-add-cart]"
        );

    if (addButton) {

        const id =
            Number(
                addButton.dataset.addCart
            );

        addToCart(id);

        return;
    }

});


/* =========================================================
   REMOVE FROM WISHLIST
========================================================= */

function removeFromWishlist(id) {

    let wishlist =
        getArray(WISHLIST_KEY);

    wishlist =
        wishlist.filter(item => {

            if (
                item &&
                typeof item === "object"
            ) {
                return Number(item.id) !== Number(id);
            }

            return Number(item) !== Number(id);
        });


    saveArray(
        WISHLIST_KEY,
        wishlist
    );


    renderWishlist();
    updateCounts();


    const product =
        PRODUCTS.find(
            item =>
                Number(item.id) === Number(id)
        );


    showToast(
        product
            ? `${product.name} removed from wishlist.`
            : "Removed from wishlist."
    );
}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(id) {

    const product =
        PRODUCTS.find(
            item =>
                Number(item.id) === Number(id)
        );


    if (!product) {
        showToast(
            "Product could not be found."
        );
        return;
    }


    if (Number(product.stock) <= 0) {
        showToast(
            "This product is currently out of stock."
        );
        return;
    }


    let cart =
        getArray(CART_KEY);


    const existing =
        cart.find(item =>
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
            oldPrice: product.oldPrice,
            image: product.image,
            quantity: 1
        });

    }


    saveArray(
        CART_KEY,
        cart
    );


    updateCounts();


    showToast(
        `${product.name} added to cart.`
    );
}


/* =========================================================
   COUNTS
========================================================= */

function updateCounts() {

    const cart =
        getArray(CART_KEY);

    const wishlist =
        getArray(WISHLIST_KEY);


    let cartQuantity = 0;


    cart.forEach(item => {

        cartQuantity +=
            Number(item.quantity || 1);

    });


    const cartCount =
        document.getElementById("cartCount");


    if (cartCount) {

        cartCount.textContent =
            cartQuantity;

        cartCount.style.display =
            cartQuantity > 0
                ? "inline-flex"
                : "none";
    }


    const wishlistCount =
        document.getElementById(
            "wishlistCount"
        );


    if (wishlistCount) {
        wishlistCount.textContent =
            wishlist.length;
    }


    updateHeroCount();
}


function updateHeroCount() {

    const count =
        getWishlistIds().length;


    const heroCount =
        document.getElementById(
            "wishlistCountHero"
        );


    if (heroCount) {
        heroCount.textContent =
            count;
    }
}


function updateWishlistSummary(
    visibleCount
) {

    const summary =
        document.getElementById(
            "wishlistSummary"
        );


    if (!summary) return;


    const total =
        getWishlistIds().length;


    if (total === 0) {

        summary.textContent =
            "No saved products yet.";

        return;
    }


    if (visibleCount !== total) {

        summary.textContent =
            `Showing ${visibleCount} of ${total} saved products`;

        return;
    }


    summary.textContent =
        `${total} saved product${total === 1 ? "" : "s"}`;
}


/* =========================================================
   SEARCH
========================================================= */

function initSearch() {

    const input =
        document.getElementById(
            "wishlistSearch"
        );


    if (!input) return;


    input.addEventListener(
        "input",
        () => {
            renderWishlist();
        }
    );
}


/* =========================================================
   SORTING
========================================================= */

function initSorting() {

    const select =
        document.getElementById(
            "wishlistSort"
        );


    if (!select) return;


    select.addEventListener(
        "change",
        () => {
            renderWishlist();
        }
    );
}


/* =========================================================
   HERO BUTTONS
========================================================= */

function initHeroButtons() {

    const shopButtons =
        document.querySelectorAll(
            '[href="shop.html"], [data-shop-link]'
        );


    shopButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {
                window.location.href =
                    "shop.html";
            }
        );

    });
}


/* =========================================================
   NEWSLETTER
========================================================= */

function initNewsletter() {

    const form =
        document.getElementById(
            "wishlistNewsletter"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const input =
                document.getElementById(
                    "newsletterEmail"
                );


            if (!input) return;


            const email =
                input.value
                    .trim()
                    .toLowerCase();


            if (!email) {

                showToast(
                    "Please enter your email address."
                );

                input.focus();

                return;
            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                showToast(
                    "Please enter a valid email address."
                );

                input.focus();

                return;
            }


            let subscribers =
                getArray("nc_newsletter");


            if (!subscribers.includes(email)) {

                subscribers.push(email);

                saveArray(
                    "nc_newsletter",
                    subscribers
                );
            }


            input.value = "";


            showToast(
                "You're subscribed. Welcome to CART!"
            );

        }
    );
}


/* =========================================================
   SMOOTH SCROLL
========================================================= */

document.addEventListener(
    "click",
    event => {

        const link =
            event.target.closest(
                'a[href^="#"]'
            );


        if (!link) return;


        const targetId =
            link.getAttribute("href");


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


        if (!target) return;


        event.preventDefault();


        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

    const toast =
        document.getElementById(
            "wishlistToast"
        );


    if (!toast) return;


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
            2600
        );
}


/* =========================================================
   STORAGE / TAB SYNC
========================================================= */

function initStorageSync() {

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key === WISHLIST_KEY ||
                event.key === CART_KEY
            ) {
                renderWishlist();
                updateCounts();
            }

        }
    );


    document.addEventListener(
        "visibilitychange",
        () => {

            if (!document.hidden) {
                renderWishlist();
                updateCounts();
            }

        }
    );
}


/* =========================================================
   LOGIN BUTTON SUPPORT
========================================================= */

function isLoggedIn() {

    return Boolean(
        localStorage.getItem(
            TOKEN_KEY
        )
    );
}


/* =========================================================
   INITIAL COUNT
========================================================= */

updateCounts();