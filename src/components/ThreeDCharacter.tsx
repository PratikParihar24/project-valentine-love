import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Capsule, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Character = ({ isGirl = false, position = [0, 0, 0] as [number, number, number] }) => {
    const group = useRef<THREE.Group>(null);
    const head = useRef<THREE.Mesh>(null);

    // Subtle idle animation
    useFrame((state) => {
        if (group.current) {
            group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.05;
        }
        if (head.current) {
            head.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    const skinColor = "#ffdbac";
    const clothColor = isGirl ? "#ffafcc" : "#3b82f6";
    const eyeColor = "#222";

    return (
        <group ref={group} position={position}>
            {/* Body */}
            <Capsule args={[0.4, 0.8, 4, 16]} position={[0, 0, 0]}>
                <meshToonMaterial color={clothColor} />
            </Capsule>

            {/* Head */}
            <mesh ref={head} position={[0, 0.9, 0]}>
                <sphereGeometry args={[0.35, 32, 32]} />
                <meshToonMaterial color={skinColor} />

                {/* Eyes */}
                <mesh position={[0.12, 0.05, 0.28]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshBasicMaterial color={eyeColor} />
                </mesh>
                <mesh position={[-0.12, 0.05, 0.28]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshBasicMaterial color={eyeColor} />
                </mesh>

                {/* Hair / Hat (Stylized) */}
                <mesh position={[0, 0.2, 0]}>
                    <sphereGeometry args={[0.36, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshToonMaterial color={isGirl ? "#4b2c20" : "#2d1b14"} />
                </mesh>
            </mesh>

            {/* Arms */}
            <Capsule args={[0.1, 0.4, 4, 8]} position={[0.5, 0.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
                <meshToonMaterial color={skinColor} />
            </Capsule>
            <Capsule args={[0.1, 0.4, 4, 8]} position={[-0.5, 0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
                <meshToonMaterial color={skinColor} />
            </Capsule>

            {/* Legs */}
            <Capsule args={[0.12, 0.4, 4, 8]} position={[0.2, -0.6, 0]}>
                <meshToonMaterial color={clothColor === "#ffafcc" ? "#333" : "#1a365d"} />
            </Capsule>
            <Capsule args={[0.12, 0.4, 4, 8]} position={[-0.2, -0.6, 0]}>
                <meshToonMaterial color={clothColor === "#ffafcc" ? "#333" : "#1a365d"} />
            </Capsule>
        </group>
    );
};

export const AvatarCanvas = ({ isGirl = false }) => {
    return (
        <div className="w-full h-64 cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                <pointLight position={[-5, 5, -5]} intensity={0.5} />

                <Character isGirl={isGirl} />

                <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
            </Canvas>
        </div>
    );
};
