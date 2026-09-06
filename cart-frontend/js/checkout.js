/* =========================================================
   CHECKOUT — CART
   checkout.js
   Frontend ↔ Flask Backend
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initCheckout();
});


/* =========================================================
   CONSTANTS
========================================================= */

const CHECKOUT_CART_KEY = "nc_cart";
const SHIPPING_KEY = "nc_shipping";

const FREE_SHIPPING_LIMIT = 100000;
const SHIPPING_FEE = 2500;


/* =========================================================
   INITIALIZE
========================================================= */

async function initCheckout() {
    if (!CartAPI.isLoggedIn()) {
        redirectToLogin();
        return;
    }

    setupCheckoutForm();
    setupPaymentMethod();
    setupShippingFields();

    await loadCheckout();
}


/* =========================================================
   LOAD CHECKOUT
========================================================= */

async function loadCheckout() {
    showLoading();

    let cart = [];

    try {
        const response = await CartAPI.getCart();

        cart = extractCart(response);

        localStorage.setItem(
            CHECKOUT_CART_KEY,
            JSON.stringify(cart)
        );
    } catch (error) {
        console.warn(
            "Could not load server cart:",
            error
        );

        cart = getLocalCart();
    }

    if (!cart.length) {
        showEmptyCart();
        return;
    }

    await loadUserInformation();
    loadSavedShipping();

    renderCheckoutCart(cart);
    updateCheckoutSummary(cart);
}


/* =========================================================
   EXTRACT CART
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

    if (Array.isArray(response?.data?.items)) {
        return response.data.items;
    }

    return [];
}


/* =========================================================
   LOCAL CART
========================================================= */

function getLocalCart() {
    try {
        const cart = JSON.parse(
            localStorage.getItem(
                CHECKOUT_CART_KEY
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
   USER INFORMATION
========================================================= */

async function loadUserInformation() {
    try {
        const response =
            await CartAPI.getCurrentUser();

        const user =
            response?.user ||
            response?.data?.user ||
            response?.data ||
            response;

        if (!user) {
            return;
        }

        setField(
            ["#fullName", "#full_name", "#name"],
            user.name ||
            user.full_name ||
            ""
        );

        setField(
            ["#email"],
            user.email || ""
        );

        setField(
            ["#phone"],
            user.phone || ""
        );

    } catch (error) {
        console.warn(
            "Could not load user information:",
            error
        );
    }
}


/* =========================================================
   SAVED SHIPPING
========================================================= */

function loadSavedShipping() {
    try {
        const saved =
            JSON.parse(
                localStorage.getItem(
                    SHIPPING_KEY
                ) || "null"
            );

        if (!saved) {
            return;
        }

        setField(
            ["#address", "#street", "#addressLine"],
            saved.address ||
            saved.street ||
            saved.addressLine ||
            ""
        );

        setField(
            ["#city"],
            saved.city || ""
        );

        setField(
            ["#state"],
            saved.state || ""
        );

        setField(
            ["#postalCode", "#postal_code"],
            saved.postal_code ||
            saved.postalCode ||
            ""
        );

        setField(
            ["#phone"],
            saved.phone ||
            getFieldValue(
                ["#phone"]
            )
        );

    } catch (error) {
        console.warn(
            "Could not load saved shipping:",
            error
        );
    }
}


/* =========================================================
   RENDER CART
========================================================= */

function renderCheckoutCart(cart) {
    const container = findElement([
        "#checkoutItems",
        "#checkout-items",
        "#orderItems",
        ".checkout-items"
    ]);

    if (!container) {
        return;
    }

    container.innerHTML = cart.map(item => {

        const product =
            item.product || item;

        const id =
            item.product_id ||
            product.product_id ||
            product.id;

        const name =
            item.name ||
            product.name ||
            "Product";

        const price = Number(
            item.price ??
            product.price ??
            0
        );

        const quantity = Math.max(
            1,
            Number(
                item.quantity ??
                item.qty ??
                1
            )
        );

        const size =
            item.size ||
            "";

        const image =
            item.image ||
            product.image ||
            "";

        const subtotal =
            price * quantity;

        return `
            <div class="checkout-item">

                <div class="checkout-item-image">
                    <img
                        src="${escapeAttribute(
                            getImageURL(image)
                        )}"
                        alt="${escapeHTML(name)}"
                        onerror="this.src='images/placeholder.jpg'"
                    >
                </div>

                <div class="checkout-item-info">

                    <a
                        href="product.html?id=${encodeURIComponent(id)}"
                        class="checkout-item-name"
                    >
                        ${escapeHTML(name)}
                    </a>

                    ${
                        size
                            ? `
                                <span class="checkout-item-size">
                                    Size: ${escapeHTML(size)}
                                </span>
                              `
                            : ""
                    }

                    <span class="checkout-item-quantity">
                        Qty: ${quantity}
                    </span>

                </div>

                <div class="checkout-item-price">
                    ${formatCurrency(subtotal)}
                </div>

            </div>
        `;
    }).join("");
}


/* =========================================================
   SUMMARY
========================================================= */

function updateCheckoutSummary(cart) {
    const subtotal = cart.reduce(
        (total, item) => {

            const price = Number(
                item.price ??
                item.product?.price ??
                0
            );

            const quantity = Math.max(
                1,
                Number(
                    item.quantity ??
                    item.qty ??
                    1
                )
            );

            return total + (
                price * quantity
            );
        },
        0
    );

    const shipping =
        subtotal >= FREE_SHIPPING_LIMIT
            ? 0
            : SHIPPING_FEE;

    const total =
        subtotal + shipping;

    setText(
        [
            "#checkoutSubtotal",
            "#subtotal",
            "#orderSubtotal"
        ],
        formatCurrency(subtotal)
    );

    setText(
        [
            "#checkoutShipping",
            "#shippingFee",
            "#shipping"
        ],
        shipping === 0
            ? "FREE"
            : formatCurrency(shipping)
    );

    setText(
        [
            "#checkoutTotal",
            "#total",
            "#orderTotal"
        ],
        formatCurrency(total)
    );

    const message =
        findElement([
            "#shippingMessage",
            ".shipping-message"
        ]);

    if (message) {
        if (shipping === 0) {
            message.textContent =
                "🎉 You qualify for free delivery!";
        } else {
            message.textContent =
                `Add ${formatCurrency(
                    FREE_SHIPPING_LIMIT - subtotal
                )} more for free delivery.`;
        }
    }
}


/* =========================================================
   FORM
========================================================= */

function setupCheckoutForm() {
    const form = findElement([
        "#checkoutForm",
        "#checkout-form"
    ]);

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        handleCheckoutSubmit
    );
}


/* =========================================================
   PAYMENT METHOD
========================================================= */

function setupPaymentMethod() {
    const methods =
        document.querySelectorAll(
            'input[name="payment_method"], input[name="paymentMethod"]'
        );

    methods.forEach(input => {
        input.addEventListener(
            "change",
            updatePaymentUI
        );
    });

    updatePaymentUI();
}


function updatePaymentUI() {
    const selected =
        document.querySelector(
            'input[name="payment_method"]:checked, input[name="paymentMethod"]:checked'
        );

    if (!selected) {
        return;
    }

    document
        .querySelectorAll(
            ".payment-method-details"
        )
        .forEach(element => {
            element.style.display = "none";
        });

    const value =
        selected.value.toLowerCase();

    const details =
        document.querySelector(
            `[data-payment-details="${value}"]`
        );

    if (details) {
        details.style.display = "";
    }
}


/* =========================================================
   SHIPPING FIELDS
========================================================= */

function setupShippingFields() {
    const fields =
        document.querySelectorAll(
            "#address, #street, #addressLine, #city, #state, #postalCode, #postal_code, #phone"
        );

    fields.forEach(field => {
        field.addEventListener(
            "input",
            saveShippingLocally
        );
    });
}


function saveShippingLocally() {
    const shipping = {
        address: getFieldValue([
            "#address",
            "#street",
            "#addressLine"
        ]),

        city: getFieldValue([
            "#city"
        ]),

        state: getFieldValue([
            "#state"
        ]),

        postal_code: getFieldValue([
            "#postalCode",
            "#postal_code"
        ]),

        phone: getFieldValue([
            "#phone"
        ])
    };

    localStorage.setItem(
        SHIPPING_KEY,
        JSON.stringify(shipping)
    );
}


/* =========================================================
   SUBMIT ORDER
========================================================= */

async function handleCheckoutSubmit(event) {
    event.preventDefault();

    const form =
        event.currentTarget;

    const submitButton =
        form.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

    const cart =
        getLocalCart();

    if (!cart.length) {
        showMessage(
            "Your cart is empty.",
            "error"
        );

        return;
    }

    if (!CartAPI.isLoggedIn()) {
        redirectToLogin();
        return;
    }

    const shipping =
        getShippingInformation();

    const validation =
        validateShipping(shipping);

    if (!validation.valid) {
        showMessage(
            validation.message,
            "error"
        );

        return;
    }

    const paymentMethod =
        getPaymentMethod();

    saveShippingLocally();

    setButtonLoading(
        submitButton,
        true
    );

    try {
        /*
         * Store checkout information for the
         * payment page.
         */
        localStorage.setItem(
            "nc_checkout",
            JSON.stringify({
                shipping,
                payment_method:
                    paymentMethod,
                created_at:
                    new Date().toISOString()
            })
        );

        /*
         * Cash on delivery and bank transfer can
         * proceed through the payment page.
         *
         * Paystack is intentionally handled by
         * payment.js so payment is verified before
         * the final order is created.
         */
        window.location.href =
            "payment.html";

    } catch (error) {
        console.error(
            "Checkout error:",
            error
        );

        showMessage(
            "Something went wrong. Please try again.",
            "error"
        );

        setButtonLoading(
            submitButton,
            false
        );
    }
}


/* =========================================================
   SHIPPING INFORMATION
========================================================= */

function getShippingInformation() {
    return {
        full_name: getFieldValue([
            "#fullName",
            "#full_name",
            "#name"
        ]),

        email: getFieldValue([
            "#email"
        ]),

        phone: getFieldValue([
            "#phone"
        ]),

        address: getFieldValue([
            "#address",
            "#street",
            "#addressLine"
        ]),

        city: getFieldValue([
            "#city"
        ]),

        state: getFieldValue([
            "#state"
        ]),

        postal_code: getFieldValue([
            "#postalCode",
            "#postal_code"
        ])
    };
}


/* =========================================================
   VALIDATE SHIPPING
========================================================= */

function validateShipping(shipping) {
    if (!shipping.full_name) {
        return {
            valid: false,
            message: "Please enter your full name."
        };
    }

    if (!shipping.email) {
        return {
            valid: false,
            message: "Please enter your email address."
        };
    }

    if (!isValidEmail(shipping.email)) {
        return {
            valid: false,
            message: "Please enter a valid email address."
        };
    }

    if (!shipping.phone) {
        return {
            valid: false,
            message: "Please enter your phone number."
        };
    }

    if (!isValidNigerianPhone(shipping.phone)) {
        return {
            valid: false,
            message: "Please enter a valid Nigerian phone number."
        };
    }

    if (!shipping.address) {
        return {
            valid: false,
            message: "Please enter your delivery address."
        };
    }

    if (!shipping.city) {
        return {
            valid: false,
            message: "Please enter your city."
        };
    }

    if (!shipping.state) {
        return {
            valid: false,
            message: "Please select your state."
        };
    }

    return {
        valid: true,
        message: ""
    };
}


/* =========================================================
   PAYMENT METHOD
========================================================= */

function getPaymentMethod() {
    const selected =
        document.querySelector(
            'input[name="payment_method"]:checked, input[name="paymentMethod"]:checked'
        );

    return selected
        ? selected.value
        : "paystack";
}


/* =========================================================
   EMPTY CART
========================================================= */

function showEmptyCart() {
    const container =
        findElement([
            "#checkoutItems",
            "#checkout-items",
            "#orderItems",
            ".checkout-items"
        ]);

    if (container) {
        container.innerHTML = `
            <div class="empty-checkout">
                <h3>Your cart is empty</h3>
                <p>Add products before checking out.</p>
                <a href="shop.html" class="btn">
                    Continue Shopping
                </a>
            </div>
        `;
    }

    const button =
        findElement([
            "#placeOrderBtn",
            "#place-order-btn",
            "#checkoutSubmit",
            'button[type="submit"]'
        ]);

    if (button) {
        button.disabled = true;
    }
}


/* =========================================================
   LOGIN REDIRECT
========================================================= */

function redirectToLogin() {
    const currentPage =
        window.location.pathname
            .split("/")
            .pop() ||
        "checkout.html";

    const redirect =
        encodeURIComponent(
            currentPage
        );

    window.location.href =
        `login.html?redirect=${redirect}`;
}


/* =========================================================
   LOADING
========================================================= */

function showLoading() {
    const container =
        findElement([
            "#checkoutItems",
            "#checkout-items",
            "#orderItems",
            ".checkout-items"
        ]);

    if (container) {
        container.innerHTML = `
            <div class="checkout-loading">
                <div class="loading-spinner"></div>
                <p>Loading your order...</p>
            </div>
        `;
    }
}


/* =========================================================
   DOM HELPERS
========================================================= */

function findElement(selectors) {
    for (const selector of selectors) {
        const element =
            document.querySelector(selector);

        if (element) {
            return element;
        }
    }

    return null;
}


function getFieldValue(selectors) {
    const element =
        findElement(selectors);

    return element
        ? element.value.trim()
        : "";
}


function setField(selectors, value) {
    const element =
        findElement(selectors);

    if (element && !element.value) {
        element.value =
            value ?? "";
    }
}


function setText(selectors, value) {
    const element =
        findElement(selectors);

    if (element) {
        element.textContent =
            value;
    }
}


/* =========================================================
   VALIDATION
========================================================= */

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


function isValidNigerianPhone(phone) {
    const clean =
        String(phone)
            .replace(/[\s\-()]/g, "");

    return /^(\+234|0)\d{10}$/
        .test(clean);
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

    if (image.startsWith("images/")) {
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
    ).format(Number(value) || 0);
}


/* =========================================================
   BUTTON LOADING
========================================================= */

function setButtonLoading(
    button,
    loading
) {
    if (!button) {
        return;
    }

    if (loading) {
        button.dataset.originalText =
            button.textContent;

        button.disabled = true;

        button.textContent =
            "Processing...";
    } else {
        button.disabled = false;

        if (
            button.dataset.originalText
        ) {
            button.textContent =
                button.dataset.originalText;
        }
    }
}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    message,
    type = "error"
) {
    let element =
        findElement([
            "#checkoutMessage",
            "#checkout-message",
            ".checkout-message"
        ]);

    if (!element) {
        element =
            document.createElement("div");

        element.className =
            "checkout-message";

        const form =
            findElement([
                "#checkoutForm",
                "#checkout-form"
            ]);

        if (form) {
            form.prepend(element);
        } else {
            document.body.prepend(element);
        }
    }

    element.textContent =
        message;

    element.className =
        `checkout-message ${type}`;

    element.style.display =
        "block";
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

window.CartCheckout = {
    loadCheckout,
    getShippingInformation,
    validateShipping,
    getPaymentMethod
};