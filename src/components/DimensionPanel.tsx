interface DimensionPanelProps {
  height: number;
  thickness: number;
  pixelsPerFoot: number;
  onChange: (height: number, thickness: number, pixelsPerFoot: number) => void;
}

// A single labelled numeric input, e.g. "HEIGHT  [ 8 ] ft"
function DimensionField({
  label,
  value,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="dim-field">
      <label>{label}</label>
      <div className="input-wrap">
        <input
          type="number"
          min={0}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        />
        <span className="unit">{unit}</span>
      </div>
    </div>
  );
}

export default function DimensionPanel({ height, thickness, pixelsPerFoot, onChange }: DimensionPanelProps) {
  return (
    <div className="panel">
      <p className="panel-title">
        <span className="idx">01</span> Wall dimensions
      </p>
      <div className="dim-grid">
        <DimensionField
          label="HEIGHT"
          value={height}
          step={0.1}
          unit="ft"
          onChange={(height) => onChange(height, thickness, pixelsPerFoot)}
        />
        <DimensionField
          label="THICKNESS"
          value={thickness}
          step={0.05}
          unit="ft"
          onChange={(thickness) => onChange(height, thickness, pixelsPerFoot)}
        />
        <DimensionField
          label="SCALE"
          value={pixelsPerFoot}
          step={1}
          unit="px/ft"
          onChange={(pixelsPerFoot) => onChange(height, thickness, pixelsPerFoot)}
        />
      </div>
      <p className="dim-hint">
        SCALE controls how many 2D pixels equal 1 foot. Bigger SCALE = larger 3D model.
      </p>
    </div>
  );
}
