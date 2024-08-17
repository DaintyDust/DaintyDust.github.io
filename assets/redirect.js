const redirects = {
    "/nanotech": "https://www.roblox.com/games/11569994474/nanotech-project-NPRF",
    "/nprf": "https://www.roblox.com/games/11569994474/nanotech-project-NPRF",
    "/roblox": "https://www.roblox.com/users/544088422/profile",
    "/profile": "https://www.roblox.com/users/544088422/profile",
    "/youtube": "https://youtube.com/@DaintyDust",
     "/yt": "https://youtube.com/@DaintyDust",
    "/twitter": "https://twitter.com/NickV535",
    "/x": "https://twitter.com/NickV535",
    "/github": "https://github.com/DaintyDust",
    "/group": "https://www.roblox.com/groups/8193767/Nick-Studios#!/about",
    "/twitch": "https://www.twitch.tv/daintydust",
};

const path = window.location.pathname.toLowerCase();
console.log(path);
console.log(redirects[path]);
if (redirects[path]) {
    window.location.href = redirects[path];
}
