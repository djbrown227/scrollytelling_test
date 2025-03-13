document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll(".step");
    const image = document.getElementById("dynamic-image");

    function updateImage(entry) {
        if (entry.isIntersecting) {
            const newImage = entry.target.getAttribute("data-img");
            image.style.opacity = 0; // Fade out effect
            setTimeout(() => {
                image.src = newImage;
                image.style.opacity = 1; // Fade in effect
            }, 300);
            
            steps.forEach(step => step.classList.remove("active"));
            entry.target.classList.add("active");
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(updateImage);
    }, { threshold: 0.6 });

    steps.forEach(step => observer.observe(step));
});
