import { useRef } from "react";

interface ColorControlsProps {
  color: string;
  textureUrl: string | null;
  textureScale: number;
  onColorChange: (color: string) => void;
  onImageUpload: (dataUrl: string) => void;
  onRemoveImage: () => void;
  onTextureScaleChange: (scale: number) => void;
}

const PRESET_COLORS = [
  "#c97a4a",
  "#e8a33d",
  "#5aa8c2",
  "#8b8fd1",
  "#d9694f",
  "#eef3f2",
  "#7bbf6a",
  "#3b7fb0",
];

export default function ColorControls({
  color,
  textureUrl,
  textureScale,
  onColorChange,
  onImageUpload,
  onRemoveImage,
  onTextureScaleChange,
}: ColorControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onImageUpload(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="panel">
      <p className="panel-title">
        <span className="idx">03</span> Wall finish &amp; tile texture
      </p>

      <div className="swatch-row">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            className={`swatch ${!textureUrl && c === color ? "active" : ""}`}
            style={{ background: c }}
            onClick={() => onColorChange(c)}
            aria-label={`Set wall color ${c}`}
          />
        ))}
      </div>

      <div className="color-custom-row">
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
        />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--paper-dim)" }}>
          Custom color{textureUrl ? " (used once image is removed)" : ""}
        </span>
      </div>

      <label className="upload-drop">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {textureUrl ? "🔄 Replace uploaded image" : "🖼️ Upload a tile image for the walls"}
      </label>

      {textureUrl && (
        <div className="texture-preview">
          <img src={textureUrl} alt="Wall texture preview" />
          <span>Image applied to wall surface</span>
          <button className="btn danger" style={{ marginLeft: "auto" }} onClick={onRemoveImage}>
            Remove
          </button>
        </div>
      )}

      {textureUrl && (
        <div className="tile-scale-row">
          <div className="tile-scale-header">
            <span>Tile size</span>
            <span className="tile-scale-val">{textureScale.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={4}
            step={0.1}
            value={textureScale}
            onChange={(e) => onTextureScaleChange(parseFloat(e.target.value))}
          />
          <div className="tile-scale-hint">
            Drag to make tiles smaller (more repeats) or larger (fewer repeats)
          </div>
        </div>
      )}
    </div>
  );
}
