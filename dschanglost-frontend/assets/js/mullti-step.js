/* ================================================
   mulllti-step.js — Formulaire dépôt multi-étapes
   DschangLost · Ville de Dschang
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ════════════════════════════════════════════
     VARIABLES
  ════════════════════════════════════════════ */
  let currentStep = 1;
  const TOTAL     = 3;

  /* ════════════════════════════════════════════
     FONCTIONS UTILITAIRES ERREURS
  ════════════════════════════════════════════ */
  function showError(fieldId, errId, msg) {
    var field = document.getElementById(fieldId);
    var err   = document.getElementById(errId);
    if (field) field.style.borderColor = '#DC2626';
    if (err)   { err.textContent = '⚠ ' + msg; err.style.display = 'block'; }
  }

  function clearError(fieldId, errId) {
    var field = document.getElementById(fieldId);
    var err   = document.getElementById(errId);
    if (field) field.style.borderColor = '';
    if (err)   { err.textContent = ''; err.style.display = 'none'; }
  }

  /* ════════════════════════════════════════════
     AFFICHER UNE ÉTAPE
  ════════════════════════════════════════════ */
  function goToStep(n) {

    /* Masquer tous les form-step */
    for (var i = 1; i <= TOTAL; i++) {
      var fs = document.getElementById('form-step-' + i);
      if (fs) { fs.style.display = 'none'; fs.classList.remove('active'); }
    }

    /* Afficher le step demandé */
    var target = document.getElementById('form-step-' + n);
    if (target) { target.style.display = 'block'; target.classList.add('active'); }

    /* Mettre à jour les indicateurs */
    for (var j = 1; j <= TOTAL; j++) {
      var ind = document.getElementById('step-indicator-' + j);
      if (!ind) continue;
      ind.classList.remove('active', 'done');
      if (j < n)  ind.classList.add('done');
      if (j === n) ind.classList.add('active');
    }

    /* Barre de progression */
    var bar = document.getElementById('stepper-progress');
    if (bar) bar.style.width = (((n - 1) / (TOTAL - 1)) * 100) + '%';

    /* Scroll haut */
    var card = document.querySelector('.form-card');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });

    currentStep = n;
  }

  /* ════════════════════════════════════════════
     VALIDATION ÉTAPE 1
  ════════════════════════════════════════════ */
  function validateStep1() {
    var ok = true;

    /* Catégorie */
    var cat = document.getElementById('categorie');
    if (!cat || !cat.value || cat.value === '') {
      showError('categorie', 'err-categorie', 'Veuillez sélectionner une catégorie.');
      ok = false;
    } else {
      clearError('categorie', 'err-categorie');
    }

    /* Nom objet */
    var nom = document.getElementById('nom-objet');
    if (!nom || nom.value.trim().length < 2) {
      showError('nom-objet', 'err-nom-objet', 'Veuillez saisir le nom de l\'objet.');
      ok = false;
    } else {
      clearError('nom-objet', 'err-nom-objet');
    }

    /* Description */
    var desc = document.getElementById('description');
    if (!desc || desc.value.trim().length < 20) {
      showError('description', 'err-description', 'Description trop courte (min. 20 caractères).');
      ok = false;
    } else {
      clearError('description', 'err-description');
    }

    return ok;
  }

  /* ════════════════════════════════════════════
     VALIDATION ÉTAPE 2
  ════════════════════════════════════════════ */
  function validateStep2() {
    var ok = true;

    /* Quartier */
    var qrt = document.getElementById('quartier');
    if (!qrt || !qrt.value || qrt.value === '') {
      showError('quartier', 'err-quartier', 'Veuillez sélectionner un quartier de Dschang.');
      ok = false;
    } else {
      clearError('quartier', 'err-quartier');
    }

    /* Date */
    var dat = document.getElementById('date-decouverte');
    if (!dat || !dat.value) {
      showError('date-decouverte', 'err-date', 'Veuillez saisir la date de découverte.');
      ok = false;
    } else {
      var sel   = new Date(dat.value);
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (sel > today) {
        showError('date-decouverte', 'err-date', 'La date ne peut pas être dans le futur.');
        ok = false;
      } else {
        clearError('date-decouverte', 'err-date');
      }
    }

    return ok;
  }

  /* ════════════════════════════════════════════
     VALIDATION ÉTAPE 3
  ════════════════════════════════════════════ */
  function validateStep3() {
    var ok = true;

    /* Nom inventeur */
    var nom = document.getElementById('inventeur-nom');
    if (!nom || nom.value.trim().length < 2) {
      showError('inventeur-nom', 'err-nom', 'Veuillez saisir votre nom complet.');
      ok = false;
    } else {
      clearError('inventeur-nom', 'err-nom');
    }

    /* Téléphone */
    var tel    = document.getElementById('inventeur-tel');
    var telVal = tel ? tel.value.replace(/\s/g, '') : '';
    if (!telVal || !/^6\d{8}$/.test(telVal)) {
      showError('inventeur-tel', 'err-tel', 'Format invalide. Ex : 677123456 (9 chiffres).');
      ok = false;
    } else {
      clearError('inventeur-tel', 'err-tel');
    }

    /* Checkbox */
    var chk = document.getElementById('confirm-check');
    var errChk = document.getElementById('err-confirm');
    if (!chk || !chk.checked) {
      if (errChk) { errChk.textContent = '⚠ Veuillez accepter les conditions.'; errChk.style.display = 'block'; }
      ok = false;
    } else {
      if (errChk) { errChk.textContent = ''; errChk.style.display = 'none'; }
    }

    return ok;
  }

  /* ════════════════════════════════════════════
     RÉCAPITULATIF
  ════════════════════════════════════════════ */
  function updateRecap() {
    var cat  = document.getElementById('categorie');
    var nom  = document.getElementById('nom-objet');
    var qrt  = document.getElementById('quartier');
    var dat  = document.getElementById('date-decouverte');

    function setText(id, val) {
      var el = document.getElementById(id);
      if (el) el.textContent = val || '—';
    }

    setText('recap-categorie', cat && cat.selectedIndex > 0 ? cat.options[cat.selectedIndex].text : '');
    setText('recap-nom',       nom ? nom.value : '');
    setText('recap-quartier',  qrt && qrt.selectedIndex > 0 ? qrt.options[qrt.selectedIndex].text : '');

    if (dat && dat.value) {
      var d = new Date(dat.value);
      setText('recap-date', d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }));
    } else {
      setText('recap-date', '—');
    }
  }

  /* ════════════════════════════════════════════
     SOUMISSION
  ════════════════════════════════════════════ */
  function submitForm() {
    var btn = document.getElementById('btn-submit');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    }
    setTimeout(function () {
      window.location.href = 'confirmation.html';
    }, 1500);
  }

  /* ════════════════════════════════════════════
     BRANCHEMENT DES BOUTONS
  ════════════════════════════════════════════ */

  /* Suivant étape 1 → 2 */
  var next1 = document.getElementById('btn-next-1');
  if (next1) {
    next1.addEventListener('click', function () {
      if (validateStep1()) goToStep(2);
    });
  }

  /* Suivant étape 2 → 3 */
  var next2 = document.getElementById('btn-next-2');
  if (next2) {
    next2.addEventListener('click', function () {
      if (validateStep2()) { updateRecap(); goToStep(3); }
    });
  }

  /* Précédent étape 2 → 1 */
  var prev2 = document.getElementById('btn-prev-2');
  if (prev2) prev2.addEventListener('click', function () { goToStep(1); });

  /* Précédent étape 3 → 2 */
  var prev3 = document.getElementById('btn-prev-3');
  if (prev3) prev3.addEventListener('click', function () { goToStep(2); });

  /* Envoyer */
  var submit = document.getElementById('btn-submit');
  if (submit) {
    submit.addEventListener('click', function () {
      if (validateStep3()) submitForm();
    });
  }

  /* ════════════════════════════════════════════
     UPLOAD PHOTO
  ════════════════════════════════════════════ */
  var photoInput    = document.getElementById('photo');
  var uploadZone    = document.getElementById('upload-zone');
  var uploadPlaceh  = document.getElementById('upload-placeholder');
  var uploadPreview = document.getElementById('upload-preview');
  var previewImg    = document.getElementById('preview-img');
  var removeBtn     = document.getElementById('remove-photo');

  function showPreview(file) {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('La photo ne doit pas dépasser 2 Mo.');
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      if (previewImg)    previewImg.src = e.target.result;
      if (uploadPlaceh)  uploadPlaceh.style.display  = 'none';
      if (uploadPreview) uploadPreview.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  function resetUpload() {
    if (photoInput)    photoInput.value  = '';
    if (previewImg)    previewImg.src    = '';
    if (uploadPlaceh)  uploadPlaceh.style.display  = 'block';
    if (uploadPreview) uploadPreview.style.display = 'none';
  }

  if (photoInput) photoInput.addEventListener('change', function () { if (this.files[0]) showPreview(this.files[0]); });
  if (removeBtn)  removeBtn.addEventListener('click', resetUpload);

  /* Drag & Drop */
  if (uploadZone) {
    uploadZone.addEventListener('dragover',  function (e) { e.preventDefault(); uploadZone.classList.add('dragover'); });
    uploadZone.addEventListener('dragleave', function ()  { uploadZone.classList.remove('dragover'); });
    uploadZone.addEventListener('drop',      function (e) {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      var file = e.dataTransfer.files[0];
      if (file && photoInput) { photoInput.files = e.dataTransfer.files; showPreview(file); }
    });
  }

  /* ════════════════════════════════════════════
     COMPTEUR CARACTÈRES
  ════════════════════════════════════════════ */
  var descEl    = document.getElementById('description');
  var charCount = document.getElementById('char-count');

  if (descEl && charCount) {
    descEl.addEventListener('input', function () {
      var len = this.value.length;
      charCount.textContent = len + ' / 500';
      charCount.style.color = len > 450 ? '#DC2626' : '#94A3B8';
      if (len > 500) this.value = this.value.substring(0, 500);
    });
  }

  /* ════════════════════════════════════════════
     INITIALISATION — forcer l'affichage étape 1
  ════════════════════════════════════════════ */

  /* Masquer tous les steps par défaut via JS (sécurité) */
  for (var i = 1; i <= TOTAL; i++) {
    var s = document.getElementById('form-step-' + i);
    if (s) s.style.display = 'none';
  }

  /* Afficher uniquement l'étape 1 */
  goToStep(1);

});