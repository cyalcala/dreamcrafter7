# DreamCrafter7 - Automated Video Cloning Tool

A powerful, modular video analysis engine designed to deconstruct UI animations and generate "Smart Prompts" for automated replication in Remotion.dev.

## Features

-   **Deep Video Analysis**: Extracts resolution, FPS, duration, and codec information using native FFmpeg.
-   **Scene Detection**: Automatically identifies scene boundaries to capture key transitions.
-   **Intelligent Color Extraction**: detailed color palette analysis (Hex codes + population) using `node-vibrant`.
-   **Context-Aware Prompt Generation**: Synthesizes extracted data into a high-density AI prompt, injecting hard facts (FPS, Dimensions, Colors) to reduce hallucination.

## Prerequisites

-   **Node.js** (v18+ recommended)
-   **FFmpeg**: Must be installed and accessible in your system PATH.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory:

```env
FFMPEG_PATH=ffmpeg
FFPROBE_PATH=ffprobe
SCENE_DETECTION_THRESHOLD=0.4
KEYFRAME_INTERVAL=2
MAX_KEYFRAMES=50
```

## Usage

### As a Library

```typescript
import VideoAnalyzer from './src/analyzer';

// Initialize
const analyzer = new VideoAnalyzer('path/to/video.mp4', './output_folder');

// Run Analysis
const result = await analyzer.analyze();

// Access Data
console.log(result.metadata.fps);       // e.g., 30
console.log(result.colorPalettes);      // Dominant colors
console.log(result.generatedPrompt);    // The "Smart Prompt" for AI Cloning
```

## Project Structure

-   `src/analyzer`: Core analysis logic (Metadata, Scenes, Colors, Prompts).
-   `src/process`: (Beta) Batch processing and sanitization utilities.

## License

MIT
