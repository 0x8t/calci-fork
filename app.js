function insertNavbar() {
    const navbarHTML = `
    <nav class="navbar">
        <div class="navbar_container">
            <a href="index.html" id="navbar_logo">Calculation Engine</a>
            <div class="navbar_toggle" id="mobile-menu">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
            <ul class="navbar_menu">
                <li class="navbar_item">
                    <a href="normal_calc.html" class="navbar_links">Advanced Calculator</a>
                </li>
                <li class="navbar_item">
                    <a href="trig_calc.html" class="navbar_links">Function Plotter</a>
                </li>
                <li class="navbar_btn">
                    <a href="info.html" class="button">Help</a>
                </li>
            </ul>
        </div>
    </nav>`;
    document.getElementById('navbar-placeholder').innerHTML = navbarHTML;

    // Move event listener code here
    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.navbar_menu');

    menu.addEventListener('click', function() {
        menu.classList.toggle('is-active');
        menuLinks.classList.toggle('active');
    });
}

// Call the function to insert the navbar when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', insertNavbar);