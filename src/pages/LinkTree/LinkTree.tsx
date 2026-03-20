import "./LinkTree.css";
import Background from "@/features/Background/Index";
import Widget, { SocialLink } from "@/features/SocialWidget";
import Popup from "@/components/Popup";
import { Link } from "react-router-dom";
import YoutubeLogo from "@/assets/Socials/Youtube_Logo.png";
import GithubLogo from "@/assets/Socials/Github_Logo.png";
import DiscordLogo from "@/assets/Socials/Discord_Logo.png";
import TwitterLogo from "@/assets/Socials/Twitter_Logo.png";
import TwitchLogo from "@/assets/Socials/Twitch_Logo.png";
import RobloxLogo from "@/assets/Socials/Roblox_Logo.png";
import NickStudiosLogo from "@/assets/Socials/Nick_Studios_Logo.png";

function LinkTree() {
  return (
    <>
      <Background />
      <Link to="/" className="back-button">
        ← Back
      </Link>
      <Widget HeaderTitle="Social Links" draggable={false}>
        <div className="social-links">
          <SocialLink href="/youtube" src={YoutubeLogo} alt="YouTube" />
          <SocialLink href="/github" src={GithubLogo} alt="GitHub" />
          <SocialLink href="" src={DiscordLogo} alt="Discord" className="discord-username-copy-popup" />
          <SocialLink href="/twitter" src={TwitterLogo} alt="Twitter" />
          <SocialLink href="/twitch" src={TwitchLogo} alt="Twitch" />
          <SocialLink href="/robloxaccounts" src={RobloxLogo} alt="Roblox Accounts" />
          <SocialLink href="/group" src={NickStudiosLogo} alt="Nick Studios Group" />
        </div>
      </Widget>
      <Popup headerTitle="Discord Username" text="DaintyDust" />
    </>
  );
}

export default LinkTree;
