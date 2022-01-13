import React, { useRef, useEffect } from "react";
import { extend } from "@react-three/fiber";
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
    geomOptions: any
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

    return (
        <mesh 
            ref={mesh}
            position={props.position}
        >
            <textGeometry attach="geometry" args={[props.text, {font, ...props.geomOptions}]}  />
            <meshNormalMaterial attach="material" />
        </mesh>
    )

}