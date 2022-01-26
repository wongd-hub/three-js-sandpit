import * as THREE from 'three'
import React, { useRef, Suspense } from 'react'
import { useGLTF, Loader, Sky, ContactShadows, PresentationControls, Html } from '@react-three/drei'
import { Canvas, useFrame } from "@react-three/fiber"
import { MeshBasicMaterial } from 'three'

export default function Iphone(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/assets/models/iphone.gltf')
  const newMaterial = new THREE.MeshNormalMaterial()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.x = -Math.PI / 1.75 + Math.cos(t / 4) / 8  + Math.PI * 0.65 + 1 + 3 + 2
    group.current.rotation.y = Math.sin(t / 4) / 8 - 1.4 + 1
    group.current.rotation.z = (1 + Math.sin(t / 1.5)) / 20 - 0.2 + 0.3 - 1
    group.current.position.y = (1 + Math.sin(t / 1.5)) / 10 + 0.8
  })

  return (
    <group ref={group} {...props} dispose={null}>
        <group position={[0, 1.56, 0,]} >
            <mesh geometry={nodes.Circle038.geometry} material={nodes.Circle038.material} />
            <mesh geometry={nodes.Circle038_1.geometry} material={materials['Front.001']} />
            <mesh geometry={nodes.Circle038_2.geometry} material={nodes.Circle038_2.material} />
            <mesh geometry={nodes.Circle038_3.geometry} material={materials['BackGrey.001']} />
            <mesh geometry={nodes.Circle038_4.geometry} material={materials['Rubber.001']} />
            <mesh geometry={nodes.AntennaLineBottom001.geometry} material={nodes.AntennaLineBottom001.material} position={[0, -2.68, 0,]} />
            <mesh geometry={nodes.AntennaLineTop001.geometry} material={nodes.AntennaLineTop001.material} position={[0, 0.02, 0,]} />
            <mesh geometry={nodes.BackCameraBottomLens001.geometry} material={nodes.BackCameraBottomLens001.material} position={[0.7, 0.88, -0.08,]} />
            <mesh geometry={nodes.AppleLogo001.geometry} material={materials['AppleLogo.001']} position={[0.17, 0.52, -0.08,]} />
            <mesh geometry={nodes.BackCameraBottomGreyRing001.geometry} material={nodes.BackCameraBottomGreyRing001.material} position={[0.7, 0.88, -0.09,]} />
            <mesh geometry={nodes.BackCameraP1001.geometry} material={materials['Black.015']} position={[0.7, 1.03, -0.09,]} />
            <mesh geometry={nodes.BackCameraTopLens001.geometry} material={nodes.BackCameraTopLens001.material} position={[0.7, 1.18, -0.08,]} />
            <mesh geometry={nodes.FlashBG001.geometry} material={materials['PinkFlash.002']} position={[0.71, 1.03, -0.09,]} />
            <mesh geometry={nodes.FrontSpeakerBG001.geometry} material={materials['FrontSpeaker.001']} position={[0.16, 1.32, 0.08,]} />
            <mesh geometry={nodes.CameraBump001.geometry} material={nodes.CameraBump001.material} position={[0.7, 1.04, -0.08,]} />
            <mesh geometry={nodes.FrontCameraContainer001.geometry} material={materials['FrontCameraBlack.002']} position={[0.34, 1.32, 0.08,]} />
            <mesh geometry={nodes.BackCameraTopGreyRing001.geometry} material={nodes.BackCameraTopGreyRing001.material} position={[0.7, 1.18, -0.09,]} />
            <mesh geometry={nodes.MuteSwitch001.geometry} material={nodes.MuteSwitch001.material} position={[-0.65, 0.92, 0.01,]} />
            <mesh geometry={nodes.iPhoneLogo001.geometry} material={materials['iPhoneLogo.001']} position={[0.2, -1.18, -0.08,]} />
            <group position={[0.98, -0.04, 0,]} >
                <mesh geometry={nodes.Circle031.geometry} material={materials['Black.014']} />
                <mesh geometry={nodes.Circle031_1.geometry} material={nodes.Circle031_1.material} />
            </group>
            <group position={[0.97, 0.56, 0,]} >
                <mesh geometry={nodes.Circle032.geometry} material={nodes.Circle032.material} />
                <mesh geometry={nodes.Circle032_1.geometry} material={nodes.Circle032_1.material} />
            </group>
            <mesh geometry={nodes.VolumeButtons001.geometry} material={nodes.VolumeButtons001.material} position={[-0.66, 0.21, 0,]} />
            <mesh geometry={nodes.SCREEN.geometry} material={materials['Display.002']} />
        </group>
    </group>
  )
}

useGLTF.preload('/assets/models/iphone.gltf')