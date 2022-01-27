import React, { useMemo, useRef, Suspense, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, OrbitControls, Loader, Sky, PerspectiveCamera } from "@react-three/drei"
import { Physics, useBox, usePlane, Debug, useTrimesh, useSphere } from '@react-three/cannon'
import * as THREE from 'three'
// import { motion } from 'framer-motion-3d'

function Plane(props) {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshPhongMaterial colour="#272727" />
        </mesh>
      )
}

export function CupModel(props) {
    // const group = useRef()
    const { nodes } = useGLTF('/assets/models/CupCentreMass.gltf')

    const {
        attributes: {
          position: { array: vertices },
        },
        index: { array: indices },
    } = nodes.Ceramic_cup_Circle005.geometry

    const [trimeshRef] = useTrimesh(() => ({ 
        args: [vertices, indices],
        mass: 0,
        // rotation: [0, 0, 0]
        // position: [0, -1, 0],
        ...props
    }))

    return (
      <group dispose={null}>
        <mesh
            ref={trimeshRef}
          castShadow
          receiveShadow
          geometry={nodes.Ceramic_cup_Circle005.geometry}
          material={nodes.Ceramic_cup_Circle005.material}

        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Saucer_Circle006.geometry}
          material={nodes.Saucer_Circle006.material}
            {...props}
        />
      </group>
    )
}

useGLTF.preload('/assets/models/CupCentreMass.gltf')

function Cube(props) {
    const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], rotation: [0.4, 0.2, 0.5], ...props }))
    return (
        <mesh receiveShadow castShadow ref={ref}>
            <boxGeometry />
            <meshStandardMaterial color="brown" />
        </mesh>
    )
}

function Sphere(props) {
    const [ref] = useSphere(() => ({ mass: 1, ...props }))
    return (
        <mesh receiveShadow castShadow ref={ref}>
            <sphereGeometry />
            <meshStandardMaterial color="brown" />
        </mesh>
    )
}

function InteractionScene(props) {

    const { camera } = useThree()
    const lookAtPosition = new THREE.Vector3(0, 0, 0)

    useEffect(() => {
        camera.lookAt(lookAtPosition)
    })


    return (
        <>
            <Physics shouldInvalidate={false}>
                <Debug color="hotpink" scale={1.5}>
                    <Plane position={[0, 0, 0]} />
                    <CupModel position={[-3.54, 1, 0]} />
                    {/* <Cube position={[0, 4, 0]}/> */}
                    <Sphere position={[0, 4, 0]}/>
                    {/* <Cube position={[-1, 8, -2]}/>
                    <Cube position={[-1.1, 20, -2.3]}/>
                    <Cube position={[1, 8, -1]}/>
                    <Cube position={[2, 5, 1]}/> */}
                </Debug>
            </Physics>
        </>
    )

}

export default function ImportedModelPhysics(props) {

    return (
        <>
            <Canvas style={props.style} shadows>
                <Suspense fallback={null}>
                    <PerspectiveCamera 
                        makeDefault 
                        position={[0, 10, 3]} 
                    />
                    <ambientLight intensity={0.5} />
                    <spotLight intensity={0.6} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow />
                    <InteractionScene />
                    <Sky />
                </Suspense>
                <OrbitControls />
            </Canvas>
            <Loader />
        </>

    )

}