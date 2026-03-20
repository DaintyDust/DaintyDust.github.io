import { SocialLink } from "@/features/SocialWidget";
import type { LocaleContent } from "./index";
import YoutubeLogo from "@/assets/Socials/Youtube_Logo.png";
import TwitterLogo from "@/assets/Socials/Twitter_Logo.png";
import GithubLogo from "@/assets/Socials/Github_Logo.png";
import DiscordLogo from "@/assets/Socials/Discord_Logo.png";
import RobloxLogo from "@/assets/Socials/Roblox_Logo.png";

export const en: LocaleContent = {
  backgroundText: "DaintyDust",
  widgets: [
    {
      title: "Socials",
      content: (
        <>
          <div className="social-links">
            <SocialLink href="/youtube" src={YoutubeLogo} alt="YouTube" />
            <SocialLink href="/twitter" src={TwitterLogo} alt="Twitter" />
            <SocialLink href="/github" src={GithubLogo} alt="GitHub" />
            <SocialLink href="" src={DiscordLogo} alt="Discord" className="discord-username-copy-popup" />
            <SocialLink href="/roblox" src={RobloxLogo} alt="Roblox" />
          </div>
          <div className="widget-footer">
            <a href="/linktree" className="linktree-btn">
              View All Links
            </a>
          </div>
        </>
      ),
    },
  ],
};
