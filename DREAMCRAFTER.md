# DreamCrafter7 Protocol (v2.0 - Enhanced)

## System Overview

DreamCrafter7 is an automated video replication engine. It uses FFmpeg for analysis and Remotion for code-driven video production. This version includes AI Agent Context awareness, robust error recovery, and registry protection.

## Directory Structure

```
DreamCrafter7/
├── inputs/                    # Drop raw video files here
├── processed/                 # Successfully analyzed files are archived here
├── failed/                   # Files that cause errors are moved here with error.log
├── public/clones/[VideoName] # Static assets (extracted frames, analysis.json)
├── src/
│   ├── remotion/clones/      # Generated Remotion code
│   │   ├── [VideoName]/      # Individual video compositions
│   │   │   ├── Composition.tsx
│   │   │   └── Prompt.tsx
│   │   └── registry.ts       # Register all active clones here
│   ├── AgentContext.ts       # System state for AI agents
│   └── process/
│       ├── QueueManager.ts   # Processing queue with lock mechanism
│       └── RegistryProtection.ts # Backup/validation system
├── system-state.json         # Real-time system state (READ THIS)
├── processing.lock           # Lock file for single-video processing
└── AI_INSTRUCTIONS.md        # AI agent guidelines
```

## Processing Pipeline

1. **Detection**: `watcher.ts` uses `chokidar` to detect new files in `inputs/`
2. **Lock Acquisition**: Ensures only ONE video processes at a time
3. **Analysis**: `VideoAnalyzer` extracts metadata, scenes, and colors
4. **Orchestration**: `MultiModelOrchestrator` generates script and visual cues
5. **Generation**: `CodeGenerator` creates the Remotion boilerplate with protection
6. **Stabilization**: `StabilizationEngine` cleans up temp assets
7. **Registry Update**: Safe update with automatic backup and validation

## Agent Guidelines

### Critical: AI Agent Must Read First

Before ANY action, AI agents MUST check `system-state.json`:

```bash
# Read current state
cat system-state.json
```

### State Recognition

Key states:
- `idle` - Ready for new video
- `processing` - Currently working on a video (DO NOT INTERFERE)
- `complete` - Last video finished successfully
- `error` - Something failed

### Video Status Check

```typescript
import { agentContext } from './src/AgentContext';

const status = agentContext.getVideoStatus('myvideo');
// Returns: { isProcessing, isProcessed, isFailed, isInQueue, details }
```

### Single Video Rule

- **ONLY ONE VIDEO at a time** is processed
- The system enforces this with lock files
- If a video is processing, wait until complete

## Error Recovery

### If Processing Fails:
1. Check `failed/error.log` for detailed error information
2. Video is moved to `failed/` folder
3. System state shows `error` status
4. Fix the issue and re-drop video to `inputs/`

### Registry Corruption:
If registry.ts gets corrupted:
```typescript
import { registryProtection } from './src/process/RegistryProtection';

// Validate
const result = registryProtection.validate();

// Restore from backup
registryProtection.restoreFromBackup();
```

## New Features in v2.0

### 1. Agent Context System (`AgentContext.ts`)
- Real-time system state in `system-state.json`
- Video status queries (`isProcessing`, `isProcessed`, etc.)
- Health check capabilities
- Active project tracking

### 2. Enhanced Lock Mechanism
- Process ID validation
- Timestamp-based expiration (5 min)
- Automatic cleanup of stale locks
- Single video enforcement

### 3. Registry Protection (`RegistryProtection.ts`)
- Automatic backups before modifications
- Validation after changes
- Rollback capability on failure
- Checksum verification

### 4. Improved Code Generator
- Zod schema validation
- Safe value handling (NaN/Infinity prevention)
- Responsive to `useVideoConfig()`
- Best practices embedded

### 5. Status Dashboard (`SystemStatus.tsx`)
- Visual feedback in Remotion
- Progress tracking
- Queue display
- Responsive design

## Current State

- **Active Task**: System hardening and protocol implementation.
- **Engine Status**: Active / Sequential Mode.
- **Single Video Mode**: ENABLED
- **Agent Context**: ACTIVE
- **Registry Protection**: ENABLED

## Quick Start

1. Drop a video into `inputs/`
2. Wait for automatic processing
3. Edit composition in `src/remotion/clones/[VideoName]/`
4. Changes hot-reload in Remotion Studio

## Best Practices for Editing

When editing generated compositions:

1. Use `useCurrentFrame()` for animation timing
2. Use `spring()` for smooth physics-based animations
3. Use `interpolate()` for value transitions
4. Always include Zod schema for props validation
5. Make responsive to `width` and `height` from `useVideoConfig()`
6. Check for NaN/Infinity in calculations
7. Use `extrapolateRight: 'clamp'` in interpolate

## CLI Commands

```bash
# Start the watcher and Remotion studio
npm start

# Run tests
npm test
```
