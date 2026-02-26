"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureItemProps {
    icon: LucideIcon;
    title: string;
    description: string;
    color: "primary" | "secondary";
}

export default function FeatureItem({ icon: Icon, title, description, color }: FeatureItemProps) {
    const gradient = color === "secondary" ? "from-secondary-400 to-secondary-600" : "from-primary-600 to-primary-800";
    const textColor = color === "secondary" ? "text-neutral-900" : "text-white";

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-start group"
        >
            <div className="flex-shrink-0">
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 rounded-large bg-gradient-to-br ${gradient} flex items-center justify-center ${textColor} shadow-lg`}
                >
                    <Icon className="w-7 h-7" />
                </motion.div>
            </div>
            <div className="ml-5">
                <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-secondary-400 transition-colors">{title}</h3>
                <p className="text-neutral-400 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
}
