---
description: How to implement a new video clone from a generated prompt
---

1. Check the `src/remotion/clones/` directory for the latest generated folder.
2. Open the `Prompt.tsx` file within that folder to read the technical requirements.
3. Open `Composition.tsx` and replace the "Ready for AI Replication" boilerplate.
4. If assets are needed, check `public/clones/[ComponentName]/` for extracted frames.
5. Use `npm start` to preview the result in Remotion Studio.
6. Refine the animation using `spring()` and `interpolate()` until it matches the visual specs in the prompt.
