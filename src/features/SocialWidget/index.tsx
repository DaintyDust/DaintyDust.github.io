import { useEffect, useRef, type ReactNode } from "react";
import "./styles/Widget.css";
import { initWidgetDragger } from "@/features/SocialWidget/ts/dragger";
import type { WidgetStartPosition } from "@/shared/types/widget";

interface WidgetProps {
  HeaderTitle: string;
  draggable?: boolean;
  position?: WidgetStartPosition;
  children?: ReactNode;
  className?: string;
}

function Widget({ HeaderTitle, draggable = true, position, children, className }: WidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const widget = widgetRef.current;
    if (!widget) {
      return;
    }

    if (!draggable) {
      void import("./styles/Widget.not-draggable.css");
      return;
    }

    return initWidgetDragger(widget, position);
  }, [draggable, position]);

  return (
    <div ref={widgetRef} className={`social-widget${!draggable ? " not-draggable" : ""}${className ? ` ${className}` : ""}`}>
      <div className="social-widget-header">
        <h3>{HeaderTitle}</h3>
        {draggable && <button className="widget-toggle">−</button>}
      </div>
      <div className="social-widget-content">{children}</div>
    </div>
  );
}

export default Widget;
export { default as SocialLink } from "./components/SocialLink";
