
import { AbsoluteFill } from 'remotion';
import React from 'react';

const promptText = `
# VIDEO REPLICATION TECHNICAL BREAKDOWN: JAPAN7
## Goal: Replicate the stylized Japanese "Monday Challenge" animation.

---

## 1. VISUAL SPECS
### Colors
- **Palette**: Orange (#E85A23), Golden Yellow (#F2AD4E), Cream (#F9E7D0), Dark Mocha (#2D1E12).
- **Style**: Vector-style, high contrast, hard shadows (comic/retro style).

### Typography
- **Japanese Text**: Extra Bold Sans-Serif or Custom Lettering (e.g., Noto Sans JP Black).
- **Hierarchy**: Large central title, smaller floating English subtitle.

### Layout
- **Container**: Full-screen Sunburst background with a central focus group (Computer + Floating Icons).

---

## 2. VIDEO CONFIGURATION
- **Dimensions**: 1920 x 1080
- **FPS**: 30 fps
- **Duration**: 15 seconds (450 frames)

---

## 3. DATA & PROPS
- **Title**: "月曜日の挑戦" (Default)
- **Subtitle**: "Monday Challenge"
- **Customizable**: Allow users to change the text and the colors of the rays.

---

## 4. ANIMATION LOGIC
- **Background**: Continuous 360-degree rotation of the sunburst.
- **Entry**: Title and Computer scale up with a slight overshoot spring.
- **Idle**: Icons (⚡, ⏹️, ⌛) bob vertically using a sine wave to create "breathing" life.

---

## 5. REPLICATION PROMPT
"Create a Remotion component replicating a Japanese stylized UI. 
- Use a repeating-conic-gradient for a rotating sunburst.
- Implement a retro computer box with 2D character eyes.
- Use spring() for scale-in entries.
- Add floating icons that use Math.sin() for hover-like motion."
`;

export const Prompt: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: '400px',
      zIndex: 1000,
      backgroundColor: 'rgba(45, 30, 18, 0.95)',
      color: '#F9E7D0',
      padding: '30px',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      fontSize: '12px',
      overflow: 'auto',
      height: '100%',
      borderLeft: '2px solid #E85A23',
      boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(10px)'
    }}>
      <h2 style={{ color: '#F2AD4E', marginBottom: '20px', borderBottom: '1px solid #E85A23', paddingBottom: '10px' }}>
        🇯🇵 JAPAN7 REPLICATION
      </h2>
      {promptText}
    </div>
  );
};
