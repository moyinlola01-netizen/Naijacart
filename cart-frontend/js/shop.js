/* =========================================================
   CART — SHOP PAGE JAVASCRIPT
   Full Marketplace Functionality
========================================================= */

"use strict";


/* =========================================================
   STORAGE
========================================================= */

const CART_KEY = "nc_cart";
const WISHLIST_KEY = "nc_wishlist";


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

let filteredProducts = [...PRODUCTS];

let currentPage = 1;

const PRODUCTS_PER_PAGE = 12;

let activeCategory = "all";
let activePrice = "all";
let activeRating = "all";
let activeSearch = "";



/* =========================================================
   HELPERS
========================================================= */

function formatPrice(price) {
    return "₦" + Number(price).toLocaleString("en-NG");
}


function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getCart() {

    try {

        const cart =
            JSON.parse(
                localStorage.getItem(CART_KEY)
            );

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        return [];
    }
}


function saveCart(cart) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();
}


function getWishlist() {

    try {

        const wishlist =
            JSON.parse(
                localStorage.getItem(WISHLIST_KEY)
            );

        return Array.isArray(wishlist)
            ? wishlist
            : [];

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


function updateCartCount() {

    const cart = getCart();

    const count =
        cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 1),
            0
        );

    document.querySelectorAll(
        "#cartCount, .cart-count, [data-cart-count]"
    ).forEach(element => {

        element.textContent = count;

    });
}


function updateWishlistCount() {

    const wishlist = getWishlist();

    document.querySelectorAll(
        "#wishlistCount, .wishlist-count, [data-wishlist-count]"
    ).forEach(element => {

        element.textContent = wishlist.length;

    });
}


function stars(rating) {

    const rounded =
        Math.round(Number(rating));

    let output = "";

    for (let i = 1; i <= 5; i++) {

        output +=
            i <= rounded
                ? "★"
                : "☆";
    }

    return output;
}


function imageCandidates(product) {

    const name =
        encodeURIComponent(product.image);

    return [
        `images/products/${name}.jpg`,
        `images/products/${name}.png`,
        `images/products/${name}.jpeg`,
        `images/products/${name}.webp`
    ];
}


/* =========================================================
   PRODUCT IMAGE
========================================================= */

function setProductImage(img, product) {

    const sources =
        imageCandidates(product);

    let index = 0;

    img.src = sources[index];

    img.onerror = function () {

        index++;

        if (index < sources.length) {

            img.src = sources[index];

        } else {

            img.onerror = null;

            img.src =
                "images/products/placeholder.jpg";
        }
    };
}


/* =========================================================
   PRODUCT CARD
========================================================= */

function createProductCard(product) {

    const wishlist =
        getWishlist();

    const isWishlisted =
        wishlist.some(
            id =>
                Number(id) === Number(product.id)
        );


    const card =
        document.createElement("article");

    card.className =
        "shop-product-card";


    card.dataset.productId =
        product.id;


    card.innerHTML = `
        <div class="shop-product-image">

            <a href="product.html?id=${product.id}">

                <img
                    class="shop-product-img"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                >

            </a>


            <span class="shop-discount-badge">
                -${product.discount}%
            </span>


            <button
                type="button"
                class="shop-wishlist-btn ${isWishlisted ? "active" : ""}"
                data-shop-action="wishlist"
                data-id="${product.id}"
                aria-label="Wishlist"
            >
                ${isWishlisted ? "♥" : "♡"}
            </button>

        </div>


        <div class="shop-product-info">

            <span class="shop-product-category">
                ${escapeHTML(product.category)}
            </span>


            <a
                href="product.html?id=${product.id}"
                class="shop-product-name"
            >
                ${escapeHTML(product.name)}
            </a>


            <div class="shop-rating">

                <span class="shop-stars">
                    ${stars(product.rating)}
                </span>

                <span class="shop-rating-number">
                    ${Number(product.rating).toFixed(1)}
                </span>

                <span class="shop-review-count">
                    (${product.review_count})
                </span>

            </div>


            <div class="shop-price-row">

                <span class="shop-price">
                    ${formatPrice(product.price)}
                </span>

                <span class="shop-old-price">
                    ${formatPrice(product.old_price)}
                </span>

            </div>


            <div class="
                shop-stock
                ${
                    product.stock <= 5
                        ? "low-stock"
                        : product.stock > 0
                            ? "in-stock"
                            : "out-stock"
                }
            ">

                ${
                    product.stock <= 0
                        ? "Out of stock"
                        : product.stock <= 5
                            ? `Only ${product.stock} left`
                            : "In stock"
                }

            </div>


            <button
                type="button"
                class="shop-add-cart"
                data-shop-action="cart"
                data-id="${product.id}"
                ${product.stock <= 0 ? "disabled" : ""}
            >
                🛒 Add to Cart
            </button>

        </div>
    `;


    const image =
        card.querySelector(
            ".shop-product-img"
        );

    setProductImage(
        image,
        product
    );


    return card;
}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {

    const container =
        document.getElementById(
            "shopProducts"
        );

    const empty =
        document.getElementById(
            "emptyProducts"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!filteredProducts.length) {

        if (empty) {
            empty.hidden = false;
        }

        renderPagination();

        updateProductCount();

        return;
    }


    if (empty) {
        empty.hidden = true;
    }


    const start =
        (currentPage - 1) *
        PRODUCTS_PER_PAGE;


    const end =
        start +
        PRODUCTS_PER_PAGE;


    const productsToShow =
        filteredProducts.slice(
            start,
            end
        );


    productsToShow.forEach(product => {

        container.appendChild(
            createProductCard(product)
        );

    });


    updateProductCount();

    renderPagination();

    updateWishlistButtons();
}


/* =========================================================
   PRODUCT COUNT
========================================================= */

function updateProductCount() {

    const count =
        document.getElementById(
            "productCount"
        );

    if (count) {

        count.textContent =
            filteredProducts.length;

    }


    const description =
        document.getElementById(
            "resultsDescription"
        );

    if (description) {

        if (activeSearch) {

            description.textContent =
                `Search results for "${activeSearch}"`;

        } else if (
            activeCategory !== "all"
        ) {

            description.textContent =
                `Showing ${activeCategory} products.`;

        } else {

            description.textContent =
                "Discover products selected for you.";

        }
    }
}


/* =========================================================
   FILTER PRODUCTS
========================================================= */

function applyFilters() {

    filteredProducts =
        PRODUCTS.filter(product => {


            /* SEARCH */

            if (activeSearch) {

                const searchText =
                    activeSearch.toLowerCase();


                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(searchText) ||

                    product.category
                        .toLowerCase()
                        .includes(searchText);


                if (!matchesSearch) {
                    return false;
                }
            }


            /* CATEGORY */

            if (
                activeCategory !== "all" &&
                product.category !== activeCategory
            ) {

                return false;
            }


            /* PRICE */

            if (activePrice === "under15") {

                if (product.price >= 15000) {
                    return false;
                }
            }


            if (activePrice === "15to25") {

                if (
                    product.price < 15000 ||
                    product.price > 25000
                ) {

                    return false;
                }
            }


            if (activePrice === "25to40") {

                if (
                    product.price < 25000 ||
                    product.price > 40000
                ) {

                    return false;
                }
            }


            if (activePrice === "over40") {

                if (product.price <= 40000) {
                    return false;
                }
            }


            /* RATING */

            if (
                activeRating !== "all" &&
                product.rating <
                Number(activeRating)
            ) {

                return false;
            }


            return true;

        });


    currentPage = 1;

    renderProducts();
}


/* =========================================================
   SORT
========================================================= */

function sortProducts(value) {

    switch (value) {

        case "newest":

            filteredProducts.sort(
                (a, b) =>
                    Number(b.id) -
                    Number(a.id)
            );

            break;


        case "price-low":

            filteredProducts.sort(
                (a, b) =>
                    a.price -
                    b.price
            );

            break;


        case "price-high":

            filteredProducts.sort(
                (a, b) =>
                    b.price -
                    a.price
            );

            break;


        case "rating":

            filteredProducts.sort(
                (a, b) =>
                    b.rating -
                    a.rating
            );

            break;


        case "discount":

            filteredProducts.sort(
                (a, b) =>
                    b.discount -
                    a.discount
            );

            break;


        default:

            filteredProducts =
                PRODUCTS.filter(
                    product =>
                        matchesCurrentFilters(
                            product
                        )
                );

            break;
    }


    currentPage = 1;

    renderProducts();
}


/* =========================================================
   CHECK CURRENT FILTERS
========================================================= */

function matchesCurrentFilters(product) {

    if (activeSearch) {

        const text =
            activeSearch.toLowerCase();

        if (
            !product.name
                .toLowerCase()
                .includes(text) &&

            !product.category
                .toLowerCase()
                .includes(text)
        ) {

            return false;
        }
    }


    if (
        activeCategory !== "all" &&
        product.category !== activeCategory
    ) {

        return false;
    }


    if (activePrice === "under15") {

        if (product.price >= 15000) {
            return false;
        }
    }


    if (activePrice === "15to25") {

        if (
            product.price < 15000 ||
            product.price > 25000
        ) {

            return false;
        }
    }


    if (activePrice === "25to40") {

        if (
            product.price < 25000 ||
            product.price > 40000
        ) {

            return false;
        }
    }


    if (activePrice === "over40") {

        if (product.price <= 40000) {
            return false;
        }
    }


    if (
        activeRating !== "all" &&
        product.rating <
        Number(activeRating)
    ) {

        return false;
    }


    return true;
}


/* =========================================================
   PAGINATION
========================================================= */

function renderPagination() {

    const pagination =
        document.getElementById(
            "shopPagination"
        );


    if (!pagination) {
        return;
    }


    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            filteredProducts.length /
            PRODUCTS_PER_PAGE
        );


    if (totalPages <= 1) {
        return;
    }


    const previous =
        document.createElement("button");

    previous.textContent = "‹";

    previous.disabled =
        currentPage === 1;


    previous.addEventListener(
        "click",
        function () {

            if (currentPage > 1) {

                currentPage--;

                renderProducts();

                scrollToProducts();
            }

        }
    );


    pagination.appendChild(previous);


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            page;


        button.className =
            page === currentPage
                ? "active"
                : "";


        button.addEventListener(
            "click",
            function () {

                currentPage = page;

                renderProducts();

                scrollToProducts();

            }
        );


        pagination.appendChild(button);
    }


    const next =
        document.createElement("button");

    next.textContent = "›";

    next.disabled =
        currentPage === totalPages;


    next.addEventListener(
        "click",
        function () {

            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                renderProducts();

                scrollToProducts();
            }

        }
    );


    pagination.appendChild(next);
}


/* =========================================================
   SCROLL
========================================================= */

function scrollToProducts() {

    const section =
        document.getElementById(
            "products"
        );

    if (section) {

        window.scrollTo({
            top:
                section.offsetTop - 100,
            behavior: "smooth"
        });

    }
}


/* =========================================================
   CART
========================================================= */

function addToCart(productId) {

    const product =
        PRODUCTS.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );


    if (!product) {
        return;
    }


    if (product.stock <= 0) {

        showToast(
            "This product is out of stock."
        );

        return;
    }


    let cart =
        getCart();


    const existing =
        cart.find(
            item =>
                Number(item.id) ===
                Number(product.id)
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
   WISHLIST
========================================================= */

function toggleWishlist(productId) {

    let wishlist =
        getWishlist();


    const id =
        Number(productId);


    const index =
        wishlist.findIndex(
            item =>
                Number(item) === id
        );


    if (index >= 0) {

        wishlist.splice(
            index,
            1
        );

        showToast(
            "Removed from wishlist"
        );

    } else {

        wishlist.push(id);

        showToast(
            "Added to wishlist"
        );

    }


    saveWishlist(wishlist);

    updateWishlistButtons();
}


/* =========================================================
   WISHLIST BUTTONS
========================================================= */

function updateWishlistButtons() {

    const wishlist =
        getWishlist();


    document.querySelectorAll(
        '[data-shop-action="wishlist"]'
    ).forEach(button => {

        const id =
            Number(button.dataset.id);


        const active =
            wishlist.some(
                item =>
                    Number(item) === id
            );


        button.classList.toggle(
            "active",
            active
        );


        button.textContent =
            active
                ? "♥"
                : "♡";

    });
}


/* =========================================================
   EVENT HANDLERS
========================================================= */

function setupProductActions() {

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-shop-action]"
                );


            if (!button) {
                return;
            }


            const action =
                button.dataset.shopAction;


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
   SEARCH
========================================================= */

function setupSearch() {

    const form =
        document.getElementById(
            "shopSearchForm"
        );


    const input =
        document.getElementById(
            "shopSearchInput"
        );


    if (!form || !input) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            activeSearch =
                input.value.trim();


            applyFilters();


            scrollToProducts();

        }
    );
}


/* =========================================================
   URL PARAMETERS
========================================================= */

function readURLParameters() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        params.get("category");


    const search =
        params.get("search");


    if (category) {

        const validCategories = [
            "Electronics",
            "Fashion",
            "Home",
            "Beauty"
        ];


        if (
            validCategories.includes(
                category
            )
        ) {

            activeCategory =
                category;


            const radio =
                document.querySelector(
                    `input[name="category"][value="${category}"]`
                );


            if (radio) {
                radio.checked = true;
            }
        }
    }


    if (search) {

        activeSearch =
            search;


        const input =
            document.getElementById(
                "shopSearchInput"
            );


        if (input) {
            input.value = search;
        }
    }
}


/* =========================================================
   FILTER CONTROLS
========================================================= */

function setupFilters() {

    document.querySelectorAll(
        'input[name="category"]'
    ).forEach(input => {

        input.addEventListener(
            "change",
            function () {

                activeCategory =
                    this.value;

                applyFilters();

            }
        );

    });


    document.querySelectorAll(
        'input[name="price"]'
    ).forEach(input => {

        input.addEventListener(
            "change",
            function () {

                activePrice =
                    this.value;

                applyFilters();

            }
        );

    });


    document.querySelectorAll(
        'input[name="rating"]'
    ).forEach(input => {

        input.addEventListener(
            "change",
            function () {

                activeRating =
                    this.value;

                applyFilters();

            }
        );

    });


    const clear =
        document.getElementById(
            "clearFilters"
        );


    if (clear) {

        clear.addEventListener(
            "click",
            clearFilters
        );

    }


    const apply =
        document.getElementById(
            "applyFilters"
        );


    if (apply) {

        apply.addEventListener(
            "click",
            function () {

                applyFilters();

                closeMobileFilters();

            }
        );

    }


    const reset =
        document.getElementById(
            "resetShop"
        );


    if (reset) {

        reset.addEventListener(
            "click",
            clearFilters
        );

    }
}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function clearFilters() {

    activeCategory = "all";

    activePrice = "all";

    activeRating = "all";

    activeSearch = "";


    document.querySelectorAll(
        'input[name="category"]'
    ).forEach(input => {

        input.checked =
            input.value === "all";

    });


    document.querySelectorAll(
        'input[name="price"]'
    ).forEach(input => {

        input.checked =
            input.value === "all";

    });


    document.querySelectorAll(
        'input[name="rating"]'
    ).forEach(input => {

        input.checked =
            input.value === "all";

    });


    const searchInput =
        document.getElementById(
            "shopSearchInput"
        );


    if (searchInput) {
        searchInput.value = "";
    }


    const sort =
        document.getElementById(
            "sortProducts"
        );


    if (sort) {
        sort.value = "featured";
    }


    filteredProducts =
        [...PRODUCTS];


    currentPage = 1;


    renderProducts();

    closeMobileFilters();

    updateURL();
}


/* =========================================================
   SORT CONTROL
========================================================= */

function setupSort() {

    const sort =
        document.getElementById(
            "sortProducts"
        );


    if (!sort) {
        return;
    }


    sort.addEventListener(
        "change",
        function () {

            sortProducts(
                this.value
            );

        }
    );
}


/* =========================================================
   MOBILE FILTER
========================================================= */

function setupMobileFilters() {

    const button =
        document.getElementById(
            "mobileFilterBtn"
        );


    const sidebar =
        document.getElementById(
            "shopSidebar"
        );


    if (!button || !sidebar) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

            sidebar.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );
}


function closeMobileFilters() {

    const sidebar =
        document.getElementById(
            "shopSidebar"
        );


    if (
        sidebar &&
        window.innerWidth <= 850
    ) {

        sidebar.classList.remove(
            "open"
        );

    }
}


/* =========================================================
   DEALS
========================================================= */

function renderDeals() {

    const container =
        document.getElementById(
            "dealProducts"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const deals =
        [...PRODUCTS]
            .sort(
                (a, b) =>
                    b.discount -
                    a.discount
            )
            .slice(0, 4);


    deals.forEach(product => {

        const card =
            document.createElement(
                "a"
            );


        card.href =
            `product.html?id=${product.id}`;


        card.className =
            "deal-card";


        card.innerHTML = `
            <small>
                SAVE ${product.discount}%
            </small>

            <h3>
                ${escapeHTML(product.name)}
            </h3>

            <p>
                Now ${formatPrice(product.price)}
            </p>
        `;


        container.appendChild(card);

    });
}


/* =========================================================
   NEWSLETTER
========================================================= */

function setupNewsletter() {

    const form =
        document.getElementById(
            "newsletterForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const input =
                form.querySelector(
                    "input[type='email']"
                );


            if (
                !input ||
                !input.value.trim()
            ) {

                showToast(
                    "Please enter your email."
                );

                return;
            }


            showToast(
                "Thanks for subscribing!"
            );


            form.reset();

        }
    );
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "shopToast"
        );


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.shopToastTimer
    );


    window.shopToastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );
}


/* =========================================================
   UPDATE URL
========================================================= */

function updateURL() {

    const params =
        new URLSearchParams();


    if (
        activeCategory !== "all"
    ) {

        params.set(
            "category",
            activeCategory
        );

    }


    if (activeSearch) {

        params.set(
            "search",
            activeSearch
        );

    }


    const query =
        params.toString();


    const newURL =
        query
            ? `${window.location.pathname}?${query}`
            : window.location.pathname;


    window.history.replaceState(
        {},
        "",
        newURL
    );
}


/* =========================================================
   CATEGORY STRIP ACTIVE STATE
========================================================= */

function updateCategoryStrip() {

    document.querySelectorAll(
        ".category-strip-item"
    ).forEach(item => {

        item.classList.remove(
            "active"
        );


        const href =
            item.getAttribute(
                "href"
            );


        if (!href) {
            return;
        }


        if (
            activeCategory === "all" &&
            href === "shop.html"
        ) {

            item.classList.add(
                "active"
            );

        }


        if (
            activeCategory !== "all" &&
            href.includes(
                `category=${encodeURIComponent(activeCategory)}`
            )
        ) {

            item.classList.add(
                "active"
            );

        }

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

        readURLParameters();

        setupSearch();

        setupFilters();

        setupSort();

        setupProductActions();

        setupMobileFilters();

        setupNewsletter();

        renderDeals();

        applyFilters();

        updateCategoryStrip();

    }
);