export interface Point2D {
  x: number;
  y: number;
}

export interface WallLine {
  id: string;
  start: Point2D;
  end: Point2D;
}

export interface WallGlobalSettings {
  height: number; // wall height in feet (e.g. 8)
  thickness: number; // wall thickness in feet (e.g. 0.5)
  pixelsPerFoot: number; // scale factor (e.g. 20 pixels = 1 foot)
  color: string;
  textureUrl: string | null;
  textureScale: number; // texture tiling factor
}

export type ViewMode = "solid" | "wireframe" | "xray";
export type CameraPreset = "perspective" | "top" | "isometric";
export type DrawingTool = "wall" | "select" | "rect" | "house" | "circle";

