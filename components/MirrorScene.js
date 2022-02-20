import { Text } from '@react-three/drei'

import React, { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'
import { applyProps, Canvas, useFrame } from "@react-three/fiber"
import { Loader } from '@react-three/drei'
import { DepthOfField, EffectComposer } from '@react-three/postprocessing'
import RgbDelay from './effects/rgbDelay'




export function Mirrors() {


    return (
        <Text material-toneMapped={false} position={[0, 0, 4.5]}>Hello World</Text>
    )

}


export default function MirrorScene(props) {


    return (
        <Canvas
            style={props.style}
        >
            <color attach="background" args={["black"]} />
            <Mirrors />
        </Canvas>
    )

}