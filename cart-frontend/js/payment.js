/* =========================================================
   CART — PAYMENT PAGE
   payment.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initPaymentPage();
});


/* =========================================================
   INITIALIZE
========================================================= */

function initPaymentPage() {

    setupSearch();
    setupPaymentMethods();
    setupPaymentForm();
    updateCartCount();

    loadShippingInformation();
    loadPaymentSummary();
}


/* =========================================================
   PAYMENT METHODS
========================================================= */

function setupPaymentMethods() {

    const paymentOptions =
        document.querySelectorAll(
            'input[name="paymentMethod"]'
        );

    paymentOptions.forEach(option => {

        option.addEventListener(
            "change",
            updatePaymentDetails
        );

    });

    updatePaymentDetails();
}


/* =========================================================
   SHOW PAYMENT DETAILS
========================================================= */

function updatePaymentDetails() {

    const selected =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

    if (!selected) {
        return;
    }

    const method = selected.value;

    const paystackDetails =
        document.getElementById(
            "paystackDetails"
        );

    const cashDetails =
        document.getElementById(
            "cashDetails"
        );

    const bankDetails =
        document.getElementById(
            "bankDetails"
        );


    [
        paystackDetails,
        cashDetails,
        bankDetails
    ].forEach(element => {

        if (element) {
            element.classList.remove("active");
        }

    });


    if (method === "paystack") {

        paystackDetails?.classList.add(
            "active"
        );

    }

    else if (
        method === "cash_on_delivery"
    ) {

        cashDetails?.classList.add(
            "active"
        );

    }

    else if (
        method === "bank_transfer"
    ) {

        bankDetails?.classList.add(
            "active"
        );

    }
}


/* =========================================================
   PAYMENT FORM
========================================================= */

function setupPaymentForm() {

    const form =
        document.getElementById(
            "paymentForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        handlePaymentSubmit
    );
}


/* =========================================================
   SUBMIT PAYMENT
========================================================= */

async function handlePaymentSubmit(event) {

    event.preventDefault();

    const agreement =
        document.getElementById(
            "paymentAgreement"
        );

    const message =
        document.getElementById(
            "paymentMessage"
        );

    const submitButton =
        document.getElementById(
            "paymentSubmitBtn"
        );


    if (
        agreement &&
        !agreement.checked
    ) {

        showPaymentMessage(
            "Please confirm your order information before continuing.",
            "error"
        );

        return;
    }


    const cart =
        getCart();


    if (
        !Array.isArray(cart) ||
        cart.length === 0
    ) {

        showPaymentMessage(
            "Your cart is empty.",
            "error"
        );

        return;
    }


    const shipping =
        getShippingInformation();


    if (!shipping) {

        showPaymentMessage(
            "Please provide your delivery information first.",
            "error"
        );

        setTimeout(() => {
            window.location.href =
                "shipping.html";
        }, 1000);

        return;
    }


    const selectedPayment =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    if (!selectedPayment) {

        showPaymentMessage(
            "Please select a payment method.",
            "error"
        );

        return;
    }


    const paymentMethod =
        selectedPayment.value;


    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
            "Processing...";
    }


    try {

        const orderData = {
            items: cart,
            shipping_address: shipping,
            payment_method: paymentMethod
        };


        /*
         * The final backend will receive this
         * information through the checkout/order API.
         */

        const response =
            await createOrder(orderData);


        if (!response) {

            throw new Error(
                "No response from server."
            );
        }


        if (!response.ok) {

            let errorMessage =
                "Unable to create your order.";

            try {

                const errorData =
                    await response.json();

                if (errorData.message) {
                    errorMessage =
                        errorData.message;
                }

                if (errorData.error) {
                    errorMessage =
                        errorData.error;
                }

            } catch (_) {}

            throw new Error(
                errorMessage
            );
        }


        const result =
            await response.json();


        handleSuccessfulOrder(
            result,
            paymentMethod
        );


    } catch (error) {

        console.error(
            "Payment error:",
            error
        );


        /*
         * During frontend development, if the
         * backend is not running yet, show a
         * friendly message instead of crashing.
         */

        showPaymentMessage(
            "Payment could not be completed. Please try again.",
            "error"
        );


        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
                "Continue to Order";
        }
    }
}


/* =========================================================
   CREATE ORDER REQUEST
========================================================= */

async function createOrder(orderData) {

    const token =
        localStorage.getItem(
            "nc_token"
        );


    const headers = {
        "Content-Type":
            "application/json"
    };


    if (token) {

        headers.Authorization =
            `Bearer ${token}`;
    }


    const baseURL =
        getApiBaseUrl();


    return fetch(
        `${baseURL}/api/orders`,
        {
            method: "POST",
            headers,
            body: JSON.stringify(
                orderData
            )
        }
    );
}


/* =========================================================
   SUCCESSFUL ORDER
========================================================= */

function handleSuccessfulOrder(
    result,
    paymentMethod
) {

    const orderId =
        result.order_number ||
        result.order_id ||
        result.id ||
        "";


    /*
     * Store the latest order temporarily so
     * the success page can use it if needed.
     */

    try {

        localStorage.setItem(
            "nc_last_order",
            JSON.stringify({
                ...result,
                payment_method:
                    paymentMethod
            })
        );

    } catch (error) {

        console.error(
            "Unable to save order:",
            error
        );
    }


    /*
     * Clear the shopping cart after the
     * order has been successfully created.
     */

    localStorage.removeItem(
        "nc_cart"
    );


    showPaymentMessage(
        "Order placed successfully!",
        "success"
    );


    setTimeout(() => {

        if (orderId) {

            window.location.href =
                `orders.html?id=${encodeURIComponent(orderId)}`;

        } else {

            window.location.href =
                "orders.html";
        }

    }, 1200);
}


/* =========================================================
   LOAD PAYMENT SUMMARY
========================================================= */

function loadPaymentSummary() {

    const cart =
        getCart();

    const itemsContainer =
        document.getElementById(
            "paymentItems"
        );


    if (
        !itemsContainer
    ) {
        return;
    }


    if (
        !Array.isArray(cart) ||
        cart.length === 0
    ) {

        itemsContainer.innerHTML = `
            <div class="summary-empty">
                Your cart is empty.
            </div>
        `;

        updateSummaryTotals(
            0,
            0,
            0
        );

        return;
    }


    itemsContainer.innerHTML =
        cart.map(item =>
            createPaymentItem(item)
        ).join("");


    calculatePaymentTotals();
}


/* =========================================================
   PAYMENT ITEM
========================================================= */

function createPaymentItem(item) {

    const name =
        item.name ||
        "Product";


    const price =
        Number(
            item.price
        ) || 0;


    const quantity =
        Number(
            item.quantity
        ) || 1;


    const image =
        item.image ||
        "images/placeholder.jpg";


    const total =
        price * quantity;


    return `
        <div class="payment-item">

            <div class="payment-item-image">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(name)}"
                    onerror="this.src='images/placeholder.jpg'"
                >

                <span class="payment-item-quantity">
                    ${quantity}
                </span>

            </div>

            <div class="payment-item-info">

                <strong>
                    ${escapeHTML(name)}
                </strong>

                <span>
                    ${formatCurrency(total)}
                </span>

            </div>

        </div>
    `;
}


/* =========================================================
   CALCULATE TOTALS
========================================================= */

function calculatePaymentTotals() {

    const cart =
        getCart();


    let subtotal = 0;


    cart.forEach(item => {

        const price =
            Number(
                item.price
            ) || 0;

        const quantity =
            Number(
                item.quantity
            ) || 1;


        subtotal +=
            price * quantity;
    });


    const shipping =
        calculateShipping(subtotal);


    const discount =
        calculateDiscount(cart);


    const total =
        Math.max(
            0,
            subtotal +
            shipping -
            discount
        );


    updateSummaryTotals(
        subtotal,
        shipping,
        discount,
        total
    );
}


/* =========================================================
   SHIPPING COST
========================================================= */

function calculateShipping(subtotal) {

    /*
     * Free shipping for orders of ₦100,000
     * or more.
     *
     * This can be replaced with the final
     * backend shipping calculation later.
     */

    if (subtotal <= 0) {
        return 0;
    }

    if (subtotal >= 100000) {
        return 0;
    }

    return 2500;
}


/* =========================================================
   DISCOUNT
========================================================= */

function calculateDiscount(cart) {

    let discount = 0;


    cart.forEach(item => {

        const price =
            Number(
                item.price
            ) || 0;

        const oldPrice =
            Number(
                item.old_price
            ) || 0;

        const quantity =
            Number(
                item.quantity
            ) || 1;


        if (
            oldPrice > price
        ) {

            discount +=
                (oldPrice - price) *
                quantity;
        }

    });


    return discount;
}


/* =========================================================
   UPDATE SUMMARY
========================================================= */

function updateSummaryTotals(
    subtotal,
    shipping,
    discount,
    total
) {

    if (
        typeof total !== "number"
    ) {

        total =
            subtotal +
            shipping -
            discount;
    }


    setText(
        "paymentSubtotal",
        formatCurrency(subtotal)
    );

    setText(
        "paymentShipping",
        shipping === 0
            ? "FREE"
            : formatCurrency(shipping)
    );

    setText(
        "paymentDiscount",
        discount > 0
            ? `-${formatCurrency(discount)}`
            : formatCurrency(0)
    );

    setText(
        "paymentTotal",
        formatCurrency(total)
    );
}


/* =========================================================
   SHIPPING INFORMATION
========================================================= */

function loadShippingInformation() {

    const addressElement =
        document.getElementById(
            "paymentAddress"
        );


    if (!addressElement) {
        return;
    }


    const shipping =
        getShippingInformation();


    if (!shipping) {

        addressElement.textContent =
            "Your delivery address will appear here.";

        return;
    }


    const parts = [
        shipping.full_name ||
        shipping.name,

        shipping.address,

        shipping.city,

        shipping.state,

        shipping.phone
    ].filter(Boolean);


    addressElement.textContent =
        parts.join(", ");
}


/* =========================================================
   GET SHIPPING INFORMATION
========================================================= */

function getShippingInformation() {

    const keys = [
        "nc_shipping",
        "shippingInfo",
        "shipping_information"
    ];


    for (
        const key of keys
    ) {

        try {

            const stored =
                localStorage.getItem(
                    key
                );


            if (!stored) {
                continue;
            }


            const data =
                JSON.parse(stored);


            if (data) {
                return data;
            }

        } catch (error) {

            console.error(
                `Unable to read ${key}:`,
                error
            );
        }
    }


    return null;
}


/* =========================================================
   GET CART
========================================================= */

function getCart() {

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

    } catch (error) {

        console.error(
            "Unable to read cart:",
            error
        );

        return [];
    }
}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

    const cart =
        getCart();


    let count = 0;


    cart.forEach(item => {

        count +=
            Number(
                item.quantity
            ) || 1;

    });


    const counters =
        document.querySelectorAll(
            "#cartCount"
        );


    counters.forEach(counter => {

        counter.textContent =
            count;

    });
}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const toggle =
        document.getElementById(
            "searchToggle"
        );

    const panel =
        document.getElementById(
            "searchPanel"
        );

    const form =
        document.getElementById(
            "searchForm"
        );

    const input =
        document.getElementById(
            "paymentSearch"
        );


    if (
        toggle &&
        panel
    ) {

        toggle.addEventListener(
            "click",
            () => {

                panel.classList.toggle(
                    "active"
                );


                if (
                    panel.classList.contains(
                        "active"
                    ) &&
                    input
                ) {

                    input.focus();
                }

            }
        );
    }


    if (
        form &&
        input
    ) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const query =
                    input.value.trim();


                if (!query) {
                    return;
                }


                window.location.href =
                    `shop.html?search=${encodeURIComponent(query)}`;
            }
        );
    }
}


/* =========================================================
   PAYMENT MESSAGE
========================================================= */

function showPaymentMessage(
    message,
    type = "info"
) {

    const element =
        document.getElementById(
            "paymentMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        `payment-message ${type}`;
}


/* =========================================================
   API BASE URL
========================================================= */

function getApiBaseUrl() {

    if (
        typeof API_BASE_URL !==
        "undefined"
    ) {

        return API_BASE_URL;
    }


    if (
        typeof BASE_URL !==
        "undefined"
    ) {

        return BASE_URL;
    }


    if (
        typeof API_URL !==
        "undefined"
    ) {

        return API_URL;
    }


    return "hhttps://cart-backend-8xew.onrender.com";
}


/* =========================================================
   SET TEXT
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {
        element.textContent =
            value;
    }
}


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(
    amount
) {

    return Number(
        amount || 0
    ).toLocaleString(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }
    );
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}