const sectionInfo = {
    dashboard: {
        title: "Dashboard",
        subtitle: "Store overview and performance"
    },

    orders: {
        title: "Orders",
        subtitle: "Manage customer orders"
    },

    products: {
        title: "Products",
        subtitle: "Manage your product catalogue"
    },

    customers: {
        title: "Customers",
        subtitle: "View registered customers"
    },

    inventory: {
        title: "Inventory",
        subtitle: "Monitor stock levels"
    },

    analytics: {
        title: "Analytics",
        subtitle: "Track store performance"
    },

    messages: {
        title: "Support",
        subtitle: "Customer support messages"
    }
};


/* =========================
   GO TO SECTION
========================= */

function goTo(section) {

    const target = document.getElementById(section);

    if (!target) {
        return;
    }

    document.querySelectorAll(".page-section").forEach(sectionElement => {
        sectionElement.classList.remove("active");
    });

    target.classList.add("active");


    document.querySelectorAll(".nav-link").forEach(link => {

        link.classList.remove("active");

        if (link.dataset.section === section) {
            link.classList.add("active");
        }

    });


    if (sectionInfo[section]) {

        const pageTitle = document.getElementById("pageTitle");
        const pageSubtitle = document.getElementById("pageSubtitle");

        if (pageTitle) {
            pageTitle.textContent = sectionInfo[section].title;
        }

        if (pageSubtitle) {
            pageSubtitle.textContent = sectionInfo[section].subtitle;
        }

    }


    if (window.location.hash !== "#" + section) {
        history.pushState(null, "", "#" + section);
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================
   LOAD SECTION FROM URL
========================= */

function loadSectionFromHash() {

    let section = window.location.hash.replace("#", "");

    if (!section || !document.getElementById(section)) {
        section = "dashboard";
    }

    goTo(section);

}


/* =========================
   NAVIGATION LINKS
========================= */

document.querySelectorAll(".nav-link[data-section]").forEach(link => {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        const section = this.dataset.section;

        goTo(section);

    });

});


/* =========================
   ALL DATA-GO BUTTONS
========================= */

document.querySelectorAll("[data-go]").forEach(element => {

    element.addEventListener("click", function (event) {

        event.preventDefault();

        const section = this.dataset.go;

        goTo(section);

    });

});


/* =========================
   ADD PRODUCT
========================= */

document.querySelectorAll('[data-action="add-product"]').forEach(button => {

    button.addEventListener("click", function () {

        goTo("products");

    });

});


/* =========================
   PRODUCT CARDS
========================= */

document.querySelectorAll(".product-card").forEach(card => {

    card.addEventListener("click", function () {

        const productName = this.dataset.product;

        if (!productName) {
            return;
        }

        goTo("products");

    });

});


/* =========================
   ORDER VIEW
========================= */

document.querySelectorAll(".view-order").forEach(button => {

    button.addEventListener("click", function (event) {

        event.stopPropagation();

        const orderNumber = this.dataset.order;

        if (!orderNumber) {
            return;
        }

        alert(
            "Order " + orderNumber +
            "\n\nOrder details can be connected to your database/API here."
        );

    });

});


/* =========================
   SUPPORT
========================= */

document.querySelectorAll(".support-item").forEach(item => {

    item.addEventListener("click", function () {

        const customer = this.dataset.customer;

        if (!customer) {
            return;
        }

        alert(
            "Support message from " +
            customer +
            "\n\nCustomer support details can be connected here."
        );

    });

});


/* =========================
   CHART
========================= */

const chartData = {

    7: [35, 50, 44, 68, 58, 78, 92],

    30: [40, 55, 48, 72, 63, 84, 96],

    90: [45, 60, 52, 77, 68, 88, 100]

};


function changeChart(value) {

    const heights = chartData[value];

    if (!heights) {
        return;
    }

    document.querySelectorAll(".bar").forEach((bar, index) => {

        if (heights[index] !== undefined) {
            bar.style.height = heights[index] + "%";
        }

    });

}


const chartSelect = document.getElementById("chartSelect");

if (chartSelect) {

    chartSelect.addEventListener("change", function () {

        changeChart(this.value);

    });

}


/* =========================
   LOGOUT
========================= */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        const confirmed = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmed) {
            return;
        }

        localStorage.removeItem("nc_token");
        localStorage.removeItem("token");

        window.location.href = "account.html";

    });

}


/* =========================
   HANDLE BROWSER BACK/FORWARD
========================= */

window.addEventListener("popstate", function () {

    loadSectionFromHash();

});


/* =========================
   START
========================= */

document.addEventListener("DOMContentLoaded", function () {

    loadSectionFromHash();

    changeChart("7");

});
