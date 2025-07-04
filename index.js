const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static files (CSS, JS, images) from "public"
app.use(express.static('public'));

// Serve music files from "music" folder (outside public)
app.use('/music', express.static('music'));

// Send index.html on root request
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
