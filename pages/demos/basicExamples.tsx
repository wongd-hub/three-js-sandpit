import { useRouter } from 'next/router';
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useRef } from 'react'
import { Sky, Loader, Stars, Stats } from '@react-three/drei'
import * as THREE from 'three'
import { DepthOfField, EffectComposer } from '@react-three/postprocessing'
import { useControls } from "leva";

// Import/create components
import Text from '../../components/Text'
import Icosahedrons from '../../components/Isocahedron';

function GrpText() {

    const group = useRef<THREE.Group>()
    useFrame(({ clock }) => (group.current!.rotation.x = group.current!.rotation.y = group.current!.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3))
  
    return (
      <group ref={group}>
        <Text text="Don't control the camera"  position={[0, 0.5, -1]} vAlign='center' hAlign='center' animate={false}
          geomOptions={{ size: 0.5, height: 0.5, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025 }} opacity={1}
        />
        <Text text="with your mouse!"  position={[-1.33, -0.15, -1]} vAlign='center' hAlign='center' animate={false}
          geomOptions={{ size: 0.5, height: 0.5, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025 }} opacity={1}
        />
      </group>
    )
  
  }

// Camera effects
function Parallax() {
    useFrame((state, delta) => {
      const parallaxX = state.mouse.x * 0.7
      const parallaxY = state.mouse.y * 0.7
  
      state.camera.position.x += (parallaxX - state.camera.position.x) * 7 * delta
      state.camera.position.y += (parallaxY - state.camera.position.y) * 7 * delta
    })
    return null
}
  
function WildCameraControls() {

    const lookAtPosition = new THREE.Vector3(0, 0, 0)
    const camPositionVec = new THREE.Vector3()

    useFrame((state) => {
        state.camera.position
        .lerp(camPositionVec.set(state.mouse.x * 3, state.mouse.y * 3, 4 + Math.abs(state.mouse.x) * 2 + Math.abs(state.mouse.y) * 2), 0.05)
        state.camera.lookAt(lookAtPosition)
    })
    return null
}

const AnimatedTextGeoms = () => {
    const { focusDistance, focalLength, bokehScale } = useControls({
        focusDistance: {
        min: 0,
        max: 4,
        value: 0.68
        },
        focalLength: {
        min: 0,
        max: 10,
        value: 8.8
        },
        bokehScale: {
        min: 0,
        max: 20,
        value: 20
        }
    });

    return (
        <Canvas id="text-test" style={{height: '50vh'}}>
            <Suspense fallback={null}>
                {/* <ambientLight color={'white'} intensity={0.2} /> */}
                <Icosahedrons range={100} material='normal' fieldScale={10} closeness={1} animation={true} />
                <GrpText />
                <Sky sunPosition={[1, 2, 0]} />
                <EffectComposer>
                    <DepthOfField
                        focusDistance={focusDistance}
                        focalLength={focalLength}
                        bokehScale={bokehScale}
                    />
                </EffectComposer>
            </Suspense>
        </Canvas>
    )

}

const BasicExamples = () => {
  const router = useRouter();

  return (
    <div>
        <Link href="/">Back to Home</Link>

        <h1>Controlling camera with mouse, using the Instances element</h1>
        <Canvas id="text-test" style={{height: '50vh'}}>
        <Suspense fallback={null}>
            <Icosahedrons range={100} material='normal' fieldScale={10} closeness={1} animation={true} />
            <Text text="Control the camera"  position={[0, 0.5, -1]} vAlign='center' hAlign='center' animate={false} opacity={1}
            geomOptions={{ size: 0.5, height: 0.5, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025 }} 
            />
            <Text text="with your mouse!"  position={[-0.31, -0.15, -1]} vAlign='center' hAlign='center' animate={false} opacity={1}
            geomOptions={{ size: 0.5, height: 0.5, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025 }} 
            />
            <Sky sunPosition={[0, 0.5, 0]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
            <WildCameraControls />
            {/* <gridHelper /> */}
        </Suspense>
        </Canvas>
        <Loader />

        <h1>Alternatively, animate both field and text</h1>
        <AnimatedTextGeoms />
        <Loader />
        <Stats showPanel={0} />
    </div>
  );
};

export default BasicExamples;