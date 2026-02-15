/**
 * DreamCrafter7 - System Status Dashboard
 * Shows current processing status directly in Remotion
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

interface SystemStatusProps {
  status: 'idle' | 'processing' | 'complete' | 'error';
  activeProject?: {
    name: string;
    stage: string;
    progress: number;
  };
  lastProcessed?: string;
  queueLength?: number;
}

export const SystemStatusDashboard: React.FC<SystemStatusProps> = ({
  status,
  activeProject,
  lastProcessed,
  queueLength = 0
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  
  // Animation values
  const entrance = spring({ frame, fps: 30, config: { damping: 15 } });
  const opacity = interpolate(frame, [0, 20], [0, 1]);
  
  const isCompact = width < 800;
  
  // Status colors
  const getStatusColor = () => {
    switch (status) {
      case 'processing': return '#F59E0B'; // Amber
      case 'complete': return '#10B981'; // Green
      case 'error': return '#EF4444'; // Red
      default: return '#6B7280'; // Gray
    }
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case 'processing': return '⚙️';
      case 'complete': return '✅';
      case 'error': return '❌';
      default: return '💤';
    }
  };

  return (
    <AbsoluteFill style={{
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      padding: isCompact ? 20 : 40,
      opacity,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24
      }}>
        <div style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          boxShadow: `0 0 20px ${getStatusColor()}`,
          animation: status === 'processing' ? 'pulse 1s infinite' : 'none'
        }} />
        <h2 style={{
          color: 'white',
          fontSize: isCompact ? 18 : 24,
          fontWeight: 700,
          margin: 0,
          letterSpacing: '-0.02em'
        }}>
          {getStatusIcon()} DreamCrafter7 Status
        </h2>
      </div>

      {/* Status Badge */}
      <div style={{
        display: 'inline-block',
        padding: '8px 16px',
        borderRadius: 8,
        backgroundColor: getStatusColor() + '20',
        border: `1px solid ${getStatusColor()}`,
        color: getStatusColor(),
        fontSize: isCompact ? 14 : 16,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 24
      }}>
        {status}
      </div>

      {/* Details */}
      <div style={{ color: '#9CA3AF', fontSize: isCompact ? 14 : 16 }}>
        
        {status === 'processing' && activeProject && (
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#6B7280', fontSize: 12, marginBottom: 4, textTransform: 'uppercase' }}>
                Processing
              </div>
              <div style={{ color: 'white', fontSize: isCompact ? 20 : 28, fontWeight: 600 }}>
                {activeProject.name}
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#6B7280', fontSize: 12, marginBottom: 4, textTransform: 'uppercase' }}>
                Stage
              </div>
              <div style={{ color: 'white', fontSize: 16 }}>
                {activeProject.stage}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: 8,
                color: '#6B7280',
                fontSize: 12
              }}>
                <span>Progress</span>
                <span>{activeProject.progress}%</span>
              </div>
              <div style={{
                height: 8,
                backgroundColor: '#1F2937',
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${activeProject.progress}%`,
                  height: '100%',
                  backgroundColor: getStatusColor(),
                  borderRadius: 4,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          </>
        )}

        {status === 'complete' && lastProcessed && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#6B7280', fontSize: 12, marginBottom: 4, textTransform: 'uppercase' }}>
              Last Processed
            </div>
            <div style={{ color: 'white', fontSize: isCompact ? 18 : 24, fontWeight: 600 }}>
              {lastProcessed}
            </div>
          </div>
        )}

        {queueLength > 0 && (
          <div style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: '#1F2937',
            borderRadius: 8
          }}>
            <span style={{ color: '#9CA3AF' }}>📋 Queue: </span>
            <span style={{ color: 'white', fontWeight: 600 }}>{queueLength} video(s)</span>
          </div>
        )}

        {status === 'idle' && (
          <div style={{ 
            padding: 24, 
            backgroundColor: '#1F2937', 
            borderRadius: 12,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎬</div>
            <div style={{ color: 'white', fontWeight: 600, marginBottom: 8 }}>
              Ready for Input
            </div>
            <div style={{ color: '#9CA3AF', fontSize: 14 }}>
              Drop a video in the inputs folder to begin
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: isCompact ? 20 : 40,
        left: isCompact ? 20 : 40,
        right: isCompact ? 20 : 40,
        paddingTop: 16,
        borderTop: '1px solid #374151',
        color: '#6B7280',
        fontSize: 12,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>DreamCrafter7 v1.0</span>
        <span>System Healthy ✅</span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </AbsoluteFill>
  );
};
