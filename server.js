

// Localhost

const express = require('express');
const path = require('path');
const app = express();

app.use('/cssfiles', express.static('cssfiles'));
app.use('/jsfiles', express.static('jsfiles'));
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'htmlfiles', 'index.html'));});
app.get('/theme', (req, res) => {res.sendFile(path.join(__dirname, 'htmlfiles', 'theme.html'));});
app.get('/controller', (req, res) => {res.sendFile(path.join(__dirname, 'htmlfiles', 'controller.html'));});
    
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
});
