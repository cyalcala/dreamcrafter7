
import { AbsoluteFill, useCurrentFrame, spring, interpolate, Img } from 'remotion';
import React from 'react';
import { z } from 'zod';

// --- SCHEMAS ---
export const AiCallsSchema = z.object({
    guyName: z.string().default('Khalid'),
    girlName: z.string().default('Jaja'),
});

// --- SUB-COMPONENTS ---

const Cloud: React.FC<{ x: number; y: number; size: number; opacity: number; speed: number }> = ({ x, y, size, opacity, speed }) => {
    const frame = useCurrentFrame();
    const drift = interpolate(frame, [0, 450], [0, speed * 150]);

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

const MessageBubble: React.FC<{ text: string; sender: 'guy' | 'girl'; startFrame: number }> = ({ text, sender, startFrame }) => {
    const frame = useCurrentFrame();
    const fps = 30;

    const progress = spring({
        frame: frame - startFrame,
        fps,
        config: { stiffness: 120, damping: 18 }
    });

    if (frame < startFrame) return null;

    const isGuy = sender === 'guy';
    const visibleChars = Math.floor(interpolate(frame, [startFrame + 5, startFrame + 40], [0, text.length], { extrapolateRight: 'clamp' }));

    return (
        <div style={{
            alignSelf: isGuy ? 'flex-end' : 'flex-start',
            backgroundColor: isGuy ? '#f43f5e' : '#f1f5f9',
            color: isGuy ? 'white' : '#1e3a8a',
            padding: '14px 24px',
            borderRadius: isGuy ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
            maxWidth: '85%',
            fontSize: '22px',
            lineHeight: '1.4',
            transform: `scale(${progress}) translateY(${(1 - progress) * 20}px)`,
            opacity: progress,
            whiteSpace: 'pre-wrap',
            boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            {text.slice(0, visibleChars)}
        </div>
    );
};

const FoodCard: React.FC<{ name: string; price: string; delay: number; imageUrl: string }> = ({ name, price, delay, imageUrl }) => {
    const frame = useCurrentFrame();
    const startFrame = 220 + delay;

    const progress = spring({
        frame: frame - startFrame,
        fps: 30,
        config: { stiffness: 200, damping: 20 }
    });

    if (frame < startFrame) return null;

    return (
        <div style={{
            width: 180,
            height: 200,
            backgroundColor: 'white',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            transform: `scale(${progress}) translateY(${(1 - progress) * 30}px)`,
            opacity: progress,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #f1f5f9'
        }}>
            <div style={{ flex: 1, position: 'relative' }}>
                <Img
                    src={imageUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>
            <div style={{ padding: '12px', backgroundColor: 'white' }}>
                <div style={{ fontWeight: '700', fontSize: 16, color: '#1e293b' }}>{name}</div>
                <div style={{ fontSize: 13, color: '#f43f5e', fontWeight: '600' }}>{price}</div>
            </div>
        </div>
    );
};

// --- MAIN COMPOSITION ---

const MESSAGES = [
    { sender: 'guy', text: "Bhie, lunch tayo later? Gutom na ako since shift ended. 🤤", delay: 20 },
    { sender: 'girl', text: "G! Pero wag na tayo mag-McDo. Suggest naman ng bago around BGC! ✨", delay: 80 },
    { sender: 'guy', text: "Sige, check ko. How about these places? San mo gusto i-date kita? 😍", delay: 150 },
];

export const AiCalls: React.FC<z.infer<typeof AiCallsSchema>> = ({ guyName, girlName }) => {
    const frame = useCurrentFrame();

    const windowSpring = spring({
        frame,
        fps: 30,
        config: { mass: 0.8, stiffness: 120, damping: 18 }
    });

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
        }}>
            {/* Decorative Pastel Clouds */}
            <Cloud x={100} y={150} size={250} opacity={0.5} speed={0.5} />
            <Cloud x={1400} y={200} size={300} opacity={0.4} speed={0.4} />
            <Cloud x={800} y={700} size={200} opacity={0.4} speed={0.6} />

            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    width: 700,
                    backgroundColor: '#ffffff',
                    borderRadius: 40,
                    boxShadow: '0 40px 100px rgba(244, 63, 94, 0.15)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transform: `scale(${windowSpring})`,
                    opacity: interpolate(frame, [0, 15], [0, 1])
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '28px 40px',
                        background: '#ffffff',
                        borderBottom: '1px solid #fff1f2',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20
                    }}>
                        <div style={{ width: 65, height: 65, borderRadius: '50%', backgroundColor: '#f43f5e', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 32 }}>👩🏽‍💻</div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 24, color: '#1e293b' }}>{girlName} ❤️</div>
                            <div style={{ fontSize: 14, color: '#f43f5e', fontWeight: 600 }}>Active 5 mins ago</div>
                        </div>
                    </div>

                    {/* Chat Body */}
                    <div style={{
                        padding: '40px',
                        height: 600,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 25,
                        overflow: 'hidden'
                    }}>
                        {MESSAGES.map((msg, i) => (
                            <MessageBubble
                                key={i}
                                text={msg.text}
                                sender={msg.sender as any}
                                startFrame={msg.delay}
                            />
                        ))}

                        {/* Food Cards Grid */}
                        <div style={{
                            display: 'flex',
                            gap: 20,
                            marginTop: 10,
                            justifyContent: 'center'
                        }}>
                            <FoodCard
                                name="Wildflour"
                                price="P800+"
                                delay={0}
                                imageUrl="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400&h=500&auto=format&fit=crop"
                            />
                            <FoodCard
                                name="Din Tai Fung"
                                price="P600+"
                                delay={15}
                                imageUrl="https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=400&h=500&auto=format&fit=crop"
                            />
                            <FoodCard
                                name="Mendokoro"
                                price="P500+"
                                delay={30}
                                imageUrl="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400&h=500&auto=format&fit=crop"
                            />
                        </div>
                    </div>

                    {/* Input Bar */}
                    <div style={{ padding: '25px 40px', backgroundColor: '#ffffff', borderTop: '1px solid #fff1f2', display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ fontSize: 28, cursor: 'pointer' }}>💖</div>
                        <div style={{ flex: 1, color: '#94a3b8', fontSize: 20, fontStyle: 'italic' }}>Thinking...</div>
                        <div style={{ width: 55, height: 55, borderRadius: '50%', backgroundColor: '#f43f5e', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 24 }}>➤</div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
