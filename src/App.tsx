import React, { useRef, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Stats,
  Grid,
} from "@react-three/drei";

interface VolSurfaceData {
  gridX: number[][];
  gridY: number[][];
  gridVol: number[][];
}

// Create dummy data for testing
const createDummyData = (): VolSurfaceData => {
  const size = 10;
  const gridX = Array(size)
    .fill(0)
    .map(() =>
      Array(size)
        .fill(0)
        .map((_, j) => j)
    );
  const gridY = Array(size)
    .fill(0)
    .map(() =>
      Array(size)
        .fill(0)
        .map((_, j) => j)
    );
  const gridVol = Array(size)
    .fill(0)
    .map((_, i) =>
      Array(size)
        .fill(0)
        .map((_, j) => Math.sin(i / 2) * Math.cos(j / 2) * 5)
    );
  return { gridX, gridY, gridVol };
};

const VolSurfaceVisualizer: React.FC<{ volSurfaceData?: VolSurfaceData }> = ({
  volSurfaceData = createDummyData(),
}) => {
  const [error, setError] = useState<string | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Debug logging
  useEffect(() => {
    console.log("Grid dimensions:", {
      x: volSurfaceData?.gridX?.length ?? 0,
      y: volSurfaceData?.gridY?.length ?? 0,
      vol: volSurfaceData?.gridVol?.length ?? 0,
    });
  }, [volSurfaceData]);

  const { vertices, colors, indices } = useMemo(() => {
    try {
      if (
        !volSurfaceData?.gridX?.length ||
        !volSurfaceData?.gridY?.length ||
        !volSurfaceData?.gridVol?.length
      ) {
        throw new Error("Missing or invalid grid data");
      }

      const vertices: number[] = [];
      const colors: number[] = [];
      const indices: number[] = [];

      const rows = volSurfaceData.gridX.length;
      const cols = volSurfaceData.gridX[0].length;

      // Generate geometry
      for (let i = 0; i < rows - 1; i++) {
        for (let j = 0; j < cols - 1; j++) {
          const x = volSurfaceData.gridX[i][j];
          const y = volSurfaceData.gridY[i][j];
          const z = volSurfaceData.gridVol[i][j];

          vertices.push(x, y, z);

          // Color based on height
          const normalizedZ = (z + 5) / 10; // Normalize to 0-1 range
          colors.push(normalizedZ, 1 - normalizedZ, 0.5);

          const vertexIndex = i * cols + j;
          indices.push(
            vertexIndex,
            vertexIndex + 1,
            vertexIndex + cols,
            vertexIndex + 1,
            vertexIndex + cols + 1,
            vertexIndex + cols
          );
        }
      }

      return { vertices, colors, indices };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return { vertices: [], colors: [], indices: [] };
    }
  }, [volSurfaceData]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="vol-surface-container">
      <Canvas style={{ background: "#2D2D3A" }}>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={0.7} />
        <Grid args={[20, 20]} position={[0, -0.01, 0]} />

        {vertices.length > 0 && (
          <mesh ref={meshRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={vertices.length / 3}
                array={new Float32Array(vertices)}
                itemSize={3}
              />
              <bufferAttribute
                attach="attributes-color"
                count={colors.length / 3}
                array={new Float32Array(colors)}
                itemSize={3}
              />
              <bufferAttribute
                attach="index"
                array={new Uint32Array(indices)}
                count={indices.length}
                itemSize={1}
              />
            </bufferGeometry>
            <meshPhysicalMaterial
              vertexColors
              side={2}
              roughness={0.4}
              metalness={0.6}
              clearcoat={0.8}
            />
          </mesh>
        )}
        <Stats />
      </Canvas>
    </div>
  );
};

export default VolSurfaceVisualizer;
