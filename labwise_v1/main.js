// Labwise Website Interactive Components
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Service Filter Functionality
    const serviceFilters = document.querySelectorAll('.service-filter');
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active filter
            serviceFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards with animation
            serviceCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    anime({
                        targets: card,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                } else {
                    anime({
                        targets: card,
                        opacity: [1, 0],
                        translateY: [0, -20],
                        duration: 200,
                        easing: 'easeInQuad',
                        complete: function() {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
    
    // Contact Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateContactForm(data)) {
                // Show success message
                showFormMessage('success', 'Thank you! Your message has been sent successfully. We will contact you within 24 hours.');
                contactForm.reset();
            } else {
                showFormMessage('error', 'Please fill in all required fields correctly.');
            }
        });
    }
    
    // Appointment Form
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            if (validateAppointmentForm(data)) {
                showFormMessage('success', 'Appointment request submitted! We will contact you to confirm your appointment.');
                appointmentForm.reset();
            } else {
                showFormMessage('error', 'Please fill in all required fields.');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
    
    // Service card hover effects
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.02,
                boxShadow: '0 10px 30px rgba(107, 70, 193, 0.2)',
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
});

// Form validation functions
function validateContactForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    return data.name && 
           data.email && 
           emailRegex.test(data.email) && 
           data.message && 
           data.message.length > 10;
}

function validateAppointmentForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    return data.name && 
           data.email && 
           emailRegex.test(data.email) && 
           data.phone && 
           data.service && 
           data.date;
}

function showFormMessage(type, message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message p-4 mb-4 rounded-lg ${
        type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`;
    messageDiv.textContent = message;
    
    // Insert message after the form
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (form.id === 'contactForm' || form.id === 'appointmentForm') {
            form.parentNode.insertBefore(messageDiv.cloneNode(true), form.nextSibling);
        }
    });
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        const messages = document.querySelectorAll('.form-message');
        messages.forEach(msg => {
            anime({
                targets: msg,
                opacity: [1, 0],
                translateY: [0, -20],
                duration: 300,
                easing: 'easeInQuad',
                complete: function() {
                    msg.remove();
                }
            });
        });
    }, 5000);
}

// Initialize map for contact page
function initMap() {
    const mapElement = document.getElementById('map');
    if (mapElement && typeof L !== 'undefined') {
        // Harare, Zimbabwe coordinates
        const map = L.map('map').setView([-17.8292, 31.0522], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add marker for Labwise location
        L.marker([-17.8292, 31.0522])
            .addTo(map)
            .bindPopup('<b>Labwise Medical Centre</b><br>Smatsatsa Office Park Block C<br>Borrowdale, Harare, Zimbabwe')
            .openPopup();
    }
}

// Call map initialization when page loads
window.addEventListener('load', initMap);