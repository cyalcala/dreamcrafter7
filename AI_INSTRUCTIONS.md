# DreamCrafter7 AI Instructions

You are an AI assistant helping a user clone UI animations using Remotion.

## Project Structure
- `src/remotion/clones/`: Contains the generated cloning projects.
- `public/clones/`: Contains the analysis assets (images, JSON) for each video.
- `inputs/`: Drop videos here.

## How to Edit a Clone
When the user asks you to "Edit Travel77", follow these steps:

1.  **Locate the Component**: Go to `src/remotion/clones/Travel77/Composition.tsx`.
2.  **Locate the Assets**: The assets are available at `/clones/travel77/`.
    - Keyframes: `/clones/travel77/frame_0.png`, `/clones/travel77/frame_60.png`, etc.
    - Analysis: You can read the prompt from `src/remotion/clones/Travel77/Prompt.tsx`.
3.  **Implement the Animation**:
    - Use `AbsoluteFill`, `Img`, `useCurrentFrame`, `interpolate`, `spring` from `remotion`.
    - Use the keyframes as reference or background overlays (opacity 0.5) to align your animation.
    - **Do not import images using `import`**. Use `<Img src="/clones/travel77/..." />`.

## Example
If the user wants to show the first frame:

```tsx
<AbsoluteFill>
    <Img src="/clones/travel77/frame_0.png" style={{width: '100%'}} />
</AbsoluteFill>
```
