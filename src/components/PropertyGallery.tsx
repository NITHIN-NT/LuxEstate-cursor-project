"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import PropertyCard from "./PropertyCard";
import { properties } from "@/data/properties";

export default function PropertyGallery() {
    const [width, setWidth] = useState(0);
    const carousel = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (carousel.current) {
            setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
        }
    }, []);

    // Only show featured properties in the gallery
    const featuredProperties = properties.filter(p => p.tag === "Featured" || p.tag === "New" || p.tag === "Hot" || p.tag === "Luxury").slice(0, 4);

    return (
        <div className="overflow-hidden cursor-grab active:cursor-grabbing">
            <motion.div
                ref={carousel}
                drag="x"
                dragConstraints={{ right: 0, left: -width }}
                whileTap={{ cursor: "grabbing" }}
                className="flex gap-8 px-4 sm:px-0"
                style={{ width: 'max-content' }}
            >
                {featuredProperties.map((property) => (
                    <motion.div
                        key={property.id}
                        className="min-w-[350px] md:min-w-[450px]"
                    >
                        <PropertyCard {...property} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
