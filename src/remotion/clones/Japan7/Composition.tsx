
import { AbsoluteFill, useCurrentFrame, spring, interpolate, Easing } from 'remotion';
import React from 'react';
import { z } from 'zod';
import { AnalogWarmth } from '../../visuals/AnalogWarmth';

// --- SCHEMAS ---
export const Japan7Schema = z.object({
  title: z.string().default('ANSAYA!'),
});

// --- SUB-COMPONENTS ---

const VibrantSunburst: React.FC = () => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 450], [0, 90]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: '-100%',
        left: '-100%',
        width: '300%',
        height: '300%',
        background: `repeating-conic-gradient(
          #E85A23 0deg 15deg, 
          #F2AD4E 15deg 30deg
        )`,
        transform: `rotate(${rotation}deg)`,
      }} />
      {/* Light Overlay for brightness */}
      <AbsoluteFill style={{ background: 'radial-gradient(circle, transparent 20%, rgba(255, 255, 255, 0.2) 100%)' }} />
      {/* Grid Overlay for Graphic Design Feel */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: `radial-gradient(#2D1E12 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        opacity: 0.1
      }} />
    </AbsoluteFill>
  );
};

const AestheticDecor: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  const shadowColor = '#2D1E12';

  switch (type) {
    case 'chip': // 3D Microchip
      return (
        <div style={{
          position: 'relative', width: 80, height: 80, transformStyle: 'preserve-3d',
          transform: 'rotateX(20deg) rotateY(20deg)'
        }}>
          <div style={{ position: 'absolute', width: 60, height: 60, top: 10, left: 10, backgroundColor: color, border: `4px solid ${shadowColor}`, transform: 'translateZ(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: 30, height: 30, border: '2px solid rgba(255,255,255,0.3)', borderRadius: 4 }} />
          </div>
          {[0, 1, 2, 3].map(i => (
            <React.Fragment key={i}>
              <div style={{ position: 'absolute', width: 15, height: 4, backgroundColor: shadowColor, top: 20 + i * 12, left: 0 }} />
              <div style={{ position: 'absolute', width: 15, height: 4, backgroundColor: shadowColor, top: 20 + i * 12, right: 0 }} />
              <div style={{ position: 'absolute', width: 4, height: 15, backgroundColor: shadowColor, left: 20 + i * 12, top: 0 }} />
              <div style={{ position: 'absolute', width: 4, height: 15, backgroundColor: shadowColor, left: 20 + i * 12, bottom: 0 }} />
            </React.Fragment>
          ))}
          <div style={{ position: 'absolute', width: 60, height: 60, top: 15, left: 15, backgroundColor: shadowColor, opacity: 0.3 }} />
        </div>
      );
    case 'brackets': // 3D Code Brackets < >
      return (
        <div style={{
          position: 'relative', width: 90, height: 60, transformStyle: 'preserve-3d',
          display: 'flex', gap: 10, fontSize: 80, fontWeight: 900, color,
          textShadow: `8px 8px 0px ${shadowColor}`
        }}>
          <div style={{ transform: 'rotateY(-20deg) translateZ(10px)' }}>&lt;</div>
          <div style={{ transform: 'rotateY(20deg) translateZ(10px)' }}>/&gt;</div>
        </div>
      );
    case 'wifi': // 3D Wifi Signal
      return (
        <div style={{
          position: 'relative', width: 80, height: 60, transformStyle: 'preserve-3d',
          transform: 'rotateX(30deg)'
        }}>
          {[40, 60, 80].map((size, i) => (
            <div key={i} style={{
              position: 'absolute', bottom: 0, left: '50%', width: size, height: size,
              border: `${8}px solid ${color}`, borderRadius: '50%',
              clipPath: 'inset(0 0 50% 0)',
              transform: `translateX(-50%) translateZ(${i * 15}px)`,
              boxShadow: `0px -5px 0px ${shadowColor} inset`
            }} />
          ))}
          <div style={{ position: 'absolute', bottom: -5, left: '50%', width: 15, height: 15, backgroundColor: color, borderRadius: '50%', transform: 'translateX(-50%) translateZ(45px)', border: `3px solid ${shadowColor}` }} />
        </div>
      );
    case 'gear': // 3D Rotating Gear
      return (
        <div style={{
          position: 'relative', width: 80, height: 80, transformStyle: 'preserve-3d'
        }}>
          <div style={{
            width: '100%', height: '100%', borderRadius: '50%', border: `15px solid ${color}`,
            transform: 'translateZ(10px)', boxShadow: `0 0 0 4px ${shadowColor}`,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: shadowColor }} />
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%', width: 15, height: 25, backgroundColor: color,
              border: `3px solid ${shadowColor}`,
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-35px) translateZ(5px)`
            }} />
          ))}
        </div>
      );
    case 'cursor': // 3D Mouse Pointer
      return (
        <div style={{
          position: 'relative', width: 60, height: 80, transformStyle: 'preserve-3d',
          transform: 'rotateZ(-15deg) rotateX(20deg)'
        }}>
          <div style={{
            width: 0, height: 0,
            borderLeft: '30px solid transparent',
            borderRight: '30px solid transparent',
            borderBottom: `60px solid ${color}`,
            transform: 'translateZ(10px)',
            filter: `drop-shadow(8px 8px 0px ${shadowColor})`
          }} />
          <div style={{
            position: 'absolute', top: 45, left: 15, width: 10, height: 25, backgroundColor: color,
            border: `3px solid ${shadowColor}`,
            transform: 'rotate(0deg) translateZ(5px)'
          }} />
        </div>
      );
    case 'node': // 3D Connection Point
      return (
        <div style={{
          position: 'relative', width: 80, height: 80, transformStyle: 'preserve-3d'
        }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 30, height: 30, backgroundColor: color, borderRadius: '50%', transform: 'translate(-50%, -50%) translateZ(20px)', border: `4px solid ${shadowColor}` }} />
          {[0, 120, 240].map(deg => (
            <div key={deg} style={{
              position: 'absolute', top: '50%', left: '50%', width: 40, height: 6, backgroundColor: shadowColor,
              transform: `translate(-50%, -50%) rotate(${deg}deg) translateX(30px)`
            }}>
              <div style={{ position: 'absolute', right: -10, top: -7, width: 20, height: 20, backgroundColor: color, borderRadius: '50%', border: `3px solid ${shadowColor}` }} />
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

const BloomAsset: React.FC<{
  type: string;
  targetX: number;
  targetY: number;
  delay: number;
  color: string;
}> = ({ type, targetX, targetY, delay, color }) => {
  const frame = useCurrentFrame();
  const bloom = spring({
    frame: frame - delay,
    fps: 30,
    config: { stiffness: 60, damping: 12 }
  });

  const x = interpolate(bloom, [0, 1], [0, targetX]);
  const y = interpolate(bloom, [0, 1], [0, targetY]);
  const scale = interpolate(bloom, [0, 1], [0, 1.2]);
  const rotate = interpolate(bloom, [0, 1], [0, 360]);
  const float = Math.sin(frame / 12) * 20;

  if (frame < delay) return null;

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: `translate(-50%, -50%) translate(${x}px, ${y + float}px) scale(${scale}) rotate(${rotate}deg)`,
      filter: `drop-shadow(10px 10px 0px rgba(0,0,0,0.1))`,
      zIndex: 100
    }}>
      <AestheticDecor type={type} color={color} />
    </div>
  );
};

// --- MAIN COMPOSITION ---

export const Japan7: React.FC<z.infer<typeof Japan7Schema>> = ({ title }) => {
  const frame = useCurrentFrame();

  const popSpring = spring({
    frame,
    fps: 30,
    config: { stiffness: 100, damping: 15 }
  });

  const tiltX = interpolate(frame, [0, 450], [5, -5]);
  const tiltY = interpolate(frame, [0, 450], [-10, 10]);

  return (
    <AnalogWarmth>
      <AbsoluteFill style={{
        backgroundColor: '#F9E7D0',
        fontFamily: '"Arial Black", sans-serif',
        perspective: '1500px'
      }}>

        {/* 1. Background Layer (Bright & Upbeat) */}
        <VibrantSunburst />

        {/* 2. Bloom Assets (Outward Blossoming) */}
        <BloomAsset type="chip" targetX={-500} targetY={-350} delay={15} color="#E85A23" />
        <BloomAsset type="brackets" targetX={500} targetY={-300} delay={20} color="#F2AD4E" />
        <BloomAsset type="wifi" targetX={-550} targetY={300} delay={25} color="#2D1E12" />
        <BloomAsset type="gear" targetX={550} targetY={250} delay={30} color="#E85A23" />
        <BloomAsset type="cursor" targetX={0} targetY={-500} delay={35} color="#F2AD4E" />
        <BloomAsset type="node" targetX={600} targetY={0} delay={40} color="#2D1E12" />

        {/* 3. Master Stage (Non-Malformed Workstation) */}
        <AbsoluteFill style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
          transform: `scale(${popSpring}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
        }}>

          {/* HUGE CENTRE TITLE */}
          <div style={{
            position: 'absolute',
            top: '8%',
            color: 'white',
            fontSize: 240,
            fontWeight: 900,
            letterSpacing: '-15px',
            textShadow: '20px 20px 0px #2D1E12',
            zIndex: 200,
            transform: 'translateZ(200px)'
          }}>
            {title}
          </div>

          {/* --- 3D WORKSTATION (Solid Construction) --- */}
          <div style={{
            position: 'relative',
            marginTop: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transformStyle: 'preserve-3d'
          }}>

            {/* MONITOR CABINET (Solid Layered 3D) */}
            <div style={{
              width: 500,
              height: 420,
              backgroundColor: '#F9E7D0',
              border: '20px solid #2D1E12',
              borderRadius: 35,
              boxShadow: '30px 30px 0px #2D1E12',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: 'translateZ(50px)',
              zIndex: 10
            }}>
              {/* Internal Screen */}
              <div style={{
                width: '90%',
                height: '80%',
                backgroundColor: '#2D1E12',
                borderRadius: 15,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Scanline Effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                  backgroundSize: '100% 4px, 3px 100%',
                  pointerEvents: 'none',
                  zIndex: 2
                }} />

                <div style={{
                  color: '#F2AD4E',
                  fontWeight: 900,
                  fontSize: 48,
                  textAlign: 'center',
                  letterSpacing: '2px',
                  textShadow: '0 0 20px rgba(242, 173, 78, 0.6)',
                  fontFamily: 'monospace',
                  zIndex: 3
                }}>
                  SYSTEM<br />READY
                </div>

                {/* Small UI corner decors */}
                <div style={{ position: 'absolute', top: 10, left: 10, width: 20, height: 2, backgroundColor: '#F2AD4E', opacity: 0.5 }} />
                <div style={{ position: 'absolute', top: 10, left: 10, width: 2, height: 20, backgroundColor: '#F2AD4E', opacity: 0.5 }} />
                <div style={{ position: 'absolute', bottom: 10, right: 10, width: 20, height: 2, backgroundColor: '#F2AD4E', opacity: 0.5 }} />
                <div style={{ position: 'absolute', bottom: 10, right: 10, width: 2, height: 20, backgroundColor: '#F2AD4E', opacity: 0.5 }} />
              </div>
            </div>

            {/* COMPUTER STAND */}
            <div style={{
              width: 140,
              height: 80,
              backgroundColor: '#F9E7D0',
              border: '12px solid #2D1E12',
              marginTop: -10,
              boxShadow: '15px 15px 0px #2D1E12',
              zIndex: 5
            }} />

            {/* KEYBOARD (Premium 3D Deck) */}
            <div style={{
              width: 600,
              height: 140,
              backgroundColor: '#F9E7D0',
              border: '15px solid #2D1E12',
              borderRadius: 20,
              marginTop: -25,
              boxShadow: '25px 25px 0px #2D1E12',
              display: 'flex',
              padding: '20px',
              gap: '10px',
              transform: 'rotateX(50deg) translateZ(100px)',
              zIndex: 50
            }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ flex: 1, backgroundColor: '#2D1E12', opacity: 0.15, borderRadius: 5 }} />
              ))}
            </div>

          </div>

        </AbsoluteFill>

        {/* Modern Brightness Gloss Overlay */}
        <AbsoluteFill style={{
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
          pointerEvents: 'none'
        }} />

      </AbsoluteFill>
    </AnalogWarmth>
  );
};
