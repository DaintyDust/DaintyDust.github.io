import "../styles/SocialLink.css";

interface SocialLinkProps {
  href: string;
  src: string;
  alt: string;
  onClick?: () => void;
  className?: string;
}

function SocialLink({ href, src, alt, onClick, className }: SocialLinkProps) {
  const Wrapper = href ? "a" : "div";
  const classes = ["social-link", className].filter(Boolean).join(" ");

  return (
    <Wrapper {...(href && { href, target: "_blank" })} className={classes} onClick={onClick}>
      <img src={src} alt={alt} />
      <span>{alt}</span>
    </Wrapper>
  );
}

export default SocialLink;
