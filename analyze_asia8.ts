
import { VideoAnalyzer } from './src/analyzer/VideoAnalyzer';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;

process.env.FFMPEG_PATH = ffmpegPath;
process.env.FFPROBE_PATH = ffprobePath;

async function run() {
    const input = path.join(process.cwd(), 'inputs/asia8.mp4');
    const output = path.join(process.cwd(), 'public/clones/asia8');
    
    if (!fs.existsSync(output)) fs.mkdirSync(output, { recursive: true });

    console.log('Analyzing asia8.mp4...');
    const analyzer = new VideoAnalyzer(input, output);
    const result = await analyzer.analyze();
    
    fs.writeFileSync(path.join(output, 'analysis.json'), JSON.stringify(result, null, 2));
    console.log('Analysis Complete! Saved to analysis.json');
}

run().catch(console.error);
