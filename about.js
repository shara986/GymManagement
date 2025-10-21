// ===== Highlight Active Menu Item =====
const menuLinks = document.querySelectorAll('.main-header nav ul li a');

menuLinks.forEach(link => {
    if (link.classList.contains('active')) return;
    link.addEventListener('click', function() {
        menuLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// ===== Smooth Scroll for Anchor Links (Optional) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Animate About Section on Load =====
window.addEventListener('load', () => {
    const container = document.querySelector('.page-section .container');
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
});
