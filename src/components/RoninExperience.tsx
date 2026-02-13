import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useSpring, motion, useMotionValueEvent, MotionValue } from 'framer-motion';
import { Crosshair, Zap, Wind, Flame, Mouse } from 'lucide-react';

const FRAME_COUNT = 168;
const SCROLL_HEIGHT = '600vh';

// --- Cinematic Text Overlay Component ---
// Each element (icon, title, line, subtitle) has its own staggered scroll animation
// for a premium, ad-like sequential reveal effect.
const TextOverlay = ({ 
    start, end, title, subtitle, scrollProgress, icon: Icon, position = 'center'
}: { 
    start: number, end: number, title: string, subtitle: string,
    scrollProgress: MotionValue<number>, icon: React.ElementType,
    position?: 'center' | 'left' | 'right'
}) => {
    const duration = end - start;
    
    // Slower fade-in (6% of scroll range) and fade-out (8% of scroll range)
    // for a more cinematic, lingering feel
    const fadeIn = start + duration * 0.08;
    const holdEnd = end - duration * 0.12;

    // --- Container: overall visibility ---
    const containerOpacity = useTransform(
        scrollProgress, 
        [start, fadeIn, holdEnd, end], 
        [0, 1, 1, 0]
    );

    // --- Icon: appears first with scale-up ---
    const iconOpacity = useTransform(
        scrollProgress,
        [start, start + duration * 0.06, holdEnd - duration * 0.02, end],
        [0, 1, 1, 0]
    );
    const iconScale = useTransform(
        scrollProgress,
        [start, start + duration * 0.08],
        [0.5, 1]
    );
    const iconY = useTransform(
        scrollProgress,
        [start, start + duration * 0.08, holdEnd, end],
        [20, 0, 0, -15]
    );

    // --- Title: slides up with a gentle reveal, slightly delayed ---
    const titleOpacity = useTransform(
        scrollProgress,
        [start + duration * 0.04, start + duration * 0.14, holdEnd - duration * 0.02, end],
        [0, 1, 1, 0]
    );
    const titleY = useTransform(
        scrollProgress,
        [start + duration * 0.04, start + duration * 0.16, holdEnd, end],
        [60, 0, 0, -30]
    );

    // --- Red Line: expands from center, delayed further ---
    const lineOpacity = useTransform(
        scrollProgress,
        [start + duration * 0.12, start + duration * 0.20, holdEnd, end],
        [0, 1, 1, 0]
    );
    const lineScaleX = useTransform(
        scrollProgress,
        [start + duration * 0.12, start + duration * 0.22],
        [0, 1]
    );

    // --- Subtitle: last to appear, gentle float up ---
    const subtitleOpacity = useTransform(
        scrollProgress,
        [start + duration * 0.16, start + duration * 0.26, holdEnd, end],
        [0, 1, 1, 0]
    );
    const subtitleY = useTransform(
        scrollProgress,
        [start + duration * 0.16, start + duration * 0.28, holdEnd, end],
        [30, 0, 0, -20]
    );

    // On mobile, always center text for better readability
    const alignClass = position === 'left' 
        ? 'items-center text-center md:items-start md:text-left md:pl-20' 
        : position === 'right' 
        ? 'items-center text-center md:items-end md:text-right md:pr-20' 
        : 'items-center text-center';

    return (
        <motion.div 
            style={{ opacity: containerOpacity, willChange: 'opacity' }}
            className={`fixed inset-0 pointer-events-none z-10 flex flex-col justify-center px-4 sm:px-6 ${alignClass}`}
        >
            {/* Icon — scales in gently */}
            <motion.div 
                style={{ opacity: iconOpacity, scale: iconScale, y: iconY }}
                className="mb-3 sm:mb-5 p-2.5 sm:p-3.5 rounded-full border border-red-500/25 bg-red-900/15 inline-flex"
            >
                {/* @ts-ignore */}
                <Icon className="text-red-400 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" strokeWidth={1.2} />
            </motion.div>

            {/* Title — cinematic slide up, lighter white for elegance */}
            <motion.h2 
                style={{ opacity: titleOpacity, y: titleY }}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white/95 uppercase leading-[0.9] mb-3 sm:mb-5 tracking-tight"
                // Softer, more diffused shadow for a premium lighter feel
            >
                {title}
            </motion.h2>

            {/* Red Line — expands from center like a cinematic wipe */}
            <motion.div 
                style={{ opacity: lineOpacity, scaleX: lineScaleX, transformOrigin: position === 'right' ? 'right' : position === 'left' ? 'left' : 'center' }}
                className="h-[2px] sm:h-[3px] w-14 sm:w-20 md:w-32 bg-gradient-to-r from-red-700 via-red-500 to-red-700 mb-4 sm:mb-6"
            ></motion.div>

            {/* Subtitle — soft float up, lighter color for refined look */}
            <motion.p 
                style={{ opacity: subtitleOpacity, y: subtitleY }}
                className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300/90 font-medium tracking-[0.25em] sm:tracking-[0.3em] uppercase max-w-[85vw] sm:max-w-md md:max-w-lg lg:max-w-xl leading-relaxed"
            >
                {subtitle}
            </motion.p>
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

        // Also handle orientation change on mobile
        const handleOrientationChange = () => {
            setTimeout(resize, 100);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('orientationchange', handleOrientationChange);
        if (!isLoading) resize();
        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
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
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white px-4">
                <h1 className="text-3xl sm:text-5xl md:text-7xl tracking-wide uppercase mb-6 sm:mb-8 text-red-600">
                    TVS RONIN
                </h1>
                <div className="w-48 sm:w-72 h-1 bg-gray-800 rounded-full overflow-hidden mb-4">
                    <motion.div 
                        className="h-full bg-red-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "easeOut" }}
                    />
                </div>
                <p className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] text-gray-500 uppercase font-semibold">
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
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-[#050505]" style={{ willChange: 'auto' }} />

                {/* Dark film for text readability */}
                <div className="absolute inset-0 bg-black/25 pointer-events-none"></div>

                {/* Edge vignette */}
                <div className="absolute inset-0 pointer-events-none" 
                     style={{ boxShadow: 'inset 0 0 60px 25px rgba(0,0,0,0.7), inset 0 0 120px 50px rgba(0,0,0,0.5)' }}></div>
            </div>

            {/* ---- SCROLL INDICATOR (shows once, disappears permanently) ---- */}
            {!hasScrolled && (
                <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="mb-2 sm:mb-3"
                    >
                        <Mouse className="text-white/70 w-6 h-6 sm:w-8 sm:h-8" />
                    </motion.div>
                    <p className="text-[10px] sm:text-xs text-white/70 font-bold tracking-[0.3em] sm:tracking-[0.5em] uppercase">
                        Scroll to Ignite
                    </p>
                    <motion.div 
                        animate={{ height: [12, 40, 12], opacity: [0.2, 0.7, 0.2] }} 
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-px bg-red-500 mt-2 sm:mt-3"
                    />
                </motion.div>
            )}

            {/* ---- TEXT OVERLAYS (wider ranges = text stays visible longer) ---- */}
            <TextOverlay 
                scrollProgress={scrollYProgress} start={0.01} end={0.22} 
                title="Urban Samurai" subtitle="Precision engineered for the streets." 
                icon={Crosshair} position="center"
            />
            <TextOverlay 
                scrollProgress={scrollYProgress} start={0.26} end={0.48} 
                title="Awaken The Machine" subtitle="Ignition. Presence. Intent." 
                icon={Zap} position="left"
            />
            <TextOverlay 
                scrollProgress={scrollYProgress} start={0.52} end={0.74} 
                title="Control In Motion" subtitle="Torque meets urban agility." 
                icon={Wind} position="right"
            />
            <TextOverlay 
                scrollProgress={scrollYProgress} start={0.76} end={0.97} 
                title="Ride The Edge" subtitle="This is not transportation. This is expression." 
                icon={Flame} position="center"
            />
        </div>
    );
};

export default RoninExperience;
