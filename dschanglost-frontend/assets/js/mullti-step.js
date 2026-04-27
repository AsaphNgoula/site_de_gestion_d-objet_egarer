//Gestion des étapes du formulaire dépôt
document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const form = document.getElementById('depositForm');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const progressFill = document.querySelector('.progress-fill');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    let currentStep = 1;
    const totalSteps = 3;

    // Mise à jour de l'affichage
    function updateStepDisplay() {
        // Masquer toutes les étapes, afficher la courante
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === currentStep);
        });
        
        // Mise à jour des indicateurs
        stepIndicators.forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.classList.remove('active', 'completed');
            if (stepNum === currentStep) indicator.classList.add('active');
            else if (stepNum < currentStep) indicator.classList.add('completed');
        });
        
        // Barre de progression
        const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = progressPercent + '%';
        
        // Boutons de navigation
        prevBtn.disabled = currentStep === 1;
        
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
        } else {
            nextBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
        }
        
        // Mise à jour du récapitulatif à l'étape 3
        if (currentStep === 3) {
            updateRecap();
        }
    }

    // Validation des champs de l'étape courante
    function validateStep(step) {
        const currentStepEl = document.getElementById(`step${step}`);
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            const errorSpan = field.parentElement.querySelector('.error-message');
            if (!field.value.trim()) {
                field.classList.add('error');
                if (errorSpan) errorSpan.textContent = 'Ce champ est requis';
                isValid = false;
            } else {
                field.classList.remove('error');
                if (errorSpan) errorSpan.textContent = '';
            }
        });
        
        // Validation spécifique étape 3
        if (step === 3) {
            const termsCheck = document.getElementById('termsCheck');
            const termsError = termsCheck.closest('.form-group').querySelector('.error-message');
            if (!termsCheck.checked) {
                termsCheck.classList.add('error');
                if (termsError) termsError.textContent = 'Vous devez accepter les conditions';
                isValid = false;
            } else {
                termsCheck.classList.remove('error');
                if (termsError) termsError.textContent = '';
            }
        }
        
        return isValid;
    }

    // Validation en temps réel
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', function() {
            if (this.hasAttribute('required')) {
                if (this.value.trim()) {
                    this.classList.remove('error');
                    const errorSpan = this.parentElement.querySelector('.error-message');
                    if (errorSpan) errorSpan.textContent = '';
                }
            }
        });
    });

    // Gestion du lieu "Autre"
    const locationSelect = document.getElementById('location');
    const otherLocationGroup = document.getElementById('otherLocationGroup');
    if (locationSelect) {
        locationSelect.addEventListener('change', function() {
            otherLocationGroup.style.display = this.value === 'autre' ? 'block' : 'none';
            const otherInput = document.getElementById('otherLocation');
            if (this.value === 'autre') {
                otherInput.setAttribute('required', 'required');
            } else {
                otherInput.removeAttribute('required');
            }
        });
    }

    // Gestion de l'upload photo
    const photoInput = document.getElementById('photoInput');
    const previewImage = document.getElementById('previewImage');
    const previewPlaceholder = document.querySelector('.preview-placeholder');
    const clearPhotoBtn = document.getElementById('clearPhotoBtn');
    
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Le fichier est trop volumineux (max 5 Mo)');
                this.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                previewPlaceholder.style.display = 'none';
                clearPhotoBtn.style.display = 'inline-flex';
            };
            reader.readAsDataURL(file);
        }
    });
    
    clearPhotoBtn.addEventListener('click', function() {
        photoInput.value = '';
        previewImage.style.display = 'none';
        previewPlaceholder.style.display = 'flex';
        clearPhotoBtn.style.display = 'none';
    });

    // Mise à jour du récapitulatif
    function updateRecap() {
        const recapContent = document.getElementById('recapContent');
        const category = document.getElementById('category');
        const objectName = document.getElementById('objectName');
        const brand = document.getElementById('brand');
        const color = document.getElementById('color');
        const foundDate = document.getElementById('foundDate');
        const foundTime = document.getElementById('foundTime');
        const location = document.getElementById('location');
        const otherLocation = document.getElementById('otherLocation');
        const description = document.getElementById('description');
        
        let locationText = location.options[location.selectedIndex]?.text || '';
        if (location.value === 'autre' && otherLocation.value) {
            locationText += ` (${otherLocation.value})`;
        }
        
        const recapHtml = `
            <div class="recap-item"><span class="recap-label">Catégorie:</span> <span class="recap-value">${category.options[category.selectedIndex]?.text || '-'}</span></div>
            <div class="recap-item"><span class="recap-label">Objet:</span> <span class="recap-value">${objectName.value || '-'}</span></div>
            <div class="recap-item"><span class="recap-label">Marque:</span> <span class="recap-value">${brand.value || '-'}</span></div>
            <div class="recap-item"><span class="recap-label">Couleur:</span> <span class="recap-value">${color.value || '-'}</span></div>
            <div class="recap-item"><span class="recap-label">Date:</span> <span class="recap-value">${foundDate.value || '-'} ${foundTime.value || ''}</span></div>
            <div class="recap-item"><span class="recap-label">Lieu:</span> <span class="recap-value">${locationText}</span></div>
            <div class="recap-item"><span class="recap-label">Description:</span> <span class="recap-value">${description.value || '-'}</span></div>
        `;
        recapContent.innerHTML = recapHtml;
    }

    // Navigation
    nextBtn.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateStepDisplay();
            }
        }
    });
    
    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            updateStepDisplay();
        }
    });
    
    // Soumission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateStep(currentStep)) {
            // Ici on redirige vers la page de confirmation
            // Pour l'instant, on simule
            window.location.href = 'confirmation.html';
        }
    });

    // Initialisation
    updateStepDisplay();
});