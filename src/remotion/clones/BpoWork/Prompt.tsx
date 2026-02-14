
import { AbsoluteFill } from 'remotion';
import React from 'react';

const promptText = `I want to create a high-fidelity BPO careers chat animation that follows the "chat7.md" technical breakdown.

VISUAL SPECS:
- Sky gradient background with floating organic clouds.
- Chat window (580px wide) with centered spring entry.
- Message bubbles with typewriter effects and staggered reveal.
- High-quality icons (Robot, Phone, Send).

DATA:
- User Question: "Where can I apply for BPO work in Manila?"
- AI Response: Lists major hubs (Makati, BGC, QC).
- Grid Cards: Accenture, Concentrix, Teleperformance.

ANIMATION:
- Frames 0-20: Scene entry.
- Frames 20-50: User message.
- Frames 60-120: AI response.
- Frames 120-160: Card reveal stagger.
`;

export const Prompt: React.FC = () => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            zIndex: 1000,
            backgroundColor: 'rgba(10, 10, 15, 0.95)',
            color: '#e2e8f0',
            padding: '30px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            fontSize: '12px',
            overflow: 'auto',
            height: '100%',
            borderLeft: '1px solid #334155',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)'
        }}>
            <h2 style={{ color: '#60a5fa', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
                🤖 CHAT7 REPLICATION
            </h2>
            {promptText}
        </div>
    );
};
