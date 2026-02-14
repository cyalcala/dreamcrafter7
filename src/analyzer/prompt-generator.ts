import { VideoMetadata, ColorPalette } from './types';

export class PromptGenerator {
    generateReplicationPrompt(metadata: VideoMetadata, colors: ColorPalette[]): string {
        // Aggregate all unique colors from all keyframes to get a "Global Palette"
        const allColors = new Set<string>();
        colors.forEach(p => p.dominantColors.forEach(c => allColors.add(c)));
        const distinctColorsArray = Array.from(allColors).slice(0, 7).join(', '); // Limit to top 7 unique

        return `Please analyze the attached UI animation for replication in Remotion.dev. I need a deep technical breakdown that covers the following 5 layers to ensure the generated code is production-ready.

1. VISUAL SPECS (The Design System)
- Colors: The video contains these dominant Hex codes: [${distinctColorsArray}]. Use these to extract specific backgrounds, accents, and text colors.
- Typography: Font style (Serif/Sans), approximated weights, and tabular figures if numbers change.
- Layout: Is it a centered card, full-screen, or split view?
- Assets: Identify any SVGs, icons, or images needed.

2. VIDEO CONFIGURATION (The Canvas)
- Dimensions: ${metadata.width}x${metadata.height} (${metadata.width === metadata.height ? 'Square' : metadata.width > metadata.height ? 'Landscape' : 'Portrait'}).
- FPS: ${Math.round(metadata.fps)}fps.
- Duration: ${Math.round(metadata.duration)} seconds (${Math.round(metadata.duration * metadata.fps)} frames).

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
    }
}
