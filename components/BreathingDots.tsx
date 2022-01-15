// Built using this tutorial https://tympanus.net/codrops/2020/12/17/recreating-a-dave-whyte-animation-in-react-three-fiber/
//  Differences include:
//   - The tutorial provides a way of turning the wave into an octagon by combining cosine with the distance function at a certain frequency
import React, { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from "@react-three/fiber"
import { Loader } from '@react-three/drei'
import { DepthOfField, EffectComposer } from '@react-three/postprocessing'

export interface DotProps {
    count: number
}

// Boxier sine wave || https://dsp.stackexchange.com/a/56529
const roundedSquareWave = (t: any, delta: number, a: number, f: number) => {
    return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta)
  }

function Dots(props: DotProps) {
    const color = new THREE.Color('white')
    const ref = useRef<THREE.InstancedMesh>()
    const origin = new THREE.Vector3()

    // Use a useMemo to cache values so no need to re-calculate every loop
    //  Also add vec which stores original positions to return there
    const { vec, transform, positions, distances } = useMemo(() => {
        const vec = new THREE.Vector3()
        const transform = new THREE.Matrix4() // This defaults to an identity matrix
        const positions = [...Array(props.count)].map((_, i) => {
            const position = new THREE.Vector3()

            // Place in square grid
            position.x = (i % Math.sqrt(props.count)) - (Math.sqrt(props.count) / 2)
            position.y = Math.floor(i / Math.sqrt(props.count)) - (Math.sqrt(props.count) / 2)

            // Offset every other column (hexagonal pattern)
            position.y += (i % 2) * 0.5

            // Add some noise
            position.x += Math.random() * 0.3
            position.y += Math.random() * 0.3
            return position
        })
        const distances = positions.map(pos => pos.length())
        return { vec, transform, positions, distances }
      }, [])

    useFrame(({ clock, camera }) => {
        // const scale = 1 + Math.sin(clock.elapsedTime) * 0.3 // Old, stock sine-wave
        for (let i = 0; i < props.count; ++i) {
            const t = clock.elapsedTime - distances[i] / 80
            const wave = roundedSquareWave(t, 0.1, 1, 1 / 4)
            const scale = 1 + wave * 0.3

            // Calculate new position
            vec.copy(positions[i]).multiplyScalar(scale)

            // Go to new position
            transform.setPosition(vec)
            ref.current!.setMatrixAt(i, transform)

        }
        ref.current!.instanceMatrix.needsUpdate = true

        camera.lookAt(origin)
    })

    return (
      <instancedMesh ref={ref} args={[undefined, undefined, props.count]}>
        <circleBufferGeometry args={[0.15]} />
        <meshBasicMaterial color={color.getHex()} />
      </instancedMesh>
    )
}

export default function BreathingDots() {

  return (
    <>
        <Canvas 
            color={'black'} 
            style={{ height: '50vh' }} 
            camera={{ position: [3, -5, 9], zoom: 1.9 }} // Zoom out
        >
            <color attach="background" args={["black"]} />
            <Suspense fallback={null}>
                <Dots count={22500} />
                <EffectComposer>
                    <DepthOfField
                        focusDistance={0.48}
                        focalLength={10}
                        bokehScale={20}
                    />
                </EffectComposer>
            </Suspense>
        </Canvas>
        <Loader />
    </>
  )
}