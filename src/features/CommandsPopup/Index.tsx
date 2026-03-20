import Widget from "@/features/SocialWidget";
import { useEffect, useState, type FormEvent } from "react";
import { DEFAULT_COMMAND_THEME_COLORS, applyThemeColors, commandOptions, noTextCommandOptions, runCommand, runTextCommand, type CommandOption, type NoTextCommandOption } from "./ts/Commands";
import "./styles/CommandsPopup.css";

interface CommandsWidgetProps {
  HasText?: boolean;
  DefaultText?: string;
}

function CommandsWidget({ HasText = false, DefaultText }: CommandsWidgetProps) {
  const availableCommandOptions = HasText ? commandOptions : noTextCommandOptions;

  const [isVisible, setIsVisible] = useState(false);
  const [text, setText] = useState("");
  const [bgColor, setBgColor] = useState<string>(DEFAULT_COMMAND_THEME_COLORS.bgColor);
  const [borderColor, setBorderColor] = useState<string>(DEFAULT_COMMAND_THEME_COLORS.borderColor);
  const [cellHighlight, setCellHighlight] = useState<string>(DEFAULT_COMMAND_THEME_COLORS.cellHighlight);
  const [electronColor, setElectronColor] = useState<string>(DEFAULT_COMMAND_THEME_COLORS.electronColor);
  const [fontColor, setFontColor] = useState<string>(DEFAULT_COMMAND_THEME_COLORS.fontColor);
  const [command, setCommand] = useState<CommandOption | NoTextCommandOption | "">("");

  useEffect(() => {
    applyThemeColors(
      {
        bgColor,
        borderColor,
        cellHighlight,
        electronColor,
        fontColor,
      },
      HasText,
    );
  }, [bgColor, borderColor, cellHighlight, electronColor, fontColor, HasText]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.repeat) return;

      const isToggleShortcut = event.ctrlKey && !event.altKey && !event.metaKey && (event.key === "/" || event.code === "Slash");

      if (!isToggleShortcut) return;

      event.preventDefault();
      setIsVisible((value) => !value);
    };

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  function handleTextKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;

    event.preventDefault();
    runTextCommand(text, DefaultText);
  }

  function handleResetDefaults() {
    setBgColor(DEFAULT_COMMAND_THEME_COLORS.bgColor);
    setBorderColor(DEFAULT_COMMAND_THEME_COLORS.borderColor);
    setCellHighlight(DEFAULT_COMMAND_THEME_COLORS.cellHighlight);
    setElectronColor(DEFAULT_COMMAND_THEME_COLORS.electronColor);
    setFontColor(DEFAULT_COMMAND_THEME_COLORS.fontColor);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (command) {
      runCommand(command, DefaultText, text);
    }
  }

  if (!isVisible) {
    return null;
  }

  return (
    <Widget HeaderTitle="Commands" className="commands-widget" position="top-center">
      <form className="commands-form" onSubmit={handleSubmit}>
        {HasText && (
          <div className="commands-row commands-row-single">
            <label className="commands-field">
              <span className="commands-label">Text</span>
              <input id="CommandsInput" className="commands-input" type="text" value={text} onChange={({ target }) => setText(target.value)} onKeyDown={handleTextKeyDown} placeholder="Enter text" />
            </label>
          </div>
        )}

        <div className="commands-row commands-row-grid">
          <label className="commands-field">
            <span className="commands-label">Cell Background Color</span>
            <input className="commands-color" type="color" value={bgColor} onChange={({ target }) => setBgColor(target.value)} />
          </label>
          <label className="commands-field">
            <span className="commands-label">Cell Border Color</span>
            <input className="commands-color" type="color" value={borderColor} onChange={({ target }) => setBorderColor(target.value)} />
          </label>
        </div>

        <div className="commands-row commands-row-grid">
          <label className="commands-field">
            <span className="commands-label">Trail Color</span>
            <input className="commands-color" type="color" value={cellHighlight} onChange={({ target }) => setCellHighlight(target.value)} />
          </label>
          <label className="commands-field">
            <span className="commands-label">Electron Color</span>
            <input className="commands-color" type="color" value={electronColor} onChange={({ target }) => setElectronColor(target.value)} />
          </label>
        </div>
        {HasText && (
          <div className="commands-row commands-row-single">
            <label className="commands-field">
              <span className="commands-label">Font Color</span>
              <input className="commands-color" type="color" value={fontColor} onChange={({ target }) => setFontColor(target.value)} />
            </label>
          </div>
        )}

        <div className="commands-row commands-actions-row">
          <label className="commands-field">
            <span className="commands-label">Command</span>
            <select className="commands-select" value={command} onChange={({ target }) => setCommand(target.value as CommandOption | NoTextCommandOption | "")}>
              <option value="">Select</option>
              {availableCommandOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button className="commands-submit" type="submit">
            send
          </button>

          <button className="commands-reset" type="button" onClick={handleResetDefaults}>
            reset
          </button>
        </div>
      </form>
    </Widget>
  );
}

export default CommandsWidget;
