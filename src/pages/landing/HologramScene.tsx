import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Environment, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// A dynamic shader material component for the AI Core
const HologramCore = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<any>(null); // MeshDistortMaterial ref type

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
        }
    });

    return (
        <Float
            speed={2} // Animation speed
            rotationIntensity={1.5} // XYZ rotation intensity
            floatIntensity={2} // Up/down float intensity
        >
            <Icosahedron ref={meshRef} args={[2, 16]} position={[0, 0, 0]}>
                <MeshDistortMaterial
                    ref={materialRef}
                    color="#8b5cf6"       // Primary purple
                    emissive="#6d28d9"    // Glowing center
                    wireframe={true}
                    transparent={true}
                    opacity={0.8}
                    distort={0.4}         // Distortion amount
                    speed={2}             // Distortion speed
                    roughness={0.2}
                    metalness={0.8}
                />
            </Icosahedron>

            {/* Inner glowing solid core */}
            <Icosahedron args={[1.2, 4]} position={[0, 0, 0]}>
                <meshStandardMaterial
                    color="#06b6d4" // Cyan accent
                    emissive="#06b6d4"
                    emissiveIntensity={4}
                    transparent={true}
                    opacity={0.9}
                    wireframe={false}
                />
            </Icosahedron>
        </Float>
    );
};

// Moving particle field in the background
const ParticleField = () => {
    const particlesCount = 2000;
    const positions = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 30;     // x
            pos[i * 3 + 1] = (Math.random() - 0.5) * 30; // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5; // z (push slightly back)
        }
        return pos;
    }, [particlesCount]);

    const pointsRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (pointsRef.current) {
            // Slow rotation of the whole field
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
            pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#8b5cf6"
                transparent
                opacity={0.4}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// Parallax camera rig reacting to mouse
const CameraRig = () => {
    const { camera, mouse } = useThree();
    const vec = new THREE.Vector3();

    useFrame(() => {
        camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 2, camera.position.z), 0.05);
        camera.lookAt(0, 0, 0);
    });

    return null;
};

const HologramScene = () => {
    return (
        <div className="w-full h-full absolute inset-0 bg-background mix-blend-screen overflow-hidden">
            {/* CSS gradient overlay to blend 3D canvas smoothly into the page background */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-primary/20 blur-[150px] rounded-full pointer-events-none" />

            <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#06b6d4" />

                <HologramCore />
                <ParticleField />
                <CameraRig />

                {/* Optional environment mapping for reflections if needed */}
                {/* <Environment preset="city" /> */}
            </Canvas>
        </div>
    );
};

export default HologramScene;
