const SUPABASE_API_KEY = 'sb_publishable_vZkQ0-GURH8AVI4N9NbsOQ_0XnIDyxS';
const SUPABASE_URL = 'https://frczbpiyxbqvdrsgyvih.supabase.co/rest/v1/';

// Localhost

const express = require('express');
const path = require('path');
const app = express();

app.use('/cssfiles', express.static('cssfiles'));
app.use('/jsfiles', express.static('jsfiles'));
app.use('/javascriptfiles', express.static(path.join(__dirname, 'javascriptfiles')));
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'htmlfiles', 'index.html'));});
app.get('/theme', (req, res) => {res.sendFile(path.join(__dirname, 'htmlfiles', 'theme.html'));});
app.get('/controller', (req, res) => {res.sendFile(path.join(__dirname, 'htmlfiles', 'controller.html'));});
app.get('/auth', (req, res) => {res.sendFile(path.join(__dirname, 'htmlfiles', 'auth.html'));});
app.get('')

    
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
    console.log(`=== PersonalControllerBoard ===`);
    console.log(`- An interface to control machinery -`);
    console.log(`- Created by Jess -`)
    console.log(`- Supabase & Render & Github -`)
    console.log(`Express server: PersonalControllerBoard Port: ${PORT}`)
});
