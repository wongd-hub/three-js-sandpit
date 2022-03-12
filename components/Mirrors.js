import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { useFrame, useResource, Canvas } from "@react-three/fiber";
import {
  Text,
  Box,
  useMatcapTexture,
  Octahedron,
  Loader,
} from "@react-three/drei";

import {
  useSlerp,
  useLayers,
  useRenderTarget,
  mirrorsData,
} from "./effects/mirrorUtils";
import { ThinFilmFresnelMap } from "./effects/ThinFilmFresnelMap";

const TEXT_PROPS = {
  fontSize: 2.5,
  font: "https://fonts.gstatic.com/s/syncopate/v12/pe0pMIuPIYBCpEV5eFdKvtKqBP5p.woff",
};

function Title({ layers, ...props }) {
  const group = useRef();
  useEffect(() => {
    group.current.lookAt(0, 0, 0);
  }, []);

  const textRef = useLayers(layers);

  return (
    <group {...props} ref={group}>
      <Text
        ref={textRef}
        name="text-hello"
        depthTest={false}
        material-toneMapped={false}
        material-color="#FFFFFF"
        {...TEXT_PROPS}
      >
        Hello!
      </Text>
    </group>
  );
}
function Mirror({ sideMaterial, reflectionMaterial, args, layers, ...props }) {
  const ref = useLayers(layers);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
      ref.current.rotation.z += 0.01;
    }
  });

  return (
    <Box
      {...props}
      ref={ref}
      args={args}
      material={[
        sideMaterial,
        sideMaterial,
        sideMaterial,
        sideMaterial,
        reflectionMaterial,
        reflectionMaterial,
      ]}
    />
  );
}

function Mirrors({ envMap, layers, ...props }) {
  const [thinFilmFresnelMap] = useState(new ThinFilmFresnelMap());
  const sideMaterial = useResource();
  const reflectionMaterial = useResource();

  return (
    <group name="mirrors" {...props}>
      <meshLambertMaterial
        ref={sideMaterial}
        map={thinFilmFresnelMap}
        color="#AAAAAA"
      />
      <meshLambertMaterial
        ref={reflectionMaterial}
        map={thinFilmFresnelMap}
        envMap={envMap}
        color="#FFFFFF"
      />
      {mirrorsData.mirrors.map((mirror, index) => (
        <Mirror
          key={`mirror-${index}`}
          layers={layers}
          {...mirror}
          name={`mirror-${index}`}
          sideMaterial={sideMaterial.current}
          reflectionMaterial={reflectionMaterial.current}
        />
      ))}
    </group>
  );
}

function TitleCopies({ layers }) {
  const vertices = useMemo(() => {
    const y = new THREE.IcosahedronGeometry(10);
    return y.vertices;
  }, []);

  return (
    <group name="titleCopies">
      {vertices.map((vertex, i) => (
        <Title
          name={"titleCopy-" + i}
          position={vertex}
          layers={layers}
          key={i}
        />
      ))}
    </group>
  );
}

export default function MirrorScene() {
  const [cubeCamera, renderTarget] = useRenderTarget();
  const group = useSlerp();

  const [matcapTexture] = useMatcapTexture("C8D1DC_575B62_818892_6E747B");

  return (
    <>
      <Canvas
        concurrent
        shadowMap
        camera={{ position: [0, 0, 5], fov: 70 }}
        style={props.style}
      >
        <color attach="background" args={["#000"]} />
        <Suspense fallback={null}>
          <group name="sceneContainer" ref={group}>
            <Octahedron
              layers={[11]}
              name="background"
              args={[20, 4, 4]}
              position={[0, 0, -5]}
            >
              <meshMatcapMaterial
                matcap={matcapTexture}
                side={THREE.BackSide}
                transparent
                opacity={0.3}
                color="#FFFFFF"
              />
            </Octahedron>
            <cubeCamera
              layers={[11]}
              name="cubeCamera"
              ref={cubeCamera}
              args={[0.1, 100, renderTarget]}
              position={[0, 0, 5]}
            />
            <Title name="title" position={[0, 0, -10]} />
            <TitleCopies layers={[11]} />
            <Mirrors layers={[0, 11]} envMap={renderTarget.texture} />
          </group>
        </Suspense>
        <ambientLight intensity={0.4} />
      </Canvas>
      <Loader />
    </>
  );
}
