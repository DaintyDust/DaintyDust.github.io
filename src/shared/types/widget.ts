import type { ReactNode } from "react";

export type WidgetStartPosition = "top-left" | "middle-left" | "bottom-left" | "top-center" | "center" | "bottom-center" | "top-right" | "middle-right" | "bottom-right";

export interface LocaleWidget {
  title: string;
  position?: WidgetStartPosition;
  content: ReactNode;
  draggable?: boolean;
}
