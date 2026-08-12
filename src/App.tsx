import { useMemo, useRef, useState } from "react";
import DimensionPanel from "./components/DimensionPanel";
import LineCanvas2D from "./components/LineCanvas2D";
import ColorControls from "./components/ColorControls";
import ViewControls from "./components/ViewControls";
import Scene3D from "./components/Scene3D";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  CameraPreset,
  DrawingTool,
  ViewMode,
  WallGlobalSettings,
  WallLine,
} from "./types";
import "./App.css";

export default function App() {
  const [walls, setWalls] = useState<WallLine[]>([]);
  const [drawingTool, setDrawingTool] = useState<DrawingTool>("wall");

  const [settings, setSettings] = useState<WallGlobalSettings>({
    height: 8,
    thickness: 0.5,
    pixelsPerFoot: 20,
    color: "#c97a4a",
    textureUrl: null,
    textureScale: 1,
  });

  const [viewMode, setViewMode] = useState<ViewMode>("solid");
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("perspective");
  const [autoRotate, setAutoRotate] = useState(false);

  const canvasElRef = useRef<HTMLCanvasElement | null>(null);

  const wallIsLive = useMemo(() => walls.length > 0, [walls]);

  const totalLengthFt = useMemo(
    () =>
      walls.reduce((sum, w) => {
        const dx = w.end.x - w.start.x;
        const dy = w.end.y - w.start.y;
        return sum + Math.hypot(dx, dy) / settings.pixelsPerFoot;
      }, 0),
    [walls, settings.pixelsPerFoot]
  );

  const volume = totalLengthFt * settings.thickness * settings.height;
  const footprintArea = useMemo(() => {
    if (walls.length < 3) return 0;
    let area = 0;
    const pts = [
      ...walls.map((w) => ({ x: w.start.x / settings.pixelsPerFoot, y: w.start.y / settings.pixelsPerFoot })),
    ];
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      area += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
    }
    return Math.abs(area) / 2;
  }, [walls, settings.pixelsPerFoot]);

  function handleSavePng() {
    const canvas = canvasElRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `wall-structure-${walls.length}walls.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">BLUEPRINT STUDIO</span>
          <div>
            <h1>3D Wall Builder</h1>
            <div className="subtitle">Draw a blueprint · watch it become a 3D structure</div>
          </div>
        </div>
        <div className="status">
          <span>
            <span className={`status-dot ${wallIsLive ? "live" : ""}`} />
            {wallIsLive
              ? `${walls.length} ${walls.length === 1 ? "wall" : "walls"} rendering in 3D`
              : "Awaiting input"}
          </span>
          <span className="status-hint">Drag to rotate · Scroll to zoom · Right-drag to pan</span>
        </div>
      </header>

      <div className="app-body">
        <div className="drafting-column">
          <DimensionPanel
            height={settings.height}
            thickness={settings.thickness}
            pixelsPerFoot={settings.pixelsPerFoot}
            onChange={(height, thickness, pixelsPerFoot) =>
              setSettings((s) => ({ ...s, height, thickness, pixelsPerFoot }))
            }
          />
          <LineCanvas2D
            walls={walls}
            onWallsChange={setWalls}
            pixelsPerFoot={settings.pixelsPerFoot}
            drawingTool={drawingTool}
            onToolChange={setDrawingTool}
          />
          <ColorControls
            color={settings.color}
            textureUrl={settings.textureUrl}
            textureScale={settings.textureScale}
            onColorChange={(color) => setSettings((s) => ({ ...s, color }))}
            onImageUpload={(textureUrl) => setSettings((s) => ({ ...s, textureUrl }))}
            onRemoveImage={() => setSettings((s) => ({ ...s, textureUrl: null }))}
            onTextureScaleChange={(textureScale) => setSettings((s) => ({ ...s, textureScale }))}
          />
          <ViewControls
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            autoRotate={autoRotate}
            onAutoRotateChange={setAutoRotate}
            cameraPreset={cameraPreset}
            onCameraPresetChange={setCameraPreset}
            onSavePng={handleSavePng}
            canSave={wallIsLive}
          />
        </div>

        <div className="app-divider" />

        <div className="viewport-column">
          <ErrorBoundary>
            <Scene3D
              walls={walls}
              settings={settings}
              viewMode={viewMode}
              autoRotate={autoRotate}
              cameraPreset={cameraPreset}
              onCanvasReady={(el) => (canvasElRef.current = el)}
            />
          </ErrorBoundary>
          {wallIsLive && (
            <div className="viewport-hud">
              <div>
                <span className="k">WALLS</span>
                <span className="v">{walls.length}</span>
              </div>
              <div>
                <span className="k">TOTAL LENGTH</span>
                <span className="v">{totalLengthFt.toFixed(1)} ft</span>
              </div>
              <div>
                <span className="k">HEIGHT</span>
                <span className="v">{settings.height.toFixed(1)} ft</span>
              </div>
              <div>
                <span className="k">THICKNESS</span>
                <span className="v">{settings.thickness.toFixed(2)} ft</span>
              </div>
              <div>
                <span className="k">FOOTPRINT</span>
                <span className="v">{footprintArea.toFixed(1)} ft&sup2;</span>
              </div>
              <div>
                <span className="k">VOLUME</span>
                <span className="v">{volume.toFixed(1)} ft&sup3;</span>
              </div>
              <div>
                <span className="k">FINISH</span>
                <span className="v">{settings.textureUrl ? "tile image" : settings.color}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
