let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");

closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  menuBtnChange(); // Wywołanie funkcji do zmiany ikony przycisku menu (opcjonalne)
});

function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
  }
}
const logoDetails = document.getElementById('logoDetails');
let logoAdded = false; // Flaga informująca, czy obrazek został już dodany

// Funkcja do dodawania obrazka
function addLogoImage() {
  if (!logoAdded) {
    const logoImage = document.createElement('img');
    logoImage.src = 'Logo.png';
    logoImage.alt = 'Logo RSS Empire Shop';
    logoImage.style.width = '40px';
    logoImage.style.marginRight = '10px';
    logoDetails.prepend(logoImage); // Dodajemy obrazek na początek elementu .logo-details
    logoAdded = true; // Ustawiamy flagę na true
  }
}

// Funkcja do usuwania obrazka
function removeLogoImage() {
  const logoImage = logoDetails.querySelector('img');
  if (logoImage) {
    logoImage.remove(); // Usuwamy obrazek
    logoAdded = false; // Ustawiamy flagę na false
  }
}

// Obsługa kliknięcia na ikonę menu
document.getElementById('btn').addEventListener('click', function() {
  if (logoAdded) {
    removeLogoImage(); // Usuwamy obrazek przy ponownym kliknięciu na ikonę menu
  } else {
    addLogoImage(); // Dodajemy obrazek przy pierwszym kliknięciu na ikonę menu
  }
});


