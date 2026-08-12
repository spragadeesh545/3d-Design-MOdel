import { useMemo, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import Wall3D from "./Wall3D";
import TexturedMaterial from "./TexturedMaterial";
import { CameraPreset, ViewMode, WallGlobalSettings, WallLine } from "../types";

interface Scene3DProps {
  walls: WallLine[];
  settings: WallGlobalSettings;
  viewMode: ViewMode;
  autoRotate: boolean;
  cameraPreset: CameraPreset;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

// Corner pillar that fills the joint between two wall boxes so corners read clean.
function CornerPillar({
  position,
  settings,
  viewMode,
}: {
  position: [number, number, number];
  settings: WallGlobalSettings;
  viewMode: ViewMode;
}) {
  const isXray = viewMode === "xray";

  return (
    <mesh position={position} castShadow={!isXray} receiveShadow={!isXray}>
      <boxGeometry
        args={[settings.thickness * 1.06, settings.height * 0.999, settings.thickness * 1.06]}
      />
      {settings.textureUrl && !isXray ? (
        <TexturedMaterial
          url={settings.textureUrl}
          repeatX={1 * (settings.textureScale || 1)}
          repeatY={(settings.height / 4) * (settings.textureScale || 1)}
          transparent={isXray}
        />
      ) : (
        <meshStandardMaterial
          color={settings.color}
          transparent={isXray}
          opacity={isXray ? 0.35 : 1}
          roughness={0.5}
          metalness={0.1}
        />
      )}
    </mesh>
  );
}

// Helper component to reposition OrbitControls camera based on view preset
function CameraController({ cameraPreset }: { cameraPreset: CameraPreset }) {
  const { camera } = useThree();
  const controlsRef = useThree((state) => state.controls) as OrbitControlsImpl | null;

  useEffect(() => {
    if (cameraPreset === "top") {
      camera.position.set(0, 35, 0.01);
      if (controlsRef) controlsRef.target.set(0, 0, 0);
    } else if (cameraPreset === "isometric") {
      camera.position.set(18, 18, 18);
      if (controlsRef) controlsRef.target.set(0, 2, 0);
    } else {
      // Perspective default
      camera.position.set(12, 10, 16);
      if (controlsRef) controlsRef.target.set(0, 2, 0);
    }
    camera.updateProjectionMatrix();
    if (controlsRef) controlsRef.update();
  }, [cameraPreset, camera, controlsRef]);

  return null;
}

export default function Scene3D({
  walls,
  settings,
  viewMode,
  autoRotate,
  cameraPreset,
  onCanvasReady,
}: Scene3DProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const ready = walls.length > 0;

  // Extract unique corner joint locations for pillar caps
  const cornerPillars = useMemo(() => {
    if (walls.length < 2) return [];
    const pts: { x: number; z: number }[] = [];
    const seen = new Set<string>();

    walls.forEach((w) => {
      [w.start, w.end].forEach((p) => {
        const key = `${Math.round(p.x)},${Math.round(p.y)}`;
        if (!seen.has(key)) {
          seen.add(key);
          pts.push({
            x: (p.x - 300) / settings.pixelsPerFoot,
            z: (p.y - 170) / settings.pixelsPerFoot,
          });
        }
      });
    });
    return pts;
  }, [walls, settings.pixelsPerFoot]);

  const isWireframe = viewMode === "wireframe";

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [14, 12, 16], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        onCreated={(state) => onCanvasReady?.(state.gl.domElement)}
      >
        <CameraController cameraPreset={cameraPreset} />
        <color attach="background" args={["#071b26"]} />
        <fog attach="fog" args={["#071b26", 25, 65]} />

        {/* Lighting setup */}
        <ambientLight intensity={0.65} />
        <directionalLight
          position={[12, 18, 10]}
          intensity={1.25}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <directionalLight position={[-12, 8, -12]} intensity={0.4} color="#5aa8c2" />
        <pointLight position={[0, 12, 0]} intensity={0.3} color="#e8a33d" />

        {/* Ground grid */}
        <Grid
          args={[80, 80]}
          cellSize={1}
          cellColor="#123244"
          sectionSize={5}
          sectionColor="#2f6f86"
          fadeDistance={45}
          fadeStrength={1.2}
          infiniteGrid
        />

        {/* Render 3D Walls */}
        {walls.map((w) => (
          <Wall3D key={w.id} line={w} settings={settings} viewMode={viewMode} showDimensions />
        ))}

        {/* Corner join pillars for clean room corners */}
        {!isWireframe &&
          cornerPillars.map((p, idx) => (
            <CornerPillar
              key={idx}
              position={[p.x, settings.height / 2, p.z]}
              settings={settings}
              viewMode={viewMode}
            />
          ))}

        {/* 3D Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={1.5}
          maxDistance={80}
          maxPolarAngle={Math.PI / 2 + 0.05}
          autoRotate={autoRotate}
          autoRotateSpeed={1.4}
        />
      </Canvas>

      {!ready && (
        <div className="viewport-empty">
          <strong>No 3D Walls Yet</strong>
          <span>
            Draw wall lines on the 2D drafting blueprint or click one of the PRESETS (🏠 House, 🏢 L-Home, ⭕ Circle) to immediately construct a 3D structure!
          </span>
        </div>
      )}
    </>
  );
}

