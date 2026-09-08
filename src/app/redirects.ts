export function getBaseDomain(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      const parts = host.split(".");
      return parts.length >= 2 ? parts.slice(-2).join(".") : host;
    }
  }
  return "daintydust.dev";
}

export type RedirectTarget = string | ((baseDomain: string) => string);

export const externalRedirects: Record<string, RedirectTarget> = {
  games: (domain) => `https://games.${domain}`,
  assets: (domain) => `https://raw.${domain}`,
  nanotech: "https://www.roblox.com/games/11569994474/nanotech-project-NPRF",
  nprf: "https://www.roblox.com/games/11569994474/nanotech-project-NPRF",
  roblox: "https://www.roblox.com/users/544088422/profile",
  profile: "https://www.roblox.com/users/544088422/profile",
  youtube: "https://youtube.com/@DaintyDust",
  yt: "https://youtube.com/@DaintyDust",
  twitter: "https://twitter.com/NickV535",
  x: "https://twitter.com/NickV535",
  github: "https://github.com/DaintyDust",
  group: "https://www.roblox.com/groups/8193767/Nick-Studios#!/about",
  "nick-studios": "https://www.roblox.com/groups/8193767/Nick-Studios#!/about",
  twitch: "https://www.twitch.tv/daintydust",
  linkedin: "https://www.linkedin.com/in/nick-verbruggen",
};

export function resolveRedirect(path: string): string | null {
  const slug = path.replace(/^\/+|\/+$/g, "").toLowerCase();
  const target = externalRedirects[slug];

  if (!target) return null;
  return typeof target === "function" ? target(getBaseDomain()) : target;
}

export default externalRedirects;
