import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useSpring, motion, useMotionValueEvent, MotionValue } from 'framer-motion';
import { Crosshair, Zap, Wind, Flame, Mouse } from 'lucide-react';

const FRAME_COUNT = 168;
const SCROLL_HEIGHT = '500vh';

// --- Text Overlay Component (Optimized — no blur, no heavy shadows) ---
const TextOverlay = ({ 
    start, end, title, subtitle, scrollProgress, icon: Icon, position = 'center'
}: { 
    start: number, end: number, title: string, subtitle: string,
    scrollProgress: MotionValue<number>, icon: React.ElementType,
    position?: 'center' | 'left' | 'right'
}) => {
    const fadeIn = start + 0.03;
    const fadeOut = end - 0.03;

    const opacity = useTransform(scrollProgress, [start, fadeIn, fadeOut, end], [0, 1, 1, 0]);
    const yVal = useTransform(scrollProgress, [start, fadeIn, fadeOut, end], [40, 0, 0, -40]);

    const alignClass = position === 'left' 
        ? 'items-start text-left pl-8 md:pl-20' 
        : position === 'right' 
        ? 'items-end text-right pr-8 md:pr-20' 
        : 'items-center text-center';

    return (
        <motion.div 
            style={{ opacity, y: yVal, willChange: 'transform, opacity' }}
            className={`fixed inset-0 pointer-events-none z-10 flex flex-col justify-center px-6 ${alignClass}`}
        >
            {/* Icon */}
            <div className="mb-5 p-3 rounded-full border border-red-500/30 bg-red-900/20 inline-flex">
                {/* @ts-ignore */}
                <Icon size={32} className="text-red-500" strokeWidth={1.5} />
            </div>

            {/* Title — uses Montserrat via CSS */}
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase leading-[0.9] mb-4 tracking-tight"
                style={{ textShadow: '0 4px 40px rgba(0,0,0,0.95), 0 0 80px rgba(0,0,0,0.6)' }}>
                {title}
            </h2>

            {/* Red Line */}
            <div className="h-1 w-16 md:w-28 bg-red-600 mb-5"></div>

            {/* Subtitle — uses Inter via CSS */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-semibold tracking-widest uppercase max-w-2xl leading-relaxed"
               style={{ textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}>
                {subtitle}
            </p>
        </motion.div>
    );
};

// --- Main Component ---
const RoninExperience: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [hasScrolled, setHasScrolled] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Track if user has ever scrolled (one-time hide for indicator)
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest > 0.01 && !hasScrolled) {
            setHasScrolled(true);
        }
    });

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises = [];

            for (let i = 0; i < FRAME_COUNT; i++) {
                const promise = new Promise<void>((resolve) => {
                    const img = new Image();
                    img.src = `/sequence/frame_${i}.jpg`;
                    img.onload = () => { loadedImages[i] = img; resolve(); };
                    img.onerror = () => resolve();
                });
                promises.push(promise);
            }

            let loadedCount = 0;
            promises.forEach(p => p.then(() => {
                loadedCount++;
                setProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
            }));

            await Promise.all(promises);
            setImages(loadedImages);
            setIsLoading(false);
        };
        loadImages();
    }, []);

    // Draw frame on scroll — uses logical size (no DPR in draw math)
    useMotionValueEvent(smoothProgress, "change", (latest) => {
        if (!canvasRef.current || images.length === 0) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(latest * (FRAME_COUNT - 1)));
        const img = images[frameIndex];
        if (!img) return;

        const w = window.innerWidth;
        const h = window.innerHeight;
        const scale = Math.max(w / img.width, h / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = (w - dw) / 2;
        const dy = (h - dh) / 2;

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, dx, dy, dw, dh);
    });

    // Canvas resize
    useEffect(() => {
        const resize = () => {
            if (!canvasRef.current) return;
            const dpr = window.devicePixelRatio || 1;
            const w = window.innerWidth;
            const h = window.innerHeight;

            canvasRef.current.width = w * dpr;
            canvasRef.current.height = h * dpr;
            canvasRef.current.style.width = `${w}px`;
            canvasRef.current.style.height = `${h}px`;

            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;
            ctx.scale(dpr, dpr);

            // Redraw current frame
            const latest = smoothProgress.get();
            const idx = Math.min(FRAME_COUNT - 1, Math.floor(latest * (FRAME_COUNT - 1)));
            if (images[idx]) {
                const img = images[idx];
                const scale = Math.max(w / img.width, h / img.height);
                const dw = img.width * scale;
                const dh = img.height * scale;
                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
            }
        };

        window.addEventListener('resize', resize);
        if (!isLoading) resize();
        return () => window.removeEventListener('resize', resize);
    }, [isLoading, images, smoothProgress]);

    // Force initial draw
    useEffect(() => {
        if (!isLoading && images.length > 0) {
            window.dispatchEvent(new Event('resize'));
        }
    }, [isLoading, images]);

    // --- Loading ---
    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white">
                <h1 className="text-5xl md:text-7xl tracking-wide uppercase mb-8 text-red-600">
                    TVS RONIN
                </h1>
                <div className="w-72 h-1 bg-gray-800 rounded-full overflow-hidden mb-4">
                    <motion.div 
                        className="h-full bg-red-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "easeOut" }}
                    />
                </div>
                <p className="text-xs tracking-[0.4em] text-gray-500 uppercase font-semibold">
                    Loading Experience — {progress}%
                </p>
            </div>
        );
    }

    // --- Main ---
    return (
        <div ref={containerRef} className="relative bg-[#050505]" style={{ height: SCROLL_HEIGHT }}>
            {/* Sticky Canvas */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 bg-[#050505]" style={{ willChange: 'auto' }} />

                {/* Dark film for text readability */}
                <div className="absolute inset-0 bg-black/35 pointer-events-none"></div>

                {/* Edge vignette */}
                <div className="absolute inset-0 pointer-events-none" 
                     style={{ boxShadow: 'inset 0 0 120px 50px rgba(0,0,0,0.7)' }}></div>
            </div>

            {/* ---- SCROLL INDICATOR (shows once, disappears permanently) ---- */}
            {!hasScrolled && (
                <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="mb-3"
                    >
                        <Mouse size={32} className="text-white/70" />
                    </motion.div>
                    <p className="text-xs text-white/70 font-bold tracking-[0.5em] uppercase">
                        Scroll to Ignite
                    </p>
                    <motion.div 
                        animate={{ height: [12, 40, 12], opacity: [0.2, 0.7, 0.2] }} 
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-px bg-red-500 mt-3"
                    />
                </motion.div>
            )}

            {/* ---- TEXT OVERLAYS ---- */}
            <TextOverlay 
                scrollProgress={scrollYProgress} start={0.02} end={0.20} 
                title="Urban Samurai" subtitle="Precision engineered for the streets." 
                icon={Crosshair} position="center"
            />
            <TextOverlay 
                scrollProgress={scrollYProgress} start={0.25} end={0.45} 
                title="Awaken The Machine" subtitle="Ignition. Presence. Intent." 
                icon={Zap} position="left"
            />
            <TextOverlay 
                scrollProgress={scrollYProgress} start={0.50} end={0.70} 
                title="Control In Motion" subtitle="Torque meets urban agility." 
                icon={Wind} position="right"
            />
            <TextOverlay 
                scrollProgress={scrollYProgress} start={0.78} end={0.96} 
                title="Ride The Edge" subtitle="This is not transportation. This is expression." 
                icon={Flame} position="center"
            />
        </div>
    );
};

export default RoninExperience;
