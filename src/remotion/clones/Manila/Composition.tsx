
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Img, staticFile } from 'remotion';
import React from 'react';
import { z } from 'zod';

// Schema for dynamic props
export const ManilaSchema = z.object({
  title: z.string(),
});

const MESSAGES = [
  { sender: 'User', text: "Where can I find the best BPO work in Manila? 🇵🇭", color: '#E9ECEF', textColor: '#2C3E50' },
  { sender: 'AI', text: "Manila has several prime BPO hubs! Here are the best spots to apply: ✨", color: '#EBF5FF', textColor: '#2C3E50' },
  { sender: 'AI', text: "🏢 Makati: The classic business hub (Ayala Ave).\n🏢 BGC: The modern, high-tech district (Taguig).\n🏢 Eastwood: The original IT park (Quezon City).", color: '#EBF5FF', textColor: '#2C3E50' },
  { sender: 'AI', text: "Top Companies: Accenture, Sutherland, Concentrix, and TaskUs are all hiring!", color: '#4A90E2', textColor: '#FFFFFF' },
];

export const Manila: React.FC<z.infer<typeof ManilaSchema>> = ({ title }) => {
  const frame = useCurrentFrame();
  const fps = 30;

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: 'sans-serif'
    }}>
      {/* Background Frame (Blurred) */}
      <Img
        src={staticFile('/clones/manila/temp_frames/frame_0000.png')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(20px) brightness(0.3)',
          opacity: 0.4
        }}
      />

      <AbsoluteFill style={{ padding: 80, justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{
          color: 'white',
          fontSize: 80,
          marginBottom: 60,
          fontWeight: 800,
          letterSpacing: '-2px',
          textShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          {title}
        </h1>

        <div style={{
          backgroundColor: '#F8F9FA',
          borderRadius: 40,
          padding: 50,
          width: 800,
          height: 600,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#4A90E2', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 24 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 20 }}>BPO Assistant</div>
              <div style={{ color: '#10b981', fontSize: 14 }}>● Online</div>
            </div>
          </div>

          {MESSAGES.map((msg, i) => {
            const startFrame = i * 45 + 30;
            const progress = spring({
              frame: frame - startFrame,
              fps,
              config: { stiffness: 120, damping: 14 }
            });

            if (frame < startFrame) return null;

            const isUser = msg.sender === 'User';

            return (
              <div
                key={i}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.color,
                  color: msg.textColor,
                  padding: '16px 28px',
                  borderRadius: isUser ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                  maxWidth: '85%',
                  fontSize: 22,
                  lineHeight: 1.4,
                  transform: `scale(${progress}) translateY(${(1 - progress) * 30}px)`,
                  opacity: progress,
                  whiteSpace: 'pre-wrap',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                {msg.text}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
