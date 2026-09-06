/* =========================================================
   PRODUCT DETAILS — CART
   product.js
   Product details + cart + wishlist
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initProductPage();
});


/* =========================================================
   STATE
========================================================= */

const PRODUCT_STATE = {
    product: null,
    quantity: 1,
    selectedSize: "",
    selectedColor: "",
    cart: []
};


/* =========================================================
   INITIALIZE
========================================================= */

async function initProductPage() {
    const productId =
        new URLSearchParams(
            window.location.search
        ).get("id");

    if (!productId) {
        showProductError(
            "Product not found."
        );
        return;
    }

    setupProductEvents();

    await loadProduct(
        productId
    );
}


/* =========================================================
   LOAD PRODUCT
========================================================= */

async function loadProduct(id) {
    showProductLoading();

    try {
        const response =
            await CartAPI.getProduct(id);

        const product =
            response?.product ||
            response?.data?.product ||
            response?.data ||
            response;

        if (!product || !product.id) {
            throw new Error(
                "Product not found."
            );
        }

        PRODUCT_STATE.product =
            product;

        renderProduct(product);

        await loadSimilarProducts(
            product
        );

        await checkWishlist(
            product.id
        );

    } catch (error) {
        console.error(
            "Could not load product:",
            error
        );

        showProductError(
            error.message ||
            "Could not load this product."
        );
    }
}


/* =========================================================
   RENDER PRODUCT
========================================================= */

function renderProduct(product) {
    setText(
        [
            "#productCategory",
            ".product-category"
        ],
        product.category ||
        "Product"
    );

    setText(
        [
            "#productName",
            ".product-name"
        ],
        product.name ||
        "Product"
    );

    setText(
        [
            "#productDescription",
            ".product-description"
        ],
        product.description ||
        "No description available."
    );

    setText(
        [
            "#productPrice",
            ".product-price"
        ],
        formatCurrency(
            product.price
        )
    );

    setText(
        [
            "#productOldPrice",
            ".product-old-price"
        ],
        product.old_price
            ? formatCurrency(
                product.old_price
            )
            : ""
    );

    setText(
        [
            "#productStock",
            ".product-stock"
        ],
        getStockText(product)
    );

    setText(
        [
            "#reviewCount",
            ".review-count"
        ],
        `(${Number(
            product.review_count || 0
        )} reviews)`
    );

    renderRating(
        product.rating
    );

    renderDiscount(
        product
    );

    renderMainImage(
        product
    );

    renderGallery(
        product
    );

    renderSizes(
        product
    );

    renderColors(
        product
    );

    updateQuantityDisplay();

    updateProductButtons(
        product
    );

    document.title =
        `${product.name} — CART`;
}


/* =========================================================
   STOCK
========================================================= */

function getStockText(product) {
    const stock =
        Number(product.stock);

    if (!Number.isFinite(stock)) {
        return "In stock";
    }

    if (stock <= 0) {
        return "Out of stock";
    }

    if (stock <= 5) {
        return `Only ${stock} left`;
    }

    return `${stock} in stock`;
}


function isOutOfStock(product) {
    return Number(
        product.stock
    ) <= 0;
}


/* =========================================================
   RATING
========================================================= */

function renderRating(rating) {
    const value =
        Number(rating) || 0;

    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (value >= i) {
            stars.push("★");
        } else if (value >= i - 0.5) {
            stars.push("★");
        } else {
            stars.push("☆");
        }
    }

    const html =
        stars.join("");

    document
        .querySelectorAll(
            "#productRating, .product-rating, .rating-stars"
        )
        .forEach(element => {
            element.innerHTML =
                html;
        });

    setText(
        [
            "#ratingValue",
            ".rating-value"
        ],
        value
            ? value.toFixed(1)
            : "0.0"
    );
}


/* =========================================================
   DISCOUNT
========================================================= */

function renderDiscount(product) {
    const element =
        findElement([
            "#productDiscount",
            ".product-discount"
        ]);

    if (!element) {
        return;
    }

    let discount =
        Number(product.discount) || 0;

    if (
        !discount &&
        Number(product.old_price) >
        Number(product.price)
    ) {
        discount =
            Math.round(
                (
                    (
                        Number(product.old_price) -
                        Number(product.price)
                    ) /
                    Number(product.old_price)
                ) * 100
            );
    }

    if (discount > 0) {
        element.textContent =
            `-${discount}%`;

        element.style.display =
            "";
    } else {
        element.style.display =
            "none";
    }
}


/* =========================================================
   MAIN IMAGE
========================================================= */

function renderMainImage(product) {
    const image =
        getImageURL(
            product.image
        );

    const main =
        findElement([
            "#mainProductImage",
            "#productImage",
            ".main-product-image img",
            ".product-main-image img"
        ]);

    if (!main) {
        return;
    }

    main.src =
        image;

    main.alt =
        product.name ||
        "Product";
}


/* =========================================================
   GALLERY
========================================================= */

function renderGallery(product) {
    const container =
        findElement([
            "#productGallery",
            "#productThumbnails",
            ".product-thumbnails",
            ".product-gallery"
        ]);

    if (!container) {
        return;
    }

    const images =
        getProductImages(
            product
        );

    if (!images.length) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML =
        images.map(
            (image, index) => `
                <button
                    type="button"
                    class="product-thumbnail ${
                        index === 0
                            ? "active"
                            : ""
                    }"
                    data-image="${escapeAttribute(
                        getImageURL(image)
                    )}"
                >
                    <img
                        src="${escapeAttribute(
                            getImageURL(image)
                        )}"
                        alt="${escapeHTML(
                            product.name || "Product"
                        )}"
                        onerror="this.style.display='none'"
                    >
                </button>
            `
        ).join("");
}


function getProductImages(product) {
    const images = [];

    if (product.image) {
        images.push(
            product.image
        );
    }

    if (Array.isArray(product.images)) {
        product.images.forEach(image => {
            if (
                image &&
                !images.includes(image)
            ) {
                images.push(image);
            }
        });
    }

    return images;
}


/* =========================================================
   SIZES
========================================================= */

function renderSizes(product) {
    const container =
        findElement([
            "#productSizes",
            "#sizeOptions",
            ".size-options"
        ]);

    if (!container) {
        return;
    }

    let sizes =
        product.sizes ||
        product.available_sizes ||
        [];

    if (
        typeof sizes === "string"
    ) {
        try {
            sizes =
                JSON.parse(sizes);
        } catch {
            sizes =
                sizes
                    .split(",")
                    .map(size =>
                        size.trim()
                    )
                    .filter(Boolean);
        }
    }

    if (!Array.isArray(sizes)) {
        sizes = [];
    }

    /*
     * Shoe products can use the requested
     * 21–42 size range.
     */
    const category =
        String(
            product.category || ""
        ).toLowerCase();

    const name =
        String(
            product.name || ""
        ).toLowerCase();

    const isShoe =
        category.includes("shoe") ||
        category.includes("footwear") ||
        name.includes("shoe") ||
        name.includes("sneaker");

    if (
        !sizes.length &&
        isShoe
    ) {
        sizes =
            Array.from(
                { length: 22 },
                (_, index) =>
                    index + 21
            );
    }

    if (!sizes.length) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML =
        sizes.map(size => `
            <button
                type="button"
                class="size-option"
                data-size="${escapeAttribute(
                    size
                )}"
            >
                ${escapeHTML(size)}
            </button>
        `).join("");
}


/* =========================================================
   COLORS
========================================================= */

function renderColors(product) {
    const container =
        findElement([
            "#productColors",
            "#colorOptions",
            ".color-options"
        ]);

    if (!container) {
        return;
    }

    let colors =
        product.colors ||
        product.available_colors ||
        [];

    if (
        typeof colors === "string"
    ) {
        try {
            colors =
                JSON.parse(colors);
        } catch {
            colors =
                colors
                    .split(",")
                    .map(color =>
                        color.trim()
                    )
                    .filter(Boolean);
        }
    }

    if (!Array.isArray(colors)) {
        colors = [];
    }

    if (!colors.length) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML =
        colors.map(color => `
            <button
                type="button"
                class="color-option"
                data-color="${escapeAttribute(
                    color
                )}"
                title="${escapeAttribute(
                    color
                )}"
            >
                ${escapeHTML(color)}
            </button>
        `).join("");
}


/* =========================================================
   PRODUCT BUTTONS
========================================================= */

function updateProductButtons(product) {
    const disabled =
        isOutOfStock(product);

    document
        .querySelectorAll(
            "#addToCart, #add-to-cart, .add-to-cart-btn, #buyNow, #buy-now"
        )
        .forEach(button => {
            button.disabled =
                disabled;
        });
}


/* =========================================================
   EVENTS
========================================================= */

function setupProductEvents() {

    document.addEventListener(
        "click",
        async event => {

            const thumbnail =
                event.target.closest(
                    ".product-thumbnail"
                );

            if (thumbnail) {
                selectThumbnail(
                    thumbnail
                );

                return;
            }


            const size =
                event.target.closest(
                    ".size-option"
                );

            if (size) {
                selectSize(size);

                return;
            }


            const color =
                event.target.closest(
                    ".color-option"
                );

            if (color) {
                selectColor(color);

                return;
            }


            const quantityButton =
                event.target.closest(
                    "[data-quantity-action]"
                );

            if (quantityButton) {
                changeQuantity(
                    quantityButton.dataset
                        .quantityAction
                );

                return;
            }


            const addButton =
                event.target.closest(
                    "#addToCart, #add-to-cart, .add-to-cart-btn"
                );

            if (addButton) {
                await addToCart();

                return;
            }


            const buyButton =
                event.target.closest(
                    "#buyNow, #buy-now, .buy-now-btn"
                );

            if (buyButton) {
                await buyNow();

                return;
            }


            const wishlistButton =
                event.target.closest(
                    "#wishlistBtn, #wishlist, .wishlist-btn, .product-wishlist"
                );

            if (wishlistButton) {
                await toggleWishlist(
                    wishlistButton
                );
            }
        }
    );


    document.addEventListener(
        "change",
        event => {
            const quantity =
                event.target.closest(
                    "#quantity, .quantity-input"
                );

            if (!quantity) {
                return;
            }

            let value =
                Number(
                    quantity.value
                );

            if (!Number.isFinite(value)) {
                value = 1;
            }

            setQuantity(value);
        }
    );
}


/* =========================================================
   THUMBNAIL
========================================================= */

function selectThumbnail(button) {
    const image =
        button.dataset.image;

    const main =
        findElement([
            "#mainProductImage",
            "#productImage",
            ".main-product-image img",
            ".product-main-image img"
        ]);

    if (main && image) {
        main.src =
            image;
    }

    document
        .querySelectorAll(
            ".product-thumbnail"
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


/* =========================================================
   SIZE
========================================================= */

function selectSize(button) {
    PRODUCT_STATE.selectedSize =
        button.dataset.size || "";

    document
        .querySelectorAll(
            ".size-option"
        )
        .forEach(item => {
            item.classList.remove(
                "active",
                "selected"
            );
        });

    button.classList.add(
        "active",
        "selected"
    );
}


/* =========================================================
   COLOR
========================================================= */

function selectColor(button) {
    PRODUCT_STATE.selectedColor =
        button.dataset.color || "";

    document
        .querySelectorAll(
            ".color-option"
        )
        .forEach(item => {
            item.classList.remove(
                "active",
                "selected"
            );
        });

    button.classList.add(
        "active",
        "selected"
    );
}


/* =========================================================
   QUANTITY
========================================================= */

function changeQuantity(action) {
    if (
        action === "increase" ||
        action === "plus"
    ) {
        setQuantity(
            PRODUCT_STATE.quantity + 1
        );

        return;
    }

    if (
        action === "decrease" ||
        action === "minus"
    ) {
        setQuantity(
            PRODUCT_STATE.quantity - 1
        );
    }
}


function setQuantity(quantity) {
    const product =
        PRODUCT_STATE.product;

    quantity =
        Math.floor(
            Number(quantity) || 1
        );

    quantity =
        Math.max(
            1,
            quantity
        );

    if (
        product &&
        Number(product.stock) > 0
    ) {
        quantity =
            Math.min(
                Number(product.stock),
                quantity
            );
    }

    PRODUCT_STATE.quantity =
        quantity;

    updateQuantityDisplay();
}


function updateQuantityDisplay() {
    document
        .querySelectorAll(
            "#quantity, .quantity-input"
        )
        .forEach(input => {
            input.value =
                PRODUCT_STATE.quantity;
        });
}


/* =========================================================
   ADD TO CART
========================================================= */

async function addToCart() {
    const product =
        PRODUCT_STATE.product;

    if (!product) {
        return;
    }

    if (isOutOfStock(product)) {
        showToast(
            "This product is out of stock."
        );

        return;
    }

    if (!CartAPI.isLoggedIn()) {
        redirectToLogin(
            window.location.href
        );

        return;
    }

    const sizeError =
        validateSelectedSize(
            product
        );

    if (sizeError) {
        showToast(
            sizeError
        );

        return;
    }

    const button =
        findElement([
            "#addToCart",
            "#add-to-cart",
            ".add-to-cart-btn"
        ]);

    setButtonLoading(
        button,
        true,
        "Adding..."
    );

    try {
        const response =
            await CartAPI.addToCart(
                product.id,
                PRODUCT_STATE.quantity,
                PRODUCT_STATE.selectedSize
            );

        /*
         * Keep local cart synchronized with
         * the server response where possible.
         */
        const serverCart =
            extractCart(
                response
            );

        if (serverCart.length) {
            saveLocalCart(
                serverCart
            );
        }

        await refreshCartCount();

        showToast(
            `${product.name} added to your cart.`
        );

    } catch (error) {
        console.error(
            "Add to cart error:",
            error
        );

        showToast(
            error.message ||
            "Could not add this product to your cart."
        );

    } finally {
        setButtonLoading(
            button,
            false,
            "Add to Cart"
        );
    }
}


/* =========================================================
   BUY NOW
========================================================= */

async function buyNow() {
    const product =
        PRODUCT_STATE.product;

    if (!product) {
        return;
    }

    if (isOutOfStock(product)) {
        showToast(
            "This product is out of stock."
        );

        return;
    }

    if (!CartAPI.isLoggedIn()) {
        redirectToLogin(
            `product.html?id=${encodeURIComponent(
                product.id
            )}`
        );

        return;
    }

    const sizeError =
        validateSelectedSize(
            product
        );

    if (sizeError) {
        showToast(
            sizeError
        );

        return;
    }

    try {
        await CartAPI.addToCart(
            product.id,
            PRODUCT_STATE.quantity,
            PRODUCT_STATE.selectedSize
        );

        await refreshCartCount();

        window.location.href =
            "checkout.html";

    } catch (error) {
        console.error(
            "Buy now error:",
            error
        );

        showToast(
            error.message ||
            "Could not continue to checkout."
        );
    }
}


/* =========================================================
   SIZE VALIDATION
========================================================= */

function validateSelectedSize(product) {
    const container =
        findElement([
            "#productSizes",
            "#sizeOptions",
            ".size-options"
        ]);

    if (!container) {
        return "";
    }

    const sizeButtons =
        container.querySelectorAll(
            ".size-option"
        );

    if (
        sizeButtons.length &&
        !PRODUCT_STATE.selectedSize
    ) {
        return "Please select a size.";
    }

    return "";
}


/* =========================================================
   WISHLIST
========================================================= */

async function checkWishlist(productId) {
    if (!CartAPI.isLoggedIn()) {
        return;
    }

    try {
        const response =
            await CartAPI.checkWishlist(
                productId
            );

        const isSaved =
            Boolean(
                response?.in_wishlist ??
                response?.is_wishlisted ??
                response?.wishlist ??
                response?.data?.in_wishlist
            );

        updateWishlistButton(
            isSaved
        );

    } catch (error) {
        console.warn(
            "Could not check wishlist:",
            error
        );
    }
}


async function toggleWishlist(button) {
    const product =
        PRODUCT_STATE.product;

    if (!product) {
        return;
    }

    if (!CartAPI.isLoggedIn()) {
        redirectToLogin(
            window.location.href
        );

        return;
    }

    try {
        const response =
            await CartAPI.checkWishlist(
                product.id
            );

        const currentlySaved =
            Boolean(
                response?.in_wishlist ??
                response?.is_wishlisted ??
                response?.wishlist ??
                response?.data?.in_wishlist
            );

        if (currentlySaved) {
            await CartAPI.removeFromWishlist(
                product.id
            );

            updateWishlistButton(
                false
            );

            showToast(
                "Removed from wishlist."
            );

        } else {
            await CartAPI.addToWishlist(
                product.id
            );

            updateWishlistButton(
                true
            );

            showToast(
                "Added to wishlist."
            );
        }

    } catch (error) {
        console.error(
            "Wishlist error:",
            error
        );

        showToast(
            error.message ||
            "Could not update wishlist."
        );
    }
}


function updateWishlistButton(
    active
) {
    document
        .querySelectorAll(
            "#wishlistBtn, #wishlist, .wishlist-btn, .product-wishlist"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                active
            );

            button.classList.toggle(
                "selected",
                active
            );

            button.setAttribute(
                "aria-pressed",
                String(active)
            );

            const text =
                button.querySelector(
                    ".wishlist-text"
                );

            if (text) {
                text.textContent =
                    active
                        ? "Saved"
                        : "Wishlist";
            }
        });
}


/* =========================================================
   SIMILAR PRODUCTS
========================================================= */

async function loadSimilarProducts(
    product
) {
    const container =
        findElement([
            "#similarProducts",
            "#similar-products",
            ".similar-products"
        ]);

    if (!container) {
        return;
    }

    try {
        const response =
            await CartAPI.getProducts();

        const products =
            extractProducts(
                response
            );

        const similar =
            products
                .filter(item =>
                    Number(item.id) !==
                    Number(product.id)
                )
                .filter(item => {

                    if (
                        !product.category
                    ) {
                        return true;
                    }

                    return String(
                        item.category || ""
                    ).toLowerCase() ===
                    String(
                        product.category
                    ).toLowerCase();
                })
                .slice(0, 4);

        if (!similar.length) {
            container.innerHTML = "";
            return;
        }

        container.innerHTML =
            similar.map(
                createSimilarProductHTML
            ).join("");

    } catch (error) {
        console.warn(
            "Could not load similar products:",
            error
        );
    }
}


function createSimilarProductHTML(
    product
) {
    const image =
        getImageURL(
            product.image
        );

    return `
        <article class="product-card">

            <a
                href="product.html?id=${encodeURIComponent(
                    product.id
                )}"
                class="product-card-image"
            >
                <img
                    src="${escapeAttribute(image)}"
                    alt="${escapeHTML(
                        product.name
                    )}"
                    onerror="this.src='images/placeholder.jpg'"
                >
            </a>

            <div class="product-card-content">

                <span class="product-category">
                    ${escapeHTML(
                        product.category || ""
                    )}
                </span>

                <a
                    href="product.html?id=${encodeURIComponent(
                        product.id
                    )}"
                    class="product-card-name"
                >
                    ${escapeHTML(
                        product.name
                    )}
                </a>

                <div class="product-rating">
                    ${renderStars(
                        product.rating
                    )}
                </div>

                <strong class="product-card-price">
                    ${formatCurrency(
                        product.price
                    )}
                </strong>

            </div>

        </article>
    `;
}


/* =========================================================
   PRODUCTS
========================================================= */

function extractProducts(response) {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.products)) {
        return response.products;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (
        Array.isArray(
            response?.data?.products
        )
    ) {
        return response.data.products;
    }

    return [];
}


function renderStars(rating) {
    const value =
        Number(rating) || 0;

    let result = "";

    for (let i = 1; i <= 5; i++) {
        result +=
            value >= i
                ? "★"
                : "☆";
    }

    return result;
}


/* =========================================================
   CART HELPERS
========================================================= */

function extractCart(response) {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.items)) {
        return response.items;
    }

    if (Array.isArray(response?.cart)) {
        return response.cart;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (
        Array.isArray(
            response?.data?.items
        )
    ) {
        return response.data.items;
    }

    return [];
}


function saveLocalCart(cart) {
    localStorage.setItem(
        "nc_cart",
        JSON.stringify(cart)
    );
}


async function refreshCartCount() {
    try {
        await CartAPI.updateCartCount();
    } catch {
        const cart =
            getLocalCart();

        const count =
            cart.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.quantity ||
                        item.qty ||
                        1
                    ),
                0
            );

        document
            .querySelectorAll(
                "#cartCount, #cart-count, .cart-count"
            )
            .forEach(element => {
                element.textContent =
                    count;
            });
    }
}


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
    } catch {
        return [];
    }
}


/* =========================================================
   LOGIN
========================================================= */

function redirectToLogin(
    redirect = window.location.href
) {
    window.location.href =
        `login.html?redirect=${encodeURIComponent(
            redirect
        )}`;
}


/* =========================================================
   LOADING / ERROR
========================================================= */

function showProductLoading() {
    const container =
        findElement([
            "#productDetails",
            ".product-details",
            ".product-detail"
        ]);

    if (container) {
        container.classList.add(
            "loading"
        );
    }
}


function showProductError(message) {
    const container =
        findElement([
            "#productDetails",
            ".product-details",
            ".product-detail",
            "main"
        ]);

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="product-error">
            <h2>Product unavailable</h2>
            <p>${escapeHTML(
                message
            )}</p>

            <a
                href="shop.html"
                class="btn"
            >
                Back to Shop
            </a>
        </div>
    `;
}


/* =========================================================
   BUTTON LOADING
========================================================= */

function setButtonLoading(
    button,
    loading,
    loadingText
) {
    if (!button) {
        return;
    }

    if (loading) {
        button.dataset.originalText =
            button.textContent;

        button.disabled =
            true;

        button.textContent =
            loadingText ||
            "Processing...";
    } else {
        button.disabled =
            false;

        button.textContent =
            button.dataset.originalText ||
            button.textContent;
    }
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {
    let toast =
        document.getElementById(
            "productToast"
        );

    if (!toast) {
        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "productToast";

        toast.className =
            "toast";

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
        window.productToastTimer
    );

    window.productToastTimer =
        setTimeout(() => {
            toast.classList.remove(
                "show"
            );
        }, 2500);
}


/* =========================================================
   DOM HELPERS
========================================================= */

function findElement(selectors) {
    for (const selector of selectors) {
        const element =
            document.querySelector(
                selector
            );

        if (element) {
            return element;
        }
    }

    return null;
}


function setText(
    selectors,
    value
) {
    const element =
        findElement(selectors);

    if (element) {
        element.textContent =
            value ?? "";
    }
}


/* =========================================================
   IMAGE
========================================================= */

function getImageURL(image) {
    if (!image) {
        return "images/placeholder.jpg";
    }

    if (
        image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("/") ||
        image.startsWith("data:")
    ) {
        return image;
    }

    if (
        image.startsWith("images/")
    ) {
        return image;
    }

    return `images/products/${image}`;
}


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(value) {
    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }
    ).format(
        Number(value) || 0
    );
}


/* =========================================================
   ESCAPE
========================================================= */

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {
    return escapeHTML(value);
}


/* =========================================================
   EXPORT
========================================================= */

window.CartProduct = {
    loadProduct,
    addToCart,
    buyNow,
    toggleWishlist,
    setQuantity
};