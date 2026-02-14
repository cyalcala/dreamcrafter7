
import * as fs from 'fs';
import * as path from 'path';

export class StabilizationEngine {
    private inputDir: string;
    private outputDir: string;
    private processedDir: string;

    constructor(dirs: { input: string; output: string; processed: string }) {
        this.inputDir = dirs.input;
        this.outputDir = dirs.output;
        this.processedDir = dirs.processed;
    }

    /**
     * SELF-HEALING: Bootstraps the environment and fixes missing structures.
     */
    public selfHeal() {
        console.log('[StabilizationEngine] Running Self-Healing check...');

        const requiredDirs = [this.inputDir, this.outputDir, this.processedDir];

        requiredDirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                console.log(`[Self-Healing] Creating missing directory: ${dir}`);
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        // Ensure .env exists or has defaults
        const envPath = path.join(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) {
            console.log('[Self-Healing] Creating default .env...');
            fs.writeFileSync(envPath, 'INPUT_DIR=inputs\nOUTPUT_DIR=public/clones\nPROCESSED_DIR=processed\n');
        }

        console.log('[StabilizationEngine] System Healthy. ✅');
    }

    /**
     * SELF-CLEANING: Removes temporary artifacts and bloating folders.
     */
    public selfClean() {
        console.log('[StabilizationEngine] Running Self-Cleaning...');

        if (!fs.existsSync(this.outputDir)) return;

        const projects = fs.readdirSync(this.outputDir);

        projects.forEach(project => {
            const projectPath = path.join(this.outputDir, project);
            if (!fs.statSync(projectPath).isDirectory()) return;

            const tempFramesPath = path.join(projectPath, 'temp_frames');
            if (fs.existsSync(tempFramesPath)) {
                console.log(`[Self-Cleaning] Removing heavy temp assets in: ${project}`);
                this.deleteRecursive(tempFramesPath);
            }
        });

        console.log('[StabilizationEngine] Workspace Cleaned. ✨');
    }

    private deleteRecursive(targetPath: string) {
        if (!fs.existsSync(targetPath)) return;

        if (fs.statSync(targetPath).isDirectory()) {
            fs.readdirSync(targetPath).forEach((file) => {
                const curPath = path.join(targetPath, file);
                this.deleteRecursive(curPath);
            });
            fs.rmdirSync(targetPath);
        } else {
            fs.unlinkSync(targetPath);
        }
    }
}
