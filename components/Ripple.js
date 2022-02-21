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

function ProceduralPoints() {
  const imgTex = useTexture("/assets/images/circle.png");
  const bufferRef = useRef(undefined);
  let t = 0;

  const seed = Math.floor(Math.random() * 2 ** 16);
  noise.seed(seed);

  const sampleNoise = (x, y, z) => {
    let scale = 1 / 8;
    let octaves = 30;
    let persistence = 0.6;
    let lacunarity = 2;

    let amp = 20;
    let freq = 1;

    let v = 0;
    for (let i = 0; i < octaves; i++) {
      v += amp * perlin3(x * freq * scale, y * freq * scale, z);
      amp *= persistence;
      freq *= lacunarity;
    }

    return v;
  };

  // Set initial positions
  const count = 100;
  const sep = 3; //
  let positions = useMemo(() => {
    let positions = [];

    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = sep * (xi - count / 2);
        let z = sep * (zi - count / 2);
        let y = sampleNoise(x, t, z);

        positions.push(x, y, z);
      }
    }

    return new Float32Array(positions);
  }, [count, sep, t]);

  const lerp = useCallback((start, end, amt) => {
    return (1 - amt) * start + amt * end;
  }, []);

  // Animate
  useFrame(() => {
    t += 0.01;
    const positions = bufferRef.current.array;

    let i = 0;
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        positions[i + 1] = lerp(
          positions[i + 1],
          sampleNoise(positions[i], t, positions[i + 2]),
          0.1
        ); // Change each y
        // console.log(positions[i + 1]);
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
          <ProceduralPoints />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
