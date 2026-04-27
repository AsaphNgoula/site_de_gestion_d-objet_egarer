//Validation temps réel pour formulaire
// Validation en temps réel supplémentaire
document.addEventListener('DOMContentLoaded', function() {
    // Validation de la date (pas dans le futur)
    const dateInput = document.getElementById('foundDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('max', today);
        
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const todayDate = new Date();
            if (selectedDate > todayDate) {
                this.classList.add('error');
                const errorSpan = this.parentElement.querySelector('.error-message');
                if (errorSpan) errorSpan.textContent = 'La date ne peut pas être dans le futur';
            } else {
                this.classList.remove('error');
            }
        });
    }
});