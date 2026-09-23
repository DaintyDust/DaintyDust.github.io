import { SocialLink } from "@/features/SocialWidget";
import type { LocaleContent } from "./index";
import EmailLogo from "@/assets/Socials/Email_Logo.png";
import LinkedInLogo from "@/assets/Socials/LinkedIn_Logo.png";
import GithubLogo from "@/assets/Socials/Github_Logo.png";
import DiscordLogo from "@/assets/Socials/Discord_Logo.png";

export const nl: LocaleContent = {
  backgroundText: "Nick",
  widgets: [
    {
      title: "Contact",
      position: "bottom-right",
      content: (
        <>
          <div className="social-links">
            <SocialLink href="mailto:nick@daintydust.dev" src={EmailLogo} alt="Email" />
            <SocialLink href="/linkedin" src={LinkedInLogo} alt="LinkedIn" target="_blank" />
            <SocialLink href="/github" src={GithubLogo} alt="GitHub" target="_blank" />
            <SocialLink href="" src={DiscordLogo} alt="Discord" className="discord-username-copy-popup" />
          </div>
        </>
      ),
    },
    {
      title: "Wie ben ik",
      position: "top-left",
      content: (
        <>
          <div>
            <p>Ik ben Nick, een {new Date().getFullYear() - 2008 - (new Date() < new Date(new Date().getFullYear(), 2, 11) ? 1 : 0)} jarige Student uit Brabant met een passie voor programmeren en gamen.</p>
          </div>
        </>
      ),
    },
    {
      title: "Mijn Projecten",
      position: "bottom-left",
      content: (
        <>
          <div>
            <p>Hier kan je mijn projecten bekijken</p>
          </div>
          <div className="widget-footer">
            <a href="/projects" className="project-btn">
              Bekijk alle projecten
            </a>
          </div>
        </>
      ),
    },
  ],
};
