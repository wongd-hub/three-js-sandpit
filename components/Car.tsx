import * as THREE from 'three'
import React, { useRef, Suspense } from 'react'
import { useGLTF, Loader, Sky, ContactShadows, PresentationControls, Html } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { Canvas, useFrame } from "@react-three/fiber"
import { MeshBasicMaterial } from 'three'

type GLTFResult = GLTF & {
  nodes: {
    FRW: THREE.Mesh
    RRW: THREE.Mesh
    RLW: THREE.Mesh
    Cube001: THREE.Mesh
    Cube001_1: THREE.Mesh
    FLW: THREE.Mesh
  }
  materials: {
    Color: THREE.MeshStandardMaterial
    Light: THREE.MeshStandardMaterial
  }
}

export default function Car(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/models/car.glb') as unknown as GLTFResult
  const newMaterial = new THREE.MeshNormalMaterial()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current!.rotation.x = -Math.PI / 1.75 + Math.cos(t / 4) / 8  + Math.PI * 0.65
    group.current!.rotation.y = Math.sin(t / 4) / 8 - 0.9
    group.current!.rotation.z = (1 + Math.sin(t / 1.5)) / 20 - 0.2
    group.current!.position.y = (1 + Math.sin(t / 1.5)) / 10 + 0.8
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.FRW.geometry}
        material={newMaterial}
        position={[-0.89, 0.39, 1.13]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.01, 0.01, 0.01]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.RRW.geometry}
        material={newMaterial}
        position={[-0.92, 0.39, -1.19]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.01, 0.01, 0.01]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.RLW.geometry}
        material={newMaterial}
        position={[0.92, 0.39, -1.19]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.01, 0.01, 0.01]}
      />
      <group rotation={[Math.PI / 2, 0, 0]} scale={[0.01, 0.01, 0.01]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube001.geometry}
          material={newMaterial}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube001_1.geometry}
          material={newMaterial}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.FLW.geometry}
        material={newMaterial}
        position={[0.89, 0.39, 1.13]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.01, 0.01, 0.01]}
      />
    </group>
  )
}

useGLTF.preload('/assets/models/car.glb')