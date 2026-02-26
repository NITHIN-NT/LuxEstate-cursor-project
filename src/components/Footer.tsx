"use client";

import { motion } from "framer-motion";
import { Building2, Facebook, Instagram, Linkedin, Send, LucideIcon } from "lucide-react";

export default function Footer() {
    const footerLinks = {
        "Quick Links": [
            { label: "Home", href: "#" },
            { label: "Properties", href: "#properties" },
            { label: "About Us", href: "#about" },
            { label: "Contact", href: "#contact" },
        ],
        "Property Types": [
            { label: "Luxury Villas", href: "#" },
            { label: "Penthouses", href: "#" },
            { label: "Estates", href: "#" },
            { label: "Apartments", href: "#" },
        ]
    };

    return (
        <footer className="bg-neutral-900 border-t border-neutral-800 pt-16 pb-8 font-body">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white rounded-lg shadow-lg transform rotate-12">
                                <Building2 className="w-6 h-6 transform -rotate-12" />
                            </div>
                            <span className="font-heading text-2xl font-bold text-white tracking-tight">
                                LUX<span className="text-gradient">ESTATE</span>
                            </span>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                            Redefining luxury real estate with unparalleled service and exclusive properties worldwide.
                        </p>
                        <div className="flex space-x-4">
                            <SocialLink icon={Facebook} />
                            <SocialLink icon={Instagram} />
                            <SocialLink icon={Linkedin} />
                        </div>
                    </motion.div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links], idx) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <h4 className="font-heading text-lg font-bold mb-6 text-white">{title}</h4>
                            <ul className="space-y-3 text-sm text-neutral-400">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="hover:text-secondary-400 transition-colors inline-block">{link.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    {/* Newsletter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h4 className="font-heading text-lg font-bold mb-6 text-white">Newsletter</h4>
                        <p className="text-neutral-400 text-sm mb-4">Get exclusive listings delivered to your inbox.</p>
                        <div className="flex flex-col gap-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-4 py-3 rounded-small focus:outline-none focus:border-secondary-400 text-sm placeholder-neutral-500 transition-all"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-gradient-to-r from-secondary-400 to-secondary-600 text-neutral-900 px-4 py-3 rounded-small font-bold hover:from-secondary-500 hover:to-secondary-700 transition-all text-sm flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" /> Subscribe
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500 font-body">
                    <p>© 2024 LuxEstate. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon: Icon }: { icon: LucideIcon }) {
    return (
        <motion.a
            href="#"
            whileHover={{ scale: 1.1, y: -2 }}
            className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-secondary-400 transition-all"
        >
            <Icon className="w-5 h-5" />
        </motion.a>
    );
}
