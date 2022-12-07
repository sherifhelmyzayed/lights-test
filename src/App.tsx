import { Vector3, SpotLight as SpotLightType } from 'three';
import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { SpotLight, useDepthBuffer, useVideoTexture } from '@react-three/drei';


const Plane = () => {
  return (
    <>
      <mesh receiveShadow position={[0, -1, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial />
      </mesh>
    </>
  )
}

const TransBox = () => {
  return (
    <>
      <mesh receiveShadow position={[0, 0, 0]} >
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          metalness={0.5}
          roughness={0.4}
          transparent
          opacity={0.6} color={'aquamarine'}
          thickness={-1.2}
          envMapIntensity={2.5}
          transmission={1}
        />
      </mesh>
    </>
  )
}

const Video = () => {
  return (
    <>
      <mesh position={[0, -1, -1]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[4, 4, 4]} />
        <VideoMaterial
        />
      </mesh>

    </>
  )
}

function VideoMaterial() {
  
  const texture = useVideoTexture('video.mp4', {
    unsuspend: 'canplay', 
    muted: true,
    loop: true,
    start: true,
  })
  return <meshBasicMaterial map={texture} toneMapped={false} />
}



const MovingSpot = () => {
  const light = useRef<SpotLightType>(null!);
  const viewport = useThree((state) => state.viewport);

  useFrame((state) => {
    light.current.target.position.lerp(
      new Vector3((state.mouse.x * viewport.width) / 2,
        (state.mouse.y * viewport.height) / 2,
        -(state.mouse.y * viewport.height) / 2),
      0.5
    );

    light.current.target.updateMatrixWorld();

  })
  return <SpotLight
    castShadow
    ref={light}
    penumbra={1}
    distance={6}
    angle={0.35}
    attenuation={5}
    anglePower={4}
    intensity={2}
    depthBuffer={useDepthBuffer({ frames: 1 })}
    color="#00000"
    position={[0, 3, 0]}
  />
}


const App = () => {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [-2, 2, 6], fov: 50, near: .01, far: 50 }} style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={['#202020']} />
      <fog attach="fog" args={['#202020', 10, 30]} />
      <ambientLight intensity={0.03} />
      <Plane />
      <TransBox />
      <MovingSpot />
      <Video />
    </Canvas>
  );
}

export default App;