
import { AbsoluteFill, useCurrentFrame, Img, staticFile } from 'remotion';
import React from 'react';
import { z } from 'zod';

// Schema for dynamic props
export const Travel77Schema = z.object({
    title: z.string(),
});

export const Travel77: React.FC<z.infer<typeof Travel77Schema>> = ({ title }) => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ color: 'white', fontSize: 100 }}>DEBUG MODE</h1>
            <p style={{ color: 'white', fontSize: 50 }}>Title: {title}</p>
            <p style={{ color: 'white' }}>Frame: {frame}</p>
        </AbsoluteFill>
    );
};
