import { useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

interface TexturedMaterialProps {
  url: string;
  repeatX: number;
  repeatY: number;
  transparent?: boolean;
  opacity?: number;
  depthWrite?: boolean;
  roughness?: number;
  metalness?: number;
}

// Loads the uploaded image as a repeatable tile texture and applies it as
// the mesh's material map. Uses drei's useLoader (the canonical, reliable
// R3F texture pipeline) and clones the cached texture per wall so each wall
// can have its own repeat count without mutating the shared cached one.
export default function TexturedMaterial({
  url,
  repeatX,
  repeatY,
  transparent = false,
  opacity = 1,
  depthWrite = true,
  roughness = 0.5,
  metalness = 0.1,
}: TexturedMaterialProps) {
  const source = useLoader(THREE.TextureLoader, url);

  const texture = useMemo(() => {
    const cloned = source.clone();
    cloned.wrapS = THREE.RepeatWrapping;
    cloned.wrapT = THREE.RepeatWrapping;
    cloned.colorSpace = THREE.SRGBColorSpace;
    return cloned;
  }, [source]);

  useEffect(() => {
    texture.repeat.set(Math.max(0.5, repeatX), Math.max(0.5, repeatY));
    texture.needsUpdate = true;
  }, [texture, repeatX, repeatY]);

  return (
    <meshStandardMaterial
      map={texture}
      color="#ffffff"
      transparent={transparent}
      opacity={opacity}
      depthWrite={depthWrite}
      roughness={roughness}
      metalness={metalness}
    />
  );
}
