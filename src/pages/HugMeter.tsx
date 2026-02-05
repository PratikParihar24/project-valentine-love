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

    // Fur on boots
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
  const head = new THREE.Mesh(headGeo, headMat);
  head.castShadow = true;
  head.receiveShadow = true;
  headGroup.add(head);

  // Face - More refined
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
  head.add(createEye(0.15));
  head.add(createEye(-0.15));

  // Small nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), new THREE.MeshStandardMaterial({ color: "#f4a460" }));
  nose.position.set(0, -0.02, 0.35);
  head.add(nose);

  // Hair - Sweeping style from image
  const hairColor = new THREE.Color(isGirl ? "#704214" : "#4b2c20");
  const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 });

  if (isGirl) {
    // Girl: Long hair and bangs
    const hairMain = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
    hairMain.position.y = 0.05;
    head.add(hairMain);

    for (let i = 0; i < 8; i++) {
      const strand = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.6, 4, 8), hairMat);
      strand.position.set(Math.sin(i) * 0.3, -0.2, Math.cos(i) * 0.1 - 0.1);
      strand.rotation.z = Math.sin(i) * 0.5;
      head.add(strand);
    }
  } else {
    // Boy: Messy/Swept hair
    const hairMain = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.8), hairMat);
    hairMain.position.y = 0.05;
    head.add(hairMain);

    for (let i = 0; i < 10; i++) {
      const spike = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.2, 4, 8), hairMat);
      spike.position.set(Math.random() * 0.4 - 0.2, 0.3, Math.random() * 0.4 - 0.2);
      spike.rotation.set(Math.random(), Math.random(), Math.random());
      head.add(spike);
    }
  }

  group.add(headGroup);

  // Arms - Coat sleeves
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

  const leftArm = createArm(0.45, -Math.PI / 4);
  const rightArm = createArm(-0.45, Math.PI / 4);
  group.add(leftArm);
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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Lights
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
