import { VideoMetadata, ColorPalette } from './types';

export class PromptGenerator {
    generateReplicationPrompt(metadata: VideoMetadata, colors: ColorPalette[]): string {
        const allColors = new Set<string>();
        colors.forEach(p => p.dominantColors.forEach(c => allColors.add(c)));
        const distinctColorsArray = Array.from(allColors).slice(0, 10).join(', ');

        const frames = Math.round(metadata.duration * metadata.fps);
        const fps = Math.round(metadata.fps);
        const duration = Math.round(metadata.duration);

        return `# DREAMCRAFTER7: AI REPLICATION MISSION
## Goal: Create a high-fidelity, interactive, and aesthetic Remotion clone.

---

## 1. VISUAL SPECS (The High-Tech Aesthetic)
### Colors & Shaders
- **Dominant Palette:** [${distinctColorsArray}]
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
- **Canvas:** ${metadata.width} x ${metadata.height} @ ${metadata.fps} fps
- **Duration:** ${duration}s (${frames} frames)

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
    }
}
