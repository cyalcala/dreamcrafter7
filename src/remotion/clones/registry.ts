import { Asia9 } from './Asia9/Composition';
import { Japan7 } from './Japan7/Composition';
import { AiCalls } from './AiCalls/Composition';
import { BpoWork } from './BpoWork/Composition';
import { Manila } from './Manila/Composition';
import React from 'react';
import { Travel77 } from './Travel77/Composition';
import { Asia8 } from './Asia8/Composition';
import { CatTech } from './CatTech/Composition';
import { Asia8Schema } from './Asia8/Composition';


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
        id: 'AiCalls',
        component: AiCalls,
        durationInFrames: 450,
        fps: 30,
        width: 1920,
        height: 1080,
        defaultProps: {
            guyName: 'Khalid',
            girlName: 'Jaja',
        }
    },
    {
        id: 'BpoWork',
        component: BpoWork,
        durationInFrames: 180,
        fps: 30,
        width: 1920,
        height: 1080,
        defaultProps: {
            assistantName: 'BPO Careers Assistant',
            assistantStatus: 'Online',
            userQuestion: 'Where can I apply for BPO work in Manila? 🇵🇭',
            aiResponse: 'Manila is the BPO capital of the world! ✨\nTop hubs to explore:\n\n• Makati - The original business hub\n• BGC - Modern & upscale district\n• Quezon City - Major IT parks',
        }
    },
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
    },
    {
        id: 'Manila',
        component: Manila,
        durationInFrames: 600,
        fps: 30,
        width: 1280,
        height: 720,
        defaultProps: {
            title: 'BPO Work Manila'
        }
    },
    {
        id: 'Japan7',
        component: Japan7,
        durationInFrames: 450,
        fps: 30,
        width: 1920,
        height: 1080,
        defaultProps: {
            title: 'ANSAYA!',
            subtitle: 'ANSAYA!'
        }
    },
    {
        id: 'CatTech',
        component: CatTech,
        durationInFrames: 300,
        fps: 30,
        width: 1920,
        height: 1080,
    },
    {
        id: 'Asia8',
        component: Asia8,
        durationInFrames: 690,
        fps: 30,
        width: 654,
        height: 782,
        defaultProps: {
            title: 'ANSAYA!',
        }
    },
    {
        id: 'Asia9',
        component: Asia9,
        durationInFrames: 300,
        fps: 30,
        width: 654,
        height: 782,
        defaultProps: {
            title: 'Asia9'
        }
    },
];
