import chokidar from 'chokidar';
import * as path from 'path';
import * as fs from 'fs';
import { VideoAnalyzer } from '../analyzer/VideoAnalyzer';
import { Sanitizer } from './Sanitizer';
import { exportAnalysisToJSON } from '../analyzer/exporter';
import { CodeGenerator } from './CodeGenerator';
import { StabilizationEngine } from './StabilizationEngine';

export class QueueManager {
  private inputDir: string;
  private outputDir: string;
  private processedDir: string;
  private failedDir: string;
  private sanitizer: Sanitizer;
  private codeGenerator: CodeGenerator;
  private stabilizationEngine: StabilizationEngine;
  private processing: boolean = false;
  private queue: string[] = [];

  constructor(inputDir: string, outputDir: string) {
    this.inputDir = inputDir;
    this.outputDir = outputDir;
    this.processedDir = path.join(path.dirname(inputDir), 'processed');
    this.failedDir = path.join(path.dirname(inputDir), 'failed');
    this.sanitizer = new Sanitizer();
    this.codeGenerator = new CodeGenerator(path.join(process.cwd(), 'src/remotion'));
    this.stabilizationEngine = new StabilizationEngine({
      input: this.inputDir,
      output: this.outputDir,
      processed: this.processedDir
    });

    // Run self-heal on startup
    this.stabilizationEngine.selfHeal();

    // Ensure directories exist
    [this.inputDir, this.outputDir, this.processedDir, this.failedDir].forEach(dir => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });
  }

  start() {
    console.log(`[QueueManager] Watching ${this.inputDir} for new videos...`);
    console.log(`[QueueManager] Outputs will be saved to ${this.outputDir}`);

    const watcher = chokidar.watch(this.inputDir, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
      }
    });

    watcher.on('add', (filePath) => {
      console.log(`[QueueManager] New file detected: ${filePath}`);
      this.queue.push(filePath);
      this.processNext();
    });
  }

  private async processNext() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const filePath = this.queue.shift();

    if (!filePath) {
      this.processing = false;
      return;
    }

    try {
      await this.processVideo(filePath);
    } catch (error) {
      console.error(`[QueueManager] Error processing ${filePath}:`, error);
      this.moveToFailed(filePath, error);
    } finally {
      this.processing = false;
      this.processNext();
    }
  }

  private async processVideo(filePath: string) {
    const fileName = path.basename(filePath, path.extname(filePath));
    const videoOutputDir = path.join(this.outputDir, fileName);

    console.log(`[QueueManager] Processing ${fileName}...`);

    let workingFilePath = filePath;
    let successfulAnalysis = null;
    let needsCleanup = false;

    // 1. Initial Analysis Attempt
    try {
      const analyzer = new VideoAnalyzer(workingFilePath, videoOutputDir);
      successfulAnalysis = await analyzer.analyze();
    } catch (error) {
      console.warn(`[QueueManager] Initial analysis failed. Attempting sanitization...`);

      // 2. Auto-Fix (Sanitization)
      try {
        workingFilePath = await this.sanitizer.sanitize(filePath);
        needsCleanup = true;
        const analyzer = new VideoAnalyzer(workingFilePath, videoOutputDir);
        successfulAnalysis = await analyzer.analyze();
      } catch (sanitizeError) {
        throw new Error(`Analysis and Sanitization both failed. Error: ${sanitizeError}`);
      }
    }

    if (successfulAnalysis) {
      // 3. Export Results
      await exportAnalysisToJSON(successfulAnalysis, path.join(videoOutputDir, 'analysis.json'));

      if (successfulAnalysis.generatedPrompt) {
        fs.writeFileSync(path.join(videoOutputDir, 'prompt.txt'), successfulAnalysis.generatedPrompt);
      }

      // 4. Generate Code
      this.codeGenerator.generateComposition(fileName, successfulAnalysis);

      console.log(`[QueueManager] Success! Output saved to ${videoOutputDir}`);
      this.moveToProcessed(filePath); // Move original file

      // Cleanup temp sanitized file
      if (needsCleanup && fs.existsSync(workingFilePath)) {
        fs.unlinkSync(workingFilePath);
      }

      // Auto-Clean temp assets to prevent storage bloat
      this.stabilizationEngine.selfClean();
    }
  }

  private moveToProcessed(filePath: string) {
    const dest = path.join(this.processedDir, path.basename(filePath));
    // Check if dest exists to avoid error
    if (fs.existsSync(dest)) {
      const name = path.basename(filePath, path.extname(filePath));
      const ext = path.extname(filePath);
      const newDest = path.join(this.processedDir, `${name}_${Date.now()}${ext}`);
      fs.renameSync(filePath, newDest);
      console.log(`[QueueManager] Archived source to ${newDest}`);
    } else {
      fs.renameSync(filePath, dest);
      console.log(`[QueueManager] Archived source to ${dest}`);
    }
  }

  private moveToFailed(filePath: string, error: any) {
    const dest = path.join(this.failedDir, path.basename(filePath));
    if (fs.existsSync(filePath)) {
      if (fs.existsSync(dest)) {
        const name = path.basename(filePath, path.extname(filePath));
        const ext = path.extname(filePath);
        const newDest = path.join(this.failedDir, `${name}_${Date.now()}${ext}`);
        fs.renameSync(filePath, newDest);
      } else {
        fs.renameSync(filePath, dest);
      }
    }
    const logPath = path.join(this.failedDir, 'error.log');
    const logEntry = `[${new Date().toISOString()}] ${path.basename(filePath)}: ${error}\n`;
    fs.appendFileSync(logPath, logEntry);
    console.log(`[QueueManager] Moved failed file to ${dest}`);
  }
}
