document.addEventListener('DOMContentLoaded', () => {

    /* ── Animation des inputs au focus ── */
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.input-wrapper').style.transform = 'scale(1.01)';
        });
        input.addEventListener('blur', function() {
            this.closest('.input-wrapper').style.transform = 'scale(1)';
        });
    });

    /* ── Toggle mot de passe (yeux) ── */
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    /* ── Force du mot de passe (inscription) ── */
    const pwdInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar span');
    const strengthText = document.querySelector('.strength-text');

    if (pwdInput) {
        pwdInput.addEventListener('input', function() {
            const val = pwdInput.value;
            let strength = 0;
            if (val.length >= 8) strength++;
            if (/[A-Z]/.test(val)) strength++;
            if (/[0-9]/.test(val)) strength++;
            if (/[^A-Za-z0-9]/.test(val)) strength++;

            const percent = (strength / 4) * 100;
            strengthBar.style.width = percent + '%';

            if (strength <= 1) {
                strengthBar.style.background = '#DC2626';
                strengthText.textContent = 'Force : Faible';
                strengthText.style.color = '#DC2626';
            } else if (strength === 2) {
                strengthBar.style.background = '#F59E0B';
                strengthText.textContent = 'Force : Moyen';
                strengthText.style.color = '#F59E0B';
            } else if (strength === 3) {
                strengthBar.style.background = '#2D5FA8';
                strengthText.textContent = 'Force : Bon';
                strengthText.style.color = '#2D5FA8';
            } else if (strength === 4) {
                strengthBar.style.background = '#16A34A';
                strengthText.textContent = 'Force : Excellent';
                strengthText.style.color = '#16A34A';
            }
        });
    }

    /* ── Validation en temps réel ── */
    function showError(input, message) {
        input.classList.add('error');
        const errorSpan = input.closest('.input-group').querySelector('.error-message');
        if (errorSpan) errorSpan.textContent = message;
    }

    function clearError(input) {
        input.classList.remove('error');
        const errorSpan = input.closest('.input-group').querySelector('.error-message');
        if (errorSpan) errorSpan.textContent = '';
    }

    document.querySelectorAll('input[required]').forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) clearError(input);
        });
        input.addEventListener('blur', () => {
            if (!input.value.trim()) showError(input, 'Ce champ est requis.');
        });
    });

    /* ── Confirmation mot de passe ── */
    const confirmInput = document.getElementById('confirmPassword');
    if (confirmInput && pwdInput) {
        confirmInput.addEventListener('input', function() {
            if (confirmInput.value !== pwdInput.value) {
                showError(confirmInput, 'Les mots de passe ne correspondent pas.');
            } else {
                clearError(confirmInput);
            }
        });
    }

    /* ── Validation formulaire Connexion ── */
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let valid = true;
            const idField = document.getElementById('loginId');
            const pwdField = document.getElementById('loginPassword');

            if (!idField.value.trim()) {
                showError(idField, 'Veuillez entrer votre email ou téléphone.');
                valid = false;
            }
            if (!pwdField.value.trim()) {
                showError(pwdField, 'Veuillez entrer votre mot de passe.');
                valid = false;
            }

            if (valid) {
                // Simuler une redirection (vers mon-espace.html comme dans l'original)
                window.location.href = 'mon-espace.html';
            }
        });
    }

    /* ── Validation formulaire Inscription ── */
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let valid = true;
            const fullName = document.getElementById('fullName');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const pwd = document.getElementById('password');
            const confirmPwd = document.getElementById('confirmPassword');
            const terms = document.getElementById('acceptTerms');

            if (!fullName.value.trim()) {
                showError(fullName, 'Le nom complet est requis.');
                valid = false;
            }
            if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
                showError(email, 'Veuillez entrer un email valide.');
                valid = false;
            }
            if (!phone.value.trim() || !/^6\d{8}$/.test(phone.value.replace(/\s/g, ''))) {
                showError(phone, 'Format attendu : 6xx xxx xxx.');
                valid = false;
            }
            if (!pwd.value || pwd.value.length < 8) {
                showError(pwd, '8 caractères minimum.');
                valid = false;
            }
            if (confirmPwd.value !== pwd.value) {
                showError(confirmPwd, 'Les mots de passe ne correspondent pas.');
                valid = false;
            }
            if (!terms.checked) {
                const termsError = terms.closest('.input-group').querySelector('.error-message');
                if (termsError) termsError.textContent = 'Vous devez accepter les conditions.';
                valid = false;
            }

            if (valid) {
                // Simuler redirection
                window.location.href = 'connexion.html';
            }
        });
    }

});