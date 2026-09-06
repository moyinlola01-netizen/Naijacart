/* =========================================================
   CART — ADDRESSES
   Database-backed delivery address management
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const addressFormSection =
        document.getElementById("addressFormSection");

    const addressForm =
        document.getElementById("addressForm");

    const addressFormTitle =
        document.getElementById("addressFormTitle");

    const addressId =
        document.getElementById("addressId");

    const addressName =
        document.getElementById("addressName");

    const addressPhone =
        document.getElementById("addressPhone");

    const addressStreet =
        document.getElementById("addressStreet");

    const addressState =
        document.getElementById("addressState");

    const addressCity =
        document.getElementById("addressCity");

    const addressPostalCode =
        document.getElementById("addressPostalCode");

    const addressLabel =
        document.getElementById("addressLabel");

    const defaultAddress =
        document.getElementById("defaultAddress");

    const addressesList =
        document.getElementById("addressesList");

    const addressesEmpty =
        document.getElementById("addressesEmpty");

    const addAddressButton =
        document.getElementById("addAddressButton");

    const emptyAddAddressButton =
        document.getElementById("emptyAddAddressButton");

    const cancelAddressButton =
        document.getElementById("cancelAddressButton");

    const saveAddressButton =
        document.getElementById("saveAddressButton");

    const formMessage =
        document.getElementById("addressFormMessage");

    const cartCount =
        document.getElementById("cartCount");

    const searchForm =
        document.getElementById("searchForm");

    const searchInput =
        document.getElementById("searchInput");


    /* =====================================================
       STATE
    ===================================================== */

    let addresses = [];

    let editingAddressId = null;


    /* =====================================================
       AUTH CHECK
    ===================================================== */

    if (
        typeof CartAPI === "undefined"
    ) {

        showMessage(
            "Unable to connect to the CART API.",
            "error"
        );

        return;
    }


    let currentUser = null;

    try {

        currentUser =
            await CartAPI.getCurrentUser();

    } catch (error) {

        console.error(
            "Unable to load current user:",
            error
        );
    }


    if (!currentUser) {

        showLoginMessage();

        return;
    }


    /* =====================================================
       LOAD ADDRESSES FROM DATABASE
    ===================================================== */

    async function loadAddresses() {

        try {

            const response =
                await CartAPI.getAddresses();

            /*
             * The API normally returns:
             * { addresses: [...] }
             */

            if (
                response &&
                Array.isArray(response.addresses)
            ) {

                addresses =
                    response.addresses;

            } else if (
                Array.isArray(response)
            ) {

                addresses =
                    response;

            } else {

                addresses = [];
            }


            /*
             * Normalize backend fields so the
             * frontend works consistently.
             */

            addresses =
                addresses.map(address => ({
                    ...address,

                    id:
                        address.id,

                    label:
                        address.label ||
                        "Home",

                    full_name:
                        address.full_name ||
                        address.fullName ||
                        address.name ||
                        "",

                    phone:
                        address.phone ||
                        "",

                    street:
                        address.street ||
                        address.address ||
                        "",

                    city:
                        address.city ||
                        "",

                    state:
                        address.state ||
                        "",

                    postal_code:
                        address.postal_code ||
                        address.postalCode ||
                        "",

                    default:
                        Boolean(
                            address.default ??
                            address.is_default
                        )
                }));


            renderAddresses();

        } catch (error) {

            console.error(
                "Unable to load addresses:",
                error
            );

            addresses = [];

            renderAddresses();

            showMessage(
                getErrorMessage(
                    error,
                    "Unable to load your addresses."
                ),
                "error"
            );
        }
    }


    /* =====================================================
       OPEN FORM
    ===================================================== */

    function openAddressForm(
        address = null
    ) {

        if (!addressFormSection) {
            return;
        }


        addressFormSection.hidden = false;

        editingAddressId =
            address?.id || null;


        if (addressFormTitle) {

            addressFormTitle.textContent =
                address
                    ? "Edit Address"
                    : "Add New Address";
        }


        if (saveAddressButton) {

            saveAddressButton.textContent =
                address
                    ? "Update Address"
                    : "Save Address";
        }


        clearErrors();

        clearMessage();


        if (address) {

            addressId.value =
                address.id || "";

            addressName.value =
                address.full_name || "";

            addressPhone.value =
                address.phone || "";

            addressStreet.value =
                address.street || "";

            addressState.value =
                address.state || "";

            addressCity.value =
                address.city || "";

            addressPostalCode.value =
                address.postal_code || "";

            addressLabel.value =
                address.label || "Home";

            defaultAddress.checked =
                Boolean(address.default);

        } else {

            addressForm.reset();

            addressId.value = "";

            addressName.value =
                currentUser.name ||
                currentUser.full_name ||
                "";

            addressPhone.value =
                currentUser.phone ||
                "";

            addressLabel.value =
                "Home";

            defaultAddress.checked =
                addresses.length === 0;
        }


        addressFormSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* =====================================================
       CLOSE FORM
    ===================================================== */

    function closeAddressForm() {

        if (!addressFormSection) {
            return;
        }

        addressFormSection.hidden = true;

        editingAddressId = null;

        if (addressForm) {
            addressForm.reset();
        }

        clearErrors();

        clearMessage();
    }


    /* =====================================================
       BUTTONS
    ===================================================== */

    if (addAddressButton) {

        addAddressButton.addEventListener(
            "click",
            () => openAddressForm()
        );
    }


    if (emptyAddAddressButton) {

        emptyAddAddressButton.addEventListener(
            "click",
            () => openAddressForm()
        );
    }


    if (cancelAddressButton) {

        cancelAddressButton.addEventListener(
            "click",
            closeAddressForm
        );
    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function setError(
        input,
        errorId,
        message
    ) {

        const error =
            document.getElementById(errorId);

        if (error) {
            error.textContent =
                message;
        }

        if (input) {
            input.classList.add("error");
        }
    }


    function clearErrors() {

        document
            .querySelectorAll(
                "#addressForm .form-error"
            )
            .forEach(element => {

                element.textContent = "";
            });


        document
            .querySelectorAll(
                "#addressForm .error"
            )
            .forEach(element => {

                element.classList.remove("error");
            });
    }


    function validateForm() {

        clearErrors();

        let valid = true;


        const name =
            addressName.value.trim();

        const phone =
            addressPhone.value.trim();

        const street =
            addressStreet.value.trim();

        const state =
            addressState.value.trim();

        const city =
            addressCity.value.trim();


        /* NAME */

        if (!name) {

            setError(
                addressName,
                "addressNameError",
                "Please enter your full name."
            );

            valid = false;

        } else if (name.length < 3) {

            setError(
                addressName,
                "addressNameError",
                "Please enter a valid name."
            );

            valid = false;
        }


        /* PHONE */

        const cleanPhone =
            phone.replace(
                /[\s()-]/g,
                ""
            );


        if (!cleanPhone) {

            setError(
                addressPhone,
                "addressPhoneError",
                "Please enter your phone number."
            );

            valid = false;

        } else if (
            !/^(\+234|0)\d{10}$/.test(
                cleanPhone
            )
        ) {

            setError(
                addressPhone,
                "addressPhoneError",
                "Enter a valid Nigerian phone number."
            );

            valid = false;
        }


        /* STREET */

        if (!street) {

            setError(
                addressStreet,
                "addressStreetError",
                "Please enter your street address."
            );

            valid = false;
        }


        /* STATE */

        if (!state) {

            setError(
                addressState,
                "addressStateError",
                "Please select your state."
            );

            valid = false;
        }


        /* CITY */

        if (!city) {

            setError(
                addressCity,
                "addressCityError",
                "Please enter your city."
            );

            valid = false;
        }


        return valid;
    }


    /* =====================================================
       SUBMIT ADDRESS
    ===================================================== */

    if (addressForm) {

        addressForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                clearMessage();


                if (!validateForm()) {
                    return;
                }


                const payload = {

                    name:
                        addressName.value.trim(),

                    full_name:
                        addressName.value.trim(),

                    phone:
                        addressPhone.value.trim(),

                    street:
                        addressStreet.value.trim(),

                    city:
                        addressCity.value.trim(),

                    state:
                        addressState.value.trim(),

                    postal_code:
                        addressPostalCode.value.trim(),

                    label:
                        addressLabel.value ||
                        "Home",

                    is_default:
                        defaultAddress.checked
                };


                const originalText =
                    saveAddressButton
                        ? saveAddressButton.textContent
                        : "Save Address";


                if (saveAddressButton) {

                    saveAddressButton.disabled = true;

                    saveAddressButton.textContent =
                        editingAddressId
                            ? "Updating..."
                            : "Saving...";
                }


                try {

                    let response;


                    if (editingAddressId) {

                        response =
                            await CartAPI.updateAddress(
                                editingAddressId,
                                payload
                            );

                    } else {

                        response =
                            await CartAPI.createAddress(
                                payload
                            );
                    }


                    console.log(
                        "Address saved:",
                        response
                    );


                    /*
                     * Reload directly from SQLite
                     * so the page always reflects
                     * the backend.
                     */

                    await loadAddresses();


                    /*
                     * Save the selected/default
                     * address for checkout.
                     */

                    const savedAddress =
                        addresses.find(
                            address =>
                                String(address.id) ===
                                String(
                                    editingAddressId ||
                                    response?.address?.id ||
                                    response?.id
                                )
                        );


                    if (savedAddress) {

                        saveAsShippingAddress(
                            savedAddress
                        );

                    } else if (
                        defaultAddress.checked
                    ) {

                        saveShippingFromForm();
                    }


                    showMessage(
                        editingAddressId
                            ? "Address updated successfully."
                            : "Address saved successfully.",
                        "success"
                    );


                    setTimeout(
                        closeAddressForm,
                        700
                    );

                } catch (error) {

                    console.error(
                        "Unable to save address:",
                        error
                    );


                    showMessage(
                        getErrorMessage(
                            error,
                            "Unable to save address. Please try again."
                        ),
                        "error"
                    );

                } finally {

                    if (saveAddressButton) {

                        saveAddressButton.disabled =
                            false;

                        saveAddressButton.textContent =
                            originalText;
                    }
                }
            }
        );
    }


    /* =====================================================
       SAVE CHECKOUT SHIPPING
    ===================================================== */

    function saveAsShippingAddress(
        address
    ) {

        if (!address) {
            return;
        }


        const shipping = {

            full_name:
                address.full_name || "",

            fullName:
                address.full_name || "",

            name:
                address.full_name || "",

            phone:
                address.phone || "",

            street:
                address.street || "",

            address:
                address.street || "",

            city:
                address.city || "",

            state:
                address.state || "",

            postal_code:
                address.postal_code || "",

            postalCode:
                address.postal_code || "",

            label:
                address.label || "Home"
        };


        localStorage.setItem(
            "nc_shipping",
            JSON.stringify(shipping)
        );

        localStorage.setItem(
            "shippingInfo",
            JSON.stringify(shipping)
        );

        localStorage.setItem(
            "shipping_information",
            JSON.stringify(shipping)
        );
    }


    function saveShippingFromForm() {

        const shipping = {

            full_name:
                addressName.value.trim(),

            fullName:
                addressName.value.trim(),

            name:
                addressName.value.trim(),

            phone:
                addressPhone.value.trim(),

            street:
                addressStreet.value.trim(),

            address:
                addressStreet.value.trim(),

            city:
                addressCity.value.trim(),

            state:
                addressState.value.trim(),

            postal_code:
                addressPostalCode.value.trim(),

            postalCode:
                addressPostalCode.value.trim(),

            label:
                addressLabel.value ||
                "Home"
        };


        localStorage.setItem(
            "nc_shipping",
            JSON.stringify(shipping)
        );

        localStorage.setItem(
            "shippingInfo",
            JSON.stringify(shipping)
        );

        localStorage.setItem(
            "shipping_information",
            JSON.stringify(shipping)
        );
    }


    /* =====================================================
       EDIT ADDRESS
    ===================================================== */

    function editAddress(id) {

        const address =
            addresses.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!address) {
            return;
        }


        openAddressForm(address);
    }


    /* =====================================================
       SET DEFAULT ADDRESS
    ===================================================== */

    async function setDefaultAddress(id) {

        try {

            await CartAPI.setDefaultAddress(id);


            await loadAddresses();


            const selected =
                addresses.find(
                    address =>
                        String(address.id) ===
                        String(id)
                );


            if (selected) {

                saveAsShippingAddress(
                    selected
                );
            }


            showMessage(
                "Default address updated.",
                "success"
            );

        } catch (error) {

            console.error(
                "Unable to set default address:",
                error
            );


            showMessage(
                getErrorMessage(
                    error,
                    "Unable to update default address."
                ),
                "error"
            );
        }
    }


    /* =====================================================
       DELETE ADDRESS
    ===================================================== */

    async function deleteAddress(id) {

        const address =
            addresses.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!address) {
            return;
        }


        const confirmed =
            window.confirm(
                `Delete your ${address.label || "saved"} address?`
            );


        if (!confirmed) {
            return;
        }


        try {

            await CartAPI.deleteAddress(id);


            await loadAddresses();


            /*
             * If the deleted address was the
             * shipping address, use the new
             * default address if available.
             */

            const newDefault =
                addresses.find(
                    item =>
                        item.default
                );


            if (newDefault) {

                saveAsShippingAddress(
                    newDefault
                );

            } else if (
                addresses.length === 0
            ) {

                localStorage.removeItem(
                    "nc_shipping"
                );

                localStorage.removeItem(
                    "shippingInfo"
                );

                localStorage.removeItem(
                    "shipping_information"
                );
            }


            showMessage(
                "Address deleted successfully.",
                "success"
            );

        } catch (error) {

            console.error(
                "Unable to delete address:",
                error
            );


            showMessage(
                getErrorMessage(
                    error,
                    "Unable to delete address."
                ),
                "error"
            );
        }
    }


    /* =====================================================
       RENDER ADDRESSES
    ===================================================== */

    function renderAddresses() {

        if (!addressesList) {
            return;
        }


        addressesList.innerHTML = "";


        if (
            !Array.isArray(addresses) ||
            addresses.length === 0
        ) {

            addressesList.hidden = true;

            if (addressesEmpty) {
                addressesEmpty.hidden = false;
            }

            return;
        }


        addressesList.hidden = false;

        if (addressesEmpty) {
            addressesEmpty.hidden = true;
        }


        addresses.forEach(address => {

            const card =
                document.createElement("article");


            card.className =
                `address-card ${
                    address.default
                        ? "default-address"
                        : ""
                }`;


            const label =
                escapeHTML(
                    address.label ||
                    "Address"
                );


            card.innerHTML = `

                <div class="address-card-header">

                    <div>

                        <span class="address-label">
                            ${label}
                        </span>

                        ${
                            address.default
                                ? `
                                    <span class="default-badge">
                                        Default
                                    </span>
                                `
                                : ""
                        }

                    </div>

                </div>


                <div class="address-card-body">

                    <strong>
                        ${escapeHTML(
                            address.full_name || ""
                        )}
                    </strong>

                    <p>
                        ${escapeHTML(
                            address.street || ""
                        )}
                    </p>

                    <p>
                        ${escapeHTML(
                            [
                                address.city,
                                address.state
                            ]
                                .filter(Boolean)
                                .join(", ")
                        )}

                        ${
                            address.postal_code
                                ? `
                                    ${escapeHTML(
                                        address.postal_code
                                    )}
                                `
                                : ""
                        }
                    </p>

                    <p>
                        ${escapeHTML(
                            address.phone || ""
                        )}
                    </p>

                </div>


                <div class="address-card-actions">

                    <button
                        type="button"
                        class="secondary-button"
                        data-action="edit"
                        data-id="${escapeHTML(
                            address.id
                        )}"
                    >
                        Edit
                    </button>

                    ${
                        address.default
                            ? ""
                            : `
                                <button
                                    type="button"
                                    class="secondary-button"
                                    data-action="default"
                                    data-id="${escapeHTML(
                                        address.id
                                    )}"
                                >
                                    Make Default
                                </button>
                            `
                    }

                    <button
                        type="button"
                        class="danger-button"
                        data-action="delete"
                        data-id="${escapeHTML(
                            address.id
                        )}"
                    >
                        Delete
                    </button>

                </div>

            `;


            addressesList.appendChild(card);
        });
    }


    /* =====================================================
       ADDRESS ACTIONS
    ===================================================== */

    if (addressesList) {

        addressesList.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "button[data-action]"
                    );


                if (!button) {
                    return;
                }


                const id =
                    button.dataset.id;

                const action =
                    button.dataset.action;


                if (action === "edit") {

                    editAddress(id);
                }


                if (action === "default") {

                    setDefaultAddress(id);
                }


                if (action === "delete") {

                    deleteAddress(id);
                }
            }
        );
    }


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchForm && searchInput) {

        searchForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const query =
                    searchInput.value.trim();


                if (!query) {
                    return;
                }


                window.location.href =
                    `shop.html?search=${encodeURIComponent(
                        query
                    )}`;
            }
        );
    }


    /* =====================================================
       CART COUNT
    ===================================================== */

    async function updateCartCount() {

        if (!cartCount) {
            return;
        }


        try {

            if (
                typeof CartAPI !== "undefined" &&
                CartAPI.getCart
            ) {

                const response =
                    await CartAPI.getCart();


                const items =
                    Array.isArray(response)
                        ? response
                        : response?.items || [];


                const count =
                    items.reduce(
                        (total, item) =>
                            total +
                            Number(
                                item.quantity || 1
                            ),
                        0
                    );


                cartCount.textContent =
                    count > 99
                        ? "99+"
                        : String(count);


                return;
            }

        } catch (error) {

            console.warn(
                "Unable to load server cart count:",
                error
            );
        }


        cartCount.textContent = "0";
    }


    /* =====================================================
       LOGIN MESSAGE
    ===================================================== */

    function showLoginMessage() {

        if (addressesList) {

            addressesList.hidden = true;
        }


        if (addressesEmpty) {

            addressesEmpty.hidden = false;

            addressesEmpty.innerHTML = `

                <div class="empty-icon">
                    🔐
                </div>

                <h2>
                    Login Required
                </h2>

                <p>
                    Please log in to manage your
                    delivery addresses.
                </p>

                <a
                    href="login.html?redirect=addresses.html"
                    class="primary-button"
                >
                    Login
                </a>

            `;
        }
    }


    /* =====================================================
       MESSAGES
    ===================================================== */

    function showMessage(
        text,
        type = "info"
    ) {

        if (!formMessage) {
            return;
        }


        formMessage.textContent =
            text;


        formMessage.className =
            `auth-message ${type}`;
    }


    function clearMessage() {

        if (!formMessage) {
            return;
        }


        formMessage.textContent = "";

        formMessage.className =
            "auth-message";
    }


    /* =====================================================
       ERROR MESSAGE HELPER
    ===================================================== */

    function getErrorMessage(
        error,
        fallback
    ) {

        if (!error) {
            return fallback;
        }


        if (
            typeof error === "string"
        ) {
            return error;
        }


        if (error.message) {
            return error.message;
        }


        if (
            error.error &&
            typeof error.error === "string"
        ) {
            return error.error;
        }


        return fallback;
    }


    /* =====================================================
       HTML ESCAPING
    ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
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


    /* =====================================================
       EXPOSE FUNCTIONS
    ===================================================== */

    window.openAddressForm =
        openAddressForm;

    window.editAddress =
        editAddress;

    window.deleteAddress =
        deleteAddress;

    window.setDefaultAddress =
        setDefaultAddress;

    window.renderAddresses =
        renderAddresses;


    /* =====================================================
       INITIALIZE
    ===================================================== */

    await loadAddresses();

    await updateCartCount();

});