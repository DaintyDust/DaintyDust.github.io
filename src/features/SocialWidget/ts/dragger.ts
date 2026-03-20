import type { WidgetStartPosition } from "@/shared/types/widget";

type WidgetPosition = {
  x: number;
  y: number;
};

type DragPoint = {
  clientX: number;
  clientY: number;
};

const MARGIN = 20;

function resolvePosition(widget: HTMLElement, position: WidgetStartPosition): { x: number; y: number } {
  const rect = widget.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const left = MARGIN;
  const right = vw - rect.width - MARGIN;
  const centerX = (vw - rect.width) / 2;
  const top = MARGIN;
  const middle = (vh - rect.height) / 2;
  const bottom = vh - rect.height - MARGIN;
  switch (position) {
    case "top-left":
      return { x: left, y: top };
    case "middle-left":
      return { x: left, y: middle };
    case "bottom-left":
      return { x: left, y: bottom };
    case "top-center":
      return { x: centerX, y: top };
    case "center":
      return { x: centerX, y: middle };
    case "bottom-center":
      return { x: centerX, y: bottom };
    case "top-right":
      return { x: right, y: top };
    case "middle-right":
      return { x: right, y: middle };
    case "bottom-right":
      return { x: right, y: bottom };
  }
}

export function initWidgetDragger(widget: HTMLElement, startPosition: WidgetStartPosition = "bottom-right") {
  const toggleBtn = widget.querySelector(".widget-toggle");
  if (!(toggleBtn instanceof HTMLButtonElement)) {
    return () => {};
  }

  const header = widget.querySelector(".social-widget-header");
  if (!(header instanceof HTMLElement)) {
    return () => {};
  }

  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let widgetStartX = 0;
  let widgetStartY = 0;
  let lastZoomLevel = window.devicePixelRatio;

  const applyPosition = (pos: WidgetStartPosition) => {
    const { x, y } = resolvePosition(widget, pos);
    widget.style.left = `${x}px`;
    widget.style.top = `${y}px`;
    widget.style.right = "auto";
    widget.style.bottom = "auto";
  };

  const resetToStartPosition = () => {
    applyPosition(startPosition);
  };

  applyPosition(startPosition);

  const detectZoomChange = () => {
    const currentZoom = window.devicePixelRatio;
    const visualViewport = window.visualViewport;
    if (Math.abs(currentZoom - lastZoomLevel) > 0.1) {
      resetToStartPosition();
      lastZoomLevel = currentZoom;
      return true;
    }

    if (visualViewport) {
      const expectedWidth = window.innerWidth;
      const actualWidth = visualViewport.width;
      if (Math.abs(expectedWidth - actualWidth) > 50) {
        resetToStartPosition();
        return true;
      }
    }

    return false;
  };

  const getWidgetPosition = (): WidgetPosition => {
    const rect = widget.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
    };
  };

  const setWidgetPosition = (x: number, y: number) => {
    if (detectZoomChange()) {
      return;
    }
    const rect = widget.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;
    const nextX = Math.max(0, Math.min(x, maxX));
    const nextY = Math.max(0, Math.min(y, maxY));
    widget.style.left = `${nextX}px`;
    widget.style.top = `${nextY}px`;
    widget.style.right = "auto";
    widget.style.bottom = "auto";
  };

  const handleToggleClick = () => {
    widget.classList.toggle("collapsed");
    toggleBtn.textContent = widget.classList.contains("collapsed") ? "+" : "−";
  };

  const handleResize = () => {
    window.setTimeout(detectZoomChange, 100);
  };

  const handleWheel = (event: WheelEvent) => {
    if (event.ctrlKey) {
      window.setTimeout(detectZoomChange, 200);
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.ctrlKey && (event.key === "+" || event.key === "-" || event.key === "0")) {
      window.setTimeout(detectZoomChange, 200);
    }
  };

  const startDrag = (point: DragPoint) => {
    isDragging = true;
    dragStartX = point.clientX;
    dragStartY = point.clientY;
    const position = getWidgetPosition();
    widgetStartX = position.x;
    widgetStartY = position.y;
    header.style.cursor = "grabbing";
    document.body.style.userSelect = "none";

    widgetOnTop();
  };

  const stopDrag = () => {
    if (!isDragging) {
      return;
    }
    isDragging = false;
    header.style.cursor = "move";
    document.body.style.userSelect = "";
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (event.target === toggleBtn) {
      return;
    }
    startDrag(event);
    event.preventDefault();
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) {
      return;
    }
    const deltaX = event.clientX - dragStartX;
    const deltaY = event.clientY - dragStartY;
    setWidgetPosition(widgetStartX + deltaX, widgetStartY + deltaY);
  };

  const handleTouchStart = (event: TouchEvent) => {
    if (event.target === toggleBtn) {
      return;
    }
    const touch = event.touches.item(0);
    if (!touch) {
      return;
    }
    startDrag(touch);
    event.preventDefault();
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!isDragging) {
      return;
    }
    const touch = event.touches.item(0);
    if (!touch) {
      return;
    }
    const deltaX = touch.clientX - dragStartX;
    const deltaY = touch.clientY - dragStartY;
    setWidgetPosition(widgetStartX + deltaX, widgetStartY + deltaY);
    event.preventDefault();
  };

  const widgetOnTop = () => {
    const allWidgets = document.querySelectorAll(".social-widget");
    allWidgets.forEach((w) => {
      const element = w as HTMLElement;
      if (element === widget) {
        element.style.zIndex = "10001";
      } else {
        element.style.zIndex = "10000";
      }
    });
  };

  toggleBtn.addEventListener("click", handleToggleClick);
  window.addEventListener("resize", handleResize);
  document.addEventListener("wheel", handleWheel, { passive: false });
  document.addEventListener("keydown", handleKeydown);
  header.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", stopDrag);
  header.addEventListener("touchstart", handleTouchStart, { passive: false });
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
  document.addEventListener("touchend", stopDrag);

  return () => {
    toggleBtn.removeEventListener("click", handleToggleClick);
    window.removeEventListener("resize", handleResize);
    document.removeEventListener("wheel", handleWheel);
    document.removeEventListener("keydown", handleKeydown);
    header.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopDrag);
    header.removeEventListener("touchstart", handleTouchStart);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", stopDrag);
  };
}
