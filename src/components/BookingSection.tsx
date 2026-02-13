import React from 'react';
import { motion } from 'framer-motion';

const BookingSection: React.FC = () => {
    return (
        <section className="py-16 sm:py-24 md:py-32 bg-red-950/20 relative overflow-hidden">
            {/* Background Texture/Image placeholder */}
            <div className="absolute inset-0 bg-[#050505] opacity-90 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 z-0"></div>
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto border border-red-900/50 bg-black/50 backdrop-blur-sm p-6 sm:p-10 md:p-16 lg:p-20"
                >
                    <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter text-white mb-4 sm:mb-6">
                        Unscripted <br/> <span className="text-red-600">Ownership</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-light mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
                        The streets are waiting. Claim your territory with the TVS Ronin today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
                        <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-red-600 text-white text-sm sm:text-base md:text-lg font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                            Book Now
                        </button>
                        <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 border border-white text-white text-sm sm:text-base md:text-lg font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                            Book Test Ride
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BookingSection;
