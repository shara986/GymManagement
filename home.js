// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Highlight Active Menu Item =====
const menuLinks = document.querySelectorAll('.main-header nav ul li a');

menuLinks.forEach(link => {
    link.addEventListener('click', function() {
        menuLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// ===== Hero Section Animation on Load =====
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '1';
    heroContent.style.transform = 'translateY(0)';
});

// ===== "Get Started Today" Button Click =====
const getStartedBtn = document.querySelector('.hero-cta');
getStartedBtn.addEventListener('click', () => {
    // Check if user is logged in and redirect to dashboard
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        window.location.href = 'dashboard.html';
    } else {
        // If not logged in, redirect to login page
        window.location.href = 'login.html';
    }
});

// ===== Dashboard Button Click =====
const dashboardBtn = document.querySelector('.header-buttons .btn-primary');
if (dashboardBtn) {
    dashboardBtn.addEventListener('click', () => {
        // Check if user is logged in and redirect to dashboard
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            window.location.href = 'dashboard.html';
        } else {
            // If not logged in, redirect to login page
            window.location.href = 'login.html';
        }
    });
}

// ===== Optional: Sticky Header Effect =====
const header = document.querySelector('.main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
