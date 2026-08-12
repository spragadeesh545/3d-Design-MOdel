import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ViewMode, WallGlobalSettings, WallLine } from "../types";
import TexturedMaterial from "./TexturedMaterial";

interface Wall3DProps {
  line: WallLine;
  settings: WallGlobalSettings;
  viewMode: ViewMode;
  showDimensions?: boolean;
}

const POP_IN_SECONDS = 0.35;

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export default function Wall3D({ line, settings, viewMode, showDimensions = true }: Wall3DProps) {
  const { height, thickness, pixelsPerFoot, color, textureUrl, textureScale } = settings;

  // Calculate real length in feet from the 2D vector length in pixels
  const { lengthFt, angle, position } = useMemo(() => {
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;
    const distPx = Math.hypot(dx, dy);
    const lenFt = Math.max(0.1, distPx / pixelsPerFoot);

    const midX = (line.start.x + line.end.x) / 2;
    const midY = (line.start.y + line.end.y) / 2;

    const worldX = (midX - 300) / pixelsPerFoot;
    const worldZ = (midY - 170) / pixelsPerFoot;

    return {
      lengthFt: lenFt,
      angle: Math.atan2(dy, dx),
      position: [worldX, height / 2, worldZ] as [number, number, number],
    };
  }, [line, height, pixelsPerFoot]);

  const groupRef = useRef<THREE.Group>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;
  }, [line.id]);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (startTimeRef.current === null) startTimeRef.current = state.clock.elapsedTime;
    const t = Math.min(1, (state.clock.elapsedTime - startTimeRef.current) / POP_IN_SECONDS);
    const s = t >= 1 ? 1 : Math.max(0.001, easeOutBack(t));
    groupRef.current.scale.setScalar(s);
  });

  const geometryArgs: [number, number, number] = [lengthFt, height, thickness];
  const isWireframe = viewMode === "wireframe";
  const isXray = viewMode === "xray";

  return (
    <group ref={groupRef} position={position} rotation={[0, -angle, 0]}>
      {/* Primary Wall Box Mesh */}
      <mesh castShadow={!isXray} receiveShadow={!isXray}>
        <boxGeometry args={geometryArgs} />
        {isWireframe ? (
          <meshStandardMaterial color="#e8a33d" wireframe />
        ) : textureUrl && !isXray ? (
          <TexturedMaterial
            url={textureUrl}
            repeatX={(lengthFt / 4) * (textureScale || 1)}
            repeatY={(height / 4) * (textureScale || 1)}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            transparent={isXray}
            opacity={isXray ? 0.35 : 1}
            depthWrite={!isXray}
            roughness={0.5}
            metalness={0.1}
          />
        )}
      </mesh>

      {/* Edge outline overlay */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...geometryArgs)]} />
        <lineBasicMaterial
          color={isWireframe || isXray ? "#e8a33d" : "#08131a"}
          transparent
          opacity={isXray ? 0.9 : 0.4}
        />
      </lineSegments>

      {/* CAD Floating Dimension Label */}
      {showDimensions && (
        <Html position={[0, height / 2 + 0.35, 0]} center distanceFactor={12}>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: "#e8a33d",
              background: "rgba(7,27,38,0.85)",
              border: "1px solid #2f6f86",
              borderRadius: 4,
              padding: "2px 6px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {lengthFt.toFixed(1)} ft
          </div>
        </Html>
      )}
    </group>
  );
}

