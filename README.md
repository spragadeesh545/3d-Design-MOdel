# Drafting Table — Stage 1: single 2D line → 3D wall

React + TypeScript + React Three Fiber. Enter Length/Width/Height, draw one
line on the 2D sheet, and a 3D wall with those exact dimensions appears
instantly on the right, orbit/zoom-able. Upload an image to texture the wall,
or pick a color.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Project layout

```
src/
  types.ts                    shared types (Point2D, WallLine, WallDimensions)
  App.tsx                     top-level state + layout
  App.css / index.css         blueprint-drafting visual theme
  components/
    DimensionPanel.tsx        Length / Width / Height inputs
    LineCanvas2D.tsx          SVG canvas, click-click line drawing
    ColorControls.tsx         color swatches + image upload
    Scene3D.tsx                R3F <Canvas>, lighting, grid, orbit controls
    Wall3D.tsx                 the extruded wall mesh itself
```

See the chat response for a full step-by-step walkthrough of how the pieces
fit together, and what to change first when extending this to multiple
connected walls (stage 2).
