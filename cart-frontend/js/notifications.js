/* =========================================================
   CART — NOTIFICATIONS JAVASCRIPT
   Backend-connected customer notifications
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const notificationsList =
        document.getElementById("notificationsList");

    const notificationsEmpty =
        document.getElementById("notificationsEmpty");

    const markAllReadBtn =
        document.getElementById("markAllReadBtn");

    const filterButtons =
        document.querySelectorAll(".notification-filter");

    const orderNotifications =
        document.getElementById("orderNotifications");

    const accountNotifications =
        document.getElementById("accountNotifications");

    const offerNotifications =
        document.getElementById("offerNotifications");

    const searchForm =
        document.getElementById("searchForm");

    const searchInput =
        document.getElementById("searchInput");

    const cartCount =
        document.getElementById("cartCount");


    /* =====================================================
       LOCAL SETTINGS
       Notification preferences remain browser-specific.
    ===================================================== */

    const SETTINGS_KEY =
        "nc_notification_settings";

    const defaultSettings = {
        orders: true,
        account: true,
        offers: true
    };

    let activeFilter = "all";

    let notifications = [];


    /* =====================================================
       SETTINGS HELPERS
    ===================================================== */

    function getSettings() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(SETTINGS_KEY)
                );

            return {
                ...defaultSettings,
                ...(saved || {})
            };

        } catch (error) {

            console.warn(
                "Unable to load notification settings.",
                error
            );

            return {
                ...defaultSettings
            };
        }
    }


    function saveSettings(settings) {

        try {

            localStorage.setItem(
                SETTINGS_KEY,
                JSON.stringify(settings)
            );

        } catch (error) {

            console.warn(
                "Unable to save notification settings.",
                error
            );
        }
    }


    /* =====================================================
       CURRENT USER
    ===================================================== */

    async function getCurrentUser() {

        try {

            if (
                window.CartAPI &&
                typeof window.CartAPI.getCurrentUser === "function"
            ) {

                return await window.CartAPI.getCurrentUser();

            }

        } catch (error) {

            console.warn(
                "Unable to load current user.",
                error
            );
        }

        return null;
    }


    /* =====================================================
       LOAD NOTIFICATIONS FROM BACKEND
    ===================================================== */

    async function loadNotifications() {

        if (
            !window.CartAPI ||
            typeof window.CartAPI.getNotifications !== "function"
        ) {

            console.warn(
                "CartAPI notification methods are unavailable."
            );

            notifications = [];

            renderNotifications();

            return;
        }


        try {

            const response =
                await window.CartAPI.getNotifications();

            /*
             * Backend may return:
             * [
             *   {...}
             * ]
             *
             * or:
             * {
             *   notifications: [...]
             * }
             */

            if (Array.isArray(response)) {

                notifications = response;

            } else if (
                response &&
                Array.isArray(response.notifications)
            ) {

                notifications =
                    response.notifications;

            } else if (
                response &&
                Array.isArray(response.data)
            ) {

                notifications =
                    response.data;

            } else {

                notifications = [];
            }


            notifications =
                notifications.map(
                    normalizeNotification
                );


            /*
             * Keep the latest notifications first.
             */

            notifications.sort(
                (a, b) => {

                    const dateA =
                        new Date(a.date).getTime() || 0;

                    const dateB =
                        new Date(b.date).getTime() || 0;

                    return dateB - dateA;
                }
            );


            renderNotifications();


        } catch (error) {

            console.error(
                "Failed to load notifications:",
                error
            );

            notifications = [];

            renderNotifications();
        }
    }


    /* =====================================================
       NORMALIZE NOTIFICATION
    ===================================================== */

    function normalizeNotification(notification) {

        const item =
            notification || {};

        return {

            id:
                item.id ??
                item.notification_id ??
                `notification-${Date.now()}-${Math.random()}`,

            type:
                normalizeType(
                    item.type ||
                    item.category ||
                    "account"
                ),

            title:
                item.title ||
                "Notification",

            message:
                item.message ||
                item.body ||
                item.description ||
                "",

            date:
                item.date ||
                item.created_at ||
                item.createdAt ||
                new Date().toISOString(),

            read:
                Boolean(
                    item.read ??
                    item.is_read ??
                    false
                ),

            link:
                item.link ||
                item.url ||
                ""
        };
    }


    /* =====================================================
       NORMALIZE TYPE
    ===================================================== */

    function normalizeType(type) {

        const value =
            String(type || "")
                .trim()
                .toLowerCase();

        if (
            value === "order" ||
            value === "orders"
        ) {

            return "orders";
        }

        if (
            value === "offer" ||
            value === "offers" ||
            value === "promotion" ||
            value === "promotions"
        ) {

            return "offers";
        }

        return "account";
    }


    /* =====================================================
       FILTER NOTIFICATIONS
    ===================================================== */

    function getFilteredNotifications() {

        const settings =
            getSettings();

        return notifications.filter(
            notification => {

                const type =
                    normalizeType(
                        notification.type
                    );


                /*
                 * Respect notification preferences.
                 */

                if (
                    type === "orders" &&
                    !settings.orders
                ) {

                    return false;
                }


                if (
                    type === "account" &&
                    !settings.account
                ) {

                    return false;
                }


                if (
                    type === "offers" &&
                    !settings.offers
                ) {

                    return false;
                }


                /*
                 * Respect active filter.
                 */

                if (
                    activeFilter !== "all" &&
                    type !== activeFilter
                ) {

                    return false;
                }


                return true;
            }
        );
    }


    /* =====================================================
       RENDER NOTIFICATIONS
    ===================================================== */

    function renderNotifications() {

        if (!notificationsList) {
            return;
        }


        const filtered =
            getFilteredNotifications();


        notificationsList.innerHTML = "";


        if (filtered.length === 0) {

            notificationsList.hidden = true;

            if (notificationsEmpty) {
                notificationsEmpty.hidden = false;
            }

            return;
        }


        notificationsList.hidden = false;

        if (notificationsEmpty) {
            notificationsEmpty.hidden = true;
        }


        filtered.forEach(
            notification => {

                const item =
                    document.createElement("article");


                item.className =
                    `notification-item ${
                        notification.read
                            ? "read"
                            : "unread"
                    }`;


                item.dataset.id =
                    String(notification.id);


                const icon =
                    getIcon(
                        notification.type
                    );


                const link =
                    notification.link || "";


                item.innerHTML = `

                    <div class="notification-icon">
                        ${icon}
                    </div>


                    <div class="notification-content">

                        <div class="notification-top">

                            <h3>
                                ${escapeHTML(
                                    notification.title
                                )}
                            </h3>

                            ${
                                notification.read
                                    ? ""
                                    : `
                                        <span
                                            class="unread-dot"
                                            title="Unread"
                                        ></span>
                                    `
                            }

                        </div>


                        <p>
                            ${escapeHTML(
                                notification.message
                            )}
                        </p>


                        <time
                            datetime="${escapeHTML(
                                notification.date
                            )}"
                        >
                            ${formatDate(
                                notification.date
                            )}
                        </time>

                    </div>


                    <div class="notification-actions">

                        <button
                            type="button"
                            class="notification-read-btn"
                            data-action="toggle-read"
                        >
                            ${
                                notification.read
                                    ? "Mark unread"
                                    : "Mark read"
                            }
                        </button>

                        ${
                            link
                                ? `
                                    <a
                                        href="${escapeHTML(
                                            link
                                        )}"
                                        class="notification-view-btn"
                                    >
                                        View
                                    </a>
                                `
                                : ""
                        }

                    </div>

                `;


                const readButton =
                    item.querySelector(
                        ".notification-read-btn"
                    );


                if (readButton) {

                    readButton.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();
                            event.stopPropagation();

                            toggleNotificationRead(
                                notification.id
                            );
                        }
                    );
                }


                item.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target.closest("button") ||
                            event.target.closest("a")
                        ) {

                            return;
                        }


                        if (
                            !notification.read
                        ) {

                            markNotificationRead(
                                notification.id
                            );
                        }

                    }
                );


                notificationsList.appendChild(
                    item
                );

            }
        );
    }


    /* =====================================================
       MARK ONE NOTIFICATION AS READ
    ===================================================== */

    async function markNotificationRead(id) {

        const notification =
            notifications.find(
                item =>
                    String(item.id) === String(id)
            );


        if (!notification) {
            return;
        }


        if (notification.read) {
            return;
        }


        /*
         * Update the UI immediately.
         */

        notification.read = true;

        renderNotifications();


        try {

            if (
                window.CartAPI &&
                typeof window.CartAPI.markNotificationRead ===
                    "function"
            ) {

                await window.CartAPI.markNotificationRead(
                    id
                );
            }

        } catch (error) {

            console.error(
                "Failed to mark notification as read:",
                error
            );
        }
    }


    /* =====================================================
       TOGGLE READ STATE
    ===================================================== */

    async function toggleNotificationRead(id) {

        const notification =
            notifications.find(
                item =>
                    String(item.id) === String(id)
            );


        if (!notification) {
            return;
        }


        /*
         * Backend currently supports marking
         * notifications as read.
         *
         * For "Mark unread", keep the UI state
         * consistent without pretending that the
         * backend has an unread endpoint.
         */

        if (notification.read) {

            notification.read = false;

            renderNotifications();

            return;
        }


        await markNotificationRead(id);
    }


    /* =====================================================
       MARK ALL AS READ
    ===================================================== */

    if (markAllReadBtn) {

        markAllReadBtn.addEventListener(
            "click",
            async () => {

                const unread =
                    notifications.filter(
                        notification =>
                            !notification.read
                    );


                if (unread.length === 0) {

                    markAllReadBtn.textContent =
                        "All notifications read";

                    setTimeout(
                        () => {

                            markAllReadBtn.textContent =
                                "Mark all as read";

                        },
                        1800
                    );

                    return;
                }


                /*
                 * Update UI immediately.
                 */

                notifications.forEach(
                    notification => {
                        notification.read = true;
                    }
                );


                renderNotifications();


                /*
                 * Use backend endpoint when available.
                 */

                try {

                    if (
                        window.CartAPI &&
                        typeof window.CartAPI.markAllNotificationsRead ===
                            "function"
                    ) {

                        await window.CartAPI
                            .markAllNotificationsRead();

                    } else {

                        /*
                         * Fallback:
                         * mark each unread notification
                         * individually.
                         */

                        if (
                            window.CartAPI &&
                            typeof window.CartAPI.markNotificationRead ===
                                "function"
                        ) {

                            await Promise.all(
                                unread.map(
                                    notification =>
                                        window.CartAPI
                                            .markNotificationRead(
                                                notification.id
                                            )
                                )
                            );
                        }

                    }

                } catch (error) {

                    console.error(
                        "Failed to mark all notifications as read:",
                        error
                    );
                }


                markAllReadBtn.textContent =
                    "All notifications read";


                setTimeout(
                    () => {

                        markAllReadBtn.textContent =
                            "Mark all as read";

                    },
                    1800
                );

            }
        );
    }


    /* =====================================================
       FILTER BUTTONS
    ===================================================== */

    filterButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    activeFilter =
                        button.dataset.filter ||
                        "all";


                    filterButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );
                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    renderNotifications();
                }
            );
        }
    );


    /* =====================================================
       LOAD SETTINGS INTO UI
    ===================================================== */

    function loadSettingsIntoUI() {

        const settings =
            getSettings();


        if (orderNotifications) {

            orderNotifications.checked =
                settings.orders;
        }


        if (accountNotifications) {

            accountNotifications.checked =
                settings.account;
        }


        if (offerNotifications) {

            offerNotifications.checked =
                settings.offers;
        }
    }


    /* =====================================================
       UPDATE SETTING
    ===================================================== */

    function updateSetting(
        settingName,
        value
    ) {

        const settings =
            getSettings();


        settings[settingName] =
            Boolean(value);


        saveSettings(
            settings
        );


        renderNotifications();
    }


    if (orderNotifications) {

        orderNotifications.addEventListener(
            "change",
            () => {

                updateSetting(
                    "orders",
                    orderNotifications.checked
                );

            }
        );
    }


    if (accountNotifications) {

        accountNotifications.addEventListener(
            "change",
            () => {

                updateSetting(
                    "account",
                    accountNotifications.checked
                );

            }
        );
    }


    if (offerNotifications) {

        offerNotifications.addEventListener(
            "change",
            () => {

                updateSetting(
                    "offers",
                    offerNotifications.checked
                );

            }
        );
    }


    /* =====================================================
       SEARCH
    ===================================================== */

    if (
        searchForm &&
        searchInput
    ) {

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


        /*
         * Prefer the shared CartAPI helper.
         */

        try {

            if (
                window.CartAPI &&
                typeof window.CartAPI.updateCartCount ===
                    "function"
            ) {

                await window.CartAPI.updateCartCount();

                return;
            }

        } catch (error) {

            console.warn(
                "Shared cart count update failed.",
                error
            );
        }


        /*
         * Local fallback.
         */

        try {

            const cart =
                JSON.parse(
                    localStorage.getItem(
                        "nc_cart"
                    )
                ) || [];


            const count =
                cart.reduce(
                    (total, item) => {

                        return (
                            total +
                            Number(
                                item.quantity || 1
                            )
                        );

                    },
                    0
                );


            cartCount.textContent =
                String(count);

        } catch {

            cartCount.textContent = "0";
        }
    }


    /* =====================================================
       ICONS
    ===================================================== */

    function getIcon(type) {

        switch (
            normalizeType(type)
        ) {

            case "orders":
                return "📦";

            case "offers":
                return "🏷️";

            case "account":
                return "👤";

            default:
                return "🔔";
        }
    }


    /* =====================================================
       DATE FORMATTER
    ===================================================== */

    function formatDate(
        dateValue
    ) {

        const date =
            new Date(dateValue);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "";
        }


        const now =
            new Date();


        const difference =
            now.getTime() -
            date.getTime();


        const minute =
            60 * 1000;

        const hour =
            60 * minute;

        const day =
            24 * hour;


        if (
            difference < minute
        ) {

            return "Just now";
        }


        if (
            difference < hour
        ) {

            const minutes =
                Math.floor(
                    difference / minute
                );

            return `${minutes} min ago`;
        }


        if (
            difference < day
        ) {

            const hours =
                Math.floor(
                    difference / hour
                );

            return `${hours} hr ago`;
        }


        if (
            difference < 7 * day
        ) {

            const days =
                Math.floor(
                    difference / day
                );

            return (
                `${days} day${
                    days === 1
                        ? ""
                        : "s"
                } ago`
            );
        }


        return date.toLocaleDateString(
            "en-NG",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    }


    /* =====================================================
       HTML ESCAPING
    ===================================================== */

    function escapeHTML(value) {

        return String(
            value ?? ""
        )
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
       EXPOSE HELPERS
    ===================================================== */

    window.CartNotifications = {

        load:
            loadNotifications,

        render:
            renderNotifications,

        markRead:
            markNotificationRead,

        markAllRead:
            async () => {

                if (markAllReadBtn) {
                    markAllReadBtn.click();
                }
            },

        toggleRead:
            toggleNotificationRead
    };


    /*
     * Compatibility with other CART scripts.
     */

    window.addCartNotification =
        function (
            orderNumber,
            status
        ) {

            /*
             * Notifications should now be created
             * by the Flask backend when orders change.
             *
             * Reload the notifications page data
             * after an order operation.
             */

            loadNotifications();
        };


    /* =====================================================
       INITIALIZE
    ===================================================== */

    await getCurrentUser();

    loadSettingsIntoUI();

    await updateCartCount();

    await loadNotifications();

});