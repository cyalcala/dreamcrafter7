
import { AbsoluteFill } from 'remotion';
import React from 'react';

const promptText = `# DREAMCRAFTER7: AI REPLICATION MISSION
## Goal: Create a high-fidelity, interactive, and aesthetic Remotion clone.

---

## 1. VISUAL SPECS (The High-Tech Aesthetic)
### Colors & Shaders
- **Dominant Palette:** [#e45c07, #b58262, #d0c0a4, #f6d88f, #b13c06, #c5af94, #e45a07, #f4d99b, #957e63, #953c0f]
- **Aesthetic Requirement:** Wrap the entire composition in the \`<AnalogWarmth />\` component to simulate film grain, jitter, and chromatic aberration.
- **Graphic Style:** Follow a "Modern Tech" or "Retro-Digital" look. Use glassmorphism and high-contrast shadows.

### 2. 3D GRAPHICS (WebGPU / 3DGS)
- **Requirement:** Implement a central 3D element using \`@remotion/three\`. 
- **Goal:** If possible, use 3D Gaussian Splatting placeholders for real-world scene depth. At minimum, implement complex 3D transforms using \`preserve-3d\`.

### 3. ENGAGEMENT (Non-Linear React State)
- **Requirement:** The video MUST be interactive. 
- **Logic:** Implement a \`useState\` called \`isEngaged\`. On click, trigger a visual "surge" (faster animations, color shifts, or confetti bursts).

---

## 4. VIDEO CONFIGURATION
- **Canvas:** 654 x 782 @ 12800 fps (Corrected to 30fps for Remotion)
- **Duration:** 23s (690 frames)

---

## 5. REPLICATION INSTRUCTIONS FOR AI:
"Build a production-ready Remotion composition that matches these visual specs. 
- Use **React + TypeScript + Zod**.
- **Choreography:** Phase entry [0-15%], Active [15-80%], Exit [80-100%].
- **Tech Stack:**
    - Always use \`spring()\` and \`interpolate()\` for motion.
    - Always wrap in \`AnalogWarmth\`.
    - Always include a \`ThreeCanvas\` for 3D elements.
    - Always implement an interactive state surge on click."`;

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
            🤖 REPLICATION PROMPT: ASIA8
        </h2>
        {promptText}
        <div style={{ marginTop: '40px', padding: '15px', backgroundColor: '#1e293b', borderRadius: '8px', color: '#94a3b8' }}>
            <strong>MISSION:</strong> Replicate the Japanese aesthetic of asia8.mp4 but replace all original text with "ANSAYA!".
        </div>
    </div>
  );
};
