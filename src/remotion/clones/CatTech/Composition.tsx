
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import React, { useState, useCallback, useMemo } from 'react';
import { AnalogWarmth } from '../../visuals/AnalogWarmth';
import confetti from 'canvas-confetti';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';

const CatFace: React.FC<{ color: string; isExcited: boolean }> = ({ color, isExcited }) => {
  const frame = useCurrentFrame();
  
  const baseFreq = isExcited ? 2 : 5;
  const bop = Math.sin(frame / baseFreq) * (isExcited ? 25 : 15);
  const tilt = Math.sin(frame / 8) * (isExcited ? 20 : 10);
  const blink = Math.sin(frame / 20) > 0.9 ? 0.1 : 1;

  return (
    <div style={{
      position: 'relative',
      width: 200,
      height: 180,
      transform: `translateY(${bop}px) rotate(${tilt}deg)`,
      transformStyle: 'preserve-3d'
    }}>
      <div style={{ position: 'absolute', top: -40, left: 10, width: 0, height: 0, borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: `60px solid ${color}`, transform: 'rotate(-20deg)' }} />
      <div style={{ position: 'absolute', top: -40, right: 10, width: 0, height: 0, borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: `60px solid ${color}`, transform: 'rotate(20deg)' }} />
      <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: color, borderRadius: '50% 50% 40% 40%', border: '8px solid #2D1E12', boxShadow: '15px 15px 0px #2D1E12' }} />
      <div style={{ position: 'absolute', top: '35%', left: '20%', width: 40, height: 40 * (isExcited ? 1.2 : blink), backgroundColor: '#2D1E12', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: '35%', right: '20%', width: 40, height: 40 * (isExcited ? 1.2 : blink), backgroundColor: '#2D1E12', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: '60%', left: '50%', width: 20, height: 15, backgroundColor: '#FF8DA1', borderRadius: '50%', transform: 'translateX(-50%)' }} />
      <div style={{ position: 'absolute', top: '65%', left: -20, width: 50, height: 4, backgroundColor: '#2D1E12', transform: 'rotate(10deg)' }} />
      <div style={{ position: 'absolute', top: '75%', left: -20, width: 50, height: 4, backgroundColor: '#2D1E12', transform: 'rotate(0deg)' }} />
      <div style={{ position: 'absolute', top: '65%', right: -20, width: 50, height: 4, backgroundColor: '#2D1E12', transform: 'rotate(-10deg)' }} />
      <div style={{ position: 'absolute', top: '75%', right: -20, width: 50, height: 4, backgroundColor: '#2D1E12', transform: 'rotate(0deg)' }} />
    </div>
  );
};

const ThreeDScene: React.FC<{ isExcited: boolean }> = ({ isExcited }) => {
  const frame = useCurrentFrame();
  const rotation = (frame / 30) * Math.PI * (isExcited ? 2 : 1);

  return (
    <ThreeCanvas width={1920} height={1080}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh rotation={[rotation, rotation, 0]} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={isExcited ? "#F2AD4E" : "#E85A23"} />
      </mesh>
    </ThreeCanvas>
  );
};

export const CatTech: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const [isExcited, setIsExcited] = useState(false);
  
  const handleInteraction = useCallback(() => {
    setIsExcited(true);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#E85A23', '#F2AD4E', '#FFFFFF']
    });
    setTimeout(() => setIsExcited(false), 2000);
  }, []);

  const bgScale = 1 + Math.sin(frame / 15) * 0.05;
  const sunburstRotation = frame * (isExcited ? 2 : 0.5);
  
  return (
    <AnalogWarmth>
      <AbsoluteFill 
        style={{ backgroundColor: '#E85A23', overflow: 'hidden', cursor: 'grab' }}
        onMouseDown={handleInteraction}
      >
        {/* Rotating Sunburst Background */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'repeating-conic-gradient(#E85A23 0deg 30deg, #F2AD4E 30deg 60deg)',
          transform: `rotate(${sunburstRotation}deg) scale(${bgScale})`,
          opacity: 0.6
        }} />

        {/* 3D WebGPU Simulation (Three.js integration) */}
        <AbsoluteFill style={{ opacity: 0.3, pointerEvents: 'none' }}>
           <ThreeDScene isExcited={isExcited} />
        </AbsoluteFill>

        <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundImage: 'radial-gradient(#2D1E12 2px, transparent 2px)', backgroundSize: '40px 40px', opacity: 0.1 }} />

        {/* Dynamic State UI */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ transform: `scale(${1.2 + Math.sin(frame/5)*0.1})` }}>
             <CatFace color="#F9E7D0" isExcited={isExcited} />
          </div>
          <div style={{ marginTop: 60, fontSize: 150, fontWeight: 900, color: 'white', fontFamily: 'Arial Black', textShadow: '15px 15px 0px #2D1E12', letterSpacing: 10, transform: `rotate(${Math.sin(frame/10)*5}deg)` }}>
            {isExcited ? 'ENERGY MAX!' : 'CAT TECH'}
          </div>
        </div>

        <div style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: 24, backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: 20, pointerEvents: 'none', opacity: isExcited ? 0 : 0.8 }}>
          Press Mouse to Engage
        </div>

        {/* Automation Status Ticker */}
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: 80, backgroundColor: '#2D1E12', display: 'flex', alignItems: 'center', padding: '0 40px', color: '#F2AD4E', fontSize: 30, fontWeight: 900, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <div style={{ display: 'flex', transform: `translateX(${(frame % 600) * -5}px)` }}>
            {Array.from({length: 10}).map((_, i) => (
              <span key={i} style={{ marginRight: 100 }}>
                {isExcited ? 'AUTOMATION: MULTI-MODEL AI ACTIVE... RENDERING 3DGS... WEBGPU ACCELERATED...' : 'SYSTEM READY... DOWNLOADING CATNIP.EXE... CONNECTING TO CLOUD... PURR-FORMANCE OPTIMIZED...'}
              </span>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AnalogWarmth>
  );
};
