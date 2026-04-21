//menu hambuger,scroll// Gestion du menu mobile (hamburger animé)
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', function() {
            menuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
    }
    
    // Lien admin caché : s'affiche avec Ctrl+Shift+A (pour démo)
    const adminLink = document.getElementById('hiddenAdminLink');
    if (adminLink) {
        let keysPressed = {};
        window.addEventListener('keydown', (e) => {
            keysPressed[e.key] = true;
            if (keysPressed['Control'] && keysPressed['Shift'] && e.key === 'A') {
                adminLink.style.display = 'inline-block';
                console.log('Accès Admin débloqué');
            }
        });
        window.addEventListener('keyup', (e) => delete keysPressed[e.key]);
    }
});