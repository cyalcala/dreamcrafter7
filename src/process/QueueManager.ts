import chokidar from 'chokidar';
import * as path from 'path';
import * as fs from 'fs';
import { VideoAnalyzer } from '../analyzer/VideoAnalyzer';
import { Sanitizer } from './Sanitizer';
import { exportAnalysisToJSON } from '../analyzer/exporter';
import { CodeGenerator } from './CodeGenerator';
import { StabilizationEngine } from './StabilizationEngine';
import { MultiModelOrchestrator } from '../orchestrator/MultiModelOrchestrator';
import { agentContext, ActiveProject } from '../AgentContext';

/**
 * DreamCrafter7 - Enhanced Queue Manager
 * Features:
 * - Single video processing at a time (strict isolation)
 * - Agent Context integration for AI awareness
 * - Robust error recovery with detailed logging
 * - Progress tracking throughout all stages
 */

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
  private static LOCK_FILE = path.join(process.cwd(), 'processing.lock');
  private static LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes

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

    // Validate lock file on startup
    this.validateAndCleanLock();
  }

  /**
   * Validate existing lock file and clean if stale
   */
  private validateAndCleanLock(): void {
    const lockFile = QueueManager.LOCK_FILE;
    
    if (fs.existsSync(lockFile)) {
      try {
        const content = fs.readFileSync(lockFile, 'utf-8');
        const lockData = JSON.parse(content);
        
        // Check if lock is expired (older than timeout)
        const lockTime = new Date(lockData.timestamp).getTime();
        const now = Date.now();
        
        if (now - lockTime > QueueManager.LOCK_TIMEOUT) {
          console.warn('[QueueManager] Found stale lock file. Cleaning up...');
          fs.unlinkSync(lockFile);
          
          // Also release agent context lock
          agentContext.releaseLock();
        } else {
          // Check if the process is still running
          try {
            process.kill(lockData.pid, 0);
            console.log(`[QueueManager] Another process (PID: ${lockData.pid}) is processing. Waiting...`);
          } catch (e) {
            // Process not running, clean stale lock
            console.warn('[QueueManager] Previous process died. Cleaning up stale lock...');
            fs.unlinkSync(lockFile);
            agentContext.releaseLock();
          }
        }
      } catch (error) {
        // Invalid lock file format, remove it
        console.warn('[QueueManager] Invalid lock file format. Cleaning up...');
        try {
          fs.unlinkSync(lockFile);
        } catch (e) {}
        agentContext.releaseLock();
      }
    }
  }

  /**
   * Acquire processing lock
   */
  private acquireLock(fileName: string): boolean {
    const lockFile = QueueManager.LOCK_FILE;
    
    if (fs.existsSync(lockFile)) {
      // Double-check lock validity
      this.validateAndCleanLock();
      if (fs.existsSync(lockFile)) {
        console.warn('[QueueManager] Cannot acquire lock - another process is running');
        return false;
      }
    }

    const lockData = {
      pid: process.pid,
      file: fileName,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + QueueManager.LOCK_TIMEOUT).toISOString()
    };

    fs.writeFileSync(lockFile, JSON.stringify(lockData, null, 2));
    
    // Also update agent context
    agentContext.acquireLock(fileName);
    
    console.log(`[QueueManager] Lock acquired for: ${fileName}`);
    return true;
  }

  /**
   * Release processing lock
   */
  private releaseLock(): void {
    const lockFile = QueueManager.LOCK_FILE;
    
    if (fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
    }
    
    agentContext.releaseLock();
    console.log('[QueueManager] Lock released');
  }

  /**
   * Get list of video files in a directory
   */
  private getVideoFiles(dir: string): string[] {
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.flv'];
    const files: string[] = [];
    
    try {
      const dirFiles = fs.readdirSync(dir);
      for (const file of dirFiles) {
        const ext = path.extname(file).toLowerCase();
        if (videoExtensions.includes(ext)) {
          files.push(path.join(dir, file));
        }
      }
    } catch (error) {
      console.error('[QueueManager] Error reading directory:', error);
    }
    
    return files;
  }

  start() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('       DreamCrafter7 - Enhanced Queue Manager Started');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📁 Input Directory: ${this.inputDir}`);
    console.log(`📁 Output Directory: ${this.outputDir}`);
    console.log(`🔒 Single Video Mode: ENABLED`);
    console.log(`🤖 Agent Context: ACTIVE`);
    console.log('═══════════════════════════════════════════════════════════════');

    // Check for any existing videos in inputs on startup
    const existingVideos = this.getVideoFiles(this.inputDir);
    if (existingVideos.length > 0) {
      console.log(`[QueueManager] Found ${existingVideos.length} existing video(s) in inputs`);
      existingVideos.forEach(v => {
        console.log(`  → ${path.basename(v)}`);
        this.queue.push(v);
      });
    }

    // Start watching for new files
    const watcher = chokidar.watch(this.inputDir, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      awaitWriteFinish: {
        stabilityThreshold: 3000, // Wait 3 seconds for file to be fully written
        pollInterval: 500
      },
      ignoreInitial: true // Don't trigger for existing files (already handled above)
    });

    watcher.on('add', (filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.flv'];
      
      if (videoExtensions.includes(ext)) {
        console.log(`[QueueManager] 📥 New video detected: ${path.basename(filePath)}`);
        this.queue.push(filePath);
        this.processNext();
      }
    });

    watcher.on('error', (error) => {
      console.error('[QueueManager] Watcher error:', error);
    });

    // If there were existing videos, start processing
    if (existingVideos.length > 0) {
      this.processNext();
    }
  }

  private async processNext() {
    // STRICT: Only one video at a time
    if (this.processing || this.queue.length === 0) {
      if (this.queue.length > 0 && !this.processing) {
        // Re-check after a delay if we were waiting for lock
        setTimeout(() => this.processNext(), 1000);
      }
      return;
    }

    // Try to acquire lock
    if (!this.acquireLock('pending')) {
      console.log('[QueueManager] Waiting for previous processing to complete...');
      setTimeout(() => this.processNext(), 2000);
      return;
    }

    this.processing = true;
    const filePath = this.queue.shift();

    if (!filePath) {
      this.processing = false;
      this.releaseLock();
      return;
    }

    const fileName = path.basename(filePath, path.extname(filePath));
    const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/[^a-zA-Z0-9]/g, '');

    // Create active project context for AI agents
    const activeProject: ActiveProject = {
      name: fileName,
      componentName: componentName,
      startTime: new Date().toISOString(),
      stage: 'initializing',
      progress: 0
    };

    // Update agent context
    agentContext.setActiveProject(activeProject);
    agentContext.updateStatus('processing');

    // Log to both console and agent context
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`🎬 STARTING: ${fileName}`);
    console.log(`${'═'.repeat(60)}`);

    try {
      // ═══════════════════════════════════════════════════════════
      // STAGE 1: Video Analysis
      // ═══════════════════════════════════════════════════════════
      agentContext.updateProgress('analyzing', 10);
      console.log(`[Stage 1/5] 🔍 Analyzing video...`);
      
      const videoOutputDir = path.join(this.outputDir, fileName);
      let workingFilePath = filePath;
      let successfulAnalysis = null;
      let needsCleanup = false;

      try {
        const analyzer = new VideoAnalyzer(workingFilePath, videoOutputDir);
        successfulAnalysis = await analyzer.analyze();
        agentContext.updateProgress('analyzing', 30);
      } catch (initialError) {
        console.warn(`[Stage 1] Initial analysis failed. Attempting sanitization...`);
        agentContext.updateProgress('sanitizing', 20);
        
        // Try to fix the video
        try {
          workingFilePath = await this.sanitizer.sanitize(filePath);
          needsCleanup = true;
          const analyzer = new VideoAnalyzer(workingFilePath, videoOutputDir);
          successfulAnalysis = await analyzer.analyze();
          agentContext.updateProgress('sanitizing', 30);
        } catch (sanitizeError) {
          throw new Error(`Analysis failed: ${initialError}. Sanitization failed: ${sanitizeError}`);
        }
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 2: AI Orchestration
      // ═══════════════════════════════════════════════════════════
      agentContext.updateProgress('orchestrating', 40);
      console.log(`[Stage 2/5] 🤖 Orchestrating AI content...`);
      
      const orchestrator = new MultiModelOrchestrator();
      const synthesis = await orchestrator.synthesizeContent(
        `Create a premium video for ${fileName} with professional presentation`
      );

      // Merge orchestration into analysis
      if (successfulAnalysis) {
        (successfulAnalysis as any).orchestration = synthesis;
      }
      
      agentContext.updateProgress('orchestrating', 60);

      // ═══════════════════════════════════════════════════════════
      // STAGE 3: Export Analysis
      // ═══════════════════════════════════════════════════════════
      agentContext.updateProgress('exporting', 70);
      console.log(`[Stage 3/5] 📦 Exporting analysis data...`);
      
      await exportAnalysisToJSON({
        ...successfulAnalysis,
        orchestration: synthesis
      }, path.join(videoOutputDir, 'analysis.json'));
      
      agentContext.updateProgress('exporting', 80);

      // ═══════════════════════════════════════════════════════════
      // STAGE 4: Generate Remotion Code
      // ═══════════════════════════════════════════════════════════
      agentContext.updateProgress('generating', 85);
      console.log(`[Stage 4/5] 💻 Generating Remotion code...`);
      
      this.codeGenerator.generateComposition(fileName, successfulAnalysis);
      
      agentContext.updateProgress('generating', 95);

      // ═══════════════════════════════════════════════════════════
      // STAGE 5: Complete & Cleanup
      // ═══════════════════════════════════════════════════════════
      console.log(`[Stage 5/5] ✨ Finalizing...`);
      
      // Move original to processed
      this.moveToProcessed(filePath);

      // Cleanup temp sanitized file
      if (needsCleanup && fs.existsSync(workingFilePath) && workingFilePath !== filePath) {
        fs.unlinkSync(workingFilePath);
      }

      // Run cleanup to prevent storage bloat
      this.stabilizationEngine.selfClean();

      // Mark complete in agent context
      agentContext.markComplete(fileName);

      // Success message with Remotion URL
      const studioUrl = `http://localhost:3000/composition/${componentName}`;
      console.log(`\n${'═'.repeat(60)}`);
      console.log(`✅ SUCCESS: ${fileName} is ready!`);
      console.log(`🔗 Open in Remotion: ${studioUrl}`);
      console.log(`${'═'.repeat(60)}\n`);

      // Auto-open browser (optional, can be disabled)
      try {
        const { exec } = require('child_process');
        exec(`start ${studioUrl}`);
      } catch (e) {
        console.warn('[QueueManager] Could not auto-open browser');
      }

    } catch (error: any) {
      console.error(`\n❌ ERROR processing ${fileName}:`, error.message);
      
      // Log detailed error
      this.logError(fileName, error);
      
      // Move to failed
      this.moveToFailed(filePath, error);
      
      // Update agent context
      agentContext.addFailedVideo(fileName);
      agentContext.markError(error.message);
    } finally {
      this.processing = false;
      this.releaseLock();
      
      // Process next in queue
      if (this.queue.length > 0) {
        setTimeout(() => this.processNext(), 1000);
      }
    }
  }

  private logError(videoName: string, error: any): void {
    const logPath = path.join(this.failedDir, 'error.log');
    const timestamp = new Date().toISOString();
    const stack = error.stack || 'No stack trace';
    
    const logEntry = `
══════════════════════════════════════════════════════════
ERROR: ${videoName}
TIME: ${timestamp}
ERROR: ${error.message}
STACK: ${stack}
══════════════════════════════════════════════════════════
`;
    
    fs.appendFileSync(logPath, logEntry);
  }

  private moveToProcessed(filePath: string) {
    const processedDir = this.processedDir;
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    let dest = path.join(processedDir, fileName);

    // Handle name collision
    if (fs.existsSync(dest)) {
      dest = path.join(processedDir, `${baseName}_${Date.now()}${ext}`);
    }

    try {
      fs.renameSync(filePath, dest);
      console.log(`[QueueManager] 📁 Archived to: ${path.basename(dest)}`);
    } catch (error) {
      console.error('[QueueManager] Failed to move to processed:', error);
    }
  }

  private moveToFailed(filePath: string, error: any) {
    const failedDir = this.failedDir;
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    let dest = path.join(failedDir, fileName);

    // Handle name collision
    if (fs.existsSync(dest)) {
      dest = path.join(failedDir, `${baseName}_${Date.now()}${ext}`);
    }

    try {
      if (fs.existsSync(filePath)) {
        fs.renameSync(filePath, dest);
      }
      console.log(`[QueueManager] ❌ Moved to failed: ${path.basename(dest)}`);
    } catch (moveError) {
      console.error('[QueueManager] Failed to move to failed:', moveError);
    }
  }
}
