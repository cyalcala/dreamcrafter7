
const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const path = require('path');

const input = path.join(process.cwd(), 'inputs/asia8.mp4');
const output = path.join(process.cwd(), 'asia8_ref.png');

try {
    execSync(`"${ffmpeg}" -i "${input}" -vf "select=eq(n\\,0)" -vframes 1 "${output}" -y`);
    console.log('Frame extracted to asia8_ref.png');
} catch (e) {
    console.error('Failed to extract frame:', e.message);
}
