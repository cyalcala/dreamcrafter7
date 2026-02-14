import React from 'react';
import { Composition, Folder } from 'remotion';
import { ClonedCompositions } from './clones/registry';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Folder name="Cloned Projects">
                {ClonedCompositions.map((comp) => (
                    <Composition
                        key={comp.id}
                        id={comp.id}
                        component={comp.component}
                        durationInFrames={comp.durationInFrames}
                        fps={comp.fps}
                        width={comp.width}
                        height={comp.height}
                        defaultProps={comp.defaultProps}
                    />
                ))}
            </Folder>
            <Composition
                id="Empty"
                component={() => <div style={{ flex: 1, textAlign: 'center', paddingTop: 100, color: 'white' }}>Waiting for input video...</div>}
                durationInFrames={30 * 5}
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="SystemCheck"
                component={() => <div style={{ flex: 1, backgroundColor: 'green', color: 'white', fontSize: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>SYSTEM IS ALIVE</div>}
                durationInFrames={300}
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};
