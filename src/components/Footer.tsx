import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white py-8 sm:py-12 border-t border-gray-900">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 sm:gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-red-600 mb-1 sm:mb-2">TVS RONIN</h3>
                        <p className="text-gray-500 text-xs sm:text-sm tracking-widest uppercase">Live the Unscripted Life</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
                        <a href="#" className="hover:text-red-500 transition-colors">Specifications</a>
                        <a href="#" className="hover:text-red-500 transition-colors">Gallery</a>
                        <a href="#" className="hover:text-red-500 transition-colors">Accessories</a>
                        <a href="#" className="hover:text-red-500 transition-colors">Support</a>
                    </div>

                    <div className="text-center md:text-right text-gray-600 text-[10px] sm:text-xs">
                        <p>&copy; {new Date().getFullYear()} TVS Motor Company. All rights reserved.</p>
                        <p className="mt-1">Designed for the Modern Urbanite.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
