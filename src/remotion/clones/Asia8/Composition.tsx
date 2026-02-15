
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import React from 'react';
import { z } from 'zod';
import { AnalogWarmth } from '../../visuals/AnalogWarmth';

export const Asia8Schema = z.object({
  title: z.string().default('ANSAYA!'),
});

const JapanesePostcard: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  
  // Animation timings
  const entry = spring({
    frame,
    fps: 30,
    config: { stiffness: 60, damping: 10 }
  });

  const float = Math.sin(frame / 20) * 15;
  const rotation = interpolate(frame, [0, 690], [-2, 2]);

  return (
    <AbsoluteFill style={{
      backgroundColor: '#f6d88f', // Muted Yellow from analysis
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '"Arial Black", sans-serif',
    }}>
      {/* Decorative Sun (Japanese style) */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        backgroundColor: '#e45c07', // Deep Orange from analysis
        opacity: 0.8,
        transform: `scale(${entry}) translateY(${float}px)`,
        boxShadow: '0 0 100px rgba(228, 92, 7, 0.4)'
      }} />

      {/* Main Container */}
      <div style={{
        position: 'relative',
        width: '80%',
        height: '70%',
        backgroundColor: '#d0c0a4', // Beige from analysis
        border: '15px solid #261e18', // Dark Brown from analysis
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `rotate(${rotation}deg) scale(${interpolate(entry, [0, 1], [0.8, 1])})`,
        boxShadow: '20px 20px 0px #261e18',
        overflow: 'hidden'
      }}>
        {/* Paper texture overlay */}
        <AbsoluteFill style={{
            opacity: 0.1,
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")',
            pointerEvents: 'none'
        }} />

        {/* ANSAYA Text (Replaces Japanese characters) */}
        <h1 style={{
          fontSize: 120,
          color: '#261e18',
          margin: 0,
          letterSpacing: '-5px',
          textTransform: 'uppercase',
          transform: `scale(${interpolate(Math.sin(frame/10), [-1, 1], [0.95, 1.05])})`,
          textShadow: '5px 5px 0px white'
        }}>
          {title}
        </h1>

        <div style={{
          marginTop: 20,
          fontSize: 40,
          color: '#e45c07',
          fontWeight: 'bold',
          padding: '10px 30px',
          border: '5px solid #e45c07',
          transform: 'rotate(-5deg)'
        }}>
          ANSAYA!
        </div>

        {/* Bottom decorative bar */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          width: '60%',
          height: 20,
          backgroundColor: '#261e18'
        }} />
      </div>

      {/* Foreground floating elements */}
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          position: 'absolute',
          width: 80,
          height: 80,
          backgroundColor: i % 2 === 0 ? '#e45c07' : '#261e18',
          borderRadius: i % 2 === 0 ? '50%' : '0%',
          top: i * 200 + 50,
          left: (i % 2 === 0 ? 50 : 500) + Math.cos(frame/30 + i) * 50,
          opacity: 0.6,
          transform: `rotate(${frame + i * 90}deg)`
        }} />
      ))}
    </AbsoluteFill>
  );
};

export const Asia8: React.FC<z.infer<typeof Asia8Schema>> = ({ title }) => {
  return (
    <AnalogWarmth>
      <JapanesePostcard title={title} />
    </AnalogWarmth>
  );
};
