
class DigitalAlbum {
    constructor() {
        this.currentPage = 0;
        this.photos = [];
        this.totalPages = 1; // Start with 1 for cover page
        this.isFlipping = false;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadPhotos();
        this.setupMusic();
        this.updatePageIndicator();
        this.updateNavigationButtons();
        this.addFlipAnimations();
    }

    setupEventListeners() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const musicToggle = document.getElementById('musicToggle');

        nextBtn.addEventListener('click', () => this.nextPage());
        prevBtn.addEventListener('click', () => this.previousPage());
        musicToggle.addEventListener('click', () => this.toggleMusic());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextPage();
            if (e.key === 'ArrowLeft') this.previousPage();
        });

        // Touch/swipe support
        let startX = 0;
        const book = document.getElementById('photoBook');
        
        book.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        book.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextPage();
                } else {
                    this.previousPage();
                }
            }
        });
    }

    async loadPhotos() {
        try {
            // In a real implementation, you would fetch this from a server
            // For now, we'll simulate loading photos from the public folder
            const photoFolder = 'public/';
            
            // This is a simulation - in reality, you'd have a proper API or file listing
            // You can add photo filenames here as you upload them
            const photoFiles = [
                'photo1.jpg',
                'photo2.jpg',
                'photo3.jpg',
                'photo4.jpg',
                'photo5.jpg'
                // Add more photo filenames here
            ];

            // Filter out files that actually exist
            const validPhotos = [];
            for (const photo of photoFiles) {
                try {
                    const response = await fetch(photoFolder + photo);
                    if (response.ok) {
                        validPhotos.push({
                            src: photoFolder + photo,
                            caption: this.generateCaption(photo)
                        });
                    }
                } catch (error) {
                    console.log(`Photo ${photo} not found, skipping...`);
                }
            }

            this.photos = validPhotos;
            this.generatePhotoPages();
            this.calculateTotalPages();
        } catch (error) {
            console.error('Error loading photos:', error);
            // Create a sample page if no photos are found
            this.createSamplePage();
        }
    }

    generateCaption(filename) {
        // Generate romantic captions based on filename or use random ones
        const captions = [
            "A moment frozen in time 💕",
            "When love speaks through smiles ❤️",
            "Our hearts beating as one 💖",
            "Pure joy captured forever 🌹",
            "Love in its purest form 💝",
            "Together is our favorite place 🥰",
            "Every picture tells our story 📸",
            "Made for each other 💞",
            "Love like this is rare 🌟",
            "Our perfect moment 💫"
        ];
        return captions[Math.floor(Math.random() * captions.length)];
    }

    createSamplePage() {
        const photoPagesContainer = document.getElementById('photoPages');
        photoPagesContainer.innerHTML = `
            <div class="page photo-page" data-page="1">
                <div class="page-content">
                    <div class="photo-container">
                        <div class="photo-frame">
                            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(45deg, #ff69b4, #ffc0cb); color: white; font-family: 'Dancing Script', cursive; font-size: 2rem; text-align: center;">
                                <div>
                                    <p>Upload your photos to the</p>
                                    <p><strong>'public'</strong> folder</p>
                                    <p>💕</p>
                                    <small style="font-size: 1rem;">Name them: photo1.jpg, photo2.jpg, etc.</small>
                                </div>
                            </div>
                        </div>
                        <div class="photo-caption">Add your beautiful memories here! 💖</div>
                    </div>
                </div>
            </div>
        `;
        this.totalPages = 3; // Cover + sample + end
    }

    generatePhotoPages() {
        const photoPagesContainer = document.getElementById('photoPages');
        photoPagesContainer.innerHTML = '';

        this.photos.forEach((photo, index) => {
            const pageElement = document.createElement('div');
            pageElement.className = 'page photo-page';
            pageElement.setAttribute('data-page', index + 1);
            
            pageElement.innerHTML = `
                <div class="page-content">
                    <div class="photo-container">
                        <div class="photo-frame">
                            <img src="${photo.src}" alt="Memory ${index + 1}" loading="lazy">
                        </div>
                        <div class="photo-caption">${photo.caption}</div>
                    </div>
                </div>
            `;

            photoPagesContainer.appendChild(pageElement);
        });
    }

    calculateTotalPages() {
        // Cover page + photo pages + end page
        this.totalPages = 1 + this.photos.length + 1;
        this.updatePageIndicator();
    }

    nextPage() {
        if (this.isFlipping || this.currentPage >= this.totalPages - 1) return;
        
        this.isFlipping = true;
        this.currentPage++;
        this.flipToPage(this.currentPage);
        this.addHeartBurst();
        
        setTimeout(() => {
            this.isFlipping = false;
        }, 1000);
    }

    previousPage() {
        if (this.isFlipping || this.currentPage <= 0) return;
        
        this.isFlipping = true;
        this.currentPage--;
        this.flipToPage(this.currentPage);
        this.addHeartBurst();
        
        setTimeout(() => {
            this.isFlipping = false;
        }, 1000);
    }

    flipToPage(pageNumber) {
        const allPages = document.querySelectorAll('.page');
        
        allPages.forEach((page, index) => {
            page.classList.remove('active', 'flipped', 'next', 'flipping-in', 'flipping-out');
            
            if (index === pageNumber) {
                page.classList.add('active', 'flipping-in');
            } else if (index < pageNumber) {
                page.classList.add('flipped');
            }
        });

        this.updatePageIndicator();
        this.updateNavigationButtons();
    }

    updatePageIndicator() {
        document.getElementById('currentPage').textContent = this.currentPage + 1;
        document.getElementById('totalPages').textContent = this.totalPages;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (this.currentPage <= 0) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
        
        if (this.currentPage >= this.totalPages - 1) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }

    addFlipAnimations() {
        // Add sparkle effects on page turns
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sparkle {
                0% { opacity: 0; transform: scale(0) rotate(0deg); }
                50% { opacity: 1; transform: scale(1) rotate(180deg); }
                100% { opacity: 0; transform: scale(0) rotate(360deg); }
            }
            .sparkle {
                position: absolute;
                width: 10px;
                height: 10px;
                background: #ff69b4;
                border-radius: 50%;
                pointer-events: none;
                animation: sparkle 1s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
    }

    addHeartBurst() {
        const book = document.getElementById('photoBook');
        const rect = book.getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.style.position = 'fixed';
            heart.style.left = rect.left + rect.width / 2 + 'px';
            heart.style.top = rect.top + rect.height / 2 + 'px';
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';
            heart.style.animation = `heartBurst 1.5s ease-out forwards`;
            heart.style.transform = `rotate(${i * 45}deg)`;
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 1500);
        }
        
        // Add heart burst animation
        if (!document.querySelector('#heartBurstStyle')) {
            const style = document.createElement('style');
            style.id = 'heartBurstStyle';
            style.textContent = `
                @keyframes heartBurst {
                    0% {
                        opacity: 1;
                        transform: scale(0) translateY(0) rotate(var(--rotation, 0deg));
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1) translateY(-30px) rotate(var(--rotation, 0deg));
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0.5) translateY(-60px) rotate(var(--rotation, 0deg));
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupMusic() {
        const audio = document.getElementById('backgroundMusic');
        const musicToggle = document.getElementById('musicToggle');
        
        // Try to play music (browsers might block autoplay)
        audio.play().catch(() => {
            console.log('Autoplay blocked. User must interact first.');
            musicToggle.textContent = '🔇';
        });

        audio.addEventListener('play', () => {
            musicToggle.textContent = '🎵';
        });

        audio.addEventListener('pause', () => {
            musicToggle.textContent = '🔇';
        });
    }

    toggleMusic() {
        const audio = document.getElementById('backgroundMusic');
        
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }
}

// Initialize the digital album when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DigitalAlbum();
});

// Add some extra love animations
function createRandomHearts() {
    setInterval(() => {
        if (Math.random() > 0.7) {
            const heart = document.createElement('div');
            heart.innerHTML = ['💕', '💖', '💝', '❤️', '💗'][Math.floor(Math.random() * 5)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = '-50px';
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '5';
            heart.style.animation = 'floatUp 4s linear forwards';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 4000);
        }
    }, 3000);
}

// Float up animation for random hearts
const floatUpStyle = document.createElement('style');
floatUpStyle.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 0;
            transform: translateY(0) scale(0.5);
        }
        10% {
            opacity: 1;
            transform: translateY(-10px) scale(1);
        }
        90% {
            opacity: 1;
            transform: translateY(-90vh) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100vh) scale(0.5);
        }
    }
`;
document.head.appendChild(floatUpStyle);

// Start random hearts animation
createRandomHearts();
