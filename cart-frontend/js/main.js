const API_URL = "https://cart-backend-8xew.onrender.com";


// =========================================================
// NAIJACART — HOMEPAGE JAVASCRIPT
// =========================================================


// =========================================================
// LOAD HOMEPAGE PRODUCTS
// =========================================================

async function loadHomeProducts() {

    const productGrid =
        document.getElementById("product-grid");

    if (!productGrid) return;

    try {

        const response =
            await fetch(API_URL + "/api/products");

        if (!response.ok) {
            throw new Error("Could not load products");
        }

        const products =
            await response.json();

        if (!products.length) {

            productGrid.innerHTML =
                "<p>No products available.</p>";

            return;
        }


        // Show first 8 products
        const popularProducts =
            products.slice(0, 8);


        productGrid.innerHTML =
            popularProducts.map(product => `

                <article class="product-card">

                    <a
                        href="/product?id=${product.id}"
                        class="product-link"
                    >

                        <div class="product-image-wrap">

                            <img
                                src="${API_URL}/images/products/${product.image}"
                                alt="${product.name}"
                                class="product-image"
                            >

                        </div>


                        <div class="product-info">

                            <p class="product-category">
                                ${product.category || ""}
                            </p>


                            <h3 class="product-name">
                                ${product.name || ""}
                            </h3>


                            <div class="product-rating">

                                <span class="rating-stars">
                                    ${createStars(product.rating)}
                                </span>

                                <span class="rating-number">
                                    ${Number(product.rating || 0).toFixed(1)}
                                    (${Number(product.review_count || 0)})
                                </span>

                            </div>


                            <div class="product-price">

                                ₦${Number(
                                    product.price || 0
                                ).toLocaleString()}

                            </div>

                        </div>

                    </a>

                </article>

            `).join("");


    } catch (error) {

        console.error(
            "Homepage product error:",
            error
        );


        productGrid.innerHTML = `
            <p>
                Unable to load products.
                Please make sure Flask is running.
            </p>
        `;

    }

}


// =========================================================
// STAR RATING
// =========================================================

function createStars(rating) {

    const rounded =
        Math.round(Number(rating) || 0);

    let stars = "";


    for (let i = 1; i <= 5; i++) {

        stars +=
            i <= rounded
                ? "★"
                : "☆";

    }


    return stars;
}


// =========================================================
// LOAD CATEGORIES
// =========================================================

async function loadHomeCategories() {

    const categoryList =
        document.getElementById("category-list");

    if (!categoryList) return;


    try {

        const response =
            await fetch(API_URL + "/api/products");

        if (!response.ok) {
            throw new Error("Could not load categories");
        }


        const products =
            await response.json();


        const categories = [
            ...new Set(
                products
                    .map(product => product.category)
                    .filter(Boolean)
            )
        ];


        categoryList.innerHTML =
            categories.map(category => `

                <a
                    href="/shop?category=${encodeURIComponent(category)}"
                    class="category-card"
                >

                    <span class="category-name">
                        ${category}
                    </span>


                    <span class="category-arrow">
                        →
                    </span>

                </a>

            `).join("");


    } catch (error) {

        console.error(
            "Homepage category error:",
            error
        );


        categoryList.innerHTML = `
            <p>
                Unable to load categories.
            </p>
        `;

    }

}


// =========================================================
// CART COUNT
// =========================================================

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("nc_cart")
        ) || [];


    const count =
        cart.reduce(
            (total, item) => {

                return total +
                    Number(item.quantity || 0);

            },
            0
        );


    document
        .querySelectorAll("#cart-count")
        .forEach(element => {

            element.textContent = count;

        });

}


// =========================================================
// START HOMEPAGE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadHomeProducts();

        loadHomeCategories();

        updateCartCount();

    }
);

// =========================================================
// NAIJACART — HERO SLIDESHOW
// =========================================================

function startHeroSlideshow() {

    const slides =
        document.querySelectorAll(".hero-slide");

    if (!slides.length) return;

    let currentSlide = 0;


    // Make sure the first slide is active
    slides.forEach((slide, index) => {

        slide.classList.toggle(
            "active",
            index === 0
        );

    });


    // Only start slideshow if there is
    // more than one slide
    if (slides.length <= 1) return;


    setInterval(function () {

        slides[currentSlide].classList.remove(
            "active"
        );


        currentSlide =
            (currentSlide + 1) % slides.length;


        slides[currentSlide].classList.add(
            "active"
        );

    }, 5000);

}


// =========================================================
// START HERO
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        startHeroSlideshow();

    }
);
