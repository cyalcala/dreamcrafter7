/**
 * DreamCrafter7 - Agent Context System
 * Provides real-time state information to AI agents (Antigravity, Cursor, etc.)
 * so they understand what the system is doing and can act accordingly.
 */

import * as fs from 'fs';
import * as path from 'path';

export type ProcessingStatus = 'idle' | 'processing' | 'analyzing' | 'generating' | 'complete' | 'error' | 'paused';

export interface ActiveProject {
  name: string;
  componentName: string;
  startTime: string;
  stage: string;
  progress: number;
}

export interface SystemState {
  version: string;
  status: ProcessingStatus;
  activeProject: ActiveProject | null;
  lastProcessed: string | null;
  lastError: string | null;
  queue: string[];
  processedVideos: string[];
  failedVideos: string[];
  lockInfo: LockInfo | null;
}

export interface LockInfo {
  pid: number;
  file: string;
  acquiredAt: string;
  expiresAt: string;
}

class AgentContext {
  private stateFile: string;
  private state: SystemState;
  private lockTimeout = 5 * 60 * 1000; // 5 minutes lock timeout

  constructor() {
    const workspaceRoot = process.cwd();
    this.stateFile = path.join(workspaceRoot, 'system-state.json');
    this.state = this.loadState();
  }

  private loadState(): SystemState {
    const defaultState: SystemState = {
      version: '1.0.0',
      status: 'idle',
      activeProject: null,
      lastProcessed: null,
      lastError: null,
      queue: [],
      processedVideos: this.getExistingVideos('processed'),
      failedVideos: this.getExistingVideos('failed'),
      lockInfo: null
    };

    try {
      if (fs.existsSync(this.stateFile)) {
        const data = fs.readFileSync(this.stateFile, 'utf-8');
        const loaded = JSON.parse(data);
        // Merge with defaults to ensure all fields exist
        return { ...defaultState, ...loaded };
      }
    } catch (error) {
      console.warn('[AgentContext] Failed to load state, using defaults:', error);
    }

    return defaultState;
  }

  private getExistingVideos(dir: 'processed' | 'failed'): string[] {
    const dirPath = path.join(process.cwd(), dir);
    const videos: string[] = [];
    
    try {
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        videos.push(...files.filter(f => 
          ['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(path.extname(f).toLowerCase())
        ));
      }
    } catch (error) {
      console.warn(`[AgentContext] Failed to read ${dir} directory:`, error);
    }
    
    return videos;
  }

  private saveState(): void {
    try {
      fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (error) {
      console.error('[AgentContext] Failed to save state:', error);
    }
  }

  /**
   * Check if a video is currently being processed or already processed
   * This is the FIRST thing any AI agent should call
   */
  getVideoStatus(videoName: string): {
    isProcessing: boolean;
    isProcessed: boolean;
    isFailed: boolean;
    isInQueue: boolean;
    details: string;
  } {
    const name = videoName.toLowerCase();
    
    if (this.state.activeProject?.name.toLowerCase() === name) {
      return {
        isProcessing: true,
        isProcessed: false,
        isFailed: false,
        isInQueue: false,
        details: `Currently ${this.state.activeProject.stage} (${this.state.activeProject.progress}%)`
      };
    }

    if (this.state.processedVideos.some(v => v.toLowerCase().includes(name))) {
      return {
        isProcessing: false,
        isProcessed: true,
        isFailed: false,
        isInQueue: false,
        details: 'Video has been processed and is ready in Remotion'
      };
    }

    if (this.state.failedVideos.some(v => v.toLowerCase().includes(name))) {
      return {
        isProcessing: false,
        isProcessed: false,
        isFailed: true,
        isInQueue: false,
        details: 'Video processing failed - check failed/error.log'
      };
    }

    if (this.state.queue.some(v => v.toLowerCase().includes(name))) {
      return {
        isProcessing: false,
        isProcessed: false,
        isFailed: false,
        isInQueue: true,
        details: 'Video is queued for processing'
      };
    }

    return {
      isProcessing: false,
      isProcessed: false,
      isFailed: false,
      isInQueue: false,
      details: 'Video not found in system'
    };
  }

  /**
   * Get the current active project for AI agents to understand context
   */
  getActiveProject(): ActiveProject | null {
    return this.state.activeProject;
  }

  /**
   * Get full system state for AI agents
   */
  getFullState(): SystemState {
    return { ...this.state };
  }

  /**
   * Get list of all available compositions in Remotion
   */
  getAvailableCompositions(): string[] {
    const registryPath = path.join(process.cwd(), 'src/remotion/clones/registry.ts');
    const compositions: string[] = [];
    
    try {
      if (fs.existsSync(registryPath)) {
        const content = fs.readFileSync(registryPath, 'utf-8');
        const matches = content.match(/id:\s*['"]([^'"]+)['"]/g);
        if (matches) {
          matches.forEach(match => {
            const id = match.match(/id:\s*['"]([^'"]+)['"]/)?.[1];
            if (id) compositions.push(id);
          });
        }
      }
    } catch (error) {
      console.warn('[AgentContext] Failed to read compositions:', error);
    }
    
    return compositions;
  }

  /**
   * Check if system is ready for new input
   */
  isReady(): boolean {
    // Check if lock is stale
    if (this.state.lockInfo) {
      const expiresAt = new Date(this.state.lockInfo.expiresAt).getTime();
      const now = Date.now();
      
      if (expiresAt < now) {
        console.warn('[AgentContext] Stale lock detected, system is ready');
        return true;
      }
    }
    
    return this.state.status !== 'processing' && 
           this.state.status !== 'analyzing' && 
           this.state.status !== 'generating';
  }

  // ===== State Update Methods (used by QueueManager) =====

  updateStatus(status: ProcessingStatus): void {
    this.state.status = status;
    this.saveState();
  }

  setActiveProject(project: ActiveProject | null): void {
    this.state.activeProject = project;
    if (project) {
      this.state.status = 'processing';
    }
    this.saveState();
  }

  updateProgress(stage: string, progress: number): void {
    if (this.state.activeProject) {
      this.state.activeProject.stage = stage;
      this.state.activeProject.progress = progress;
      this.saveState();
    }
  }

  markComplete(videoName: string): void {
    this.state.activeProject = null;
    this.state.status = 'complete';
    this.state.lastProcessed = videoName;
    this.state.lastError = null;
    this.state.processedVideos.push(videoName);
    // Remove from queue if present
    this.state.queue = this.state.queue.filter(v => !v.includes(videoName));
    this.saveState();
  }

  markError(error: string): void {
    this.state.status = 'error';
    this.state.lastError = error;
    this.saveState();
  }

  addToQueue(videoName: string): void {
    if (!this.state.queue.includes(videoName)) {
      this.state.queue.push(videoName);
      this.saveState();
    }
  }

  addFailedVideo(videoName: string): void {
    this.state.failedVideos.push(videoName);
    this.state.activeProject = null;
    this.state.status = 'error';
    this.saveState();
  }

  acquireLock(fileName: string): boolean {
    const now = Date.now();
    const lockInfo: LockInfo = {
      pid: process.pid,
      file: fileName,
      acquiredAt: new Date(now).toISOString(),
      expiresAt: new Date(now + this.lockTimeout).toISOString()
    };
    
    this.state.lockInfo = lockInfo;
    this.saveState();
    return true;
  }

  releaseLock(): void {
    this.state.lockInfo = null;
    this.saveState();
  }

  /**
   * System health check - returns status of all subsystems
   */
  healthCheck(): {
    status: 'healthy' | 'degraded' | 'error';
    checks: Record<string, { status: 'ok' | 'warning' | 'error'; message: string }>;
  } {
    const checks: Record<string, { status: 'ok' | 'warning' | 'error'; message: string }> = {};
    
    // Check directories
    const dirs = ['inputs', 'processed', 'failed', 'public/clones', 'src/remotion/clones'];
    dirs.forEach(dir => {
      const dirPath = path.join(process.cwd(), dir);
      checks[dir] = fs.existsSync(dirPath) 
        ? { status: 'ok', message: `Directory exists: ${dir}` }
        : { status: 'error', message: `Missing directory: ${dir}` };
    });

    // Check FFmpeg
    const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
    checks['ffmpeg'] = fs.existsSync(ffmpegPath.replace(/"/g, '')) || process.env.FFMPEG_PATH
      ? { status: 'ok', message: 'FFmpeg configured' }
      : { status: 'warning', message: 'FFmpeg path not found' };

    // Check lock status
    if (this.state.lockInfo) {
      const expiresAt = new Date(this.state.lockInfo.expiresAt).getTime();
      checks['lock'] = expiresAt > Date.now()
        ? { status: 'ok', message: `Processing: ${this.state.lockInfo.file}` }
        : { status: 'warning', message: 'Stale lock detected' };
    } else {
      checks['lock'] = { status: 'ok', message: 'No active lock' };
    }

    // Overall status
    const hasErrors = Object.values(checks).some(c => c.status === 'error');
    const hasWarnings = Object.values(checks).some(c => c.status === 'warning');
    
    return {
      status: hasErrors ? 'error' : hasWarnings ? 'degraded' : 'healthy',
      checks
    };
  }
}

// Export singleton instance
export const agentContext = new AgentContext();
export default agentContext;
