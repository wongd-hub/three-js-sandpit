// https://www.youtube.com/watch?v=wRmeFtRkF-8

import React, { Suspense, useCallback, useMemo, useRef } from "react";
import * as THREE from "three";
import { applyProps, Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Loader, OrbitControls } from "@react-three/drei";
import noise, { perlin3 } from "./effects/noise";

function Points() {
  const imgTex = useTexture("/assets/images/circle.png");
  const bufferRef = useRef(undefined);

  // grapher.mathpix.com; sin(x^2 + y^2 + a) * 0.2 produces a wave, changing a moves it along
  let t = 0;
  let f = 0.002;
  let a = 3;
  const graph = useCallback(
    (x, z) => {
      return Math.sin(f * (x ** 2 + z ** 2 + t)) * a;
    },
    [t, f, a]
  );

  // [x1, y1, z1, x2, y2, z2, ...]
  const count = 100; // Number of points on each axis - total points is count^2
  const sep = 3; //
  let positions = useMemo(() => {
    let positions = [];

    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = sep * (xi - count / 2);
        let z = sep * (zi - count / 2);
        let y = graph(x, z);

        positions.push(x, y, z);
      }
    }

    return new Float32Array(positions);
  }, [count, sep, graph]);

  // Animate
  useFrame(() => {
    t += 15;
    const positions = bufferRef.current.array;

    let i = 0;
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = sep * (xi - count / 2);
        let z = sep * (zi - count / 2);
        positions[i + 1] = graph(x, z); // Change each y
        i += 3;
      }
    }

    bufferRef.current.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          ref={bufferRef}
          attachObject={["attributes", "position"]}
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        attach="material"
        map={imgTex}
        color={0x00aaff}
        size={0.5}
        sizeAttenuation
        transparent={false}
        alphaTest={0.5}
        opacity={1.0}
      />
    </points>
  );
}

function ProceduralPoints({
  position,
  rotation,
  grid: { width, height, sep },
  anim: { init, update },
}) {
  // const imgTex = useTexture("/assets/images/circle.png");
  const posRef = useRef(undefined);
  let colorRef = useRef(undefined);
  let t = init;

  const seed = Math.floor(Math.random() * 2 ** 16);
  noise.seed(seed);

  const sampleNoise = (x, y, z) => {
    let scale = 1 / 8;
    let octaves = 20;
    let persistence = 0.3;
    let lacunarity = 2;

    let amp = 5;
    let freq = 1;

    let v = 0;
    for (let i = 0; i < octaves; i++) {
      v += amp * perlin3(x * freq * scale, y * freq * scale, z);
      amp *= persistence;
      freq *= lacunarity;
    }

    return v;
  };

  const colorOfXYZT = (x, y, z, t) => {
    return {
      r: z,
      g: z / 5,
      b: Math.sqrt(x ** 2 + y ** 2) / 75,
    };
  };

  // Set initial positions
  let { positions, colors, normals } = useMemo(() => {
    let positions = [],
      colors = [],
      normals = [];

    for (let yi = 0; yi < height; yi++) {
      for (let xi = 0; xi < width; xi++) {
        // Generate initial positions
        let x = sep * (xi - (width - 1) / 2.0);
        let y = sep * (yi - (height - 1) / 2.0);
        let z = sampleNoise(x, y, t);
        positions.push(x, y, z);

        // Generate colour values
        let color = colorOfXYZT(x, y, z, t);
        colors.push(color.r, color.g, color.b);

        // Generate normals
        normals.push(0, 0, 1);
      }
    }
    // console.log(colors);
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      normals: new Float32Array(normals),
    };
  }, [width, height, sep, t]);

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

  // Animate
  useFrame(() => {
    t = update(t);
    const positions = posRef.current.array;
    const colors = colorRef.current.array;

    let i = 0;
    for (let yi = 0; yi < height; yi++) {
      for (let xi = 0; xi < width; xi++) {
        positions[i + 2] = sampleNoise(positions[i], positions[i + 1], t);
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
    <points position={position} rotation={rotation}>
      <bufferGeometry attach="geometry">
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

      <pointsMaterial
        attach="material"
        // map={imgTex}
        // color={0x00aaff}
        vertexColors
        size={0.5}
        sizeAttenuation
        transparent={false}
        alphaTest={0.5}
        opacity={1.0}
      />
    </points>
  );
}

export default function RippleScene(props) {
  return (
    <>
      <Canvas
        flat
        linear
        colorManagement={false}
        camera={{ position: [100, 10, 0], fov: 75 }}
        className="gallery-canvas"
        style={props.style}
      >
        <OrbitControls />
        <color attach="background" args={["black"]} />
        <Suspense fallback={null}>
          {props.which === "ripple" ? (
            <Points />
          ) : (
            <ProceduralPoints
              position={[0, 0, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              grid={{
                width: 100,
                height: 100,
                sep: 1.5,
              }}
              anim={{
                init: 0,
                update: (t) => t + 0.02,
              }}
            />
          )}
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
