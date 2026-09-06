import { useState, useMemo, type ReactNode } from "react";
import { FloatingWindow } from "@mantine/core";
import type { UseFloatingWindowOptions } from "@mantine/hooks";
import "./styles/Widget.css";
import "./styles/Widget.not-draggable.css";
import type { WidgetStartPosition } from "@/shared/types/widget";

type FloatingPosition = NonNullable<UseFloatingWindowOptions["initialPosition"]>;

interface WidgetProps {
  HeaderTitle: string;
  draggable?: boolean;
  position?: WidgetStartPosition;
  offset?: number;
  children?: ReactNode;
  className?: string;
}

let topZIndex = 10000;
const DEFAULT_OFFSET = 20;

function resolveStartPosition(
  position: WidgetStartPosition = "bottom-right",
  offset: number = DEFAULT_OFFSET,
): FloatingPosition {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const centerX = Math.max(offset, Math.round((vw - 280) / 2));
  const centerY = Math.max(offset, Math.round((vh - 240) / 2));

  const positions: Record<WidgetStartPosition, FloatingPosition> = {
    "top-left": { top: offset, left: offset },
    "top-center": { top: offset, left: centerX },
    "top-right": { top: offset, right: offset },
    "middle-left": { top: centerY, left: offset },
    center: { top: centerY, left: centerX },
    "middle-right": { top: centerY, right: offset },
    "bottom-left": { bottom: offset, left: offset },
    "bottom-center": { bottom: offset, left: centerX },
    "bottom-right": { bottom: offset, right: offset },
  };

  return positions[position] ?? { bottom: offset, right: offset };
}

function Widget({
  HeaderTitle,
  draggable = true,
  position = "bottom-right",
  offset = DEFAULT_OFFSET,
  children,
  className,
}: WidgetProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [zIndex, setZIndex] = useState(10000);

  const initialPosition = useMemo(() => resolveStartPosition(position, offset), [position, offset]);

  const bringToTop = () => {
    topZIndex += 1;
    setZIndex(topZIndex);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsed((prev) => !prev);
  };

  if (!draggable) {
    return (
      <div className={`social-widget not-draggable${className ? ` ${className}` : ""}`}>
        <div className="social-widget-header">
          <h3>{HeaderTitle}</h3>
        </div>
        <div className="social-widget-content">{children}</div>
      </div>
    );
  }

  return (
    <FloatingWindow
      unstyled
      withinPortal={false}
      enabled={draggable}
      constrainToViewport
      constrainOffset={offset}
      dragHandleSelector=".social-widget-header"
      excludeDragHandleSelector=".widget-toggle"
      initialPosition={initialPosition}
      zIndex={zIndex}
      onDragStart={bringToTop}
      onMouseDownCapture={bringToTop}
      onTouchStartCapture={bringToTop}
      className={`social-widget${collapsed ? " collapsed" : ""}${className ? ` ${className}` : ""}`}
    >
      <div className="social-widget-header">
        <h3>{HeaderTitle}</h3>
        <button
          type="button"
          className="widget-toggle"
          onClick={handleToggle}
          aria-label={collapsed ? "Expand widget" : "Collapse widget"}
        >
          {collapsed ? "+" : "−"}
        </button>
      </div>
      <div className="social-widget-content">{children}</div>
    </FloatingWindow>
  );
}

export default Widget;
export { default as SocialLink } from "./components/SocialLink";
