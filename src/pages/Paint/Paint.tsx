import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import Background from "@/features/Background/Index";
import * as paintMod from "@/features/Background/ts/paint";
import Widget from "@/features/SocialWidget";
import "./Paint.css";
import { Pencil, Brush, Square, Circle, Type, Eraser, Trash } from "lucide-react";

type Tool = "pen" | "brush" | "rect" | "circle" | "text" | "eraser";
type Cell = { row: number; col: number; color: string };

function brushCells(row: number, col: number, color: string, density: number): Cell[] {
  const offset = Math.floor(density / 2);
  const cells: Cell[] = [];
  for (let dr = 0; dr < density; dr++) for (let dc = 0; dc < density; dc++) cells.push({ row: row - offset + dr, col: col - offset + dc, color });
  return cells;
}

function roundBrushCells(row: number, col: number, color: string, density: number): Cell[] {
  const cells: Cell[] = [];
  const radius = density / 2;
  for (let dr = -Math.ceil(radius); dr <= Math.ceil(radius); dr++) {
    for (let dc = -Math.ceil(radius); dc <= Math.ceil(radius); dc++) {
      if (Math.sqrt(dr * dr + dc * dc) <= radius) {
        cells.push({ row: row + dr, col: col + dc, color });
      }
    }
  }
  return cells;
}

function getPreviewCells(tool: Tool, color: string, density: number, hover: { row: number; col: number }, start: { row: number; col: number } | null): Cell[] {
  const cells: Cell[] = [];

  if (tool === "pen") {
    return brushCells(hover.row, hover.col, color, density);
  }

  if (tool === "brush") {
    return roundBrushCells(hover.row, hover.col, color, density);
  }

  if (tool === "eraser") {
    return brushCells(hover.row, hover.col, "#ffffff", density);
  }

  if (!start) return cells;

  if (tool === "rect") {
    const r1 = Math.min(start.row, hover.row),
      r2 = Math.max(start.row, hover.row);
    const c1 = Math.min(start.col, hover.col),
      c2 = Math.max(start.col, hover.col);
    for (let r = r1; r <= r2; r++) {
      cells.push(...brushCells(r, c1, color, density));
      cells.push(...brushCells(r, c2, color, density));
    }
    for (let c = c1; c <= c2; c++) {
      cells.push(...brushCells(r1, c, color, density));
      cells.push(...brushCells(r2, c, color, density));
    }
    return cells;
  }

  if (tool === "circle") {
    const cr = (start.row + hover.row) / 2;
    const cc = (start.col + hover.col) / 2;
    const radius = Math.max(Math.abs(hover.row - start.row), Math.abs(hover.col - start.col)) / 2;
    const steps = Math.ceil(2 * Math.PI * radius * 4);
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * 2 * Math.PI;
      const r = Math.round(cr + radius * Math.sin(angle));
      const c = Math.round(cc + radius * Math.cos(angle));
      cells.push(...brushCells(r, c, color, density));
    }
    return cells;
  }

  return cells;
}

export default function Paint() {
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#00b4d8");
  const [density, setDensity] = useState(1);
  const [cellSize, setCellSize] = useState(8);
  const isDrawing = useRef(false);
  const startCell = useRef<{ row: number; col: number } | null>(null);

  const getCellFromEvent = useCallback((e: React.MouseEvent) => {
    const cd = paintMod.getCellDistance ? paintMod.getCellDistance() : paintMod.CELL_DISTANCE;
    const row = Math.floor(e.clientY / cd);
    const col = Math.floor(e.clientX / cd);
    return { row, col };
  }, []);

  const applyTool = useCallback(
    (e: React.MouseEvent) => {
      const cursor = getCellFromEvent(e);

      if (tool === "eraser") {
        for (const { row, col } of brushCells(cursor.row, cursor.col, "", density)) paintMod.eraseCell(row, col);
        return;
      }

      if (tool === "pen") {
        for (const { row, col } of brushCells(cursor.row, cursor.col, color, density)) paintMod.paintCell(row, col, color);
      }

      if (tool === "brush") {
        for (const { row, col } of roundBrushCells(cursor.row, cursor.col, color, density)) paintMod.paintCell(row, col, color);
      }
    },
    [tool, color, density, getCellFromEvent],
  );

  const paintRect = useCallback(
    (from: { row: number; col: number }, to: { row: number; col: number }) => {
      const r1 = Math.min(from.row, to.row),
        r2 = Math.max(from.row, to.row);
      const c1 = Math.min(from.col, to.col),
        c2 = Math.max(from.col, to.col);
      for (let r = r1; r <= r2; r++) {
        for (const { row, col } of brushCells(r, c1, color, density)) paintMod.paintCell(row, col, color);
        for (const { row, col } of brushCells(r, c2, color, density)) paintMod.paintCell(row, col, color);
      }
      for (let c = c1; c <= c2; c++) {
        for (const { row, col } of brushCells(r1, c, color, density)) paintMod.paintCell(row, col, color);
        for (const { row, col } of brushCells(r2, c, color, density)) paintMod.paintCell(row, col, color);
      }
    },
    [color, density],
  );

  const paintCircle = useCallback(
    (from: { row: number; col: number }, to: { row: number; col: number }) => {
      const cr = (from.row + to.row) / 2;
      const cc = (from.col + to.col) / 2;
      const radius = Math.max(Math.abs(to.row - from.row), Math.abs(to.col - from.col)) / 2;
      const steps = Math.ceil(2 * Math.PI * radius * 4);
      for (let i = 0; i < steps; i++) {
        const angle = (i / steps) * 2 * Math.PI;
        const r = Math.round(cr + radius * Math.sin(angle));
        const c = Math.round(cc + radius * Math.cos(angle));
        for (const { row, col } of brushCells(r, c, color, density)) paintMod.paintCell(row, col, color);
      }
    },
    [color, density],
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".social-widget")) return;
      const cursor = getCellFromEvent(e);

      isDrawing.current = true;
      startCell.current = cursor;

    //   if (tool === "text") {
    //     const text = prompt("Voer tekst in:");
    //     if (!text) return;
    //     let dc = 0;
    //     for (const _ch of text) {
    //       paintMod.paintCell(cursor.row, cursor.col + dc, color);
    //       dc += 2;
    //     }
    //     return;
    //   }

      applyTool(e);
    },
    [tool, color, getCellFromEvent, applyTool],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const hover = getCellFromEvent(e);
      const preview = getPreviewCells(tool, color, density, hover, startCell.current);
      paintMod.setPreview(preview);

      if (!isDrawing.current) return;
      if (tool === "pen" || tool === "brush" || tool === "eraser") {
        applyTool(e);
      }
    },
    [tool, color, density, applyTool, getCellFromEvent],
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing.current) return;
      isDrawing.current = false;

      const from = startCell.current;
      const to = getCellFromEvent(e);
      if (!from || !to) return;

      if (tool === "rect") paintRect(from, to);
      if (tool === "circle") paintCircle(from, to);

      startCell.current = null;
    },
    [tool, getCellFromEvent, paintRect, paintCircle],
  );

  useEffect(() => {
    if (tool === "brush" && density < 5) setDensity(5);
  }, [tool]);

  const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: "pen", icon: <Pencil />, label: "Pencil" },
    { id: "brush", icon: <Brush />, label: "Brush" },
    { id: "rect", icon: <Square />, label: "Rectangle" },
    { id: "circle", icon: <Circle />, label: "Circle" },
    // { id: "text", icon: <Type />, label: "Text" },
    { id: "eraser", icon: <Eraser />, label: "Eraser" },
  ];

  return (
    <div style={{ width: "100vw", height: "100vh", cursor: "crosshair" }} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={() => paintMod.clearPreview()}>
      <Background paint={true} />

      <Link to="/" className="back-button">
        ← Back
      </Link>

      <Widget HeaderTitle="Tools" position="middle-left" draggable={true} className="paint-widget">
        <div className="paint-tools">
          {tools.map((t) => (
            <button key={t.id} type="button" className={`paint-tool-btn${tool === t.id ? " active" : ""}`} onClick={() => setTool(t.id)}>
              {t.icon}
              {t.label}
            </button>
          ))}

          <div className="paint-divider" />

          <label className="paint-label">Color</label>
          <input type="color" className="paint-color-input" value={color} onChange={(e) => setColor(e.target.value)} />

          <label className="paint-label">Size: {density}</label>
          <input type="range" min={1} max={50} value={density} onChange={(e) => setDensity(Number(e.target.value))} className="paint-range" />

          <label className="paint-label">Grid Size: {cellSize}px</label>
          <input
            type="range"
            min={2}
            max={24}
            step={2}
            value={cellSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setCellSize(newSize);
              paintMod.setCellSize(newSize);
            }}
            className="paint-range"
          />

          <div className="paint-divider" />

          <button type="button" className="paint-tool-btn paint-clear-btn" onClick={() => paintMod.clearPainted()}>
            <Trash /> Clear
          </button>
        </div>
      </Widget>
    </div>
  );
}
