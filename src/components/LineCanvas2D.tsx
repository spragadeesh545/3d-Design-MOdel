import { useEffect, useState, type MouseEvent } from "react";
import { DrawingTool, Point2D, WallLine } from "../types";

interface LineCanvas2DProps {
  walls: WallLine[];
  onWallsChange: (walls: WallLine[]) => void;
  pixelsPerFoot: number;
  drawingTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
}

const VIEW_W = 600;
const VIEW_H = 340;
const GRID_STEP = 20;
const ANGLE_SNAP_DEG = 15;
const NODE_SNAP_RADIUS = 15;

function getSvgPoint(evt: MouseEvent<SVGSVGElement>, svg: SVGSVGElement): Point2D {
  const rect = svg.getBoundingClientRect();
  const scaleX = VIEW_W / rect.width;
  const scaleY = VIEW_H / rect.height;
  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY,
  };
}

function angleDeg(origin: Point2D, point: Point2D): number {
  const raw = (Math.atan2(point.y - origin.y, point.x - origin.x) * 180) / Math.PI;
  return Math.round((raw + 360) % 360);
}

function snapAngle(origin: Point2D, point: Point2D): Point2D {
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const step = (ANGLE_SNAP_DEG * Math.PI) / 180;
  const snapped = Math.round(angle / step) * step;
  return {
    x: origin.x + Math.cos(snapped) * length,
    y: origin.y + Math.sin(snapped) * length,
  };
}

// Find existing node near raw point for snap
function findNearbyNode(point: Point2D, walls: WallLine[]): Point2D | null {
  for (const w of walls) {
    if (Math.hypot(w.start.x - point.x, w.start.y - point.y) <= NODE_SNAP_RADIUS) {
      return w.start;
    }
    if (Math.hypot(w.end.x - point.x, w.end.y - point.y) <= NODE_SNAP_RADIUS) {
      return w.end;
    }
  }
  return null;
}

export default function LineCanvas2D({
  walls,
  onWallsChange,
  pixelsPerFoot,
  drawingTool,
  onToolChange,
}: LineCanvas2DProps) {
  const [draftStart, setDraftStart] = useState<Point2D | null>(null);
  const [cursor, setCursor] = useState<Point2D | null>(null);
  const [shiftHeld, setShiftHeld] = useState(false);
  const [selectedWallId, setSelectedWallId] = useState<string | null>(null);

  // Track keyboard shortcuts: Esc cancels draft, Delete/Backspace deletes selected wall
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Shift") setShiftHeld(true);
      if (e.key === "Escape") {
        setDraftStart(null);
        setCursor(null);
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedWallId) {
        onWallsChange(walls.filter((w) => w.id !== selectedWallId));
        setSelectedWallId(null);
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "Shift") setShiftHeld(false);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [selectedWallId, walls, onWallsChange]);

  function getAdjustedPoint(raw: Point2D, start: Point2D | null): { point: Point2D; isNode: boolean } {
    const nodeSnap = findNearbyNode(raw, walls);
    if (nodeSnap) {
      return { point: nodeSnap, isNode: true };
    }
    if (start && shiftHeld) {
      return { point: snapAngle(start, raw), isNode: false };
    }
    return { point: raw, isNode: false };
  }

  function handleClick(evt: MouseEvent<SVGSVGElement>) {
    if (drawingTool === "select") return;
    const svg = evt.currentTarget;
    const raw = getSvgPoint(evt, svg);
    const { point } = getAdjustedPoint(raw, draftStart);

    if (!draftStart) {
      setDraftStart(point);
      return;
    }

    const dx = point.x - draftStart.x;
    const dy = point.y - draftStart.y;
    if (Math.hypot(dx, dy) < 8) return; // ignore tiny clicks

    const newWall: WallLine = {
      id: crypto.randomUUID(),
      start: draftStart,
      end: point,
    };

    onWallsChange([...walls, newWall]);
    // Continue chain from the endpoint!
    setDraftStart(point);
  }

  function handleRightClick(evt: MouseEvent<SVGSVGElement>) {
    evt.preventDefault();
    setDraftStart(null);
    setCursor(null);
  }

  function handleMove(evt: MouseEvent<SVGSVGElement>) {
    const raw = getSvgPoint(evt, evt.currentTarget);
    const { point } = getAdjustedPoint(raw, draftStart);
    setCursor(point);
  }

  function handleWallClick(e: MouseEvent, wallId: string) {
    if (drawingTool === "select") {
      e.stopPropagation();
      setSelectedWallId(wallId);
    }
  }

  function handleUndo() {
    if (walls.length === 0) return;
    onWallsChange(walls.slice(0, -1));
    setDraftStart(null);
    setSelectedWallId(null);
  }

  function handleClear() {
    setDraftStart(null);
    setCursor(null);
    setSelectedWallId(null);
    onWallsChange([]);
  }

  function handleFinishChain() {
    setDraftStart(null);
    setCursor(null);
  }

  // Preset generators
  function loadPreset(type: "house" | "lshape" | "circle") {
    setDraftStart(null);
    setCursor(null);
    setSelectedWallId(null);
    const newWalls: WallLine[] = [];

    if (type === "house") {
      // 4 walls
      const pts: Point2D[] = [
        { x: 170, y: 90 },
        { x: 430, y: 90 },
        { x: 430, y: 250 },
        { x: 170, y: 250 },
      ];
      for (let i = 0; i < 4; i++) {
        newWalls.push({
          id: crypto.randomUUID(),
          start: pts[i],
          end: pts[(i + 1) % 4],
        });
      }
    } else if (type === "lshape") {
      // L-shaped house structure
      const pts: Point2D[] = [
        { x: 160, y: 80 },
        { x: 440, y: 80 },
        { x: 440, y: 170 },
        { x: 300, y: 170 },
        { x: 300, y: 260 },
        { x: 160, y: 260 },
      ];
      for (let i = 0; i < 6; i++) {
        newWalls.push({
          id: crypto.randomUUID(),
          start: pts[i],
          end: pts[(i + 1) % 6],
        });
      }
    } else if (type === "circle") {
      // Octagonal circular structure (8 walls)
      const cx = 300;
      const cy = 170;
      const radius = 110;
      const count = 10;
      const pts: Point2D[] = [];
      for (let i = 0; i < count; i++) {
        const a = (i * 2 * Math.PI) / count;
        pts.push({
          x: cx + Math.cos(a) * radius,
          y: cy + Math.sin(a) * radius,
        });
      }
      for (let i = 0; i < count; i++) {
        newWalls.push({
          id: crypto.randomUUID(),
          start: pts[i],
          end: pts[(i + 1) % count],
        });
      }
    }

    onWallsChange(newWalls);
  }

  // SVG grid lines
  const gridLines = [];
  for (let x = 0; x <= VIEW_W; x += GRID_STEP) {
    gridLines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={VIEW_H} className="grid-line" />);
  }
  for (let y = 0; y <= VIEW_H; y += GRID_STEP) {
    gridLines.push(<line key={`h${y}`} x1={0} y1={y} x2={VIEW_W} y2={y} className="grid-line" />);
  }

  const activeDraftEnd = draftStart ? cursor : null;

  return (
    <div className="panel">
      <div className="panel-header">
        <p className="panel-title">
          <span className="idx">02</span> 2D Blueprint Draft
        </p>

        <div className="preset-bar">
          <span className="preset-label">PRESETS:</span>
          <button className="btn small" onClick={() => loadPreset("house")}>
            🏠 House
          </button>
          <button className="btn small" onClick={() => loadPreset("lshape")}>
            🏢 L-Home
          </button>
          <button className="btn small" onClick={() => loadPreset("circle")}>
            ⭕ Circle
          </button>
        </div>
      </div>

      <div className="tool-selector">
        <button
          className={`btn ${drawingTool === "wall" ? "primary" : ""}`}
          onClick={() => {
            onToolChange("wall");
            setSelectedWallId(null);
          }}
        >
          ✏️ Draw Wall
        </button>
        <button
          className={`btn ${drawingTool === "select" ? "primary" : ""}`}
          onClick={() => {
            onToolChange("select");
            setDraftStart(null);
          }}
        >
          🖐️ Select Wall
        </button>
        {draftStart && (
          <button className="btn warning" onClick={handleFinishChain}>
            ✓ Done Chain
          </button>
        )}
      </div>

      <div className="canvas-frame">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          onClick={handleClick}
          onContextMenu={handleRightClick}
          onMouseMove={handleMove}
          style={{ cursor: drawingTool === "select" ? "default" : "crosshair" }}
        >
          <defs>
            <style>{`
              .grid-line { stroke: rgba(90,168,194,0.14); stroke-width: 1; }
              .draft-line { stroke: #e8a33d; stroke-width: 2.5; stroke-dasharray: 6 5; }
              .draft-line.snapped { stroke-dasharray: none; }
              .final-line { stroke: #e8a33d; stroke-width: 3.5; stroke-linecap: round; cursor: pointer; }
              .final-line.selected { stroke: #ff4d4d; stroke-width: 5; }
              .final-line:hover { stroke: #fcd34d; stroke-width: 4.5; }
              .endpoint { fill: #eef3f2; stroke: #e8a33d; stroke-width: 2; }
              .endpoint-snap { fill: #38bdf8; stroke: #0284c7; stroke-width: 3; r: 7; }
              .wall-label { font-family: "JetBrains Mono", monospace; font-size: 10px; fill: #9fb3bb; text-anchor: middle; pointer-events: none; }
              .angle-tag { font-family: "JetBrains Mono", monospace; font-size: 11px; fill: #e8a33d; }
            `}</style>
          </defs>

          <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="transparent" />
          {gridLines}

          {/* Existing wall lines */}
          {walls.map((w) => {
            const dx = w.end.x - w.start.x;
            const dy = w.end.y - w.start.y;
            const lenPx = Math.hypot(dx, dy);
            const lenFt = (lenPx / pixelsPerFoot).toFixed(1);
            const midX = (w.start.x + w.end.x) / 2;
            const midY = (w.start.y + w.end.y) / 2;
            const isSelected = w.id === selectedWallId;

            return (
              <g key={w.id} onClick={(e) => handleWallClick(e, w.id)}>
                <line
                  x1={w.start.x}
                  y1={w.start.y}
                  x2={w.end.x}
                  y2={w.end.y}
                  className={`final-line ${isSelected ? "selected" : ""}`}
                />
                <circle cx={w.start.x} cy={w.start.y} r={4} className="endpoint" />
                <circle cx={w.end.x} cy={w.end.y} r={4} className="endpoint" />
                <text x={midX} y={midY - 7} className="wall-label">
                  {lenFt}ft
                </text>
              </g>
            );
          })}

          {/* Active drafting line */}
          {draftStart && activeDraftEnd && (
            <line
              x1={draftStart.x}
              y1={draftStart.y}
              x2={activeDraftEnd.x}
              y2={activeDraftEnd.y}
              className={`draft-line ${shiftHeld ? "snapped" : ""}`}
            />
          )}

          {draftStart && <circle cx={draftStart.x} cy={draftStart.y} r={5} className="endpoint" />}

          {/* Magnetic cursor / node snap indicator */}
          {cursor && findNearbyNode(cursor, walls) && (
            <circle cx={cursor.x} cy={cursor.y} r={7} className="endpoint-snap" />
          )}

          {/* Live angle & length readout */}
          {draftStart && activeDraftEnd && (
            <text x={activeDraftEnd.x + 12} y={activeDraftEnd.y - 10} className="angle-tag">
              {(Math.hypot(activeDraftEnd.x - draftStart.x, activeDraftEnd.y - draftStart.y) / pixelsPerFoot).toFixed(1)}ft · {angleDeg(draftStart, activeDraftEnd)}°
            </text>
          )}
        </svg>

        <span className="canvas-hint">
          {drawingTool === "select"
            ? selectedWallId
              ? "Wall selected! Click 'Delete Selected' or hit Backspace"
              : "Click on any wall to select it"
            : draftStart
            ? "Click to place wall end · Right-click/Esc to end wall chain · Shift snaps angle"
            : "Click anywhere on grid to start drawing walls"}
        </span>
      </div>

      <div className="canvas-toolbar">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--paper-dim)" }}>
          {walls.length} {walls.length === 1 ? "wall" : "walls"} drawn
        </span>

        <div style={{ display: "flex", gap: 8 }}>
          {selectedWallId && (
            <button
              className="btn danger"
              onClick={() => {
                onWallsChange(walls.filter((w) => w.id !== selectedWallId));
                setSelectedWallId(null);
              }}
            >
              Delete Selected
            </button>
          )}
          <button className="btn" onClick={handleUndo} disabled={walls.length === 0}>
            Undo
          </button>
          <button className="btn danger" onClick={handleClear} disabled={walls.length === 0 && !draftStart}>
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

