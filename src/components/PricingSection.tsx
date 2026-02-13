import React from 'react';
import { motion } from 'framer-motion';

const variants = [
    {
        name: "Single Tone",
        price: "₹ 1,49,000*",
        color: "bg-gray-800",
        features: ["Single Channel ABS", "Urban Mode", "Rain Mode", "LED Headlamp"]
    },
    {
        name: "Dual Tone",
        price: "₹ 1,56,700*",
        color: "bg-red-900",
        features: ["Dual Channel ABS", "Golden USD Forks", "All LED Lamps", "SmartXonnect"]
    },
    {
        name: "Triple Tone",
        price: "₹ 1,68,750*",
        color: "bg-yellow-600",
        features: ["Tri-Color Graphics", "Adjustable Levers", "Diamond Cut Alloys", "Voice Assist"]
    }
];

const PricingSection: React.FC = () => {
    return (
        <section className="py-12 sm:py-16 md:py-24 bg-[#080808] text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 sm:mb-12 md:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-3 sm:mb-4 text-white">
                        Choose Your <span className="text-red-600">Ronin</span>
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base md:text-lg tracking-widest uppercase">Select your defining style</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {variants.map((variant, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-[#111] border border-gray-800 p-5 sm:p-6 md:p-8 hover:border-red-600 transition-colors duration-300 group relative"
                        >
                            <div className={`absolute top-0 left-0 w-full h-1 ${variant.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                            <h3 className="text-xl sm:text-2xl font-bold uppercase mb-1 sm:mb-2">{variant.name}</h3>
                            <p className="text-2xl sm:text-3xl font-black text-red-500 mb-4 sm:mb-6">{variant.price}</p>
                            
                            <ul className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
                                {variant.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-gray-400 text-xs sm:text-sm">
                                        <div className="w-1.5 h-1.5 bg-red-600 mr-3 rounded-full flex-shrink-0"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-3 sm:py-4 border border-gray-600 text-white text-sm sm:text-base uppercase tracking-widest hover:bg-white hover:text-black transition-all hover:font-bold">
                                View Details
                            </button>
                        </motion.div>
                    ))}
                </div>
                <p className="text-center text-[10px] sm:text-xs text-gray-600 mt-8 sm:mt-12">*Ex-showroom price. Prices may vary by state.</p>
            </div>
        </section>
    );
};

export default PricingSection;
