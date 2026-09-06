"use strict";

/* =========================================================
   CART — PRODUCT PAGE
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
        stock: 25,
        description: "A complete body care set designed for everyday personal care and a fresh, comfortable feel."
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
        stock: 15,
        description: "A stylish classic denim jacket that works perfectly with casual and everyday outfits."
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
        stock: 20,
        description: "A premium dinner set made for everyday meals, family gatherings and special occasions."
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
        stock: 25,
        description: "Compact wireless earbuds delivering convenient everyday listening with a comfortable fit."
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
        stock: 20,
        description: "A practical face care collection for building a simple everyday personal-care routine."
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
        stock: 22,
        description: "A complete hair care set suitable for maintaining a simple and consistent hair-care routine."
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
        stock: 18,
        description: "A stylish leather handbag with a practical design for everyday use."
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
        stock: 14,
        description: "Comfortable wireless headphones designed for music, entertainment and everyday listening."
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
        stock: 20,
        description: "A comfortable premium hoodie suitable for relaxed everyday styling."
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
        stock: 16,
        description: "A sophisticated fragrance option for everyday wear and special occasions."
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
        stock: 30,
        description: "A decorative throw pillow that adds a stylish finishing touch to your living space."
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
        stock: 24,
        description: "A convenient power bank for keeping compatible devices charged while you're on the go."
    },
    {
        id: 13,
        name: "Skincare Essentials",
        category: "Beauty",
        price: 19000,
        old_price: 24000,
        discount: 21,
        image: "skincare",
        rating: 4.6,
        review_count: 20,
        stock: 18,
        description: "Essential skin-care products for maintaining a simple everyday routine."
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
        stock: 15,
        description: "A practical smart watch designed for everyday convenience and connected use."
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
        stock: 20,
        description: "Classic sneakers designed for comfortable everyday wear and casual styling."
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
        stock: 20,
        description: "A wireless Bluetooth speaker for convenient music and entertainment at home or on the go."
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
        stock: 28,
        description: "A useful storage set for keeping your home organised and your belongings neatly arranged."
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
        stock: 17,
        description: "A modern table lamp that works beautifully for bedrooms, study areas and workspaces."
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
        stock: 15,
        description: "A classic wristwatch with a clean design suitable for everyday and smart-casual styling."
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
        stock: 25,
        description: "A decorative wall piece designed to give your room a more finished and stylish appearance."
    }
];


/* =========================================================
   HELPERS
========================================================= */

function formatPrice(price) {
    return "₦" + Number(price).toLocaleString("en-NG");
}


function getStars(rating) {
    const rounded = Math.round(Number(rating));

    return "★".repeat(rounded) +
           "☆".repeat(5 - rounded);
}


function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   IMAGE PATH
   USES THE SAME FOLDER AS HOME + SHOP
========================================================= */

function getImagePaths(product) {

    const filename = product.image;

    return [
        `images/products/${filename}.jpg`,
        `images/products/${filename}.png`,
        `images/products/${filename}.jpeg`,
        `images/products/${filename}.webp`
    ];
}


function loadProductImage(img, product) {

    const paths = getImagePaths(product);

    let current = 0;

    function tryImage() {

        if (current >= paths.length) {

            console.error(
                "Product image not found:",
                product.image
            );

            img.alt = product.name;

            return;
        }

        img.src = paths[current];

        img.onerror = function () {
            current++;
            tryImage();
        };
    }

    tryImage();
}


/* =========================================================
   URL
========================================================= */

function getProductId() {

    const params =
        new URLSearchParams(window.location.search);

    return Number(params.get("id"));
}


function getProduct() {

    const id = getProductId();

    return PRODUCTS.find(
        product => product.id === id
    );
}


/* =========================================================
   CART
========================================================= */

function getCart() {

    try {
        return JSON.parse(
            localStorage.getItem(CART_KEY)
        ) || [];
    } catch {
        return [];
    }
}


function saveCart(cart) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );
}


function updateCartCount() {

    const cart = getCart();

    const count = cart.reduce(
        (total, item) =>
            total +
            Number(
                item.quantity ||
                item.qty ||
                1
            ),
        0
    );

    const counter =
        document.querySelector("#cartCount");

    if (counter) {
        counter.textContent = count;
    }
}


/* =========================================================
   WISHLIST
========================================================= */

function getWishlist() {

    try {
        return JSON.parse(
            localStorage.getItem(WISHLIST_KEY)
        ) || [];
    } catch {
        return [];
    }
}


function saveWishlist(wishlist) {

    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
    );
}


function updateWishlistCount() {

    const wishlist =
        getWishlist();

    const counter =
        document.querySelector("#wishlistCount");

    if (counter) {
        counter.textContent =
            wishlist.length;
    }
}


function updateWishlistButton(product) {

    const button =
        document.querySelector("#productWishlist");

    if (!button) {
        return;
    }

    const wishlist =
        getWishlist();

    const active =
        wishlist.some(
            id => Number(id) === product.id
        );

    button.classList.toggle(
        "active",
        active
    );

    button.textContent =
        active ? "♥" : "♡";
}


function toggleWishlist(product) {

    let wishlist =
        getWishlist();

    const exists =
        wishlist.some(
            id => Number(id) === product.id
        );

    if (exists) {

        wishlist =
            wishlist.filter(
                id => Number(id) !== product.id
            );

        showToast(
            "Removed from wishlist"
        );

    } else {

        wishlist.push(product.id);

        showToast(
            "Added to wishlist"
        );
    }

    saveWishlist(wishlist);

    updateWishlistCount();
    updateWishlistButton(product);
}


/* =========================================================
   RENDER PRODUCT
========================================================= */

function renderProduct(product) {

    const image =
        document.querySelector("#productImage");

    const name =
        document.querySelector("#productName");

    const category =
        document.querySelector("#productCategory");

    const stars =
        document.querySelector("#productStars");

    const rating =
        document.querySelector("#productRating");

    const reviewCount =
        document.querySelector("#productReviewCount");

    const price =
        document.querySelector("#productPrice");

    const oldPrice =
        document.querySelector("#productOldPrice");

    const save =
        document.querySelector("#productSave");

    const description =
        document.querySelector("#productDescription");

    const stock =
        document.querySelector("#productStock");

    const discount =
        document.querySelector("#productDiscount");


    /* IMAGE */

    if (image) {

        loadProductImage(
            image,
            product
        );

        image.alt =
            product.name;
    }


    /* NAME */

    if (name) {
        name.textContent =
            product.name;
    }


    /* CATEGORY */

    if (category) {
        category.textContent =
            product.category;
    }


    /* RATING */

    if (stars) {
        stars.textContent =
            getStars(product.rating);
    }


    if (rating) {
        rating.textContent =
            product.rating.toFixed(1);
    }


    if (reviewCount) {
        reviewCount.textContent =
            `${product.review_count} reviews`;
    }


    /* PRICE */

    if (price) {
        price.textContent =
            formatPrice(product.price);
    }


    if (oldPrice) {
        oldPrice.textContent =
            formatPrice(product.old_price);
    }


    if (save) {

        const saving =
            product.old_price -
            product.price;

        save.textContent =
            `Save ${formatPrice(saving)}`;
    }


    /* DESCRIPTION */

    if (description) {
        description.textContent =
            product.description;
    }


    /* STOCK */

    if (stock) {

        if (product.stock <= 0) {

            stock.textContent =
                "Out of stock";

        } else if (product.stock <= 5) {

            stock.textContent =
                `Only ${product.stock} left`;

        } else {

            stock.textContent =
                `${product.stock} available`;
        }
    }


    /* DISCOUNT */

    if (discount) {

        discount.textContent =
            `-${product.discount}%`;
    }


    /* BREADCRUMB */

    const breadcrumbCategory =
        document.querySelector(
            "#breadcrumbCategory"
        );

    const breadcrumbProduct =
        document.querySelector(
            "#breadcrumbProduct"
        );

    if (breadcrumbCategory) {
        breadcrumbCategory.textContent =
            product.category;
    }

    if (breadcrumbProduct) {
        breadcrumbProduct.textContent =
            product.name;
    }


    /* DESCRIPTION TAB */

    const descriptionText =
        document.querySelector(
            "#descriptionText"
        );

    if (descriptionText) {
        descriptionText.textContent =
            product.description;
    }


    /* LARGE RATING */

    const largeRating =
        document.querySelector(
            "#largeRating"
        );

    const largeStars =
        document.querySelector(
            "#largeStars"
        );

    if (largeRating) {
        largeRating.textContent =
            product.rating.toFixed(1);
    }

    if (largeStars) {
        largeStars.textContent =
            getStars(product.rating);
    }


    /* QUANTITY */

    const quantity =
        document.querySelector(
            "#productQuantity"
        );

    if (quantity) {

        quantity.min = 1;

        quantity.max =
            Math.max(1, product.stock);

        quantity.value =
            product.stock > 0 ? 1 : 0;
    }


    updateWishlistButton(product);

    renderOptions(product);

    renderSimilarProducts(product);

    document.title =
        `${product.name} | CART`;
}


/* =========================================================
   OPTIONS
========================================================= */

function renderOptions(product) {

    const container =
        document.querySelector(
            "#productOptions"
        );

    if (!container) {
        return;
    }

    let html = "";


    if (product.category === "Fashion") {

        html += `
            <div class="product-option-group">

                <span class="product-option-title">
                    Select Size
                </span>

                <div class="product-option-values">

                    ${["S", "M", "L", "XL"]
                        .map(size => `
                            <button
                                type="button"
                                class="product-option-button"
                                data-option="size"
                                data-value="${size}"
                            >
                                ${size}
                            </button>
                        `)
                        .join("")}

                </div>

            </div>
        `;
    }


    if (product.name === "Classic Sneakers") {

        const sizes = [
            21, 22, 23, 24, 25, 26,
            27, 28, 29, 30, 31, 32,
            33, 34, 35, 36, 37, 38,
            39, 40, 41, 42
        ];

        html += `
            <div class="product-option-group">

                <span class="product-option-title">
                    Select Shoe Size
                </span>

                <div class="product-option-values">

                    ${sizes
                        .map(size => `
                            <button
                                type="button"
                                class="product-option-button"
                                data-option="size"
                                data-value="${size}"
                            >
                                ${size}
                            </button>
                        `)
                        .join("")}

                </div>

            </div>
        `;
    }


    if (product.category === "Electronics") {

        html += `
            <div class="product-option-group">

                <span class="product-option-title">
                    Color
                </span>

                <div class="product-option-values">

                    <button
                        type="button"
                        class="product-option-button"
                        data-option="color"
                        data-value="Black"
                    >
                        Black
                    </button>

                    <button
                        type="button"
                        class="product-option-button"
                        data-option="color"
                        data-value="White"
                    >
                        White
                    </button>

                </div>

            </div>
        `;
    }


    container.innerHTML =
        html;


    container
        .querySelectorAll(
            ".product-option-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const option =
                        button.dataset.option;

                    container
                        .querySelectorAll(
                            `[data-option="${option}"]`
                        )
                        .forEach(item => {
                            item.classList.remove(
                                "active"
                            );
                        });

                    button.classList.add(
                        "active"
                    );
                }
            );
        });
}


/* =========================================================
   QUANTITY
========================================================= */

function getQuantity(product) {

    const input =
        document.querySelector(
            "#productQuantity"
        );

    if (!input) {
        return 1;
    }

    let value =
        parseInt(input.value, 10);

    if (!Number.isFinite(value)) {
        value = 1;
    }

    value =
        Math.max(1, value);

    value =
        Math.min(
            value,
            product.stock
        );

    input.value =
        value;

    return value;
}


function setupQuantity(product) {

    const decrease =
        document.querySelector(
            "#decreaseQuantity"
        );

    const increase =
        document.querySelector(
            "#increaseQuantity"
        );

    const input =
        document.querySelector(
            "#productQuantity"
        );


    if (decrease) {

        decrease.addEventListener(
            "click",
            () => {

                const current =
                    getQuantity(product);

                if (current > 1) {
                    input.value =
                        current - 1;
                }
            }
        );
    }


    if (increase) {

        increase.addEventListener(
            "click",
            () => {

                const current =
                    getQuantity(product);

                if (
                    current <
                    product.stock
                ) {
                    input.value =
                        current + 1;
                }
            }
        );
    }


    if (input) {

        input.addEventListener(
            "change",
            () => {
                getQuantity(product);
            }
        );
    }
}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(product) {

    const quantity =
        getQuantity(product);

    if (product.stock <= 0) {

        showToast(
            "This product is out of stock"
        );

        return false;
    }


    let cart =
        getCart();


    const index =
        cart.findIndex(
            item =>
                Number(item.id) ===
                product.id
        );


    if (index >= 0) {

        const existing =
            Number(
                cart[index].quantity ||
                cart[index].qty ||
                0
            );

        const newQuantity =
            Math.min(
                existing + quantity,
                product.stock
            );

        cart[index].quantity =
            newQuantity;

        cart[index].qty =
            newQuantity;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            old_price: product.old_price,
            image: product.image,
            quantity: quantity,
            qty: quantity
        });
    }


    saveCart(cart);

    updateCartCount();

    return true;
}


/* =========================================================
   BUTTONS
========================================================= */

function setupButtons(product) {

    const addButton =
        document.querySelector(
            "#addToCartBtn"
        );

    const buyButton =
        document.querySelector(
            "#buyNowBtn"
        );

    const wishlistButton =
        document.querySelector(
            "#productWishlist"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            () => {

                if (
                    addToCart(product)
                ) {

                    showToast(
                        `${product.name} added to cart`
                    );
                }
            }
        );
    }


    if (buyButton) {

        buyButton.addEventListener(
            "click",
            () => {

                if (
                    addToCart(product)
                ) {

                    window.location.href =
                        "cart.html";
                }
            }
        );
    }


    if (wishlistButton) {

        wishlistButton.addEventListener(
            "click",
            () => {
                toggleWishlist(product);
            }
        );
    }
}


/* =========================================================
   SIMILAR PRODUCTS
========================================================= */

function renderSimilarProducts(product) {

    const container =
        document.querySelector(
            "#similarProducts"
        );

    if (!container) {
        return;
    }


    const similar =
        PRODUCTS
            .filter(item =>
                item.id !== product.id &&
                item.category === product.category
            )
            .slice(0, 4);


    container.innerHTML =
        similar.map(item => {

            return `
                <article
                    class="similar-product-card"
                >

                    <a
                        href="product.html?id=${item.id}"
                        class="similar-product-image"
                    >

                        <img
                            data-similar-id="${item.id}"
                            src=""
                            alt="${escapeHTML(item.name)}"
                        >

                        <span
                            class="similar-product-discount"
                        >
                            -${item.discount}%
                        </span>

                    </a>


                    <div class="similar-product-info">

                        <span
                            class="similar-product-category"
                        >
                            ${escapeHTML(item.category)}
                        </span>


                        <a
                            href="product.html?id=${item.id}"
                            class="similar-product-name"
                        >
                            ${escapeHTML(item.name)}
                        </a>


                        <div
                            class="similar-product-rating"
                        >

                            <span
                                class="similar-product-stars"
                            >
                                ${getStars(item.rating)}
                            </span>

                            <span
                                class="similar-product-rating-number"
                            >
                                ${item.rating}
                            </span>

                        </div>


                        <div>

                            <span
                                class="similar-product-price"
                            >
                                ${formatPrice(item.price)}
                            </span>

                            <span
                                class="similar-product-old-price"
                            >
                                ${formatPrice(item.old_price)}
                            </span>

                        </div>

                    </div>

                </article>
            `;
        })
        .join("");


    container
        .querySelectorAll(
            "[data-similar-id]"
        )
        .forEach(img => {

            const id =
                Number(
                    img.dataset.similarId
                );

            const item =
                PRODUCTS.find(
                    product =>
                        product.id === id
                );

            if (item) {
                loadProductImage(
                    img,
                    item
                );
            }
        });
}


/* =========================================================
   TABS
========================================================= */

function setupTabs() {

    const tabs =
        document.querySelectorAll(
            ".product-tab"
        );

    const contents =
        document.querySelectorAll(
            ".product-tab-content"
        );


    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const target =
                    tab.dataset.tab;


                tabs.forEach(item => {
                    item.classList.remove(
                        "active"
                    );
                });


                contents.forEach(content => {
                    content.classList.remove(
                        "active"
                    );
                });


                tab.classList.add(
                    "active"
                );


                const targetContent =
                    document.querySelector(
                        `#${target}`
                    );


                if (targetContent) {
                    targetContent.classList.add(
                        "active"
                    );
                }
            }
        );
    });
}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const form =
        document.querySelector(
            "#productSearchForm"
        );

    const input =
        document.querySelector(
            "#productSearchInput"
        );


    if (!form || !input) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const search =
                input.value.trim();


            if (!search) {

                window.location.href =
                    "shop.html";

                return;
            }


            window.location.href =
                `shop.html?search=${encodeURIComponent(search)}`;
        }
    );
}


/* =========================================================
   NEWSLETTER
========================================================= */

function setupNewsletter() {

    const form =
        document.querySelector(
            "#newsletterForm"
        );

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const input =
                form.querySelector(
                    "input"
                );


            if (
                !input ||
                !input.value.trim()
            ) {

                showToast(
                    "Enter your email address"
                );

                return;
            }


            showToast(
                "You're subscribed successfully!"
            );

            form.reset();
        }
    );
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.querySelector(
            "#productToast"
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
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );
}


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();

        updateWishlistCount();

        setupSearch();

        setupNewsletter();

        setupTabs();


        const product =
            getProduct();


        if (!product) {

            const details =
                document.querySelector(
                    "#productDetails"
                );

            if (details) {

                details.innerHTML = `
                    <div
                        class="product-loading"
                        style="
                            grid-column:1/-1;
                            min-height:400px;
                            text-align:center;
                        "
                    >
                        <div>
                            <h2>
                                Product not found
                            </h2>

                            <p>
                                This product could not be found.
                            </p>

                            <a
                                href="shop.html"
                                style="
                                    display:inline-block;
                                    margin-top:15px;
                                    padding:12px 20px;
                                    background:#0f6b4f;
                                    color:white;
                                    border-radius:8px;
                                    text-decoration:none;
                                    font-weight:700;
                                "
                            >
                                Back to Shop
                            </a>
                        </div>
                    </div>
                `;
            }

            return;
        }


        renderProduct(product);

        setupQuantity(product);

        setupButtons(product);
    }
);