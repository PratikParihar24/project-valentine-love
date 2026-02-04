import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { Users, Heart } from 'lucide-react';
import { Confetti } from '@/components/Confetti';

// Helper to create a stylized character in Three.js
const createCharacter = (isGirl: boolean) => {
  const group = new THREE.Group();
  const skinColor = new THREE.Color("#ffdbac");
  const clothColor = new THREE.Color(isGirl ? "#ffafcc" : "#3b82f6");
  const eyeColor = new THREE.Color("#222");

  // Body
  const bodyGeo = new THREE.CapsuleGeometry(0.4, 0.8, 4, 16);
  const bodyMat = new THREE.MeshToonMaterial({ color: clothColor });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // Head
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.9, 0);

  const headGeo = new THREE.SphereGeometry(0.35, 32, 32);
  const headMat = new THREE.MeshToonMaterial({ color: skinColor });
  const head = new THREE.Mesh(headGeo, headMat);
  headGroup.add(head);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.05, 16, 16);
  const eyeMat = new THREE.MeshBasicMaterial({ color: eyeColor });

  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(0.12, 0.05, 0.28);
  head.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(-0.12, 0.05, 0.28);
  head.add(rightEye);

  // Hair
  const hairGeo = new THREE.SphereGeometry(0.36, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const hairMat = new THREE.MeshToonMaterial({ color: new THREE.Color(isGirl ? "#4b2c20" : "#2d1b14") });
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.set(0, 0.15, 0);
  head.add(hair);

  group.add(headGroup);

  // Arms
  const armGeo = new THREE.CapsuleGeometry(0.08, 0.4, 4, 8);
  const armMat = new THREE.MeshToonMaterial({ color: skinColor });

  const leftArm = new THREE.Mesh(armGeo, armMat);
  leftArm.position.set(0.45, 0.3, 0);
  leftArm.rotation.z = -Math.PI / 4;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, armMat);
  rightArm.position.set(-0.45, 0.3, 0);
  rightArm.rotation.z = Math.PI / 4;
  group.add(rightArm);

  return { group, head, leftArm, rightArm };
};

const HugMeter = () => {
  const [value, setValue] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasReachedMax, setHasReachedMax] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    mikuu: any,
    chakudi: any
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null; // Transparent

    const camera = new THREE.PerspectiveCamera(35, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const mikuu = createCharacter(true);
    const chakudi = createCharacter(false);

    scene.add(mikuu.group);
    scene.add(chakudi.group);

    sceneRef.current = { scene, camera, renderer, mikuu, chakudi };

    let animationId: number;
    const animate = (time: number) => {
      animationId = requestAnimationFrame(animate);
      const t = time / 1000;

      // Idle animations
      mikuu.group.position.y = Math.sin(t * 2) * 0.02;
      chakudi.group.position.y = Math.cos(t * 2) * 0.02;
      mikuu.head.rotation.y = Math.sin(t * 0.5) * 0.1;
      chakudi.head.rotation.y = Math.cos(t * 0.5) * 0.1;

      renderer.render(scene, camera);
    };

    animate(0);

    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      const { camera, renderer } = sceneRef.current;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update character positions based on slider
  useEffect(() => {
    if (!sceneRef.current) return;
    const { mikuu, chakudi } = sceneRef.current;

    const spread = 4;
    const progress = value / 100;
    const leftX = -spread + (progress * (spread - 0.4));
    const rightX = spread - (progress * (spread - 0.4));

    mikuu.group.position.x = leftX;
    chakudi.group.position.x = rightX;

    // Face each other
    mikuu.group.rotation.y = Math.PI / 4 * progress;
    chakudi.group.rotation.y = -Math.PI / 4 * progress;

    // Hugging arm motion at 100%
    if (value === 100) {
      mikuu.leftArm.rotation.z = Math.PI / 2;
      mikuu.rightArm.rotation.z = -Math.PI / 2;
      chakudi.leftArm.rotation.z = Math.PI / 2;
      chakudi.rightArm.rotation.z = -Math.PI / 2;
    } else {
      mikuu.leftArm.rotation.z = -Math.PI / 4;
      mikuu.rightArm.rotation.z = Math.PI / 4;
      chakudi.leftArm.rotation.z = -Math.PI / 4;
      chakudi.rightArm.rotation.z = Math.PI / 4;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setValue(newValue);

    if (newValue === 100 && !hasReachedMax) {
      setHasReachedMax(true);
      setShowConfetti(true);
    }
  };

  const isHugging = value === 100;

  return (
    <div className={`min-h-screen bg-gradient-to-b from-background via-rose-light/30 to-background overflow-hidden relative`}>
      <NavigationMenu />
      <PageHeader
        title="3D Hug Meter"
        subtitle="Mikuu & Chakudi"
        icon={<Users className="w-5 h-5 text-primary" />}
      />

      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <main className="pt-24 pb-8 px-4 flex flex-col items-center justify-center min-h-screen relative z-10">

        <div className="w-full max-w-2xl h-[450px] relative mt-[-50px]">
          <div ref={containerRef} className="w-full h-full" />

          <div className="absolute top-4 left-0 w-full flex justify-between px-10 pointer-events-none">
            <span className="text-sm font-bold bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-primary/20 text-primary">Mikuu</span>
            <span className="text-sm font-bold bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-primary/20 text-primary">Chakudi</span>
          </div>
        </div>

        {/* Slider Card */}
        <motion.div
          className="glass-card rounded-3xl p-6 w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-sm">Hug Power</span>
            <span className="text-2xl font-bold text-primary">{value}%</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={handleChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(347 77% 62%) ${value}%, hsl(347 30% 88%) ${value}%)`,
            }}
          />

          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>👋 Wave</span>
            <span>🤗 MEGA HUG</span>
          </div>

          {isHugging && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-primary font-semibold flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 fill-current" />
                Mikuu & Chakudi are hugging!
                <Heart className="w-5 h-5 fill-current" />
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.p
          className="text-muted-foreground text-sm mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Slide to bring Mikuu & Chakudi together! 💕
        </motion.p>
      </main>
    </div>
  );
};

export default HugMeter;
