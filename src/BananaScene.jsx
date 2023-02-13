import * as THREE from "three";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { Environment, useGLTF } from "@react-three/drei";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";

function Banana({ z }) {
  const ref = useRef();
  const { nodes, materials } = useGLTF("/banana-v1-transformed.glb");

  const { viewport, camera } = useThree();

  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z]);

  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  });

  useFrame((state) => {
    ref.current.rotation.set(
      (data.rX += 0.001),
      (data.rY += 0.004),
      (data.rZ += 0.0005)
    );
    ref.current.position.set(data.x * width, (data.y += 0.01), z);
    if (data.y > height) {
      data.y = -height;
    }
  });
  return (
    <mesh
      ref={ref}
      geometry={nodes.banana.geometry}
      material={materials["skin.001"]}
      position={[0, 1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      material-emissive="orange"
    />
  );
}

const BananaScene = ({ count = 100, depth = 80 }) => {
  return (
    <Canvas gl={{ alpha: false }} camera={{ near: 0.1, far: 110, fov: 30 }}>
      <color attach="background" args={["#ffbf3f"]} />
      {/* <ambientLight intensity={0.2} /> */}
      <spotLight position={[10, 10, 10]} intensity={1} />
      <Suspense fallback={null}>
        {Array.from({ length: count }, (_, i) => (
          <Banana key={i} z={-(i / count) * depth - 20} />
        ))}
        <EffectComposer>
          <DepthOfField
            target={[0, 0, depth / 2]}
            focalLength={0.5}
            bokehScale={11}
            height={700}
          />
        </EffectComposer>
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
};

export default BananaScene;
