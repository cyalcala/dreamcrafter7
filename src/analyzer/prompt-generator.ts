import { VideoMetadata, ColorPalette } from './types';

export class PromptGenerator {
    generateReplicationPrompt(metadata: VideoMetadata, colors: ColorPalette[]): string {
        const allColors = new Set<string>();
        colors.forEach(p => p.dominantColors.forEach(c => allColors.add(c)));
        const distinctColorsArray = Array.from(allColors).slice(0, 10).join(', ');

        const frames = Math.round(metadata.duration * metadata.fps);
        const fps = Math.round(metadata.fps);
        const duration = Math.round(metadata.duration);

        return `# VIDEO REPLICATION TECHNICAL BREAKDOWN
## Goal: Create a production-ready Remotion clone of this animation.

---

## 1. VISUAL SPECS (The Design System)
### Colors
- **Dominant Palette:** [${distinctColorsArray}]
- **Action:** Map these to Backgrounds, Accents, and Text. Use precise Hex codes found in the video.

### Typography
- **Font Family:** Analyze if it is Sans-Serif (Clean/Modern) or Serif. Recommend Inter/Roboto as fallback.
- **Hierarchy:** Define sizes and weights for Titles, Subtitles, and Body text.

### Layout
- **Style:** ${metadata.width > metadata.height ? 'Landscape (16:9 style)' : 'Vertical/Portrait Style'}.
- **Container:** Centered card, full background, or floating interface?

---

## 2. VIDEO CONFIGURATION (The Canvas)
- **Dimensions:** ${metadata.width} x ${metadata.height}
- **FPS:** ${fps} fps
- **Duration:** ${duration} seconds (${frames} frames)

---

## 3. DATA & PROPS (The Schema)
- **Props to Extract:** Identify dynamic elements (Headers, Names, Prices, Image URLs).
- **Zod Schema:** Define a strict \`z.object\` to make these elements customizable via Remotion props.

---

## 4. ANIMATION LOGIC (The Choreography)
- **Phase 1 (Entry):** Define the sequence for frames [0 - ${Math.round(frames * 0.15)}].
- **Phase 2 (Active):** Define main interactions for frames [${Math.round(frames * 0.15)} - ${Math.round(frames * 0.8)}].
- **Phase 3 (Exit/Hold):** Define final state for frames [${Math.round(frames * 0.8)} - ${frames}].
- **Motion Parameters:**
  - Use \`spring()\` for natural bouncy movements (Entry/Exit).
  - Use \`interpolate()\` for linear transitions and typewriter effects.

---

## 5. THE AI REPLICATION PROMPT (READY TO COPY)
**Instructions for AI Assistant:**
"Create a production-ready Remotion composition that replicates this UI animation. 
- Use **React + TypeScript + Zod**.
- All animations must be **frame-based** (use \`useCurrentFrame\`).
- Implement the design system defined in Section 1.
- Use the Canvas specs in Section 2.
- Ensure the code follows the **Modern Code Structure**: Imports → Zod Schema → Sub-components → Main Composition.
- **Critial Requirement:** Do not use CSS transitions. Use \`interpolate\` and \`spring\` for all motion."`;
    }
}
