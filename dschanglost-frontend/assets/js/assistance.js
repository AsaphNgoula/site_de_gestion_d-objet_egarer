const form = document.getElementById('assistance-form');
const msg = document.getElementById('success-msg');

form.addEventListener('submit', function(e) {
  e.preventDefault(); // empêche rechargement

  msg.classList.remove('hidden');

  form.reset();
});