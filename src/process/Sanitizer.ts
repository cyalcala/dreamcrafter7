import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

export class Sanitizer {
  /**
   * Attempts to sanitize a video file by transcoding it to a standard compatible format (H.264/AAC MP4).
   * Returns the path to the sanitized file (which might be the same as input if overwrite is true, or a new temp file).
   */
  async sanitize(filePath: string): Promise<string> {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const name = path.basename(filePath, ext);
    // Use a timestamp to avoid conflicts if we sanitize multiple times or similar names
    const sanitizedPath = path.join(dir, `${name}_fixed_${Date.now()}.mp4`);

    console.log(`[Sanitizer] Attempting to fix ${filePath}...`);

    try {
      // Basic normalization command:
      // -c:v libx264: Use widely compatible H.264 video codec
      // -preset fast: Balance speed/quality
      // -c:a aac: Use widely compatible AAC audio codec
      // -movflags +faststart: Optimize for web playback (optional but good)
      // -y: Overwrite output if exists
      const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
      const command = `"${ffmpeg}" -i "${filePath}" -c:v libx264 -preset fast -c:a aac -movflags +faststart "${sanitizedPath}" -y`;

      await execAsync(command);

      console.log(`[Sanitizer] Successfully created sanitized version: ${sanitizedPath}`);
      return sanitizedPath;
    } catch (error) {
      console.error(`[Sanitizer] Failed to sanitize ${filePath}:`, error);
      // Clean up if partial file was created
      if (fs.existsSync(sanitizedPath)) {
        fs.unlinkSync(sanitizedPath);
      }
      throw error; // Propagate error if even sanitization fails
    }
  }
}
