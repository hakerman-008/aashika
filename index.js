const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files (no use of path module)
app.use('/styles.css', express.static('styles.css'));
app.use('/script.js', express.static('script.js'));
app.use('/public', express.static('public'));
app.use('/music', express.static('music'));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// API endpoint to get available photos
app.get('/api/photos', (req, res) => {
    try {
        const files = fs.readdirSync('./public');

        const photos = files
            .filter(file => file.match(/^photo\d+\.(jpg|jpeg|png|gif)$/i))
            .sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)[0]);
                const numB = parseInt(b.match(/\d+/)[0]);
                return numA - numB;
            })
            .map(file => ({
                filename: file,
                url: `/public/${file}`,
                id: parseInt(file.match(/\d+/)[0])
            }));

        res.json({
            success: true,
            count: photos.length,
            photos: photos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to load photos'
        });
    }
});

// API endpoint to get album info
app.get('/api/album-info', (req, res) => {
    const photoFiles = fs.readdirSync('./public').filter(file =>
        file.match(/^photo\d+\.(jpg|jpeg|png|gif)$/i)
    );

    const hasMusic = fs.existsSync('./music/love-song.mp3');

    res.json({
        title: "Our Love Story - Digital Album",
        description: "A beautiful romantic digital photo album",
        totalPhotos: photoFiles.length,
        hasMusic: hasMusic
    });
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '.' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`💕 Love Album server is running on port ${PORT}`);
    const photoCount = fs.readdirSync('./public').filter(file =>
        file.match(/^photo\d+\.(jpg|jpeg|png|gif)$/i)
    ).length;
    console.log(`🌐 Access your album at: http://localhost:${PORT}`);
    console.log(`📸 Total photos loaded: ${photoCount}`);
});
