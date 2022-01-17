// Adapted from this sandbox https://codesandbox.io/s/lt473?file=/src/App.js
import React, { useMemo, useRef, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Loader } from "@react-three/drei"
import './effects/dotmaterial'

export function Particles({ rows, cols }) {
    const [coords, sizes, colours] = useMemo(() => {
      const initialCoords = []
      const initialSizes = []
      const initialColours = []

      let i = 0

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          initialCoords.push(x)
          initialCoords.push(y)
          initialCoords.push(i)
          initialSizes.push(Math.random() < 0.03 ? 10 : 6)
          initialColours.push(0xafb0ba)
          i++
        }
      }
  
      const coords = new Float32Array(initialCoords)
      const sizes = new Float32Array(initialSizes)
      const colours = new Float32Array(initialColours)
      return [coords, sizes, colours]
    }, [rows, cols])
  
    const geom = useRef()
    
    useFrame((state) => {
        geom.current.material.uniforms.time.value = state.clock.elapsedTime
        geom.current.geometry.verticesNeedUpdate = true
    })
  
    return (
      <points ref={geom} position={[0, 1, 0]} rotation={[-Math.PI / 4, 0, Math.PI / 6]}>
        <bufferGeometry attach="geometry">
          <bufferAttribute attachObject={["attributes", "position"]} count={coords.length / 3} array={coords} itemSize={3} />
          <bufferAttribute attachObject={["attributes", "size"]} count={sizes.length} array={sizes} itemSize={1} />
          <bufferAttribute attachObject={["attributes", "color"]} count={colours.length} array={colours} itemSize={1} />
        </bufferGeometry>
        <dotMaterial />
      </points>
    )
  }


export default function ParticleField() {

    return (
        <>
            <Canvas
                style={{height: '50vh'}}
                camera={{ position: [0, 0, 2] }}
            >
                <Suspense fallback={null}>
                    <color attach="background" args={["black"]} />
                    <Particles rows={50} cols={50} />
                </Suspense>
                <OrbitControls />
            </Canvas>
            <Loader />
        </>
    )
}