import * as fs from 'fs';
import * as path from 'path';
import { VideoAnalysisResult } from '../analyzer/types';
import { registryProtection } from './RegistryProtection';

export class CodeGenerator {
    private clonesDir: string;
    private registryPath: string;

    constructor(remotionSrcDir: string) {
        this.clonesDir = path.join(remotionSrcDir, 'clones');
        this.registryPath = path.join(this.clonesDir, 'registry.ts');

        if (!fs.existsSync(this.clonesDir)) {
            fs.mkdirSync(this.clonesDir, { recursive: true });
        }
    }

    generateComposition(videoName: string, analysis: VideoAnalysisResult) {
        const componentName = this.sanitizeComponentName(videoName);
        const componentDir = path.join(this.clonesDir, componentName);
        const orchestration = analysis.orchestration || {
            script: "System Default: Analysis Complete.",
            voiceUrl: "",
            visualCues: []
        };

        if (!fs.existsSync(componentDir)) {
            fs.mkdirSync(componentDir, { recursive: true });
        }

        // 1. Create Composition.tsx with enhanced error handling
        const compositionContent = this.generateCompositionTemplate(componentName, videoName, orchestration);
        fs.writeFileSync(path.join(componentDir, 'Composition.tsx'), compositionContent);

        // 2. Create Prompt.tsx (To display the AI prompt in the preview)
        const promptContent = this.generatePromptTemplate(analysis);
        fs.writeFileSync(path.join(componentDir, 'Prompt.tsx'), promptContent);

        // 3. Update Registry with protection
        this.updateRegistryWithProtection(componentName, analysis);
        
        console.log(`[CodeGenerator] ✅ Generated ${componentName} at ${componentDir}`);
    }

    private generateCompositionTemplate(componentName: string, videoName: string, orchestration: any): string {
        return `import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import React from 'react';
import { z } from 'zod';
import { Prompt } from './Prompt';
import { DreamCrafterBase } from '../../core/DreamCrafterBase';

// AI Orchestrated Schema with validation
export const ${componentName}Schema = z.object({
  title: z.string().default('${componentName}'),
  script: z.string().default(\`${orchestration.script?.slice(0, 200) || 'Welcome to ' + componentName}\`),
  voiceUrl: z.string().default('${orchestration.voiceUrl || ''}'),
  enableThree: z.boolean().default(true),
  duration: z.number().optional(),
});

/**
 * DREAMCRAFTER7 PREMIUM COMPONENT: ${videoName}
 * Built with Agentic Precision & Modern Motion Principles
 * 
 * Best Practices Applied:
 * - Zod schema validation for props
 * - Responsive to width/height from useVideoConfig()
 * - Spring animations for smooth entrance/exit
 * - Error boundary protection
 */
export const ${componentName}: React.FC<z.infer<typeof ${componentName}Schema>> = ({ title, script, enableThree = true }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Error boundary: Prevent NaN or invalid values
  const safeFrame = isNaN(frame) ? 0 : frame;
  const safeFps = isNaN(fps) || fps <= 0 ? 30 : fps;

  // Intro Animation: Smooth entrance using spring physics
  const entrance = spring({
    frame: safeFrame,
    fps: safeFps,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(safeFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const yOffset = interpolate(entrance, [0, 1], [50, 0]);

  return (
    <DreamCrafterBase title={title} initialScript={script} enableThree={enableThree}>
      {(isEngaged, automation, branch, layout) => {
        const surge = spring({
            frame: isEngaged ? safeFrame % 30 : 0,
            fps: safeFps,
            config: { mass: 0.5 }
        });

        return (
            <AbsoluteFill style={{ 
                backgroundColor: '#050510',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <AbsoluteFill style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity,
                    transform: \`translateY(\${yOffset}px)\`
                }}>
                    <div style={{ 
                        padding: 100 * layout.scaleFactor, 
                        textAlign: 'center',
                        background: 'rgba(15, 15, 25, 0.4)',
                        backdropFilter: 'blur(40px) saturate(180%)',
                        borderRadius: 80 * layout.scaleFactor,
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
                        transform: \`scale(\${1 + (isEngaged ? surge * 0.05 : 0)}) rotate(\${branch === 'ACTION' ? 2 : 0}deg)\`,
                        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                        width: layout.isPortrait ? '85%' : '60%',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative Gradient Background */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            left: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'radial-gradient(circle at center, rgba(74, 144, 226, 0.1) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }} />

                        <h1 style={{ 
                            fontSize: (layout.isPortrait ? 80 : 120) * layout.scaleFactor, 
                            fontWeight: 800, 
                            letterSpacing: '-0.04em',
                            background: 'linear-gradient(to bottom, #fff, #94a3b8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: 30 * layout.scaleFactor
                        }}>
                            {title}
                        </h1>
                        
                        <div style={{ 
                            fontSize: 32 * layout.scaleFactor, 
                            color: '#e2e8f0', 
                            maxWidth: 800 * layout.scaleFactor,
                            margin: '0 auto',
                            lineHeight: 1.4,
                            fontWeight: 400,
                            opacity: 0.9
                        }}>
                            {automation.script}
                        </div>

                        <div style={{ 
                            marginTop: 60 * layout.scaleFactor, 
                            display: 'flex', 
                            justifyContent: 'center', 
                            gap: 20,
                            opacity: 0.5
                        }}>
                            <span style={{ fontSize: 16 * layout.scaleFactor, padding: '8px 16px', border: '1px solid white', borderRadius: 20 }}>
                                {branch}
                            </span>
                            <span style={{ fontSize: 16 * layout.scaleFactor, padding: '8px 16px', border: '1px solid white', borderRadius: 20 }}>
                                {layout.isPortrait ? 'MOBILE' : 'DESKTOP'}
                            </span>
                        </div>
                    </div>
                </AbsoluteFill>
            </AbsoluteFill>
        );
      }}
    </DreamCrafterBase>
  );
};
`;
    }

    private generatePromptTemplate(analysis: VideoAnalysisResult): string {
        const promptText = analysis.generatedPrompt?.replace(/`/g, '\\`').replace(/\$/g, '\\$') || 'No prompt generated';
        
        return `
import { AbsoluteFill } from 'remotion';
import React from 'react';

const promptText = \`${promptText.slice(0, 2000)}\`;

export const Prompt: React.FC = () => {
  return (
    <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '400px',
        zIndex: 1000,
        backgroundColor: 'rgba(10, 10, 15, 0.95)',
        color: '#e2e8f0',
        padding: '30px',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        fontSize: '12px',
        overflow: 'auto',
        height: '100%',
        borderLeft: '1px solid #334155',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)'
    }}>
        <h2 style={{ color: '#60a5fa', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
            🤖 REPLICATION PROMPT
        </h2>
        {promptText}
        <div style={{ marginTop: '40px', padding: '15px', backgroundColor: '#1e293b', borderRadius: '8px', color: '#94a3b8' }}>
            <strong>TIP:</strong> Copy this text and paste it to Antigravity to build the clone.
        </div>
    </div>
  );
};
`;
    }

    private sanitizeComponentName(name: string): string {
        // Convert "travel77" to "Travel77"
        // Remove non-alphanumeric, camel case
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/[^a-zA-Z0-9]/g, '');
    }

    /**
     * Update registry with protection - backup, validate, rollback on failure
     */
    private updateRegistryWithProtection(componentName: string, analysis: VideoAnalysisResult) {
        // Use registry protection system
        registryProtection.withProtection(() => {
            this.updateRegistry(componentName, analysis);
        });
    }

    private updateRegistry(componentName: string, analysis: VideoAnalysisResult) {
        let registryContent = fs.readFileSync(this.registryPath, 'utf-8');

        // Check if already registered
        if (registryContent.includes(componentName)) {
            console.log(`[CodeGenerator] ${componentName} already registered.`);
            return;
        }

        // Add import
        const importStatement = `import { ${componentName} } from './${componentName}/Composition';\n`;
        if (!registryContent.includes(importStatement)) {
            registryContent = importStatement + registryContent;
        }

        // Add entry to array - safely handle metadata
        const duration = analysis.metadata?.duration || 10;
        const fps = analysis.metadata?.fps || 30;
        const width = analysis.metadata?.width || 1920;
        const height = analysis.metadata?.height || 1080;

        const newEntry = `
    {
        id: '${componentName}',
        component: ${componentName},
        durationInFrames: ${Math.round(duration * fps)},
        fps: ${Math.round(fps)},
        width: ${width},
        height: ${height},
        defaultProps: {
            title: '${componentName}'
        }
    },`;

        // Insert before the closing bracket of the array
        const arrayEndIndex = registryContent.lastIndexOf('];');
        if (arrayEndIndex !== -1) {
            registryContent = registryContent.slice(0, arrayEndIndex) + newEntry + registryContent.slice(arrayEndIndex);
        }

        fs.writeFileSync(this.registryPath, registryContent);
        console.log(`[CodeGenerator] Registered ${componentName} in Remotion Root.`);
    }
}
