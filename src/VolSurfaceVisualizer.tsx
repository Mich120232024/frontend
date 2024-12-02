import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Stats,
  Grid,
  Text,
  Environment,
} from "@react-three/drei";

interface VolSurfaceData {
  gridX: number[][];
  gridY: number[][];
  gridVol: number[][];
}

interface VolSurfaceVisualizerProps {
  volSurfaceData: VolSurfaceData;
}

// Animated surface component
const Surface: React.FC<{
  vertices: number[];
  colors: number[];
  indices: number[];
}> = ({ vertices, colors, indices }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
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
      <meshPhysicalMaterial
        vertexColors
        side={2}
        roughness={0.4}
        metalness={0.6}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
};

const VolSurfaceVisualizer: React.FC<VolSurfaceVisualizerProps> = ({
  volSurfaceData,
}) => {
  const { gridX, gridY, gridVol } = volSurfaceData;

  const { vertices, colors, indices, bounds } = useMemo(() => {
    if (!gridX?.length || !gridY?.length || !gridVol?.length) {
      throw new Error("Invalid grid data");
    }

    const vertices: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    let minVal = Infinity;
    let maxVal = -Infinity;

    gridVol.forEach((row) =>
      row.forEach((val) => {
        minVal = Math.min(minVal, val);
        maxVal = Math.max(maxVal, val);
      })
    );

    for (let i = 0; i < gridX.length - 1; i++) {
      for (let j = 0; j < gridX[i].length - 1; j++) {
        const x = gridX[i][j];
        const y = gridY[i][j];
        const z = gridVol[i][j];

        vertices.push(x, y, z);

        const normalizedVol = (z - minVal) / (maxVal - minVal);
        colors.push(normalizedVol, 1 - normalizedVol, 0.5);

        const vertexIndex = i * gridX[i].length + j;
        indices.push(
          vertexIndex,
          vertexIndex + 1,
          vertexIndex + gridX[i].length,
          vertexIndex + 1,
          vertexIndex + gridX[i].length + 1,
          vertexIndex + gridX[i].length
        );
      }
    }

    return { vertices, colors, indices, bounds: { minVal, maxVal } };
  }, [gridX, gridY, gridVol]);

  return (
    <div className="vol-surface-container">
      <Canvas shadows dpr={[1, 2]}>
        <color attach="background" args={["#1a1a1a"]} />
        <PerspectiveCamera makeDefault position={[15, 15, 15]} fov={50} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={50}
          minDistance={5}
        />

        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
        />

        <Text
          position={[10, 0, 0]}
          rotation={[0, 0, 0]}
          fontSize={0.8}
          color="white"
        >
          Maturity
        </Text>
        <Text
          position={[0, 10, 0]}
          rotation={[0, 0, Math.PI / 2]}
          fontSize={0.8}
          color="white"
        >
          Delta
        </Text>

        <Grid
          args={[20, 20]}
          position={[0, -0.01, 0]}
          cellColor="#424242"
          sectionColor="#ffffff"
        />

        <Surface vertices={vertices} colors={colors} indices={indices} />
        <Stats />
      </Canvas>

      <div className="vol-surface-info">
        <div>
          Volatility Range: {bounds.minVal.toFixed(2)} -{" "}
          {bounds.maxVal.toFixed(2)}
        </div>
        <div>Points: {vertices.length / 3}</div>
      </div>
    </div>
  );
};

export default VolSurfaceVisualizer;
