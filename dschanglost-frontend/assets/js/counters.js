// Animation des compteurs (déclenché au scroll)
function animateCounters() {
    const counters = document.querySelectorAll('.counter-number');
    const speed = 200; // Durée approx par incrément

    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = parseInt(counter.innerText);
            const increment = Math.ceil(target / speed);

            if (count < target) {
                counter.innerText = count + increment;
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

// Utilisation de l'Intersection Observer pour lancer l'animation quand visible
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const countersSection = document.querySelector('.counters');
if (countersSection) {
    observer.observe(countersSection);
}