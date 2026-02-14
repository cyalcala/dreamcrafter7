
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export const AnalogWarmth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  
  // Create a subtle "flicker" and "jitter" for that analog warmth
  const flicker = interpolate(Math.sin(frame * 0.5), [-1, 1], [0.99, 1.01]);
  
  return (
    <AbsoluteFill style={{
      filter: `contrast(1.1) brightness(${flicker}) saturate(1.1)`,
      overflow: 'hidden'
    }}>
      {/* 1. Halation / Bloom Effect (Glow on bright areas) */}
      <AbsoluteFill style={{
          filter: 'blur(8px) brightness(1.2) saturate(1.5)',
          opacity: 0.3,
          mixBlendMode: 'screen',
          pointerEvents: 'none'
      }}>
          {children}
      </AbsoluteFill>

      {/* 2. RGB Split (Chromatic Aberration) Simulation */}
      <AbsoluteFill style={{ 
          mixBlendMode: 'screen', 
          opacity: 0.2,
          transform: `translateX(3px)`,
          filter: 'blur(2px) hue-rotate(90deg)',
          pointerEvents: 'none'
      }}>
          {children}
      </AbsoluteFill>
      
      {/* 3. Main Content Content */}
      <AbsoluteFill style={{ transform: `scale(1.002)` }}>
        {children}
      </AbsoluteFill>

      {/* 4. Dynamic Lens Flare (Tactile & Luxe) */}
      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 1005 }}>
          <div style={{
              position: 'absolute',
              top: '20%',
              left: '30%',
              width: 400,
              height: 400,
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              filter: 'blur(40px)',
              transform: `translate(${Math.sin(frame/50) * 100}px, ${Math.cos(frame/50) * 50}px) scale(${flicker})`,
          }} />
          <div style={{
              position: 'absolute',
              bottom: '10%',
              right: '20%',
              width: 200,
              height: 200,
              background: 'radial-gradient(circle, rgba(74, 144, 226, 0.05) 0%, transparent 70%)',
              filter: 'blur(20px)',
              transform: `translate(${Math.cos(frame/40) * 150}px, ${Math.sin(frame/40) * 80}px)`,
          }} />
      </AbsoluteFill>
      
      {/* 5. Advanced CRT Scanlines */}
      <AbsoluteFill style={{
        pointerEvents: 'none',
        background: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)`,
        backgroundSize: '100% 4px',
        zIndex: 1010
      }} />

      {/* 6. Professional Film Grain Overlay */}
      <AbsoluteFill style={{
        opacity: 0.07,
        pointerEvents: 'none',
        backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2003/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E')`,
        zIndex: 1011
      }} />

      {/* 7. Vignette for depth */}
      <AbsoluteFill style={{
        pointerEvents: 'none',
        background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
        zIndex: 1012
      }} />
    </AbsoluteFill>
  );
};
