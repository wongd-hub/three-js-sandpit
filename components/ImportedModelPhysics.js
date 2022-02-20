import React, { useMemo, useRef, Suspense, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, OrbitControls, Loader, Sky, PerspectiveCamera } from "@react-three/drei"
import { Physics, useBox, usePlane, Debug, useTrimesh, useSphere, useCompoundBody, useCylinder } from '@react-three/cannon'
import * as THREE from 'three'
// import { motion } from 'framer-motion-3d'

export function VanillaBean(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/assets/models/vanilla_hp.glb')

  // Pull out vertices and indices information to create a trimesh for the physics world
  const {
    attributes: {
      position: { array: vertices },
    },
    index: { array: indices },
  } = nodes.FlowerBean.geometry
  console.log(vertices)
  const [trimeshRef] = useTrimesh(() => ({ // Not working; could instead just put a plane in the cup, visualise with debugger
    args: [vertices.map(x => x * 0.02), indices],
    mass: 7,
    ...props
  }))


  return (
    <group ref={trimeshRef} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.FlowerBean.geometry}
        material={nodes.FlowerBean.material}
        scale={[0.03, 0.03, 0.03]}
      />
    </group>
  )
}

useGLTF.preload('/assets/models/models/vanilla_hp.glb')

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
                {/* <Debug color="hotpink" scale={1.5}> */}
                    <Plane position={[0, 0, 0]} />
                    <VanillaBean position={[0, 10, 0]} rotation={[0, Math.PI / 7, Math.PI / 6]} />
                    <VanillaBean position={[-1, 20, -4]} rotation={[Math.PI / 7, Math.PI / 2, Math.PI / 12]} />
                {/* </Debug> */}
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