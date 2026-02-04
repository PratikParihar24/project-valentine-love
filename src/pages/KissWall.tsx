import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { Sparkles, Heart } from 'lucide-react';
import { Confetti } from '@/components/Confetti';

type KissType = 'peck' | 'cheek' | 'forehead' | 'butterfly' | 'eskimo';

interface KissConfig {
  id: KissType;
  label: string;
  emoji: string;
  description: string;
  girlEmoji: string;
  boyEmoji: string;
  kissEmoji: string;
}

const KISS_TYPES: KissConfig[] = [
  { id: 'peck', label: 'Quick Peck', emoji: '💋', description: 'A sweet quick kiss', girlEmoji: '😗', boyEmoji: '😙', kissEmoji: '💋' },
  { id: 'cheek', label: 'Cheek Kiss', emoji: '😘', description: 'A gentle kiss on the cheek', girlEmoji: '😚', boyEmoji: '☺️', kissEmoji: '💕' },
  { id: 'forehead', label: 'Forehead Kiss', emoji: '🥰', description: 'A caring forehead kiss', girlEmoji: '🥰', boyEmoji: '😌', kissEmoji: '💗' },
  { id: 'butterfly', label: 'Butterfly Kiss', emoji: '🦋', description: 'Eyelashes fluttering', girlEmoji: '😊', boyEmoji: '😊', kissEmoji: '🦋' },
  { id: 'eskimo', label: 'Eskimo Kiss', emoji: '👃', description: 'Nose to nose rub', girlEmoji: '🤭', boyEmoji: '😄', kissEmoji: '💖' },
];

const createKissingCharacter = (isGirl: boolean) => {
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
  const armGeo = new THREE.CapsuleGeometry(0.08, 0.3, 4, 8);
  const armMat = new THREE.MeshToonMaterial({ color: skinColor });
  const leftArm = new THREE.Mesh(armGeo, armMat);
  leftArm.position.set(0.5, 0.2, 0);
  leftArm.rotation.z = -Math.PI / 6;
  group.add(leftArm);
  const rightArm = new THREE.Mesh(armGeo, armMat);
  rightArm.position.set(-0.5, 0.2, 0);
  rightArm.rotation.z = Math.PI / 6;
  group.add(rightArm);

  return { group, head: headGroup, headMesh: head };
};

const KissWall = () => {
  const [selectedKiss, setSelectedKiss] = useState<KissType>('peck');
  const [isKissing, setIsKissing] = useState(false);
  const [kissCount, setKissCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    mikuu: any,
    chakudi: any
  } | null>(null);

  const currentKiss = KISS_TYPES.find(k => k.id === selectedKiss)!;

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(35, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const mikuu = createKissingCharacter(true);
    const chakudi = createKissingCharacter(false);

    mikuu.group.position.x = -1.2;
    chakudi.group.position.x = 1.2;

    scene.add(mikuu.group);
    scene.add(chakudi.group);

    sceneRef.current = { scene, camera, renderer, mikuu, chakudi };

    let animationId: number;
    const animate = (time: number) => {
      animationId = requestAnimationFrame(animate);
      const t = time / 1000;

      // Idle movement
      mikuu.group.position.y = Math.sin(t * 1.5) * 0.02;
      chakudi.group.position.y = Math.cos(t * 1.5) * 0.02;

      renderer.render(scene, camera);
    };

    animate(0);

    return () => {
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update animations based on state
  useEffect(() => {
    if (!sceneRef.current) return;
    const { mikuu, chakudi } = sceneRef.current;

    if (isKissing) {
      switch (selectedKiss) {
        case 'peck':
          mikuu.group.position.x = -0.4;
          chakudi.group.position.x = 0.4;
          mikuu.head.rotation.x = -0.2;
          chakudi.head.rotation.x = 0.2;
          break;
        case 'cheek':
          mikuu.group.position.x = -0.7;
          chakudi.group.position.x = 0.3;
          mikuu.group.rotation.y = 0.5;
          break;
        case 'forehead':
          mikuu.group.position.x = -0.5;
          chakudi.group.position.x = 0.5;
          chakudi.head.rotation.x = 0.4;
          break;
        case 'butterfly':
          mikuu.group.position.x = -0.2;
          chakudi.group.position.x = 0.2;
          break;
        case 'eskimo':
          mikuu.group.position.x = -0.25;
          chakudi.group.position.x = 0.25;
          break;
      }
    } else {
      // Reset positions smoothly
      mikuu.group.position.x = -1.2;
      chakudi.group.position.x = 1.2;
      mikuu.group.rotation.y = 0;
      chakudi.group.rotation.y = 0;
      mikuu.head.rotation.x = 0;
      chakudi.head.rotation.x = 0;
    }
  }, [isKissing, selectedKiss]);

  const handleKiss = () => {
    if (isKissing) return;

    setIsKissing(true);
    setKissCount(prev => prev + 1);

    // Add floating hearts
    const newHearts = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 60 - 30,
    }));
    setFloatingHearts(prev => [...prev, ...newHearts]);

    // Show confetti every 5 kisses
    if ((kissCount + 1) % 5 === 0) {
      setShowConfetti(true);
    }

    setTimeout(() => {
      setIsKissing(false);
    }, 1500);

    // Clean up old hearts
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-rose-light/30 to-background relative overflow-hidden">
      <NavigationMenu />
      <PageHeader
        title="3D Kiss Day"
        subtitle="Mikuu & Chakudi"
        icon={<Sparkles className="w-5 h-5 text-primary" />}
      />

      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <main className="pt-24 pb-8 px-4 flex flex-col items-center">
        {/* 3D Scene */}
        <div className="w-full max-w-sm h-72 mb-6 relative">
          <div ref={containerRef} className="w-full h-full" />

          {/* Floating Hearts HUD */}
          <AnimatePresence>
            {floatingHearts.map((heart) => (
              <motion.div
                key={heart.id}
                className="absolute left-1/2 top-1/2 text-2xl pointer-events-none z-20"
                initial={{ opacity: 0, y: 0, x: heart.x }}
                animate={{ opacity: [0, 1, 0], y: -150, x: heart.x }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
              >
                💕
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Labels */}
          <div className="absolute top-2 w-full flex justify-between px-6 pointer-events-none">
            <span className="text-xs font-bold bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-primary">Mikuu</span>
            <span className="text-xs font-bold bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-primary">Chakudi</span>
          </div>
        </div>

        {/* Kiss Counter */}
        <motion.div
          className="glass-card rounded-full px-6 py-3 mb-6 flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Heart className="w-5 h-5 text-primary fill-current" />
          <span className="font-bold text-foreground text-lg">{kissCount}</span>
          <span className="text-muted-foreground text-sm">kisses shared</span>
        </motion.div>

        {/* Kiss Types Selection */}
        <motion.div
          className="glass-card rounded-3xl p-6 w-full max-w-sm mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-serif text-lg font-semibold text-foreground mb-4 text-center">
            Choose Kiss Type
          </h3>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {KISS_TYPES.slice(0, 3).map((kiss) => (
              <motion.button
                key={kiss.id}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${selectedKiss === kiss.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80 text-foreground'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedKiss(kiss.id)}
              >
                <span className="text-2xl">{kiss.emoji}</span>
                <span className="text-xs font-medium">{kiss.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {KISS_TYPES.slice(3).map((kiss) => (
              <motion.button
                key={kiss.id}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${selectedKiss === kiss.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80 text-foreground'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedKiss(kiss.id)}
              >
                <span className="text-2xl">{kiss.emoji}</span>
                <span className="text-xs font-medium">{kiss.label}</span>
              </motion.button>
            ))}
          </div>

          <p className="text-center text-muted-foreground text-sm mt-4">
            {currentKiss.description}
          </p>
        </motion.div>

        {/* Kiss Button */}
        <motion.button
          className={`w-full max-w-sm py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${isKissing
            ? 'bg-primary/70 text-primary-foreground'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          whileHover={{ scale: isKissing ? 1 : 1.02 }}
          whileTap={{ scale: isKissing ? 1 : 0.98 }}
          onClick={handleKiss}
          disabled={isKissing}
        >
          <span className="text-2xl">{currentKiss.emoji}</span>
          {isKissing ? 'Kissing...' : `Give a ${currentKiss.label}!`}
        </motion.button>

        <motion.p
          className="text-muted-foreground text-sm mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Mikuu & Chakudi are ready for kisses! 💋
        </motion.p>
      </main>
    </div>
  );
};

export default KissWall;
