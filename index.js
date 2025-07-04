const express = require('express');
const app = express();
const port = 5000;

app.use(express.static('public'));

// Additional security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`💝 Your romantic surprise is running on port ${port}`);
});
