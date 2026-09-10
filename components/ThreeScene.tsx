import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  scrollProgress: number; // 0 to 1
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ scrollProgress }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene with dark atmospheric fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070709, 0.015);

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 26);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true, 
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    dirLight.position.set(5, 12, 18);
    scene.add(dirLight);

    const goldLight = new THREE.PointLight(0xffd700, 4.5, 50);
    goldLight.position.set(0, 6, 14);
    scene.add(goldLight);

    const amberBackLight = new THREE.PointLight(0xf59e0b, 3, 40);
    amberBackLight.position.set(-14, -8, -6);
    scene.add(amberBackLight);

    const cyanAccentLight = new THREE.PointLight(0x06b6d4, 2.5, 38);
    cyanAccentLight.position.set(14, 10, -6);
    scene.add(cyanAccentLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    blueRimLight.position.set(-10, -6, -12);
    scene.add(blueRimLight);

    // -------------------------------------------------------------
    // 1. Central 3D "EEE" (Department of EEE) Rotating Core
    // -------------------------------------------------------------
    const eeeGroup = new THREE.Group();
    eeeGroup.position.set(0, 0, 0);

    // Function to generate sharp geometric 2D path for letter 'E'
    const createLetterEShape = () => {
      const shape = new THREE.Shape();
      const w = 2.4;    // width of top & bottom bars
      const mw = 1.85;  // width of middle bar
      const h = 4.2;    // total height
      const t = 0.78;   // thickness of vertical spine
      const bt = 0.68;  // thickness of horizontal bars

      // Trace outer and inner contour of letter 'E'
      shape.moveTo(0, 0);
      shape.lineTo(w, 0);
      shape.lineTo(w, bt);
      shape.lineTo(t, bt);
      shape.lineTo(t, (h - bt) / 2);
      shape.lineTo(mw, (h - bt) / 2);
      shape.lineTo(mw, (h + bt) / 2);
      shape.lineTo(t, (h + bt) / 2);
      shape.lineTo(t, h - bt);
      shape.lineTo(w, h - bt);
      shape.lineTo(w, h);
      shape.lineTo(0, h);
      shape.closePath();
      return shape;
    };

    const extrudeSettings = {
      depth: 0.95,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.09,
      bevelThickness: 0.09,
    };

    const letterEShape = createLetterEShape();
    const letterGeo = new THREE.ExtrudeGeometry(letterEShape, extrudeSettings);
    letterGeo.center(); // Center geometry around origin for smooth rotation

    // Rich metallic gold material with warm specular glow
    const goldLetterMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3bf36,
      metalness: 0.92,
      roughness: 0.2,
      emissive: 0x472f00,
      emissiveIntensity: 0.45,
    });

    // Wireframe / edge highlight for futuristic electrical engineering aesthetics
    const edgeGeo = new THREE.EdgesGeometry(letterGeo);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xfff2a3,
      transparent: true,
      opacity: 0.75,
    });

    const letterMeshes: THREE.Group[] = [];
    const letterSpacing = 3.25; // X-axis spacing between letters

    [-letterSpacing, 0, letterSpacing].forEach((xPos, idx) => {
      const singleLetterGroup = new THREE.Group();
      singleLetterGroup.position.set(xPos, 0, 0);

      const letterMesh = new THREE.Mesh(letterGeo, goldLetterMaterial);
      const edgeMesh = new THREE.LineSegments(edgeGeo, edgeMaterial);

      singleLetterGroup.add(letterMesh);
      singleLetterGroup.add(edgeMesh);

      // Subtle inner circuit glowing particle in the middle of each E
      const sparkGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const sparkMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const spark = new THREE.Mesh(sparkGeo, sparkMat);
      spark.position.set(0, 0, 0.6);
      singleLetterGroup.add(spark);

      eeeGroup.add(singleLetterGroup);
      letterMeshes.push(singleLetterGroup);
    });

    // Multi-Axis Electromagnetic Orbit Rings encircling 3D EEE
    const orbitRingGeo1 = new THREE.TorusGeometry(6.6, 0.06, 16, 120);
    const orbitRingGeo2 = new THREE.TorusGeometry(8.2, 0.05, 16, 140);

    const orbitMat1 = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7,
    });
    const orbitMat2 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
      opacity: 0.5,
    });

    const orbitRing1 = new THREE.Mesh(orbitRingGeo1, orbitMat1);
    orbitRing1.rotation.x = Math.PI / 3;
    eeeGroup.add(orbitRing1);

    const orbitRing2 = new THREE.Mesh(orbitRingGeo2, orbitMat2);
    orbitRing2.rotation.y = Math.PI / 4;
    orbitRing2.rotation.x = -Math.PI / 6;
    eeeGroup.add(orbitRing2);

    // Orbiting Satellite Energy Nodes
    const satelliteCount = 6;
    const satellites: { mesh: THREE.Mesh; angle: number; speed: number; radius: number }[] = [];
    const satGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xffe680 });

    for (let i = 0; i < satelliteCount; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      const radius = 6.4 + (i % 2) * 1.6;
      const angle = (i / satelliteCount) * Math.PI * 2;
      satellites.push({
        mesh: sat,
        angle,
        speed: 0.5 + (i % 2) * 0.3,
        radius,
      });
      eeeGroup.add(sat);
    }

    eeeGroup.scale.set(0.9, 0.9, 0.9);
    scene.add(eeeGroup);

    // -------------------------------------------------------------
    // 2. 3D Electrical Node Particle Cloud
    // -------------------------------------------------------------
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color(0xffd700);
    const amberColor = new THREE.Color(0xf59e0b);
    const cyanColor = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 70;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      const rand = Math.random();
      const chosenColor = rand > 0.6 ? goldColor : rand > 0.3 ? amberColor : cyanColor;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // -------------------------------------------------------------
    // 3. Cyber Ground Perspective Lines (Power Grid Bus)
    // -------------------------------------------------------------
    const gridHelper = new THREE.GridHelper(120, 30, 0xd4af37, 0x1e222d);
    gridHelper.position.y = -10;
    scene.add(gridHelper);

    // Mouse Tracking for Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const halfX = window.innerWidth / 2;
      const halfY = window.innerHeight / 2;
      targetMouseX = (e.clientX - halfX) * 0.0008;
      targetMouseY = (e.clientY - halfY) * 0.0008;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const progress = scrollRef.current; // 0 to 1

      // Dynamic Camera Path responding to scroll & mouse
      camera.position.x = mouseX * 25;
      camera.position.y = -progress * 6 - mouseY * 15;
      camera.position.z = 26 - progress * 10;
      camera.lookAt(0, -progress * 3, 0);

      // 3D "EEE" Group Rotation
      eeeGroup.rotation.y = elapsedTime * 0.45 + mouseX * 2.2;
      eeeGroup.rotation.x = Math.sin(elapsedTime * 0.35) * 0.2 - mouseY * 1.8;
      eeeGroup.rotation.z = Math.sin(elapsedTime * 0.25) * 0.08;
      eeeGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.5 - progress * 4;

      // Subtle synchronized wave motion on individual 'E' letters
      letterMeshes.forEach((mesh, idx) => {
        mesh.position.y = Math.sin(elapsedTime * 1.6 + idx * 0.8) * 0.15;
        mesh.rotation.y = Math.sin(elapsedTime * 0.9 + idx * 0.5) * 0.1;
      });

      // Electromagnetic Orbit Rings rotation
      orbitRing1.rotation.z = elapsedTime * 0.35;
      orbitRing1.rotation.y = elapsedTime * 0.2;
      orbitRing2.rotation.z = -elapsedTime * 0.3;
      orbitRing2.rotation.x = elapsedTime * 0.25;

      // Orbiting Satellite Energy Nodes
      satellites.forEach((sat, i) => {
        sat.angle += sat.speed * delta;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
        sat.mesh.position.y = Math.sin(sat.angle * 2 + i) * 1.8;
      });

      // Particles gentle drift
      particles.rotation.y = elapsedTime * 0.03;

      // Grid subtle scroll effect
      gridHelper.position.z = (elapsedTime * 3) % 4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
