import { setThemeColors as setFontThemeColors, shape, timer, init } from "@/features/Background/ts/font";
import { setThemeColors as setBaseThemeColors } from "@/features/Background/ts/index";

export const commandOptions = ["Destroy", "Init", "Explode", "Clear", "Queue", "Countdown", "Galaxy", "Ring"] as const;
export const noTextCommandOptions = ["Destroy", "Init", "Explode", "Clear"] as const;

export type CommandOption = (typeof commandOptions)[number];
export type NoTextCommandOption = (typeof noTextCommandOptions)[number];

export const DEFAULT_COMMAND_THEME_COLORS = {
  bgColor: "#1d2227",
  borderColor: "#0d1a2e",
  cellHighlight: "#328bf6", //"#00b4d8",
  electronColor: "#0096c7", //"#328bf6", //"#0096c7",
  fontColor: "#0081a7",
} as const;

export type CommandThemeColors = {
  bgColor: string;
  borderColor: string;
  cellHighlight: string;
  electronColor: string;
  fontColor: string;
};

export function runCommand(command: CommandOption | NoTextCommandOption, DefaultText?: string, commandText?: string) {
  clearTimeout(timer);

  switch (command.toLowerCase()) {
    case "destroy":
      return shape.destroy();

    case "init":
      return init(DefaultText);

    case "explode":
      return shape.explode();

    case "clear":
      return shape.clear();

    case "queue":
      return shape.queue(commandText, DefaultText);

    case "countdown":
      return shape.countdown();

    case "galaxy":
      shape.clear();
      return shape.galaxy();

    case "ring":
      shape.clear();
      return shape.ring();
  }
}

export function runTextCommand(text: string, DefaultText?: string) {
  const value = text.trim();
  const displayText = value || DefaultText;

  if (!displayText) return;

  clearTimeout(timer);
  return shape.print(displayText);
}

export function applyThemeColors(colors: CommandThemeColors, hasText = true) {
  const apply = hasText ? setFontThemeColors : setBaseThemeColors;

  apply({
    bgColor: colors.bgColor,
    borderColor: colors.borderColor,
    cellHighlight: colors.cellHighlight,
    electronColor: colors.electronColor,
    fontColor: colors.fontColor,
  });
}
