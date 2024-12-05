import React, { useMemo, useRef, useEffect, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    handleResize(); // Set initial dimensions
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        maxVol = Math.max(maxVol, vol);
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

    return { vertices, colors, indices };
  }, [gridX, gridY, gridVol]);

  return (
    <div ref={containerRef} className="vol-surface-container">
      <Canvas
        style={{ background: "#2D2D3A" }}
        camera={{ position: [10, 10, 10], fov: 75 }}
        gl={{ antialias: true }}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 50 } }}
      >
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
    </div>
  );
};

export default VolSurfaceVisualizer;
