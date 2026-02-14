
import { AbsoluteFill } from 'remotion';
import React from 'react';

const promptText = `Manual Recovery Mode.`;

export const Prompt: React.FC = () => {
    return (
        <div style={{
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#00ff00',
            padding: 40,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            fontSize: 14,
            overflow: 'auto',
            height: '100%'
        }}>
            <h2>🤖 AI Replication Prompt</h2>
            <hr style={{ borderColor: '#333' }} />
            {promptText}
        </div>
    );
};
