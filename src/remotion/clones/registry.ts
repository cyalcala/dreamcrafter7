import React from 'react';
import { Travel77 } from './Travel77/Composition';

export type ClonedComposition = {
    id: string;
    component: React.ComponentType<any>;
    durationInFrames: number;
    fps: number;
    width: number;
    height: number;
    defaultProps?: any;
};

// This array will be populated by the CodeGenerator when new videos are processed.
// Initially empty.
export const ClonedCompositions: ClonedComposition[] = [
    {
        id: 'Travel77',
        component: Travel77,
        durationInFrames: 300,
        fps: 30,
        width: 1920,
        height: 1080,
        defaultProps: {
            title: 'BPO Work'
        }
    }
];
