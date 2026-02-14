import { QueueManager } from './process/QueueManager';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set static paths if not in env
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;

if (!process.env.FFMPEG_PATH || process.env.FFMPEG_PATH === 'ffmpeg') {
    process.env.FFMPEG_PATH = ffmpegPath;
}
if (!process.env.FFPROBE_PATH || process.env.FFPROBE_PATH === 'ffprobe') {
    process.env.FFPROBE_PATH = ffprobePath;
}

console.log(`FFmpeg Path: ${process.env.FFMPEG_PATH}`);
console.log(`FFprobe Path: ${process.env.FFPROBE_PATH}`);
const INPUT_DIR = process.env.INPUT_DIR || path.join(process.cwd(), 'inputs');
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(process.cwd(), 'outputs');

console.log('Starting DreamCrafter7 Video Processor...');
console.log(`Input Directory: ${INPUT_DIR}`);
console.log(`Output Directory: ${OUTPUT_DIR}`);

const manager = new QueueManager(INPUT_DIR, OUTPUT_DIR);

manager.start();

// Keep process alive
process.stdin.resume();
