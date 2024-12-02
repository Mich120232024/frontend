import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid } from "@react-three/drei";
import * as THREE from "three";

interface VolSurfaceVisualizerProps {
  volSurfaceData: {
    gridX: number[][];
    gridY: number[][];
    gridVol: number[][];
  };
}

const VolSurfaceVisualizer: React.FC<VolSurfaceVisualizerProps> = ({
  volSurfaceData,
}) => {
  const { gridX, gridY, gridVol } = volSurfaceData;

  const { vertices, colors, indices } = useMemo(() => {
    if (!gridX.length || !gridY.length || !gridVol.length) {
      console.error("Invalid grid data:", { gridX, gridY, gridVol });
      throw new Error("Invalid grid data");
    }

    const vertices: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    let minVol = Infinity;
    let maxVol = -Infinity;

    gridVol.forEach((row) => {
      row.forEach((vol) => {
        minVol = Math.min(minVol, vol);
      });
    });

    for (let i = 0; i < gridX.length - 1; i++) {
      for (let j = 0; j < gridX[i].length - 1; j++) {
        const x = gridX[i][j];
        const y = gridY[i][j];
        const z = gridVol[i][j];

        vertices.push(x, y, z);

        const normalizedVol = (z - minVol) / (maxVol - minVol);
        colors.push(normalizedVol, 1 - normalizedVol, 0.5);
        const idx = i * gridX[i].length + j;
        indices.push(idx, idx + 1, idx + gridX[i].length);
        indices.push(idx + 1, idx + gridX[i].length + 1, idx + gridX[i].length);
      }
    }

    return { vertices, colors, indices, minVol, maxVol };
  }, [gridX, gridY, gridVol]);

  return (
    <Canvas style={{ background: "#2D2D3A" }}>
      <PerspectiveCamera makeDefault position={[10, 10, 10]} />
      <OrbitControls enableZoom={true} enableRotate={true} />
      <ambientLight intensity={0.5} />
      <Grid args={[20, 20]} position={[0, 0, 0]} />
      <mesh>
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
            array={new Uint16Array(indices)}
            count={indices.length}
            itemSize={1}
          />
        </bufferGeometry>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} />
      </mesh>
    </Canvas>
  );
};

export default VolSurfaceVisualizer;
