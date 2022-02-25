import * as THREE from "three";
import React, { useRef, Suspense, useState } from "react";
import {
  useGLTF,
  Loader,
  Sky,
  ContactShadows,
  PresentationControls,
  Html,
  PerspectiveCamera,
} from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshBasicMaterial, PointLight } from "three";

import Car from "./Car";
import Iphone from "./Iphone";

export interface ShowcaseProps {
  style: any;
}

export default function ShowcaseScene(props: ShowcaseProps) {
  const [model, setModel] = useState("car");
  const models = ["car", "iphone"];

  function onClick() {
    console.log();
    // Get index of current state model
    var index = models.findIndex((el) => el === model);

    // Iterate up
    var indexUp = index + 1;

    // Check if indexUp is greater than length of array; if so, drop it back to 0
    if (indexUp > models.length - 1) {
      indexUp = 0;
    }

    // Set new state
    setModel(models[indexUp]);
  }

  return (
    <>
      <h2 onClick={onClick}>Snappy controls (click here to change model)</h2>
      <p>
        <a
          href="https://codesandbox.io/s/bouncy-watch-qyz5r"
          target="_blank"
          rel="noreferrer"
        >
          Bouncy watch
        </a>
      </p>
      <Canvas
        style={props.style}
        className="gallery-canvas"
        camera={
          model === "car"
            ? { position: [0, 2, 5], zoom: 1.2 }
            : model === "iphone"
            ? { position: [1, 5, 4], zoom: 0.3 }
            : {}
        }
        shadows
      >
        <Suspense fallback={null}>
          <PresentationControls
            global
            snap
            config={{ mass: 2, tension: 500 }}
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            {model === "car" ? (
              <>
                <Car />
                <Html scale={0.5} position={[0.1, 2.2, 1.2]} transform occlude>
                  <div className="annotation">Drag me! 🖱️</div>
                </Html>
              </>
            ) : model === "iphone" ? (
              <>
                <pointLight position={[-1, 0, 1]} intensity={1} />
                <pointLight position={[1, 0, -1]} intensity={1} />
                <Iphone position={[0, 0, 0]} scale={0.75} />
                <Html scale={0.5} position={[0.1, 1.1, 0.65]} transform occlude>
                  <div className="annotation">Drag me! 🖱️</div>
                </Html>
              </>
            ) : (
              <></>
            )}
          </PresentationControls>
          <Sky />
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.75}
            width={10}
            height={10}
            blur={2.6}
            far={2}
          />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
