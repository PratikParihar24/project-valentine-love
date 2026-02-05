import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { Trash2, Heart, Sparkles, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
];

const createKissingCharacter = (isGirl: boolean) => {
  const group = new THREE.Group();
  const skinColor = new THREE.Color("#ffdbac");
  const girlCoatColor = new THREE.Color("#d2b48c"); // Tan/Beige
  const boyCoatColor = new THREE.Color("#4a5d4e"); // Grayish Green
  const eyeColor = new THREE.Color("#3d2b1f"); // Dark brown eyes

  // Body - Coat
  const bodyGroup = new THREE.Group();
  const bodyGeo = new THREE.CapsuleGeometry(0.35, 0.6, 8, 24);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: isGirl ? girlCoatColor : boyCoatColor,
    roughness: 0.8
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  body.receiveShadow = true;
  bodyGroup.add(body);

  // Fur Collar proxy
  const furGeo = new THREE.TorusGeometry(0.3, 0.1, 8, 24);
  const furMat = new THREE.MeshStandardMaterial({ color: "#f5f5f5", roughness: 1 });
  const collar = new THREE.Mesh(furGeo, furMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.35;
  bodyGroup.add(collar);

  // Scarf for boy
  if (!isGirl) {
    const scarfGeo = new THREE.TorusGeometry(0.25, 0.08, 8, 24);
    const scarfMat = new THREE.MeshStandardMaterial({ color: "#c0392b" }); // Deep red
    const scarf = new THREE.Mesh(scarfGeo, scarfMat);
    scarf.rotation.x = Math.PI / 2;
    scarf.position.y = 0.32;
    bodyGroup.add(scarf);

    // Scarf tail
    const tailGeo = new THREE.CapsuleGeometry(0.06, 0.3, 4, 8);
    const tail = new THREE.Mesh(tailGeo, scarfMat);
    tail.position.set(0.15, 0.1, 0.2);
    tail.rotation.z = 0.2;
    bodyGroup.add(tail);
  }

  // Legs & Boots
  const bootMat = new THREE.MeshStandardMaterial({ color: "#4834d4" }); // Deep blue pants
  const bootLeatherMat = new THREE.MeshStandardMaterial({ color: "#4b2c20" }); // Brown boots

  const createLeg = (x: number) => {
    const legGroup = new THREE.Group();
    const pants = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.4, 4, 12), bootMat);
    pants.position.y = -0.5;
    legGroup.add(pants);

    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.2, 0.3), bootLeatherMat);
    boot.position.set(0, -0.75, 0.05);
    legGroup.add(boot);

    const bootFur = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 16), furMat);
    bootFur.position.y = -0.65;
    legGroup.add(bootFur);

    legGroup.position.x = x;
    return legGroup;
  };

  bodyGroup.add(createLeg(0.15));
  bodyGroup.add(createLeg(-0.15));
  group.add(bodyGroup);

  // Head
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.95, 0);

  const headGeo = new THREE.SphereGeometry(0.38, 32, 32);
  const headMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.5 });
  const headMesh = new THREE.Mesh(headGeo, headMat);
  headMesh.castShadow = true;
  headMesh.receiveShadow = true;
  headGroup.add(headMesh);

  // Face
  const createEye = (x: number) => {
    const eye = new THREE.Group();
    const white = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), new THREE.MeshStandardMaterial({ color: "#fff" }));
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), new THREE.MeshBasicMaterial({ color: eyeColor }));
    pupil.position.z = 0.05;
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), new THREE.MeshBasicMaterial({ color: "#fff" }));
    spark.position.set(0.02, 0.02, 0.08);
    eye.add(white);
    eye.add(pupil);
    eye.add(spark);
    eye.position.set(x, 0.05, 0.3);
    return eye;
  };
  headMesh.add(createEye(0.15));
  headMesh.add(createEye(-0.15));

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), new THREE.MeshStandardMaterial({ color: "#f4a460" }));
  nose.position.set(0, -0.02, 0.35);
  headMesh.add(nose);

  // Hair
  const hairColor = new THREE.Color(isGirl ? "#704214" : "#4b2c20");
  const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 });

  if (isGirl) {
    const hairMain = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
    hairMain.position.y = 0.05;
    headMesh.add(hairMain);

    for (let i = 0; i < 8; i++) {
      const strand = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.6, 4, 8), hairMat);
      strand.position.set(Math.sin(i) * 0.3, -0.2, Math.cos(i) * 0.1 - 0.1);
      strand.rotation.z = Math.sin(i) * 0.5;
      headMesh.add(strand);
    }
  } else {
    const hairMain = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.8), hairMat);
    hairMain.position.y = 0.05;
    headMesh.add(hairMain);

    for (let i = 0; i < 10; i++) {
      const spike = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.2, 4, 8), hairMat);
      spike.position.set(Math.random() * 0.4 - 0.2, 0.3, Math.random() * 0.4 - 0.2);
      spike.rotation.set(Math.random(), Math.random(), Math.random());
      headMesh.add(spike);
    }
  }

  group.add(headGroup);

  // Arms
  const sleeveMat = bodyMat;
  const createArm = (x: number, rot: number) => {
    const armGroup = new THREE.Group();
    const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.4, 4, 8), sleeveMat);
    armGroup.add(sleeve);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), headMat);
    hand.position.y = -0.25;
    armGroup.add(hand);

    armGroup.position.set(x, 0.3, 0);
    armGroup.rotation.z = rot;
    return armGroup;
  };

  const leftArm = createArm(0.5, -Math.PI / 6);
  const rightArm = createArm(-0.5, Math.PI / 6);
  group.add(leftArm);
  group.add(rightArm);

  return { group, head: headGroup, headMesh };
};

const KissWall = () => {
  const [selectedKiss, setSelectedKiss] = useState<KissType>('peck');
  const [isKissing, setIsKissing] = useState(false);
  const [kissCount, setKissCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const { toast } = useToast();
  const lastMilestoneRef = useRef(0);

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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffafcc, 0.4);
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

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

  // Milestone Check
  useEffect(() => {
    if (kissCount >= 30 && lastMilestoneRef.current < 30) {
      toast({
        title: "Kiss Overload! 💋✨",
        description: "30 kisses on the wall! Your love is legendary!",
      });
      lastMilestoneRef.current = 30;
    } else if (kissCount >= 10 && lastMilestoneRef.current < 10) {
      toast({
        title: "Ten Kisses! 💋",
        description: "A beautiful collection of sweet pecks.",
      });
      lastMilestoneRef.current = 10;
    }
  }, [kissCount, toast]);

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
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl animate-pulse">
              {currentKiss.emoji}
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground">
              {currentKiss.label}
            </h3>
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
