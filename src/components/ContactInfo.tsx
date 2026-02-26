"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ContactInfoProps {
    icon: LucideIcon;
    label: string;
    value: string;
    color: "primary" | "secondary";
}

export default function ContactInfo({ icon: Icon, label, value, color }: ContactInfoProps) {
    const gradient = color === "secondary" ? "from-secondary-400 to-secondary-600" : "from-primary-600 to-primary-800";
    const textColor = color === "secondary" ? "text-neutral-900" : "text-white";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center group"
        >
            <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-14 h-14 rounded-large bg-gradient-to-br ${gradient} flex items-center justify-center ${textColor} shadow-lg transition-transform`}
            >
                <Icon className="w-6 h-6" />
            </motion.div>
            <div className="ml-5">
                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="font-bold text-white text-lg group-hover:text-secondary-400 transition-colors">{value}</p>
            </div>
        </motion.div>
    );
}
