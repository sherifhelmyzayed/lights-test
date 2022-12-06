import { Vector3, SpotLight as SpotLightType } from 'three';
import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { SpotLight, useDepthBuffer } from '@react-three/drei';


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

const MovingSpot = () => {
  const light = useRef<SpotLightType>(null!);
  const viewport = useThree((state) => state.viewport);
  const vec = new Vector3();

  useFrame((state) => {
    light.current.target.position.lerp(
      vec.set((state.mouse.x * viewport.width) / 2,
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
    <Canvas shadows dpr={[1, 2]} camera={{ position: [-2, 2, 6], fov: 50, near: 1, far: 20 }} style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={['#202020']} />
      <fog attach="fog" args={['#202020', 10, 30]} />
      <Plane />
      <MovingSpot />
    </Canvas>
  );
}

export default App;