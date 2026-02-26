"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Bed, Bath, Maximize } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PropertyCardProps {
    id: string;
    mainImage: string;
    title: string;
    price: string;
    location: string;
    beds: number | string;
    baths: number | string;
    size: string;
    tag: string | null;
    tagColor?: "primary" | "secondary" | string | null;
}

export default function PropertyCard({
    id, mainImage, title, price, location, beds, baths, size, tag, tagColor = "secondary"
}: PropertyCardProps) {
    const gradient = tagColor === "secondary" ? "from-secondary-400 to-secondary-600" : "from-primary-600 to-primary-800";
    const textColor = tagColor === "secondary" ? "text-neutral-900" : "text-white";

    return (
        <Link href={`/properties/${id}`} className="block">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -12 }}
                className="card-3d bg-neutral-800 rounded-large overflow-hidden shadow-custom hover:shadow-custom-hover border border-neutral-700"
            >
                <div className="relative h-72 overflow-hidden group">
                    <div className="absolute top-4 left-4 z-10">
                        <span className={`bg-gradient-to-r ${gradient} ${textColor} text-xs font-bold px-4 py-2 rounded-small uppercase tracking-wider shadow-lg`}>
                            {tag}
                        </span>
                    </div>
                    <div className="absolute top-4 right-4 z-10">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 bg-white/90 backdrop-blur-sm text-primary-800 rounded-full flex items-center justify-center shadow-lg transition-colors hover:bg-white"
                        >
                            <Heart className="w-5 h-5" />
                        </motion.button>
                    </div>
                    <Image
                        src={mainImage}
                        alt={title}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-heading text-2xl font-bold text-white">{title}</h3>
                        <p className="font-heading text-2xl font-bold text-gradient">{price}</p>
                    </div>
                    <p className="text-neutral-400 text-sm mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-secondary-400" /> {location}
                    </p>
                    <div className="flex items-center justify-between border-t border-neutral-700 pt-4 text-sm text-neutral-300">
                        <span className="flex items-center gap-2"><Bed className="w-4 h-4 text-secondary-400" /> {beds} Beds</span>
                        <span className="flex items-center gap-2"><Bath className="w-4 h-4 text-secondary-400" /> {baths} Baths</span>
                        <span className="flex items-center gap-2"><Maximize className="w-4 h-4 text-secondary-400" /> {size}</span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-6 bg-gradient-to-r from-primary-700 to-primary-800 text-white py-3 rounded-small font-bold shadow-lg hover:from-primary-600 hover:to-primary-700 transition-all font-body"
                    >
                        View Details
                    </motion.button>
                </div>
            </motion.div>
        </Link>
    );
}
