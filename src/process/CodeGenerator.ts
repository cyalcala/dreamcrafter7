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

        if (!fs.existsSync(componentDir)) {
            fs.mkdirSync(componentDir, { recursive: true });
        }

        // 1. Create Composition.tsx
        const compositionContent = `
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Img, staticFile, Audio } from 'remotion';
import React from 'react';
import { z } from 'zod';
import { Prompt } from './Prompt';

// Schema for dynamic props
export const ${componentName}Schema = z.object({
  title: z.string(),
});

/**
 * DREAMCRAFTER7 CLONE: ${videoName}
 * This component was automatically generated. 
 * Use the embedded AI Replication Prompt to complete the animation logic.
 */
export const ${componentName}: React.FC<z.infer<typeof ${componentName}Schema>> = ({ title }) => {
  const frame = useCurrentFrame();
  const videoName = "${videoName}";
  
  // TIP: Use staticFile(\`/clones/\${videoName}/frame_0.png\`) to access extracted assets.
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', color: 'white', fontFamily: 'sans-serif' }}>
      {/* 1. Reference the Prompt directly in the UI during development */}
      <Prompt />

      {/* 2. Your Implementation Goes Here */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ padding: 40, border: '2px solid #333', borderRadius: 20, textAlign: 'center' }}>
              <h1 style={{ fontSize: 60, marginBottom: 20 }}>{title}</h1>
              <p style={{ opacity: 0.5 }}>Frame: {frame}</p>
              <div style={{ marginTop: 20, color: '#4A90E2' }}>
                  Ready for AI Replication...
              </div>
          </div>
      </AbsoluteFill>
    </AbsoluteFill>
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
