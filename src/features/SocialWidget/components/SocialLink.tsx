import { Link } from "react-router-dom";
import "../styles/SocialLink.css";

interface SocialLinkProps {
  href: string;
  src: string;
  alt: string;
  target?: string;
  onClick?: () => void;
  className?: string;
}

function SocialLink({ href, src, alt, target, onClick, className }: SocialLinkProps) {
  const classes = ["social-link", className].filter(Boolean).join(" ");

  if (!href) {
    return (
      <div className={classes} onClick={onClick}>
        <img src={src} alt={alt} />
        <span>{alt}</span>
      </div>
    );
  }

  if (href.startsWith("/") && target !== "_blank") {
    return (
      <Link to={href} {...(target ? { target } : {})} className={classes} onClick={onClick}>
        <img src={src} alt={alt} />
        <span>{alt}</span>
      </Link>
    );
  }

  return (
    <a href={href} {...(target ? { target } : {})} className={classes} onClick={onClick}>
      <img src={src} alt={alt} />
      <span>{alt}</span>
    </a>
  );
}

export default SocialLink;
