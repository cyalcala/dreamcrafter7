import * as fs from 'fs';
import * as path from 'path';
import { VideoAnalysisResult } from './types';

export async function exportAnalysisToJSON(analysis: VideoAnalysisResult, outputPath: string): Promise<void> {
    try {
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const jsonContent = JSON.stringify(analysis, null, 2);
        fs.writeFileSync(outputPath, jsonContent, 'utf-8');
        console.log(`Analysis exported to ${outputPath}`);
    } catch (error) {
        throw new Error(`Failed to export analysis: ${error}`);
    }
}

export async function loadAnalysisFromJSON(jsonPath: string): Promise<VideoAnalysisResult> {
    try {
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`Analysis file not found: ${jsonPath}`);
        }
        const content = fs.readFileSync(jsonPath, 'utf-8');
        return JSON.parse(content) as VideoAnalysisResult;
    } catch (error) {
        throw new Error(`Failed to load analysis: ${error}`);
    }
}
