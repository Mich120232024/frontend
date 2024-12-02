import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

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

  // Check for invalid or empty data
  if (!gridX.length || !gridY.length || !gridVol.length) {
    console.warn("VolSurfaceVisualizer received invalid or empty data:", {
      gridX,
      gridY,
      gridVol,
    });
    return (
      <p style={{ color: "red" }}>
        Invalid or empty data for volatility surface.
      </p>
    );
  }

  // Prepare vertices and colors for the surface
  const vertices = new Float32Array(gridX.length * gridX[0].length * 3);
  const colors = new Float32Array(gridX.length * gridX[0].length * 3);

  let index = 0;
  for (let i = 0; i < gridX.length; i++) {
    for (let j = 0; j < gridX[i].length; j++) {
      const x = gridX[i][j];
      const y = gridY[i][j];
      const z = gridVol[i][j];

      // Set vertex positions
      vertices[index * 3] = x;
      vertices[index * 3 + 1] = y;
      vertices[index * 3 + 2] = z;

      // Set vertex colors based on z (volatility)
      const color = Math.min(Math.max((z - 5) / 15, 0), 1); // Normalize z
      colors[index * 3] = color; // R
      colors[index * 3 + 1] = 1 - color; // G
      colors[index * 3 + 2] = 0.5; // B

      index++;
    }
  }

  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <mesh>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={vertices.length / 3}
            array={vertices}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <meshStandardMaterial vertexColors side={2} />
      </mesh>
    </Canvas>
  );
};

export default VolSurfaceVisualizer;
