import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { NavigationMenu } from '@/components/NavigationMenu';

const DebugPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Basic Vanilla Three.js Setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#fff0f0');

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshToonMaterial({ color: 0xff4d6d });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0x404040));

        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <NavigationMenu />
            <div className="pt-24 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4">Vanilla Three.js Debug (No Fiber)</h1>
                <p className="text-muted-foreground mb-8">If you see a rotating pink cube, Three.js is working!</p>
                <div
                    ref={containerRef}
                    className="w-full max-w-2xl h-[400px] border-2 border-primary/20 rounded-3xl overflow-hidden glass-card"
                />
            </div>
        </div>
    );
};

export default DebugPage;
