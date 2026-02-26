"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Building2 } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Properties", href: "/properties" },
        { name: "About", href: "#about" },
        { name: "Contact", href: "#contact" },
    ];

    return (
        <nav
            className="fixed top-0 w-full z-50 transition-all duration-300 py-4 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-700/50 shadow-2xl"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white rounded-lg shadow-lg transform rotate-12">
                            <Building2 className="w-6 h-6 transform -rotate-12" />
                        </div>
                        <span className="font-heading text-2xl font-bold text-white tracking-tight">
                            LUX<span className="text-gradient">ESTATE</span>
                        </span>
                    </motion.div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link, i) => (
                            <Link key={link.name} href={link.href}>
                                <motion.span
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-neutral-300 hover:text-white font-medium text-sm transition-colors relative group cursor-pointer"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary-400 transition-all group-hover:w-full" />
                                </motion.span>
                            </Link>
                        ))}
                        <motion.a
                            href="#contact"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2.5 text-sm font-bold rounded-small text-neutral-900 bg-gradient-to-r from-secondary-400 to-secondary-500 hover:from-secondary-500 hover:to-secondary-600 transition-all shadow-lg"
                        >
                            Get Started
                        </motion.a>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white p-2"
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-effect border-b border-neutral-700/50 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-3 py-3 text-neutral-300 hover:text-white font-medium border-l-4 border-transparent hover:border-secondary-400 transition-all"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/#contact"
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full text-center px-6 py-3 mt-4 text-sm font-bold rounded-small text-neutral-900 bg-gradient-to-r from-secondary-400 to-secondary-500"
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
