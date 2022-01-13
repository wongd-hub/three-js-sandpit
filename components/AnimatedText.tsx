import * as THREE from 'three';
import React, { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Text from './Text'

export interface AnimatedTextProps {
    groupProps?: JSX.IntrinsicElements["group"],
    text: string,
    geomOptions: any
}

export default function AnimatedText(props: AnimatedTextProps) {
  
    const grp = useRef<THREE.Group>()
    useFrame(({ clock }) => (grp.current!.rotation.x = grp.current!.rotation.y = grp.current!.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3))
  
    return (
      <group ref={grp} {...props.groupProps} dispose={null}>
          <Suspense fallback="Loading...">
            <Text text={props.text} geomOptions={... props.geomOptions} />
          </Suspense>
      </group>
    )
  
}