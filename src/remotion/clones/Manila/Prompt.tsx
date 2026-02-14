
import { AbsoluteFill } from 'remotion';
import React from 'react';

const promptText = `Please analyze the attached UI animation for replication in Remotion.dev. I need a deep technical breakdown that covers the following 5 layers to ensure the generated code is production-ready.

1. VISUAL SPECS (The Design System)
- Colors: The video contains these dominant Hex codes: []. Use these to extract specific backgrounds, accents, and text colors.
- Typography: Font style (Serif/Sans), approximated weights, and tabular figures if numbers change.
- Layout: Is it a centered card, full-screen, or split view?
- Assets: Identify any SVGs, icons, or images needed.

2. VIDEO CONFIGURATION (The Canvas)
- Dimensions: 710x546 (Landscape).
- FPS: 12800fps.
- Duration: 19 seconds (245069 frames).

3. DATA & PROPS (The Schema)
- What data is displayed? (Text headers, numbers, image URLs).
- Define the zod schema: Which of these elements should be customizable props? (e.g., "Make the 'Price' and 'User Avatar' dynamic props").

4. ANIMATION LOGIC (The Choreography)
- Breakdown by Frame (approximate):
- [Frame 0-10]: Initial state.
- [Frame 10-30]: Entry animation (Trigger).
- [Frame 30-End]: Secondary effects.
- Type of Motion:
- Spring (Bouncy/Natural) -> Suggest Stiffness/Damping settings.
- Interpolate (Linear/Eased) -> Suggest Input/Output ranges.

5. THE REPLICATION PROMPT
- Write a single, high-density prompt that I can paste into an AI coding assistant.
- It must explicitly ask for a React Functional Component using remotion, zod, useCurrentFrame, and spring/interpolate based on the specs above.`;

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
        <hr style={{borderColor: '#333'}}/>
        {promptText}
    </div>
  );
};
