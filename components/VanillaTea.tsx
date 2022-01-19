import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense } from 'react'
import { Sky, Loader, Stats } from '@react-three/drei'

// Import/create components
import CupModels from '../components/CupModel'
import Text from '../components/Text'

// Camera effects
function Dolly() {
    useFrame((state) => {
      state.camera.position.z = 7 + Math.sin(state.clock.getElapsedTime())
      state.camera.updateProjectionMatrix()
    })
    return null
}
  
export function VTSetup() {

    const textOptions = {
        size: 1,
        height: 1,
        bevelEnabled: true,
        bevelSize: 0.05,
        bevelThickness: 0.05
      }

    return (
        <Suspense fallback={null}>
            <spotLight color="#61dafb" position={[-10, -10, -10]} intensity={0.2} />
            <spotLight color="#61dafb" position={[-10, 0, 15]} intensity={0.8} />
            <spotLight color="#61dafb" position={[-5, 20, 2]} intensity={0.5} />
            <spotLight color="#f2056f" position={[15, 10, -2]} intensity={2} />
            <spotLight color="#f2056f" position={[15, 10, 5]} intensity={1} />
            <spotLight color="#b107db" position={[5, -10, 5]} intensity={0.8} />
            <CupModels count={500} fieldScale={10} closeness={0} animation={true} material='phong' opacity={0.6}/>
            <Text text="VANILLA" position={[0, 0, -1]} vAlign='center' hAlign='center' geomOptions={textOptions} animate={true} opacity={1} />
            <Text text="TEA" position={[-1, -1, -1]} vAlign='center' hAlign='center' geomOptions={textOptions} animate={true} opacity={1} />
            <Sky />
            <Dolly />
            <Stats showPanel={0} />
        </Suspense>
    )
}

export interface VanillaTeaProps {
    style: any
  }
  

export default function VanillaTea(props: VanillaTeaProps) {

    return (
        <>
            <Canvas 
                id="teacup-field" 
                style={props.style}
                className="gallery-canvas"
                camera={{ near: 0.5, far: 15 }}
            >
                <VTSetup />
            </Canvas>
            <Loader />
        </>
    )

}