import { SocialLink } from "@/features/SocialWidget";
import type { LocaleContent } from "./index";
import { Link } from "react-router-dom";
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
            <SocialLink href="/youtube" src={YoutubeLogo} alt="YouTube" target="_blank" />
            <SocialLink href="/twitter" src={TwitterLogo} alt="Twitter" target="_blank" />
            <SocialLink href="/github" src={GithubLogo} alt="GitHub" target="_blank" />
            <SocialLink href="" src={DiscordLogo} alt="Discord" className="discord-username-copy-popup" />
            <SocialLink href="/roblox" src={RobloxLogo} alt="Roblox" target="_blank" />
          </div>
          <div className="widget-footer">
            <Link to="/linktree" className="linktree-btn">
              View All Links
            </Link>
          </div>
        </>
      ),
    },
  ],
};
