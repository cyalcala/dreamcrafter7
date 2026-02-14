
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, Img } from 'remotion';
import React, { useMemo } from 'react';
import { z } from 'zod';
import { Prompt } from './Prompt';

// --- SCHEMAS ---
export const BpoWorkSchema = z.object({
    assistantName: z.string().default('BPO Careers Assistant'),
    assistantStatus: z.string().default('Online'),
    userQuestion: z.string().default("Where can I apply for BPO work in Manila? 🇵🇭"),
    aiResponse: z.string().default("Manila is the BPO capital of the world! ✨\nTop hubs to explore:\n\n• Makati - The original business hub\n• BGC - Modern & upscale district\n• Quezon City - Major IT parks"),
    primaryBlue: z.string().default('#4A90E2'),
});

// --- SUB-COMPONENTS ---

const Cloud: React.FC<{ x: number; y: number; size: number; opacity: number; speed: number }> = ({ x, y, size, opacity, speed }) => {
    const frame = useCurrentFrame();
    const drift = interpolate(frame, [0, 180], [0, speed * 50]);

    return (
        <div style={{
            position: 'absolute',
            left: x + drift,
            top: y,
            width: size,
            opacity,
            color: 'white'
        }}>
            <svg viewBox="0 0 200 100">
                <path d="M25,60 Q25,25 50,25 Q75,15 90,25 Q110,10 130,25 Q155,20 170,40 Q180,60 160,75 Q140,85 100,80 Q60,85 40,75 Q20,70 25,60 Z" fill="currentColor" />
            </svg>
        </div>
    );
};

const MessageBubble: React.FC<{ text: string; sender: 'user' | 'ai'; startFrame: number }> = ({ text, sender, startFrame }) => {
    const frame = useCurrentFrame();
    const fps = 30;

    const progress = spring({
        frame: frame - startFrame,
        fps,
        config: { stiffness: 120, damping: 18 }
    });

    if (frame < startFrame) return null;

    const isUser = sender === 'user';
    const visibleChars = Math.floor(interpolate(frame, [startFrame + 5, startFrame + 30], [0, text.length], { extrapolateRight: 'clamp' }));

    return (
        <div style={{
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            backgroundColor: isUser ? '#E9ECEF' : '#EBF5FF',
            color: '#2C3E50',
            padding: '12px 16px',
            borderRadius: '16px',
            maxWidth: '85%',
            fontSize: '18px',
            lineHeight: '1.5',
            transform: `scale(${progress}) translateY(${(1 - progress) * 15}px)`,
            opacity: progress,
            whiteSpace: 'pre-wrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            fontFamily: 'sans-serif'
        }}>
            {text.slice(0, visibleChars)}
        </div>
    );
};

const BpoCard: React.FC<{ name: string; info: string; delay: number; imageUrl: string }> = ({ name, info, delay, imageUrl }) => {
    const frame = useCurrentFrame();
    const startFrame = 120 + delay;

    const progress = spring({
        frame: frame - startFrame,
        fps: 30,
        config: { stiffness: 200, damping: 20 }
    });

    if (frame < startFrame) return null;

    return (
        <div style={{
            width: 160,
            height: 140,
            backgroundColor: 'white',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: `scale(${progress}) translateY(${(1 - progress) * 30}px)`,
            opacity: progress,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ flex: 1, backgroundColor: '#f1f5f9', position: 'relative' }}>
                <Img
                    src={imageUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute'
                    }}
                />
            </div>
            <div style={{ padding: 10, backgroundColor: 'white', position: 'relative', zIndex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: 13, color: '#2C3E50' }}>{name}</div>
                <div style={{ fontSize: 11, color: '#6C757D' }}>{info}</div>
            </div>
        </div>
    );
};

// --- MAIN COMPOSITION ---

export const BpoWork: React.FC<z.infer<typeof BpoWorkSchema>> = (props) => {
    const { assistantName, assistantStatus, userQuestion, aiResponse } = props;
    const frame = useCurrentFrame();

    const windowSpring = spring({
        frame,
        fps: 30,
        config: { mass: 0.8, stiffness: 120, damping: 18 }
    });

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%)',
        }}>
            {/* Background Clouds */}
            <Cloud x={100} y={150} size={180} opacity={0.6} speed={1} />
            <Cloud x={300} y={250} size={120} opacity={0.8} speed={1.5} />
            <Cloud x={1000} y={180} size={200} opacity={0.5} speed={0.8} />
            <Cloud x={1500} y={400} size={150} opacity={0.7} speed={1.2} />

            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    width: 580,
                    backgroundColor: '#F8F9FA',
                    borderRadius: 24,
                    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transform: `scale(${windowSpring})`,
                    opacity: interpolate(frame, [0, 15], [0, 1])
                }}>
                    {/* Header */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #eee'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ fontSize: 24 }}>🤖</div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 16, color: '#2C3E50' }}>{assistantName}</div>
                                <div style={{ fontSize: 12, color: '#6C757D' }}>{assistantStatus}</div>
                            </div>
                        </div>
                        <div style={{ fontSize: 20 }}>📞</div>
                    </div>

                    {/* Chat Body */}
                    <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <MessageBubble text={userQuestion} sender="user" startFrame={20} />
                        <MessageBubble text={aiResponse} sender="ai" startFrame={60} />

                        {/* Card Grid */}
                        <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                            <BpoCard
                                name="Accenture"
                                info="Makati & BGC"
                                delay={0}
                                imageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=300&auto=format&fit=crop"
                            />
                            <BpoCard
                                name="Concentrix"
                                info="QC & Taguig"
                                delay={12}
                                imageUrl="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&h=300&auto=format&fit=crop"
                            />
                            <BpoCard
                                name="Teleperformance"
                                info="Manila Wide"
                                delay={24}
                                imageUrl="https://images.unsplash.com/photo-1570126618953-d437176e8c79?q=80&w=400&h=300&auto=format&fit=crop"
                            />
                        </div>
                    </div>

                    {/* Input Bar */}
                    <div style={{ padding: '15px 20px', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ fontSize: 20 }}>😊</div>
                        <div style={{ flex: 1, color: '#ADB5BD', fontSize: 14 }}>Type a message...</div>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#4A90E2', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>➤</div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
