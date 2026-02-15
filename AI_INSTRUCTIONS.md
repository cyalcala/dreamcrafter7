# DreamCrafter7 - AI Agent Instructions

## Overview

DreamCrafter7 is an automated video replication system that transforms video files into Remotion compositions. When you open this workspace in any AI agent manager (Antigravity, Cursor, etc.), this system ensures smooth video replication with proper state awareness.

## Quick Start

1. **Drop a video** into the `inputs/` folder
2. **The system automatically** analyzes, generates code, and opens Remotion
3. **Edit** the generated composition in `src/remotion/clones/[VideoName]/`

## System State (Critical for AI Agents)

Before taking ANY action, AI agents MUST check the current system state:

```typescript
// Read system-state.json to understand what's happening
import { agentContext } from './src/AgentContext';

// Check if a specific video is being processed
const status = agentContext.getVideoStatus('myvideo');
// Returns: { isProcessing, isProcessed, isFailed, isInQueue, details }

// Check if system is ready for new input
const ready = agentContext.isReady();

// Get current active project
const project = agentContext.getActiveProject();

// Get list of all available compositions
const compositions = agentContext.getAvailableCompositions();

// Run health check
const health = agentContext.healthCheck();
```

## Process Flow

```
inputs/ → [Watch] → Analysis → Orchestration → CodeGen → Remotion Studio
                                    ↓                              ↓
                              failed/                    src/remotion/clones/
```

## Critical Rules for AI Agents

### 1. Single Video Processing
- **ONLY ONE VIDEO at a time** is processed
- Check `processing.lock` file or `system-state.json` before starting
- If processing, wait until complete before adding new videos

### 2. State Recognition (MUST DO)
Before any action, check:
```bash
# Read the system state file
cat system-state.json
```

Key states:
- `idle` - Ready for new video
- `processing` - Currently working on a video
- `complete` - Last video finished successfully
- `error` - Something failed

### 3. Active Project Focus
When a video is being processed:
- The AI should recognize which video is active
- All edits should be in `src/remotion/clones/[ActiveProject]/`
- Don't interfere with processing videos

### 4. Video Status Check
Before editing or replicating:
```typescript
const status = agentContext.getVideoStatus('myvideo');

if (status.isProcessing) {
  // Wait until complete - don't interfere!
  console.log('Video is being processed, waiting...');
} else if (status.isProcessed) {
  // Ready to edit!
  console.log('Video is ready at: src/remotion/clones/' + videoName);
} else if (status.isFailed) {
  // Check errors
  console.log('Failed - check failed/error.log');
}
```

## Directory Structure

```
DreamCrafter7/
├── inputs/                    # Drop videos here
├── processed/                 # Completed videos go here
├── failed/                   # Failed videos + error.log
├── public/clones/[name]/    # Extracted frames, analysis.json
├── src/
│   ├── remotion/
│   │   └── clones/
│   │       ├── [VideoName]/  # Generated composition
│   │       │   ├── Composition.tsx
│   │       │   └── Prompt.tsx
│   │       └── registry.ts   # Composition registry
│   ├── AgentContext.ts       # System state (READ THIS)
│   └── process/
│       ├── QueueManager.ts    # Processing queue
│       └── RegistryProtection.ts # Backup/validation
└── system-state.json         # Current system state
```

## Editing a Video

1. **Check state first**: `cat system-state.json`
2. **Find the composition**: `src/remotion/clones/[VideoName]/Composition.tsx`
3. **Edit** using Remotion best practices:
   - Use `useCurrentFrame()` for animation
   - Use `spring()` for smooth physics
   - Use `interpolate()` for transitions
   - Always include Zod schema for props
   - Make responsive to `width` and `height` from `useVideoConfig()`

## Remotion Best Practices

### Always Use These Patterns:

```tsx
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { z } from 'zod';

// 1. Schema for props validation
export const MyVideoSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
});

// 2. Main component with typed props
export const MyVideo: React.FC<z.infer<typeof MyVideoSchema>> = ({ title }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // 3. Safe values
  const safeFrame = isNaN(frame) ? 0 : frame;
  const safeFps = isNaN(fps) || fps <= 0 ? 30 : fps;

  // 4. Spring animation
  const entrance = spring({
    frame: safeFrame,
    fps: safeFps,
    config: { damping: 12, stiffness: 100 },
  });

  // 5. Interpolate for smooth transitions
  const opacity = interpolate(safeFrame, [0, 30], [0, 1]);
  
  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Your content */}
    </AbsoluteFill>
  );
};
```

### Common Errors to Avoid:
- Don't use hardcoded values - always use `useVideoConfig()`
- Check for NaN/Infinity in calculations
- Use `interpolate()` with `extrapolateRight: 'clamp'` 
- Define default props in Zod schema

## Error Handling

### If Processing Fails:
1. Check `failed/error.log` for details
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

## CLI Commands

```bash
# Start the watcher and Remotion studio
npm start

# Run tests
npm test

# Check system health
# Read system-state.json manually
```

## Tips for AI Agents

1. **Always read system-state.json first** - It tells you everything
2. **One video at a time** - The system enforces this, respect it
3. **Don't edit while processing** - Wait for complete status
4. **Check failed/error.log** - Detailed error information
5. **Use the Prompt.tsx** - Contains the AI replication instructions

## System Health Check

The system automatically runs self-healing on startup:
- Creates missing directories
- Cleans stale lock files
- Validates registry structure

If you notice issues, check:
```bash
# View current state
cat system-state.json

# Check lock status
cat processing.lock

# View recent errors
cat failed/error.log
```

## Integration with AI Agents

When you (as an AI) work in this workspace:

1. **On startup**: Read `system-state.json` to understand current state
2. **Before editing**: Verify video is processed and not being worked on
3. **During editing**: Make changes in the active composition folder
4. **After editing**: Remotion hot-reloads automatically

The system is designed to be self-documenting and error-resistant. Trust the system state files - they are the source of truth for what the system is doing.
