import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Sky, Loader, Stars } from "@react-three/drei";
import * as THREE from "three";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
// import { useControls } from "leva";

// Import/create components
import Text from "../components/Text";
import Icosahedrons from "../components/Isocahedron";

function GrpText() {
  const group = useRef<THREE.Group>();
  useFrame(
    ({ clock }) =>
      (group.current!.rotation.x =
        group.current!.rotation.y =
        group.current!.rotation.z =
          Math.sin(clock.getElapsedTime()) * 0.3)
  );

  return (
    <group ref={group}>
      <Text
        text="Don't control the camera"
        position={[0, 0.5, -1]}
        vAlign="center"
        hAlign="center"
        animate={false}
        geomOptions={{
          size: 0.5,
          height: 0.5,
          bevelEnabled: true,
          bevelSize: 0.025,
          bevelThickness: 0.025,
        }}
        opacity={1}
      />
      <Text
        text="with your mouse!"
        position={[-1.33, -0.15, -1]}
        vAlign="center"
        hAlign="center"
        animate={false}
        geomOptions={{
          size: 0.5,
          height: 0.5,
          bevelEnabled: true,
          bevelSize: 0.025,
          bevelThickness: 0.025,
        }}
        opacity={1}
      />
    </group>
  );
}

// Camera effects
function Parallax() {
  useFrame((state, delta) => {
    const parallaxX = state.mouse.x * 0.7;
    const parallaxY = state.mouse.y * 0.7;

    state.camera.position.x +=
      (parallaxX - state.camera.position.x) * 7 * delta;
    state.camera.position.y +=
      (parallaxY - state.camera.position.y) * 7 * delta;
  });
  return null;
}

function WildCameraControls() {
  const lookAtPosition = new THREE.Vector3(0, 0, 0);
  const camPositionVec = new THREE.Vector3();

  useFrame((state) => {
    state.camera.position.lerp(
      camPositionVec.set(
        state.mouse.x * 3,
        state.mouse.y * 3,
        4 + Math.abs(state.mouse.x) * 2 + Math.abs(state.mouse.y) * 2
      ),
      0.05
    );
    state.camera.lookAt(lookAtPosition);
  });
  return null;
}

export interface AnimTextProps {
  style: any;
}

export function AnimatedTextGeoms(props: AnimTextProps) {
  // const { focusDistance, focalLength, bokehScale } = useControls({
  //   focusDistance: {
  //     min: 0,
  //     max: 4,
  //     value: 0.68,
  //   },
  //   focalLength: {
  //     min: 0,
  //     max: 10,
  //     value: 8.8,
  //   },
  //   bokehScale: {
  //     min: 0,
  //     max: 20,
  //     value: 20,
  //   },
  // });

  return (
    <>
      <Canvas id="text-test" style={props.style}>
        <Suspense fallback={null}>
          <Icosahedrons
            range={100}
            material="normal"
            fieldScale={10}
            closeness={1}
            animation={true}
          />
          <GrpText />
          <Sky sunPosition={[1, 2, 0]} />
          <EffectComposer>
            <DepthOfField
              focusDistance={0.68}
              focalLength={8.8}
              bokehScale={20}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}

export interface BasicExProps {
  style: any;
}

export function BasicExamples(props: BasicExProps) {
  return (
    <>
      <Canvas id="text-test" style={props.style}>
        <Suspense fallback={null}>
          <Icosahedrons
            range={100}
            material="normal"
            fieldScale={10}
            closeness={1}
            animation={true}
          />
          <Text
            text="Control the camera"
            position={[0, 0.5, -1]}
            vAlign="center"
            hAlign="center"
            animate={false}
            opacity={1}
            geomOptions={{
              size: 0.5,
              height: 0.5,
              bevelEnabled: true,
              bevelSize: 0.025,
              bevelThickness: 0.025,
            }}
          />
          <Text
            text="with your mouse!"
            position={[-0.31, -0.15, -1]}
            vAlign="center"
            hAlign="center"
            animate={false}
            opacity={1}
            geomOptions={{
              size: 0.5,
              height: 0.5,
              bevelEnabled: true,
              bevelSize: 0.025,
              bevelThickness: 0.025,
            }}
          />
          <Sky sunPosition={[0, 0.5, 0]} />
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
          />
          <WildCameraControls />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
