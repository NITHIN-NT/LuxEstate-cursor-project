"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { Search, SlidersHorizontal } from "lucide-react";

export default function PropertiesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState("All");

    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag === "All" || property.tag === selectedTag;
        return matchesSearch && matchesTag;
    });

    const tags = ["All", "Featured", "New", "Hot", "Luxury"];

    return (
        <div className="min-h-screen bg-neutral-900 text-white font-body overflow-x-hidden">
            <Navbar />

            {/* Header Section */}
            <section className="pt-32 pb-16 bg-gradient-to-b from-neutral-800 to-neutral-900 border-b border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 text-white capitalize">Discover Exceptional <span className="text-gradient">Estates</span></h1>
                        <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
                            Browse our curated collection of extraordinary properties across the most prestigious locations in the world.
                        </p>
                    </motion.div>

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-12 max-w-4xl mx-auto"
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                                <input
                                    type="text"
                                    placeholder="Search by city, neighborhood, or property title..."
                                    className="w-full bg-neutral-800 border border-neutral-700 text-white pl-12 pr-4 py-4 rounded-small shadow-lg focus:outline-none focus:border-secondary-400 transition-all text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                {tags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`px-6 py-4 rounded-small text-sm font-bold transition-all whitespace-nowrap shadow-lg ${selectedTag === tag
                                            ? "bg-secondary-400 text-neutral-900"
                                            : "bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-600"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Properties Grid */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <p className="text-neutral-400">Showing {filteredProperties.length} extraordinary properties</p>
                        <button className="flex items-center gap-2 text-secondary-400 font-bold hover:text-secondary-500 transition-colors">
                            <SlidersHorizontal className="w-5 h-5" /> More Filters
                        </button>
                    </div>

                    <AnimatePresence mode="popLayout">
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredProperties.map((property) => (
                                <motion.div
                                    key={property.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <PropertyCard {...property} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {filteredProperties.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 bg-neutral-800/50 rounded-large border border-dashed border-neutral-700"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="p-6 bg-neutral-800 rounded-full border border-neutral-700">
                                    <Search className="w-12 h-12 text-neutral-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No Properties Found</h3>
                            <p className="text-neutral-400">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedTag("All"); }}
                                className="mt-8 text-secondary-400 font-bold hover:underline"
                            >
                                Reset all filters
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
