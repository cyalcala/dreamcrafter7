export interface VideoMetadata {
    duration: number;
    fps: number;
    width: number;
    height: number;
    codec: string;
    bitrate: number;
}

export interface SceneSegment {
    startTime: number;
    endTime: number;
    frameNumber: number;
    sceneScore: number;
}

export interface Keyframe {
    timestamp: number;
    frameNumber: number;
    filePath: string;
}

export interface ColorPalette {
    dominantColors: string[]; // Hex codes
    population: number[];
}

export interface VideoAnalysisResult {
    metadata: VideoMetadata;
    scenes: SceneSegment[];
    keyframes: Keyframe[];
    colorPalettes: ColorPalette[];
    generatedPrompt?: string;
    orchestration?: any;
}
