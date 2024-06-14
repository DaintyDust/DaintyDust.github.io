// server.js

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const redirects = {
    "/nanotech": "https://www.roblox.com/games/11569994474/nanotech-project-NPRF",
    "/nprf": "https://www.roblox.com/games/11569994474/nanotech-project-NPRF",
    "/roblox": "https://www.roblox.com/users/544088422/profile",
    "/youtube": "https://youtube.com/@DaintyDust",
    "/twitter": "https://twitter.com/NickV535",
    "/x": "https://twitter.com/NickV535",
    "/github": "https://github.com/DaintyDust",
    "/group": "https://www.roblox.com/groups/8193767/Nick-Studios#!/about",
};

app.use(express.static(path.join(__dirname, 'Docs')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/Docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'Docs', 'index.html'));
});

app.get('/Docs/snake', (req, res) => {
    res.sendFile(path.join(__dirname, 'Docs', 'snake.html'));
});

app.get('/Docs/error', (req, res) => {
    res.sendFile(path.join(__dirname, 'Docs', 'error.html'));
});

app.get('*', (req, res) => {
    const redirectUrl = redirects[req.path];
    if (redirectUrl) {
        res.redirect(redirectUrl);
    } else {
        res.redirect('/Docs/error.html');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
