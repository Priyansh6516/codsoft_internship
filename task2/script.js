// Navigation Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        navLinks.classList.remove('active');
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar Background Change on Scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add/remove background color based on scroll position
    if (currentScroll > 50) {
        navbar.style.background = '#ffffff';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.boxShadow = 'none';
    }

    // Hide/show navbar based on scroll direction
    if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// Animate Elements on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .feature, .stat-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initialize animation styles
document.querySelectorAll('.service-card, .feature, .stat-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease';
});

// Add scroll event listener for animations
window.addEventListener('scroll', animateOnScroll);

// Form Submission Handler
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }, 1500);
});

// Counter Animation for Stats Section
const stats = document.querySelectorAll('.counter');
let hasAnimated = false;

const animateStats = () => {
    if (hasAnimated) return;

    const statsSection = document.querySelector('.stats');
    const statsSectionTop = statsSection.getBoundingClientRect().top;

    if (statsSectionTop < window.innerHeight * 0.75) {
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            let count = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps

            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    stat.textContent = Math.ceil(count) + (stat.textContent.includes('%') ? '%' : '+');
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target + (stat.textContent.includes('%') ? '%' : '+');
                }
            };

            updateCount();
        });

        hasAnimated = true;
    }
};

window.addEventListener('scroll', animateStats);