
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
        this.initializePageStates();
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
        // No need for 'public/' prefix since public folder is root in URL
        const photoFolder = '';

            // List all available photos (update this list based on your actual photos)
            const availablePhotos = [
                'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg',
                'photo6.jpg', 'photo7.jpg', 'photo8.jpg', 'photo9.jpg', 'photo10.jpg',
                'photo11.jpg', 'photo12.jpg', 'photo13.jpg', 'photo14.jpg', 'photo15.jpg',
                'photo16.jpg', 'photo17.jpg', 'photo18.jpg', 'photo19.jpg', 'photo20.jpg',
                'photo21.jpg', 'photo22.jpg', 'photo23.jpg', 'photo24.jpg', 'photo25.jpg',
                'photo26.jpg', 'photo27.jpg', 'photo28.jpg', 'photo29.jpg'
            ];

            // Convert to photo objects
            this.photos = availablePhotos.map(photo => ({
                src: photoFolder + photo,
                caption: this.generateCaption(photo)
            }));

            this.generatePhotoPages();
            this.calculateTotalPages();
        } catch (error) {
            console.error('Error loading photos:', error);
            // Create a sample page if no photos are found
            this.createSamplePage();
        }
    }

    generateCaption(filename) {
        // Generate romantic captions for her beautiful photos
        const captions = [
            "Your smile lights up my world 💕",
            "Absolutely breathtaking ❤️",
            "An angel in my eyes 👑",
            "Pure beauty captured forever 🌹",
            "You're my sunshine ☀️",
            "Perfection has a name - it's you 💝",
            "Every photo shows your magic ✨",
            "My heart skips a beat 💞",
            "Beauty beyond words 🌟",
            "You make everything beautiful 💫",
            "My favorite masterpiece 🎨",
            "Radiant as always 🌺",
            "Simply stunning 💖",
            "You're my dream come true 🌙",
            "Elegance personified 👸",
            "My beautiful queen 💎",
            "Grace and beauty combined 🦋",
            "You steal my breath away 💨",
            "Perfect in every way 🌈",
            "My heart's desire 💘"
        ];
        return captions[Math.floor(Math.random() * captions.length)];
    }

    createSamplePage() {
        const photoPagesContainer = document.getElementById('photoPages');
        photoPagesContainer.innerHTML = `
            <div class="page photo-page" data-page="1">
                <div class="page-spread">
                    <div class="left-page">
                        <div class="photo-container">
                            <div class="photo-frame">
                                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(45deg, #ff69b4, #ffc0cb); color: white; font-family: 'Dancing Script', cursive; font-size: 1.5rem; text-align: center;">
                                    <div>
                                        <p>Upload photos to</p>
                                        <p><strong>'public'</strong> folder</p>
                                        <p>💕</p>
                                    </div>
                                </div>
                            </div>
                            <div class="photo-caption">Her beautiful memories here! 💖</div>
                        </div>
                        <div class="love-quote quote-top-left">Your smile lights up my world 💕</div>
                        <div class="love-quote quote-bottom-left">You're my everything 💞</div>
                    </div>
                    <div class="right-page">
                        <div class="photo-container">
                            <div class="photo-frame">
                                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(45deg, #ff1493, #ffc0cb); color: white; font-family: 'Dancing Script', cursive; font-size: 1.5rem; text-align: center;">
                                    <div>
                                        <p>Name them:</p>
                                        <p>photo1.jpg</p>
                                        <p>photo2.jpg, etc.</p>
                                        <p>💖</p>
                                    </div>
                                </div>
                            </div>
                            <div class="photo-caption">More beautiful moments! ✨</div>
                        </div>
                        <div class="love-quote quote-top-right">My heart beats your name 💓</div>
                        <div class="love-quote quote-bottom-right">Forever and always 💍</div>
                    </div>
                </div>
            </div>
        `;
        this.totalPages = 3; // Cover + sample + end
    }

    generatePhotoPages() {
        const photoPagesContainer = document.getElementById('photoPages');
        photoPagesContainer.innerHTML = '';

        // Create pages for real book flipping - each page spread shows content that can flip
        for (let i = 0; i < this.photos.length; i++) {
            const currentPhoto = this.photos[i];
            const pageNumber = i + 1;

            const pageElement = document.createElement('div');
            pageElement.className = 'page photo-page';
            pageElement.setAttribute('data-page', pageNumber);
            pageElement.style.position = 'absolute';
            pageElement.style.top = '0';
            pageElement.style.left = '0';
            pageElement.style.zIndex = '1';

            const loveQuotes = this.getLoveQuotes();
            const randomQuotes = this.getRandomQuotes(loveQuotes, 4);

            // Show current page content and prepare next page content
            const nextPhoto = this.photos[i + 1];
            const nextRandomQuotes = this.getRandomQuotes(this.getLoveQuotes(), 4);

            pageElement.innerHTML = `
                <div class="page-spread">
                    <div class="left-page">
                        ${i > 0 ? this.createPhotoHTML(this.photos[i - 1], 'left') : `
                            <div class="love-quote quote-center-left">${randomQuotes[0]}</div>
                            <div class="love-quote quote-bottom-left">${randomQuotes[1]}</div>
                        `}
                    </div>
                    <div class="right-page">
                        ${this.createPhotoHTML(currentPhoto, 'right')}
                        <div class="love-quote quote-top-right">${randomQuotes[2]}</div>
                        <div class="love-quote quote-bottom-right">${randomQuotes[3]}</div>

                        <!-- Back side content (current photo will show on left when flipped) -->
                        <div class="right-page-back">
                            ${this.createPhotoHTML(currentPhoto, 'left')}
                            <div class="love-quote quote-top-left" style="position: absolute; top: 15px; left: 15px; width: 140px;">${randomQuotes[2]}</div>
                            <div class="love-quote quote-bottom-left" style="position: absolute; bottom: 15px; left: 15px; width: 140px;">${randomQuotes[3]}</div>
                        </div>
                    </div>

                    <!-- Next page content that appears on right during flip -->
                    <div class="next-page-content">
                        ${nextPhoto ? this.createPhotoHTML(nextPhoto, 'right') : `
                            <div class="love-quote quote-center-right">Thank you for all the beautiful memories... 💕</div>
                        `}
                        ${nextPhoto ? `
                            <div class="love-quote quote-top-right" style="position: absolute; top: 15px; right: 15px; width: 140px;">${nextRandomQuotes[0]}</div>
                            <div class="love-quote quote-bottom-right" style="position: absolute; bottom: 15px; right: 15px; width: 140px;">${nextRandomQuotes[1]}</div>
                        ` : ''}
                    </div>
                </div>
            `;

            photoPagesContainer.appendChild(pageElement);
        }
    }

    createPhotoHTML(photo, side) {
        if (!photo) return '';

        return `
            <div class="photo-container">
                <div class="photo-frame">
                    <img src="${photo.src}" alt="Beautiful Memory" loading="lazy">
                </div>
                <div class="photo-caption">${photo.caption}</div>
            </div>
        `;
    }

    getLoveQuotes() {
        return [
            "Your smile is my favorite curve 💕",
            "You're my today and all my tomorrows ✨",
            "In your eyes, I found my home 🏠",
            "You make ordinary moments extraordinary 🌟",
            "My heart beats your name 💓",
            "You're the reason I believe in love 💖",
            "Every day with you is a blessing 🙏",
            "You're my sunshine on cloudy days ☀️",
            "Your laugh is my favorite sound 🎵",
            "You complete my soul 💫",
            "Forever isn't long enough with you ♾️",
            "You're my greatest adventure 🌍",
            "Your love is my strength 💪",
            "You make me a better person 🌸",
            "My heart chose you 💘",
            "You're my happy place 🌈",
            "Love you beyond words 📝",
            "You're my everything 💞",
            "My favorite hello, hardest goodbye 👋",
            "You're worth every star in the sky ⭐",
            "Your beauty takes my breath away 😍",
            "You're my dream come true 🌙",
            "My love for you grows daily 📈",
            "You're my forever and always 💍",
            "Your heart is my treasure 💎",
            "You make me feel alive 🔥",
            "My angel on earth 👼",
            "You're my miracle 🌟",
            "Your love is my compass 🧭",
            "You're my perfect match 🧩",
            "My heart belongs to you 💝",
            "You're my greatest love story 📖",
            "Your presence is a gift 🎁",
            "You're my safe haven ⚓",
            "My queen, my everything 👑"
        ];
    }

    getRandomQuotes(quotes, count) {
        const shuffled = [...quotes].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    calculateTotalPages() {
        // Cover page + individual photo pages + end page
        const photoPages = this.photos.length;
        this.totalPages = 1 + photoPages + 1; // Cover + photo pages + end
        this.updatePageIndicator();
    }

    nextPage() {
        if (this.isFlipping || this.currentPage >= this.totalPages - 1) return;

        this.isFlipping = true;
        const currentPageElement = document.querySelector(`[data-page="${this.currentPage}"]`);
        const nextPageElement = document.querySelector(`[data-page="${this.currentPage + 1}"]`);

        if (currentPageElement) {
            // Add turning animation to current page
            currentPageElement.classList.add('turning');
            currentPageElement.style.zIndex = '15';
        }

        // Prepare next page to show its content on the right
        if (nextPageElement) {
            nextPageElement.style.zIndex = '8';
            nextPageElement.classList.add('preparing');
        }

        // Start the flip animation
        setTimeout(() => {
            if (currentPageElement) {
                currentPageElement.classList.add('flipped');
                currentPageElement.classList.remove('active');
            }

            this.currentPage++;
            if (nextPageElement) {
                nextPageElement.classList.add('active');
                nextPageElement.classList.remove('flipped', 'preparing');
                nextPageElement.style.zIndex = '10';
            }

            this.updatePageIndicator();
            this.updateNavigationButtons();
            this.addHeartBurst();
        }, 600); // Mid-way through animation

        // Clean up animation classes
        setTimeout(() => {
            if (currentPageElement) {
                currentPageElement.classList.remove('turning');
                currentPageElement.style.zIndex = '1';
            }
            this.isFlipping = false;
        }, 1200);
    }

    previousPage() {
        if (this.isFlipping || this.currentPage <= 0) return;

        this.isFlipping = true;
        const currentPageElement = document.querySelector(`[data-page="${this.currentPage}"]`);

        this.currentPage--;
        const previousPageElement = document.querySelector(`[data-page="${this.currentPage}"]`);

        if (previousPageElement) {
            // Add turning back animation to previous page
            previousPageElement.classList.add('turning-back');
            previousPageElement.style.zIndex = '15';
        }

        // Start the flip back animation
        setTimeout(() => {
            if (currentPageElement) {
                currentPageElement.classList.remove('active');
                currentPageElement.classList.add('flipped');
                currentPageElement.style.zIndex = '1';
            }

            if (previousPageElement) {
                previousPageElement.classList.add('active');
                previousPageElement.classList.remove('flipped');
            }

            this.updatePageIndicator();
            this.updateNavigationButtons();
            this.addHeartBurst();
        }, 600); // Mid-way through animation

        // Clean up animation classes
        setTimeout(() => {
            if (previousPageElement) {
                previousPageElement.classList.remove('turning-back');
                previousPageElement.style.zIndex = '10';
            }
            this.isFlipping = false;
        }, 1200);
    }

    initializePageStates() {
        const allPages = document.querySelectorAll('.page');

        allPages.forEach((page, index) => {
            page.classList.remove('active', 'flipped', 'turning', 'turning-back');

            if (index === this.currentPage) {
                page.classList.add('active');
                page.style.zIndex = '10';
                page.style.transform = 'rotateY(0deg)';
            } else if (index < this.currentPage) {
                page.classList.add('flipped');
                page.style.zIndex = '1';
                page.style.transform = 'rotateY(-180deg)';
            } else {
                // Pages that haven't been reached yet
                page.style.transform = 'rotateY(0deg)';
                page.style.zIndex = '2';
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
