// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Smooth Scrolling for anchor links (fallback/enhancement)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Lightbox Functionality
const modal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const closeModalBtn = document.querySelector('.close-modal');
const prevBtn = document.querySelector('.prev-img');
const nextBtn = document.querySelector('.next-img');

let currentImageIndex = 0;
let currentImageArray = [];

// Function to open single image or an image that belongs to a smaller visible group
window.openLightbox = function(imgElement) {
    // If we click a single visible image, just show it (or try to find its siblings if needed)
    // For simplicity, we can create a temporary array with just this image if it's isolated
    // But since it's inside a gallery, we can gather all visible images in that specific gallery
    
    const parentGallery = imgElement.closest('.cabin-gallery');
    if (parentGallery) {
        // Collect all images in this gallery (visible + hidden)
        const allImagesInGallery = parentGallery.querySelectorAll('img:not(.more-images img)');
        currentImageArray = Array.from(allImagesInGallery).map(img => img.src);
        
        // Find index of clicked image
        currentImageIndex = currentImageArray.indexOf(imgElement.src);
        if(currentImageIndex === -1) currentImageIndex = 0;
        
    } else {
        currentImageArray = [imgElement.src];
        currentImageIndex = 0;
    }
    
    updateLightboxImage();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
};

// Function to open a specific group of hidden images
window.openLightboxGroup = function(groupId) {
    const hiddenGroup = document.getElementById(`group-${groupId}`);
    if (hiddenGroup) {
        const images = hiddenGroup.querySelectorAll('img');
        currentImageArray = Array.from(images).map(img => img.src);
        currentImageIndex = 0;
        
        updateLightboxImage();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
};

function updateLightboxImage() {
    if (currentImageArray.length > 0) {
        lightboxImg.src = currentImageArray[currentImageIndex];
        
        // Hide/show navigation buttons based on array length
        if (currentImageArray.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        }
    }
}

// Close Modal
closeModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Navigate images
prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + currentImageArray.length) % currentImageArray.length;
    updateLightboxImage();
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % currentImageArray.length;
    updateLightboxImage();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + currentImageArray.length) % currentImageArray.length;
            updateLightboxImage();
        }
        if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % currentImageArray.length;
            updateLightboxImage();
        }
    }
});
