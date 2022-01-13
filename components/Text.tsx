import React, { useRef, useEffect, useState } from "react";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import poppinsBold from '../public/assets/fonts/Poppins_Bold.json';

extend({ TextGeometry })

export interface TextProps {
    position?: any,
    text: string,
    vAlign?: string, 
    hAlign?: string,
    geomOptions: any,
    animate: boolean
}

// Components
export default function Text(props: TextProps) {

    const font = new FontLoader().parse(poppinsBold);
    const mesh = useRef<THREE.Mesh>(null!)

    // Align text as noted in props
    useEffect(() => {
        mesh.current.position.set(props.position[0], props.position[1], props.position[2])

        const size = new THREE.Vector3()
        mesh.current.geometry.computeBoundingBox()
        mesh.current.geometry.boundingBox!.getSize(size)
        mesh.current.position.x += props.hAlign === 'center' ? -size.x / 2 : props.hAlign === 'right' ? 0 : -size.x
        mesh.current.position.y += props.vAlign === 'center' ? -size.y / 2 : props.vAlign === 'top' ? 0 : -size.y
      }, [props]);

    // const txtGrp = useRef<THREE.Group>()
    const [txtHovered, setTxtHovered] = useState(false)
      
    useFrame((state) => {
        if (props.animate === true) {
            mesh.current!.scale.x = 
            mesh.current!.scale.y = 
            mesh.current!.scale.z = 
            THREE.MathUtils.lerp(mesh.current!.scale.z, txtHovered ? 1.4 : 1, 0.1)
        }
    })


    return (
        <mesh 
            ref={mesh}
            position={props.position}
            onPointerOver={(e) => (e.stopPropagation(), setTxtHovered(true))} onPointerOut={() => setTxtHovered(false)}
        >
            <textGeometry attach="geometry" args={[props.text, {font, ...props.geomOptions}]}  />
            <meshNormalMaterial attach="material" />
        </mesh>
    )

}