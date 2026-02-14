import * as fs from 'fs';
import * as path from 'path';
import { VideoAnalysisResult } from '../analyzer/types';

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

        // 1. Create Composition.tsx
        const compositionContent = `
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import React from 'react';
import { z } from 'zod';
import { Prompt } from './Prompt';
import { DreamCrafterBase } from '../../core/DreamCrafterBase';

// AI Orchestrated Schema
export const ${componentName}Schema = z.object({
  title: z.string().default('${componentName}'),
  script: z.string().default(\`${orchestration.script}\`),
  voiceUrl: z.string().default('${orchestration.voiceUrl || ''}'),
});

/**
 * DREAMCRAFTER7 CORE GENERATED CLONE: ${videoName}
 */
export const ${componentName}: React.FC<z.infer<typeof ${componentName}Schema>> = ({ title, script }) => {
  const frame = useCurrentFrame();

  return (
    <DreamCrafterBase title={title} initialScript={script}>
      {(isEngaged, automation, branch, layout) => (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ 
                padding: 80 * layout.scaleFactor, 
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(20px)',
                borderRadius: 60 * layout.scaleFactor,
                border: '1px solid rgba(255,255,255,0.1)',
                transform: \`scale(\${isEngaged ? 1.05 : 1}) rotate(\${branch === 'ACTION' ? 2 : 0}deg)\`,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                width: layout.isPortrait ? '80%' : 'auto'
            }}>
                <h1 style={{ 
                    fontSize: (layout.isPortrait ? 80 : 100) * layout.scaleFactor, 
                    fontWeight: 900, 
                    letterSpacing: '-5px',
                    textShadow: '0 0 50px rgba(74, 144, 226, 0.5)',
                    color: isEngaged ? '#F2AD4E' : 'white',
                    marginBottom: 20 * layout.scaleFactor
                }}>
                    {title}
                </h1>
                
                <div style={{ 
                    fontSize: 24 * layout.scaleFactor, 
                    color: '#4A90E2', 
                    fontFamily: 'monospace',
                    maxWidth: 600 * layout.scaleFactor,
                    margin: '0 auto',
                    lineHeight: 1.5,
                    opacity: 0.8
                }}>
                    {automation.script}
                </div>

                <div style={{ marginTop: 40 * layout.scaleFactor, opacity: 0.3, fontSize: 14 * layout.scaleFactor }}>
                    PATH: {branch} // PLATFORM: {layout.isPortrait ? 'MOBILE' : 'DESKTOP'}
                </div>
            </div>
        </AbsoluteFill>
      )}
    </DreamCrafterBase>
  );
};
`;
        fs.writeFileSync(path.join(componentDir, 'Composition.tsx'), compositionContent);

        // 2. Create Prompt.tsx (To display the AI prompt in the preview)
        const promptContent = `
import { AbsoluteFill } from 'remotion';
import React from 'react';

const promptText = \`${analysis.generatedPrompt?.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;

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
        fs.writeFileSync(path.join(componentDir, 'Prompt.tsx'), promptContent);

        // 3. Update Registry
        this.updateRegistry(componentName, analysis);
    }

    private sanitizeComponentName(name: string): string {
        // Convert "travel77" to "Travel77"
        // Remove non-alphanumeric, camel case
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/[^a-zA-Z0-9]/g, '');
    }

    private updateRegistry(componentName: string, analysis: VideoAnalysisResult) {
        // We need to append the new composition to registry.ts
        // This is a bit hacky (parsing TS file as string), but efficient for this purpose.

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

        // Add entry to array
        const newEntry = `
    {
        id: '${componentName}',
        component: ${componentName},
        durationInFrames: ${Math.round(analysis.metadata.duration * analysis.metadata.fps)},
        fps: ${Math.round(analysis.metadata.fps)},
        width: ${analysis.metadata.width},
        height: ${analysis.metadata.height},
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
