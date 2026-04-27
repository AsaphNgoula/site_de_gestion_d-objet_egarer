const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const objects = document.querySelectorAll(".object-card");

// 🔍 fonction filtre
function filterObjects() {
  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = filterCategory.value;

  objects.forEach(obj => {

    const text = obj.innerText.toLowerCase();
    const category = obj.getAttribute("data-category");

    const matchSearch = text.includes(searchValue);
    const matchCategory = (categoryValue === "all" || categoryValue === category);

    if (matchSearch && matchCategory) {
      obj.style.display = "block";
    } else {
      obj.style.display = "none";
    }

  });
}

// événements
searchInput.addEventListener("input", filterObjects);
filterCategory.addEventListener("change", filterObjects);

function filterObjects() {
  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = filterCategory.value;

  objects.forEach(obj => {

    const text = obj.innerText.toLowerCase();
    const category = obj.dataset.category;

    const matchSearch = text.includes(searchValue);
    const matchCategory = categoryValue === "all" || categoryValue === category;

    obj.style.display = (matchSearch && matchCategory) ? "block" : "none";
  });
}