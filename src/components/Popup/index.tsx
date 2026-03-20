import "./styles/Popup.css";
import { useState, useEffect } from "react";
import Button from "@/components/Button";

type PopupProps = {
  headerTitle?: string;
  text: string;
  triggerClassName?: string;
};

function Popup({ headerTitle, text, triggerClassName = "discord-username-copy-popup" }: PopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if ((e.target as Element).closest(`.${triggerClassName}`)) {
        setIsOpen(true);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [triggerClassName]);

  const handleClose = () => setIsOpen(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert(`Failed to copy to clipboard. Username: ${text}`);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup" onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3>{headerTitle}</h3>
        <div className="popup-copy-text">{text}</div>
        <div className="popup-buttons">
          <Button className="popup-btn copy-btn" onClick={handleCopy}>
            Copy
          </Button>
          <Button className="popup-btn close-popup" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
