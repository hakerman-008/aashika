const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files
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

// Serve the main HTML file for all routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '.' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`💝 Your romantic surprise is running on port ${PORT}`);
});
