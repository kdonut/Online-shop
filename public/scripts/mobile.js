const mobileMenuBtnElem = document.getElementById('mobile-menu-btn');
const mobileMenuElem = document.getElementById('mobile-menu');

function toggleMobileMenu() {
    mobileMenuElem.classList.toggle('open');
}

mobileMenuBtnElem.addEventListener("click",toggleMobileMenu);