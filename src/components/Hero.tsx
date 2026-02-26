"use client";

import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-900 via-primary-900 to-neutral-900 animate-gradient pt-20">
            {/* Floating 3D Shapes */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [45, 50, 45]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-secondary-400/20 to-secondary-600/20 rounded-3xl blur-xl"
            />
            <motion.div
                animate={{
                    y: [0, 20, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-primary-600/20 to-primary-800/20 rounded-full blur-xl"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block mb-6 px-4 py-2 bg-secondary-500/20 border border-secondary-400/30 rounded-full text-secondary-400 text-sm font-bold uppercase tracking-wider"
                    >
                        Premium Real Estate
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
                    >
                        Discover Your <br />
                        <span className="text-gradient">Dream Space</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-neutral-300 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Experience luxury living redefined. Explore our curated collection of extraordinary properties in the world&apos;s most prestigious locations.
                    </motion.p>

                    {/* Search Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="perspective-container max-w-4xl mx-auto"
                    >
                        <div className="glass-effect p-6 md:p-8 rounded-large shadow-custom transform transition-all duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-1">
                                    <input type="text" placeholder="Location" className="w-full bg-neutral-800/50 border border-neutral-700 text-white px-4 py-3 rounded-small focus:outline-none focus:border-secondary-400 transition-all placeholder-neutral-400" />
                                </div>
                                <div className="md:col-span-1">
                                    <select className="w-full bg-neutral-800/50 border border-neutral-700 text-white px-4 py-3 rounded-small focus:outline-none focus:border-secondary-400 transition-all">
                                        <option>Property Type</option>
                                        <option>Villa</option>
                                        <option>Apartment</option>
                                        <option>Penthouse</option>
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <select className="w-full bg-neutral-800/50 border border-neutral-700 text-white px-4 py-3 rounded-small focus:outline-none focus:border-secondary-400 transition-all">
                                        <option>Price Range</option>
                                        <option>$500k - $1M</option>
                                        <option>$1M - $5M</option>
                                        <option>$5M+</option>
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full bg-gradient-to-r from-secondary-400 to-secondary-600 text-neutral-900 px-6 py-3 rounded-small font-bold flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <Search className="w-5 h-5" /> Search
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
                    >
                        {[
                            { label: "Properties", value: "1200+" },
                            { label: "Happy Clients", value: "850+" },
                            { label: "Years", value: "15" },
                            { label: "Support", value: "24/7" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="glass-effect p-6 rounded-large text-center"
                            >
                                <p className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-2">{stat.value}</p>
                                <p className="text-neutral-400 text-sm uppercase tracking-wider">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
                <ChevronDown className="text-secondary-400 w-8 h-8" />
            </motion.div>
        </section>
    );
}
