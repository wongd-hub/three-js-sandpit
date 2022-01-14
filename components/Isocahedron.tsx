// Attempt at instancing https://codesandbox.io/s/floating-instanced-shoes-forked-j37nd?file=/src/App.js

import React, { useRef, useState } from "react";
import { Instances, Instance } from '@react-three/drei'
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';

export function Icosahedron({ ...props }: JSX.IntrinsicElements['group']) {

    const ref = useRef<THREE.InstancedMesh>()
    const [hovered, setHover] = useState(false)
    const color = hovered ? new THREE.Color('white') : new THREE.Color('#FF2E00')

    useFrame((state) => {
        ref.current!.scale.x = 
            ref.current!.scale.y = 
            ref.current!.scale.z = 
            THREE.MathUtils.lerp(ref.current!.scale.z, hovered ? 1.2 : 1, 0.1)
    })

    return (
        <group {...props}>
          <Instance 
            ref={ref} 
            onPointerOver={(e) => {e.stopPropagation(); setHover(true);}} 
            onPointerOut={() => setHover(false)} 
            color={color}
        />
        </group>
      )


}

// Formulae pulled from the following sandbox to generate random positions
const randomVector = (r: number) => [r / 2 - Math.random() * r, r / 2 - Math.random() * r, r / 2 - Math.random() * r]
const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
const randomData = Array.from({ length: 1000 }, (r = 10) => ({ random: Math.random(), position: randomVector(r as number), rotation: randomEuler() }))

export default function Icosahedrons(props: {
    groupProps?: JSX.IntrinsicElements["group"],
    range: number,
    fieldScale: number,
    closeness: number,
    animation: boolean,
    material: 'normal' | 'phong'
}) {

    const instanceGrp = useRef<THREE.Group>()

    useFrame(({ clock }) => {
        if (props.animation === true) {
            instanceGrp.current!.rotation.x = clock.getElapsedTime() * 0.1
            instanceGrp.current!.rotation.y = clock.getElapsedTime() * 0.4
            instanceGrp.current!.rotation.z = clock.getElapsedTime() * 0.1
        }
      })

    return (
        <group ref={instanceGrp}>
            <Instances 
                range={props.range} 
                material={props.material === 'normal' ? new THREE.MeshNormalMaterial() : new THREE.MeshPhongMaterial()}
                geometry={new THREE.IcosahedronGeometry(1, 0)}
            >
                {
                    new Array(props.range).fill('i').map((el, i) => {
                        const xPos = (Math.random() - 0.5) * props.fieldScale;
                        const yPos = (Math.random() - 0.5) * props.fieldScale;
                        const zPos = (Math.random() - 0.5) * props.fieldScale + props.closeness;
                    
                        const xRot = Math.PI * Math.random() * 2 
                        const yRot = Math.PI * Math.random() * 2 
                        const zRot = Math.PI * Math.random() * 2 
                    
                        const sca = Math.random() * 0.2
                    
                        const saucerBool = Math.random() < 0.5 ? true : false
                        return (<Icosahedron key={i} position={[xPos, yPos, zPos]} rotation={[xRot, yRot, zRot]} scale={[sca, sca, sca]} />)
                    })
                }
            </Instances>
        </group>
    )

}