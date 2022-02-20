import React, { useMemo, useRef, Suspense, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Loader, Sky, PerspectiveCamera } from "@react-three/drei"
import { Physics, useBox, usePlane, Debug } from '@react-three/cannon'
import * as THREE from 'three'

function Plane(props) {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshPhongMaterial colour="#272727" />
        </mesh>
      )
}

function Cube(props) {
    const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], rotation: [0.4, 0.2, 0.5], ...props }))
    return (
        <mesh receiveShadow castShadow ref={ref}>
            <boxGeometry />
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
            <Physics>
                {/* <Debug color="hotpink"> */}
                    <Plane position={[0, 0, 0]} />
                    <Cube position={[0, 10, 0]}/>
                    <Cube position={[-1, 8, -2]}/>
                    <Cube position={[-1.1, 20, -2.3]}/>
                    <Cube position={[1, 8, -1]}/>
                    <Cube position={[2, 5, 1]}/>
                {/* </Debug> */}
            </Physics>
        </>
    )

}

export default function BasicPhysics(props) {

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