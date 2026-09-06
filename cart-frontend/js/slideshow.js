/* =========================================================
   NAIJACART — HERO SLIDESHOW
========================================================= */

console.log("🔥 NaijaCart slideshow loaded");


let currentSlide = 0;
let slideshowTimer = null;


/* =========================================================
   START SLIDESHOW
========================================================= */

function startSlideshow() {

    const slides = document.querySelectorAll(".hero-slide");

    if (!slides.length) {

        console.log("❌ No hero slides found");

        return;
    }

    if (slides.length <= 1) {

        console.log("ℹ️ Only one hero slide found");

        return;
    }


    console.log(`✅ ${slides.length} hero slides found`);


    // Make sure only the first slide is active

    slides.forEach((slide, index) => {

        slide.classList.toggle(
            "active",
            index === 0
        );

    });


    currentSlide = 0;


    // Prevent duplicate timers

    if (slideshowTimer) {

        clearInterval(slideshowTimer);

    }


    slideshowTimer = setInterval(() => {

        slides[currentSlide].classList.remove(
            "active"
        );


        currentSlide =
            (currentSlide + 1) % slides.length;


        slides[currentSlide].classList.add(
            "active"
        );


        console.log(
            `🎞️ Showing hero slide ${currentSlide + 1}`
        );

    }, 4000);

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        startSlideshow();

    }
);
