import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Capsule, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Character = ({ isGirl = false, position = [0, 0, 0] as [number, number, number] }) => {
    const group = useRef<THREE.Group>(null);
    const head = useRef<THREE.Group>(null);

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
    const girlCoatColor = "#d2b48c"; // Tan/Beige
    const boyCoatColor = "#4a5d4e"; // Grayish Green
    const eyeColor = "#3d2b1f"; // Dark brown eyes
    const hairColor = isGirl ? "#704214" : "#4b2c20";

    return (
        <group ref={group} position={position}>
            {/* Body - Coat */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <capsuleGeometry args={[0.35, 0.6, 8, 24]} />
                <meshStandardMaterial color={isGirl ? girlCoatColor : boyCoatColor} roughness={0.8} />
            </mesh>

            {/* Fur Collar proxy */}
            <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.3, 0.08, 8, 24]} />
                <meshStandardMaterial color="#f5f5f5" roughness={1} />
            </mesh>

            {!isGirl && (
                /* Scarf for boy */
                <group position={[0, 0.32, 0]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.25, 0.08, 8, 24]} />
                        <meshStandardMaterial color="#c0392b" />
                    </mesh>
                    <mesh position={[0.15, -0.2, 0.2]} rotation={[0, 0, 0.2]}>
                        <capsuleGeometry args={[0.06, 0.3, 4, 8]} />
                        <meshStandardMaterial color="#c0392b" />
                    </mesh>
                </group>
            )}

            {/* Legs & Boots */}
            <group position={[0.15, -0.6, 0]}>
                <mesh castShadow>
                    <capsuleGeometry args={[0.12, 0.4, 4, 12]} />
                    <meshStandardMaterial color="#4834d4" />
                </mesh>
                <mesh position={[0, -0.15, 0.05]}>
                    <boxGeometry args={[0.18, 0.2, 0.3]} />
                    <meshStandardMaterial color="#4b2c20" />
                </mesh>
                <mesh position={[0, -0.05, 0]}>
                    <cylinderGeometry args={[0.13, 0.13, 0.1, 16]} />
                    <meshStandardMaterial color="#f5f5f5" />
                </mesh>
            </group>
            <group position={[-0.15, -0.6, 0]}>
                <mesh castShadow>
                    <capsuleGeometry args={[0.12, 0.4, 4, 12]} />
                    <meshStandardMaterial color="#4834d4" />
                </mesh>
                <mesh position={[0, -0.15, 0.05]}>
                    <boxGeometry args={[0.18, 0.2, 0.3]} />
                    <meshStandardMaterial color="#4b2c20" />
                </mesh>
                <mesh position={[0, -0.05, 0]}>
                    <cylinderGeometry args={[0.13, 0.13, 0.1, 16]} />
                    <meshStandardMaterial color="#f5f5f5" />
                </mesh>
            </group>

            {/* Head */}
            <group ref={head} position={[0, 0.95, 0]}>
                <mesh castShadow receiveShadow>
                    <sphereGeometry args={[0.38, 32, 32]} />
                    <meshStandardMaterial color={skinColor} roughness={0.5} />
                </mesh>

                {/* Eyes - Refined */}
                <group position={[0.15, 0.05, 0.3]}>
                    <mesh>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshStandardMaterial color="#ffffff" />
                    </mesh>
                    <mesh position={[0, 0, 0.05]}>
                        <sphereGeometry args={[0.045, 16, 16]} />
                        <meshBasicMaterial color={eyeColor} />
                    </mesh>
                    <mesh position={[0.02, 0.02, 0.08]}>
                        <sphereGeometry args={[0.015, 8, 8]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                </group>
                <group position={[-0.15, 0.05, 0.3]}>
                    <mesh>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshStandardMaterial color="#ffffff" />
                    </mesh>
                    <mesh position={[0, 0, 0.05]}>
                        <sphereGeometry args={[0.045, 16, 16]} />
                        <meshBasicMaterial color={eyeColor} />
                    </mesh>
                    <mesh position={[0.02, 0.02, 0.08]}>
                        <sphereGeometry args={[0.015, 8, 8]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                </group>

                {/* Small Nose */}
                <mesh position={[0, -0.02, 0.35]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshStandardMaterial color="#f4a460" />
                </mesh>

                {/* Blush */}
                <mesh position={[0.22, -0.08, 0.28]} scale={[1, 0.5, 1]}>
                    <sphereGeometry args={[0.06, 16, 16]} />
                    <meshStandardMaterial color="#ff8080" transparent opacity={0.4} />
                </mesh>
                <mesh position={[-0.22, -0.08, 0.28]} scale={[1, 0.5, 1]}>
                    <sphereGeometry args={[0.06, 16, 16]} />
                    <meshStandardMaterial color="#ff8080" transparent opacity={0.4} />
                </mesh>

                {/* Hair - Sweeping */}
                <mesh position={[0, 0.05, 0]}>
                    <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, isGirl ? Math.PI / 2 : Math.PI / 1.8]} />
                    <meshStandardMaterial color={hairColor} roughness={0.8} />
                </mesh>
                {isGirl && (
                    <group>
                        {[...Array(8)].map((_, i) => (
                            <mesh key={i} position={[Math.sin(i) * 0.3, -0.2, Math.cos(i) * 0.1 - 0.1]} rotation={[0, 0, Math.sin(i) * 0.5]}>
                                <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
                                <meshStandardMaterial color={hairColor} />
                            </mesh>
                        ))}
                    </group>
                )}
            </group>

            {/* Arms - Sleeves */}
            <group position={[0.45, 0.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <mesh castShadow>
                    <capsuleGeometry args={[0.09, 0.4, 4, 8]} />
                    <meshStandardMaterial color={isGirl ? girlCoatColor : boyCoatColor} />
                </mesh>
                <mesh position={[0, -0.25, 0]}>
                    <sphereGeometry args={[0.07, 12, 12]} />
                    <meshStandardMaterial color={skinColor} />
                </mesh>
            </group>
            <group position={[-0.45, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
                <mesh castShadow>
                    <capsuleGeometry args={[0.09, 0.4, 4, 8]} />
                    <meshStandardMaterial color={isGirl ? girlCoatColor : boyCoatColor} />
                </mesh>
                <mesh position={[0, -0.25, 0]}>
                    <sphereGeometry args={[0.07, 12, 12]} />
                    <meshStandardMaterial color={skinColor} />
                </mesh>
            </group>
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
