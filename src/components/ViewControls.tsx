import { CameraPreset, ViewMode } from "../types";

interface ViewControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  autoRotate: boolean;
  onAutoRotateChange: (value: boolean) => void;
  cameraPreset: CameraPreset;
  onCameraPresetChange: (preset: CameraPreset) => void;
  onSavePng: () => void;
  canSave: boolean;
}

const MODES: { value: ViewMode; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "wireframe", label: "Wireframe" },
  { value: "xray", label: "X-Ray" },
];

const CAMERA_VIEWS: { value: CameraPreset; label: string }[] = [
  { value: "perspective", label: "🎥 3D" },
  { value: "isometric", label: "📐 Isometric" },
  { value: "top", label: "🗺️ Top View" },
];

export default function ViewControls({
  viewMode,
  onViewModeChange,
  autoRotate,
  onAutoRotateChange,
  cameraPreset,
  onCameraPresetChange,
  onSavePng,
  canSave,
}: ViewControlsProps) {
  return (
    <div className="panel">
      <p className="panel-title">
        <span className="idx">04</span> View &amp; export
      </p>

      <span className="control-label">Render mode</span>
      <div className="segmented">
        {MODES.map((m) => (
          <button
            key={m.value}
            className={viewMode === m.value ? "active" : ""}
            onClick={() => onViewModeChange(m.value)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <span className="control-label">Camera preset</span>
      <div className="segmented">
        {CAMERA_VIEWS.map((v) => (
          <button
            key={v.value}
            className={cameraPreset === v.value ? "active" : ""}
            onClick={() => onCameraPresetChange(v.value)}
          >
            {v.label}
          </button>
        ))}
      </div>

      <label className="switch-row">
        <span>Auto-rotate</span>
        <span className={`switch ${autoRotate ? "on" : ""}`} onClick={() => onAutoRotateChange(!autoRotate)}>
          <span className="thumb" />
        </span>
      </label>

      <button className="btn primary" style={{ width: "100%", marginTop: 8 }} onClick={onSavePng} disabled={!canSave}>
        📸 Save PNG snapshot
      </button>
    </div>
  );
}
