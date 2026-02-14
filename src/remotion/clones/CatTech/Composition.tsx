
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import React from 'react';

const CatFace: React.FC<{ color: string }> = ({ color }) => {
    const frame = useCurrentFrame();

    // Head bop & rotation
    const bop = Math.sin(frame / 5) * 15;
    const tilt = Math.sin(frame / 8) * 10;

    // Eye blink
    const blink = Math.sin(frame / 20) > 0.9 ? 0.1 : 1;

    return (
        <div style={{
            position: 'relative',
            width: 200,
            height: 180,
            transform: `translateY(${bop}px) rotate(${tilt}deg)`,
            transformStyle: 'preserve-3d'
        }}>
            {/* Ears */}
            <div style={{ position: 'absolute', top: -40, left: 10, width: 0, height: 0, borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: `60px solid ${color}`, transform: 'rotate(-20deg)' }} />
            <div style={{ position: 'absolute', top: -40, right: 10, width: 0, height: 0, borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: `60px solid ${color}`, transform: 'rotate(20deg)' }} />

            {/* Face Base */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: color,
                borderRadius: '50% 50% 40% 40%',
                border: '8px solid #2D1E12',
                boxShadow: '15px 15px 0px #2D1E12'
            }} />

            {/* Eyes */}
            <div style={{ position: 'absolute', top: '35%', left: '20%', width: 40, height: 40 * blink, backgroundColor: '#2D1E12', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: '35%', right: '20%', width: 40, height: 40 * blink, backgroundColor: '#2D1E12', borderRadius: '50%' }} />

            {/* Nose */}
            <div style={{ position: 'absolute', top: '60%', left: '50%', width: 20, height: 15, backgroundColor: '#FF8DA1', borderRadius: '50%', transform: 'translateX(-50%)' }} />

            {/* Whiskers */}
            <div style={{ position: 'absolute', top: '65%', left: -20, width: 50, height: 4, backgroundColor: '#2D1E12', transform: 'rotate(10deg)' }} />
            <div style={{ position: 'absolute', top: '75%', left: -20, width: 50, height: 4, backgroundColor: '#2D1E12', transform: 'rotate(0deg)' }} />
            <div style={{ position: 'absolute', top: '65%', right: -20, width: 50, height: 4, backgroundColor: '#2D1E12', transform: 'rotate(-10deg)' }} />
            <div style={{ position: 'absolute', top: '75%', right: -20, width: 50, height: 4, backgroundColor: '#2D1E12', transform: 'rotate(0deg)' }} />
        </div>
    );
};

const TechFloatingIcon: React.FC<{ type: 'code' | 'atom' | 'wifi' | 'bolt'; x: number; y: number; delay: number }> = ({ type, x, y, delay }) => {
    const frame = useCurrentFrame();
    const float = Math.sin((frame - delay) / 10) * 30;
    const rotate = (frame - delay) * 2;

    const content = {
        code: '</>',
        atom: '⚛️',
        wifi: '📶',
        bolt: '⚡'
    }[type];

    return (
        <div style={{
            position: 'absolute',
            left: x,
            top: y + float,
            fontSize: 60,
            fontWeight: 900,
            color: '#F2AD4E',
            textShadow: '5px 5px 0px #2D1E12',
            transform: `rotate(${rotate}deg)`,
            zIndex: 10
        }}>
            {content}
        </div>
    );
};

export const CatTech: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    // Background pulse
    const bgScale = 1 + Math.sin(frame / 15) * 0.05;

    return (
        <AbsoluteFill style={{ backgroundColor: '#E85A23', overflow: 'hidden' }}>
            {/* Rotating Sunburst Background */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'repeating-conic-gradient(#E85A23 0deg 30deg, #F2AD4E 30deg 60deg)',
                transform: `rotate(${frame * 0.5}deg) scale(${bgScale})`,
                opacity: 0.6
            }} />

            {/* Grid Overlay */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundImage: 'radial-gradient(#2D1E12 2px, transparent 2px)',
                backgroundSize: '40px 40px',
                opacity: 0.1
            }} />

            {/* Floating Tech Elements */}
            <TechFloatingIcon type="code" x={200} y={200} delay={0} />
            <TechFloatingIcon type="atom" x={1500} y={300} delay={10} />
            <TechFloatingIcon type="wifi" x={300} y={800} delay={20} />
            <TechFloatingIcon type="bolt" x={1600} y={750} delay={30} />

            {/* Main Content */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* The Dancing Cat */}
                <div style={{ transform: `scale(${1.2 + Math.sin(frame / 5) * 0.1})` }}>
                    <CatFace color="#F9E7D0" />
                </div>

                {/* Floating "TECH" title */}
                <div style={{
                    marginTop: 60,
                    fontSize: 150,
                    fontWeight: 900,
                    color: 'white',
                    fontFamily: 'Arial Black',
                    textShadow: '15px 15px 0px #2D1E12',
                    letterSpacing: 10,
                    transform: `rotate(${Math.sin(frame / 10) * 5}deg)`
                }}>
                    CAT TECH
                </div>
            </div>

            {/* Bottom Ticker/Status Bar */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: 80,
                backgroundColor: '#2D1E12',
                display: 'flex',
                alignItems: 'center',
                padding: '0 40px',
                color: '#F2AD4E',
                fontSize: 30,
                fontWeight: 900,
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>
                <div style={{
                    display: 'flex',
                    transform: `translateX(${(frame % 600) * -5}px)`
                }}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} style={{ marginRight: 100 }}>
                            SYSTEM READY... DOWNLOADING CATNIP.EXE... CONNECTING TO CLOUD... PURR-FORMANCE OPTIMIZED...
                        </span>
                    ))}
                </div>
            </div>
        </AbsoluteFill>
    );
};
