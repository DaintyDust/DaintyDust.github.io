// linktree.js

document.addEventListener('DOMContentLoaded', () => {
    const discordLink = document.getElementById('discord-link');
    
    if (discordLink) {
        discordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const discordUsername = '@DaintyDust'; 
            const message = `Discord username: ${discordUsername}`;
            
            navigator.clipboard.writeText(discordUsername)
                .then(() => {
                    console.log('Copied to clipboard:', discordUsername);
                    alert(`${message}\n\nCopied to clipboard!`);
                })
                .catch(err => {
                    console.error('Failed to copy:', err);
                    alert(`${message}\n\n(Could not copy to clipboard)`);
                });
        });
    }
});