
import React, { useState, useCallback, useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Audio, Video, staticFile } from 'remotion';
import { AnalogWarmth } from '../visuals/AnalogWarmth';
import { ThreeCanvas } from '@remotion/three';
import confetti from 'canvas-confetti';

interface OrchestrationData {
  script: string;
  voiceUrl?: string;
  musicUrl?: string;
  bRollClips?: string[];
  visualPulse: number;
}

// Branching Path Type
type VideoBranch = 'MAIN' | 'DETAILS' | 'ACTION' | 'EXIT';

// Responsive Layout Type
interface ResponsiveLayout {
  isPortrait: boolean;
  isSquare: boolean;
  isLandscape: boolean;
  aspectRatio: number;
  scaleFactor: number; // Scale things based on height for consistency
}

interface DreamCrafterBaseProps {
  children: (
    isEngaged: boolean, 
    automationData: OrchestrationData, 
    currentBranch: VideoBranch,
    layout: ResponsiveLayout
  ) => React.ReactNode;
  title: string;
  initialScript?: string;
  enableThree?: boolean;
}

/**
 * CORE COMPONENT: DreamCrafterBase (Global Tech Engine)
 * Final Refinement: Responsive Motion Branding & Platform-First Architecture.
 */
export const DreamCrafterBase: React.FC<DreamCrafterBaseProps> = ({ 
  children, 
  title, 
  initialScript,
  enableThree = true 
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const [isEngaged, setIsEngaged] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<VideoBranch>('MAIN');

  // RESPONSIVE LOGIC: Motion Breakpoints
  const layout: ResponsiveLayout = useMemo(() => {
    const aspectRatio = width / height;
    return {
        isPortrait: aspectRatio < 0.8,
        isSquare: aspectRatio >= 0.8 && aspectRatio <= 1.2,
        isLandscape: aspectRatio > 1.2,
        aspectRatio,
        scaleFactor: height / 1080 // Base everything on 1080p height
    };
  }, [width, height]);

  // AUTOMATION: Orchestrated Data Stream
  const automationData = useMemo(() => ({
    script: initialScript || `Analyzing metadata for ${title}... Path: ${currentBranch}`,
    voiceUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    musicUrl: undefined,
    bRollClips: [],
    visualPulse: Math.sin(frame / 10) * 0.2 + 1
  }), [title, frame, currentBranch, initialScript]);

  const handleInteraction = useCallback(() => {
    setIsEngaged(true);
    const branches: VideoBranch[] = ['MAIN', 'DETAILS', 'ACTION', 'EXIT'];
    const nextIndex = (branches.indexOf(currentBranch) + 1) % branches.length;
    setCurrentBranch(branches[nextIndex]);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F2AD4E', '#4A90E2', '#FFFFFF']
    });
    setTimeout(() => setIsEngaged(false), 2000);
  }, [currentBranch]);

  // Motion Blur Simulation
  const blur = isEngaged ? 10 : 0;

  return (
    <AnalogWarmth>
      <AbsoluteFill 
        style={{ 
          backgroundColor: '#0A0A0F', 
          color: 'white', 
          fontFamily: 'Inter, system-ui, sans-serif',
          cursor: 'pointer',
          overflow: 'hidden',
          filter: `blur(${blur}px)`,
          transition: 'filter 0.3s ease-out'
        }}
        onClick={handleInteraction}
      >
        {/* WEBGPU & NEURAL RENDERING (3DGS): Photorealistic Flying-Camera Environment */}
        {enableThree && (
          <AbsoluteFill style={{ 
              opacity: 0.3, 
              pointerEvents: 'none', 
              transform: 'translateZ(-100px)',
              filter: isEngaged ? 'contrast(1.5) saturate(1.2)' : 'none' 
          }}>
            <ThreeCanvas width={width} height={height}>
              <perspectiveCamera 
                position={[
                    Math.sin(frame/120) * 10, 
                    Math.cos(frame/150) * 4, 
                    interpolate(frame, [0, 600], [15, 2])
                ]} 
              />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={2.5} />
              
              <points rotation={[0, frame/400, 0]}>
                <sphereGeometry args={[10, 256, 256]} /> 
                <pointsMaterial 
                  color={isEngaged ? "#FFFFFF" : "#4A90E2"} 
                  size={0.015} 
                  transparent 
                  opacity={isEngaged ? 0.9 : 0.4}
                  sizeAttenuation
                  blending={2}
                />
              </points>

              <mesh position={[0, 0, 0]} rotation={[frame/50, frame/30, 0]}>
                <dodecahedronGeometry args={[2, 0]} />
                <meshStandardMaterial 
                  color={isEngaged ? "#F2AD4E" : "#1A1A2E"} 
                  wireframe
                  emissive={isEngaged ? "#F2AD4E" : "#000000"}
                  emissiveIntensity={2}
                />
              </mesh>
            </ThreeCanvas>
          </AbsoluteFill>
        )}

        {/* AUTOMATION: Audio & B-Roll Integration */}
        {automationData.voiceUrl && <Audio src={automationData.voiceUrl} />}
        {automationData.bRollClips?.map((clip, i) => (
            <AbsoluteFill key={i} style={{ opacity: 0.1, pointerEvents: 'none' }}>
                <Video src={clip} muted />
            </AbsoluteFill>
        ))}

        {/* Child Implementation with Automation Stream, Branching & RESPONSIVE LAYOUT */}
        {children(isEngaged, automationData, currentBranch, layout)}

        {/* Global Interaction UI */}
        <div style={{
          position: 'absolute',
          bottom: layout.isPortrait ? 80 : 40, 
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: isEngaged ? 0 : 0.4,
          fontSize: 18 * layout.scaleFactor, 
          fontWeight: 900,
          letterSpacing: 4,
          textTransform: 'uppercase',
          pointerEvents: 'none',
          textShadow: '0 0 20px rgba(74, 144, 226, 0.5)',
          animation: 'pulse 2s infinite'
        }}>
          [ Click for System Surge ]
        </div>
      </AbsoluteFill>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.4; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.8; transform: translateX(-50%) scale(1.05); }
          100% { opacity: 0.4; transform: translateX(-50%) scale(1); }
        }
      `}</style>
    </AnalogWarmth>
  );
};
