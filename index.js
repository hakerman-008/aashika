
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files (CSS, JS, images, music)
app.use('/styles.css', express.static(path.join(__dirname, 'styles.css')));
app.use('/script.js', express.static(path.join(__dirname, 'script.js')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/music', express.static(path.join(__dirname, 'music')));

// API endpoint to get available photos
app.get('/api/photos', (req, res) => {
    try {
        const publicDir = path.join(__dirname, 'public');
        const files = fs.readdirSync(publicDir);
        
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
    res.json({
        title: "Our Love Story - Digital Album",
        description: "A beautiful romantic digital photo album",
        totalPhotos: fs.readdirSync(path.join(__dirname, 'public')).filter(file => 
            file.match(/^photo\d+\.(jpg|jpeg|png|gif)$/i)
        ).length,
        hasMusic: fs.existsSync(path.join(__dirname, 'music', 'love-song.mp3'))
    });
});

// Serve the main HTML file for all routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`💕 Love Album server is running on port ${PORT}`);
    console.log(`🌐 Access your album at: http://localhost:${PORT}`);
    console.log(`📸 Total photos loaded: ${fs.readdirSync(path.join(__dirname, 'public')).filter(file => 
        file.match(/^photo\d+\.(jpg|jpeg|png|gif)$/i)
    ).length}`);
});
