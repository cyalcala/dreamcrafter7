import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import React from 'react';
import { z } from 'zod';
import { Prompt } from './Prompt';
import { DreamCrafterBase } from '../../core/DreamCrafterBase';

// AI Orchestrated Schema
export const Asia9Schema = z.object({
  title: z.string().default('Asia9'),
  script: z.string().default(`System Default: Analysis Complete.`),
  voiceUrl: z.string().default(''),
});

/**
 * DREAMCRAFTER7 PREMIUM COMPONENT: asia9
 * Built with Agentic Precision & Modern Motion Principles
 */
export const Asia9: React.FC<z.infer<typeof Asia9Schema>> = ({ title, script }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Intro Animation: Smooth entrance
  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const yOffset = interpolate(entrance, [0, 1], [50, 0]);

  return (
    <DreamCrafterBase title={title} initialScript={script}>
      {(isEngaged, automation, branch, layout) => {
        const surge = spring({
            frame: isEngaged ? frame % 30 : 0, // Pulsing effect if engaged
            fps,
            config: { mass: 0.5 }
        });

        return (
            <AbsoluteFill style={{ 
                backgroundColor: '#050510',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <AbsoluteFill style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity,
                    transform: `translateY(${yOffset}px)`
                }}>
                    <div style={{ 
                        padding: 100 * layout.scaleFactor, 
                        textAlign: 'center',
                        background: 'rgba(15, 15, 25, 0.4)',
                        backdropFilter: 'blur(40px) saturate(180%)',
                        borderRadius: 80 * layout.scaleFactor,
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
                        transform: `scale(${1 + (isEngaged ? surge * 0.05 : 0)}) rotate(${branch === 'ACTION' ? 2 : 0}deg)`,
                        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                        width: layout.isPortrait ? '85%' : '60%',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative Gradient Background */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            left: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'radial-gradient(circle at center, rgba(74, 144, 226, 0.1) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }} />

                        <h1 style={{ 
                            fontSize: (layout.isPortrait ? 80 : 120) * layout.scaleFactor, 
                            fontWeight: 800, 
                            letterSpacing: '-0.04em',
                            background: 'linear-gradient(to bottom, #fff, #94a3b8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: 30 * layout.scaleFactor
                        }}>
                            {title}
                        </h1>
                        
                        <div style={{ 
                            fontSize: 32 * layout.scaleFactor, 
                            color: '#e2e8f0', 
                            maxWidth: 800 * layout.scaleFactor,
                            margin: '0 auto',
                            lineHeight: 1.4,
                            fontWeight: 400,
                            opacity: 0.9
                        }}>
                            {automation.script}
                        </div>

                        <div style={{ 
                            marginTop: 60 * layout.scaleFactor, 
                            display: 'flex', 
                            justifyContent: 'center', 
                            gap: 20,
                            opacity: 0.5
                        }}>
                            <span style={{ fontSize: 16 * layout.scaleFactor, padding: '8px 16px', border: '1px solid white', borderRadius: 20 }}>
                                {branch}
                            </span>
                            <span style={{ fontSize: 16 * layout.scaleFactor, padding: '8px 16px', border: '1px solid white', borderRadius: 20 }}>
                                {layout.isPortrait ? 'MOBILE' : 'DESKTOP'}
                            </span>
                        </div>
                    </div>
                </AbsoluteFill>
            </AbsoluteFill>
        );
      }}
    </DreamCrafterBase>
  );
};
