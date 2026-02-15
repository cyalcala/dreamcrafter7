import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { VideoMetadata, SceneSegment } from './types';

const execAsync = promisify(exec);

export async function getVideoMetadata(videoPath: string): Promise<VideoMetadata> {
    try {
        const ffprobe = process.env.FFPROBE_PATH || 'ffprobe';
        const command = `"${ffprobe}" -v quiet -print_format json -show_format -show_streams "${videoPath}"`;
        const { stdout } = await execAsync(command);
        const data = JSON.parse(stdout);

        const videoStream = data.streams.find((s: any) => s.codec_type === 'video');
        if (!videoStream) {
            throw new Error('No video stream found');
        }

        // Use avg_frame_rate as it's often more reliable for VFR, fallback to r_frame_rate
        let fps = 0;
        try {
            fps = eval(videoStream.avg_frame_rate);
            if (!fps || fps > 120 || fps < 1) {
                fps = eval(videoStream.r_frame_rate);
            }
        } catch (e) {
            fps = eval(videoStream.r_frame_rate);
        }

        // Sanity check: cap extreme FPS values (likely calculation errors or weird timebases)
        if (fps > 120 || !fps) {
            console.warn(`[ffmpeg-utils] Detected unusual FPS (${fps}). Defaulting to 30.`);
            fps = 30;
        }

        return {
            duration: parseFloat(data.format.duration),
            fps: fps,
            width: videoStream.width,
            height: videoStream.height,
            codec: videoStream.codec_name,
            bitrate: parseInt(data.format.bit_rate, 10),
        };
    } catch (error) {
        throw new Error(`Failed to get video metadata: ${error}`);
    }
}

export async function detectScenes(videoPath: string, threshold: number = 0.4): Promise<SceneSegment[]> {
    try {
        const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
        // Using select filter to detect scene changes. 'showinfo' prints details to stderr.
        const command = `"${ffmpeg}" -i "${videoPath}" -filter:v "select='gt(scene,${threshold})',showinfo" -f null -`;
        const { stderr } = await execAsync(command);

        const scenes: SceneSegment[] = [];
        const regex = /pts_time:([0-9.]+)/g;
        let match;
        let lastTime = 0;

        while ((match = regex.exec(stderr)) !== null) {
            const time = parseFloat(match[1]);
            scenes.push({
                startTime: lastTime,
                endTime: time,
                frameNumber: -1, // Placeholder, difficult to get exact frame number without parsing more info
                sceneScore: threshold, // Placeholder
            });
            lastTime = time;
        }

        // Add the final segment
        // Note: We might need metadata duration to close the last segment accurately, 
        // but for now this captures the transition points.

        return scenes;
    } catch (error) {
        throw new Error(`Failed to detect scenes: ${error}`);
    }
}

export async function extractKeyframes(
    videoPath: string,
    outputDir: string,
    timestamps: number[]
): Promise<string[]> {
    try {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const filePaths: string[] = [];

        // Simplistic approach: Extract frames one by one for exact timestamps.
        // For production, batch extraction with complex fitlers is better but harder to implement reliably in one go.
        // Optimization: Use a single command with select filter for multiple timestamps if possible, 
        // but a loop is safer for now to ensure all files are created.

        // BETTER APPROACH for stability: 
        // Use the timestamps to build a select filter string.
        // ffmpeg -i input.mp4 -vf "select='eq(t,10)+eq(t,20)...',vsync=0" -frame_pts 1 out%d.png

        // Fallback: Loop for now as it's robust for small N.
        for (let i = 0; i < timestamps.length; i++) {
            const time = timestamps[i];
            const filename = `frame_${i.toString().padStart(4, '0')}.png`;
            const outputPath = path.join(outputDir, filename);

            // -ss before -i is faster seeking
            const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
            const command = `"${ffmpeg}" -ss ${time} -i "${videoPath}" -frames:v 1 -q:v 2 "${outputPath}" -y`;
            await execAsync(command);
            filePaths.push(outputPath);
        }

        return filePaths;
    } catch (error) {
        throw new Error(`Failed to extract keyframes: ${error}`);
    }
}
