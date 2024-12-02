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

  console.log("VolSurfaceVisualizer Props:", volSurfaceData); // Debugging log

  if (!gridX?.length || !gridY?.length || !gridVol?.length) {
    console.error("Invalid or empty grid data:", { gridX, gridY, gridVol });
    return (
      <p style={{ color: "red" }}>
        Invalid or empty data for volatility surface.
      </p>
    );
  }

  const vertices: number[] = [];
  const colors: number[] = [];

  for (let i = 0; i < gridX.length; i++) {
    for (let j = 0; j < gridX[i].length; j++) {
      const x = gridX[i][j];
      const y = gridY[i][j];
      const z = gridVol[i][j];

      vertices.push(x, y, z);

      const color = Math.min(Math.max((z - 5) / 15, 0), 1);
      colors.push(color, 1 - color, 0.5);
    }
  }

  console.log("Vertices:", vertices); // Debugging log
  console.log("Colors:", colors); // Debugging log

  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
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
        </bufferGeometry>
        <meshStandardMaterial vertexColors side={2} />
      </mesh>
    </Canvas>
  );
};

export default VolSurfaceVisualizer;
