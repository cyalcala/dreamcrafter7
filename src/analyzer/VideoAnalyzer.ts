import * as fs from 'fs';
import * as path from 'path';
import { VideoMetadata, SceneSegment, Keyframe, ColorPalette, VideoAnalysisResult } from './types';
import { getVideoMetadata, detectScenes, extractKeyframes } from './ffmpeg-utils';
import { ColorAnalyzer } from './color-analyzer';
import { PromptGenerator } from './prompt-generator';

export class VideoAnalyzer {
    private videoPath: string;
    private outputDir: string;
    private tempFramesDir: string;
    private colorAnalyzer: ColorAnalyzer;
    private promptGenerator: PromptGenerator;

    constructor(videoPath: string, outputDir: string) {
        this.videoPath = videoPath;
        this.outputDir = outputDir;
        this.tempFramesDir = path.join(outputDir, 'temp_frames');
        this.colorAnalyzer = new ColorAnalyzer();
        this.promptGenerator = new PromptGenerator();
    }

    async analyze(): Promise<VideoAnalysisResult> {
        try {
            if (!fs.existsSync(this.videoPath)) {
                throw new Error(`Video file not found: ${this.videoPath}`);
            }

            // Ensure directories exist
            if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir, { recursive: true });
            if (!fs.existsSync(this.tempFramesDir)) fs.mkdirSync(this.tempFramesDir, { recursive: true });

            console.log('Starting analysis...');

            // 1. Metadata
            console.log('Extracting metadata...');
            const metadata = await this.extractMetadata();

            // 2. Scene Detection
            console.log('Detecting scenes...');
            const scenes = await this.detectScenes();

            // 3. Keyframe Extraction
            console.log('Extracting keyframes...');
            const keyframes = await this.extractKeyframes(scenes, metadata.duration);

            // 4. Color Analysis
            console.log('Analyzing colors...');
            const framePaths = keyframes.map(k => k.filePath);
            const colorPalettes = await this.analyzeColors(framePaths);

            // 5. Generate Prompt
            console.log('Generating AI prompt...');
            const generatedPrompt = await this.generatePrompt(metadata, colorPalettes);

            // 6. Cleanup
            await this.cleanup();

            const result: VideoAnalysisResult = {
                metadata,
                scenes,
                keyframes,
                colorPalettes,
                generatedPrompt
            };

            console.log('Analysis complete.');
            return result;

        } catch (error) {
            console.error('Analysis failed:', error);
            throw error;
        }
    }

    private async extractMetadata(): Promise<VideoMetadata> {
        return await getVideoMetadata(this.videoPath);
    }

    private async detectScenes(): Promise<SceneSegment[]> {
        const threshold = parseFloat(process.env.SCENE_DETECTION_THRESHOLD || '0.4');
        return await detectScenes(this.videoPath, threshold);
    }

    private async extractKeyframes(scenes: SceneSegment[], duration: number): Promise<Keyframe[]> {
        // Strategy: Extract frames at scene starts AND regular intervals
        // For simplicity in this v1, we'll just extract scene starts.
        // If no scenes detected (or only 1), fallback to interval.

        let timestamps: number[] = scenes.map(s => s.startTime);

        // If fewer than 2 scenes, add intervals
        if (scenes.length < 2) {
            const interval = parseInt(process.env.KEYFRAME_INTERVAL || '2', 10);
            for (let t = 0; t < duration; t += interval) {
                timestamps.push(t);
            }
        }

        // Deduplicate and sort
        timestamps = Array.from(new Set(timestamps)).sort((a, b) => a - b);

        // Cap strictly to MAX_KEYFRAMES to avoid explosion
        const maxFrames = parseInt(process.env.MAX_KEYFRAMES || '50', 10);
        if (timestamps.length > maxFrames) {
            // Uniformly sample
            const step = Math.ceil(timestamps.length / maxFrames);
            timestamps = timestamps.filter((_, i) => i % step === 0);
        }

        const filePaths = await extractKeyframes(this.videoPath, this.tempFramesDir, timestamps);

        return filePaths.map((path, index) => ({
            timestamp: timestamps[index] || 0,
            frameNumber: -1, // We didn't calculate exact frame number
            filePath: path
        }));
    }

    private async analyzeColors(framePaths: string[]): Promise<ColorPalette[]> {
        return await this.colorAnalyzer.analyzeVideoColors(framePaths);
    }

    private async generatePrompt(metadata: VideoMetadata, colors: ColorPalette[]): Promise<string> {
        return this.promptGenerator.generateReplicationPrompt(metadata, colors);
    }

    private async cleanup(): Promise<void> {
        // Optional: Remove temp frames if we don't need them persisted. 
        // For now, let's keep them as they might be useful assets.
        // If we wanted to delete:
        // fs.rmSync(this.tempFramesDir, { recursive: true, force: true });
    }
}
