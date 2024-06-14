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

function handleRedirect() {
    const path = window.location.pathname;
    console.log(path);
    console.log(redirects[path]);
    if (redirects[path]) {
        window.location.href = redirects[path];
    }
}

// Listen for URL changes
window.addEventListener('popstate', handleRedirect);

// Override pushState and replaceState to detect URL changes
(function(history) {
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function(state, title, url) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
        }
        handleRedirect();
        return pushState.apply(history, arguments);
    };

    history.replaceState = function(state, title, url) {
        if (typeof history.onreplacestate == "function") {
            history.onreplacestate({state: state});
        }
        handleRedirect();
        return replaceState.apply(history, arguments);
    };
})(window.history);

// Initial redirect check
handleRedirect();
