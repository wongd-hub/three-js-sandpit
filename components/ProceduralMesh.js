// https://www.youtube.com/watch?v=2kTQZVzkXgI

import React, { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Loader, OrbitControls } from "@react-three/drei";
import noise, { perlin3 } from "./effects/noise";

function MeshAnim({
  position,
  rotation,
  grid: { width, height, sep },
  colorOfXYZT,
  zOfXYT,
  anim: { init, update },
}) {
  // General idea for animations is to keep track of some state, t, which is initialised and updated
  //  every frame according to the update function
  let t = init; // time

  let { positions, colors, normals } = useMemo(() => {
    let positions = [],
      colors = [],
      normals = [];

    for (let yi = 0; yi < height; yi++) {
      for (let xi = 0; xi < width; xi++) {
        // Generate initial positions
        let x = sep * (xi - (width - 1) / 2.0);
        let y = sep * (yi - (height - 1) / 2.0);
        let z = zOfXYT(x, y, t);
        positions.push(x, y, z);

        // Generate colour values
        let color = colorOfXYZT(x, y, z, t);
        colors.push(color.r, color.g, color.b);

        // Generate normals
        normals.push(0, 0, 1);
      }
    }

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      normals: new Float32Array(normals),
    };
  }, [width, height, sep, zOfXYT, colorOfXYZT, t]);

  // Index buffer saves redundant rendering of vertices that are shared amongst multiple triangles
  // Loop over all squares in the grid and triangulate each one
  let indices = useMemo(() => {
    let indices = [];
    let i = 0;
    for (let yi = 0; yi < height - 1; yi++) {
      for (let xi = 0; xi < width - 1; xi++) {
        indices.push(i, i + 1, i + width + 1); // Bottom right triangle
        indices.push(i + width + 1, i + width, i);
        i++;
      }
    }

    return new Uint16Array(indices);
  }, [width, height]);

  //Animation
  let posRef = useRef(undefined);
  let colorRef = useRef(undefined);

  useFrame(() => {
    t = update(t);

    const positions = posRef.current.array;
    const colors = colorRef.current.array;

    let i = 0;
    for (let yi = 0; yi < height; yi++) {
      for (let xi = 0; xi < width; xi++) {
        positions[i + 2] = zOfXYT(positions[i], positions[i + 1], t);
        let c = colorOfXYZT(
          positions[i],
          positions[i + 1],
          positions[i + 2],
          t
        );
        colors[i] = c.r;
        colors[i + 1] = c.g;
        colors[i + 2] = c.b;
        i += 3;
      }
    }

    posRef.current.needsUpdate = true;
    colorRef.current.needsUpdate = true;
  });

  return (
    <mesh position={position} rotation={rotation}>
      <bufferGeometry>
        <bufferAttribute
          ref={posRef}
          attachObject={["attributes", "position"]}
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          ref={colorRef}
          attachObject={["attributes", "color"]}
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={["attributes", "normal"]}
          array={normals}
          count={normals.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="index"
          array={indices}
          count={indices.length}
        />
      </bufferGeometry>
      <meshStandardMaterial
        vertexColors
        side={THREE.DoubleSide}
        wireframe={true}
      />
    </mesh>
  );
}

export default function ProceduralMesh(props) {
  const seed = Math.floor(Math.random() * 2 ** 16);
  noise.seed(seed);

  const sampleNoise = (x, y, z) => {
    let scale = 1 / 8;
    let octaves = 20;
    let persistence = 0.6;
    let lacunarity = 2;

    let amp = 1;
    let freq = 1;

    let v = 0;
    for (let i = 0; i < octaves; i++) {
      v += amp * perlin3(x * freq * scale, y * freq * scale, z);
      amp *= persistence;
      freq *= lacunarity;
    }

    return v;
  };

  const zOfXYT = (x, y, t) => {
    return sampleNoise(x, y, t);
  };

  const colorOfXYZT = (x, y, z, t) => {
    return {
      r: z,
      g: z / 5,
      b: Math.sqrt(x ** 2 + y ** 2) / 75,
    };
  };

  return (
    <>
      <Canvas
        flat
        linear
        colorManagement={false}
        camera={{ position: [0, 2, 10], fov: 75 }}
        className="gallery-canvas"
        style={props.style}
      >
        <OrbitControls />
        <ambientLight />
        <color attach="background" args={["black"]} />
        <Suspense fallback={null}>
          <MeshAnim
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            grid={{
              width: 100,
              height: 100,
              sep: 0.1,
            }}
            zOfXYT={zOfXYT}
            colorOfXYZT={colorOfXYZT}
            anim={{
              init: 0,
              update: (t) => t + 0.005,
            }}
          />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
