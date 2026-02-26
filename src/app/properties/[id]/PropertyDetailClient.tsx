"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
    Heart, Share2, MapPin, Bed, Bath, Maximize,
    ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2,
    Phone
} from "lucide-react";
import Image from "next/image";
import { PropertyWithRelations } from "@/lib/properties";

interface PropertyDetailClientProps {
    property: PropertyWithRelations;
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
    const router = useRouter();
    const [activeImage, setActiveImage] = useState(0);

    const [formData, setFormData] = useState({
        type: "Book a Private Viewing",
        name: "",
        email: "",
        phone: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const validateForm = () => {
        if (!formData.name.trim()) return "Please let us know your full name so we can address you properly.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) return "An email address is required to send you your requested information.";
        if (!emailRegex.test(formData.email)) return "That email doesn't look quite right. Please check for typos.";
        const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) return "Please enter a valid phone number (e.g. +1 555 123 4567).";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = validateForm();
        if (error) {
            setErrorMsg(error);
            return;
        }
        setErrorMsg("");
        setStatus("loading");

        try {
            const response = await fetch("/api/enquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    propertyId: property.id,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: `Request Type: ${formData.type}`,
                }),
            });

            if (!response.ok) throw new Error("Submission failed");

            setStatus("success");
            setFormData({ type: "Book a Private Viewing", name: "", email: "", phone: "" });
            setTimeout(() => setStatus("idle"), 3000);
        } catch {
            setStatus("error");
            setErrorMsg("We're having trouble submitting your request. Please try again or call us directly.");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white font-body selection:bg-secondary-400 selection:text-neutral-900">
            {/* Back Button & Top Actions */}
            <div className="pt-24 pb-6 bg-neutral-900 border-b border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Back to listings
                    </button>
                    <div className="flex gap-4">
                        <button className="p-3 bg-neutral-800 rounded-full border border-neutral-700 hover:border-secondary-400 transition-all text-neutral-300 hover:text-white shadow-lg">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-3 bg-neutral-800 rounded-full border border-neutral-700 hover:border-secondary-400 transition-all text-neutral-300 hover:text-white shadow-lg">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                        <div className="lg:col-span-2 relative rounded-large overflow-hidden shadow-2xl border border-neutral-800">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="relative w-full h-full"
                                >
                                    <Image
                                        src={property.gallery[activeImage] || property.mainImage}
                                        alt={property.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Slider Controls */}
                            {property.gallery.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setActiveImage(prev => (prev === 0 ? property.gallery.length - 1 : prev - 1))}
                                        className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-neutral-900/60 backdrop-blur-md rounded-full text-white hover:bg-neutral-900 transition-all border border-white/20"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => setActiveImage(prev => (prev === property.gallery.length - 1 ? 0 : prev + 1))}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-neutral-900/60 backdrop-blur-md rounded-full text-white hover:bg-neutral-900 transition-all border border-white/20"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}

                            {property.tag && (
                                <div className="absolute top-6 left-6 flex gap-3">
                                    <span className="bg-secondary-400 text-neutral-900 text-xs font-bold px-4 py-2 rounded-small uppercase tracking-wider shadow-lg">
                                        {property.tag}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-rows-3 gap-4 h-full">
                            {property.gallery.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-full h-full rounded-large overflow-hidden border-2 transition-all shadow-lg ${activeImage === idx ? "border-secondary-400" : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="py-12 bg-neutral-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="font-heading text-5xl font-bold text-white mb-4">{property.title}</h1>
                                    <p className="flex items-center gap-2 text-neutral-400 text-lg">
                                        <MapPin className="w-5 h-5 text-secondary-400" /> {property.location}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold mb-1">Asking Price</p>
                                    <p className="font-heading text-4xl font-bold text-gradient">{property.price}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-8 py-8 border-y border-neutral-800 mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-neutral-800 rounded-large text-secondary-400 border border-neutral-700 shadow-lg">
                                        <Bed className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-white">{property.beds}</p>
                                        <p className="text-sm text-neutral-500 uppercase tracking-wider">Bedrooms</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-neutral-800 rounded-large text-secondary-400 border border-neutral-700 shadow-lg">
                                        <Bath className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-white">{property.baths}</p>
                                        <p className="text-sm text-neutral-500 uppercase tracking-wider">Bathrooms</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-neutral-800 rounded-large text-secondary-400 border border-neutral-700 shadow-lg">
                                        <Maximize className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-white">{property.size}</p>
                                        <p className="text-sm text-neutral-500 uppercase tracking-wider">Total Area</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-16">
                                <h2 className="font-heading text-3xl font-bold text-white mb-6">About this Property</h2>
                                <p className="text-neutral-400 text-lg leading-relaxed mb-8 whitespace-pre-line">
                                    {property.description}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {property.features.map((feature, i) => (
                                        <div key={i} className="flex justify-between items-center py-4 border-b border-neutral-800">
                                            <span className="text-neutral-500 uppercase tracking-wider text-xs font-bold">{feature.label}</span>
                                            <span className="text-white font-medium">{feature.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="font-heading text-3xl font-bold text-white mb-8">Premium Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {property.amenities.map((amenity, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-neutral-800/30 rounded-large border border-neutral-800 group hover:border-secondary-400/50 transition-all shadow-md">
                                            <div className="p-2 bg-secondary-400/10 rounded-full text-secondary-400 group-hover:bg-secondary-400 group-hover:text-neutral-900 transition-all">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <span className="text-neutral-300 font-medium">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Form */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 p-10 bg-neutral-800 rounded-large border border-neutral-700 shadow-custom">
                                <h3 className="font-heading text-2xl font-bold text-white mb-8">Inquire Privately</h3>
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    {errorMsg && (
                                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-small">
                                            {errorMsg}
                                        </div>
                                    )}
                                    {status === "success" && (
                                        <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded-small flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" /> Request submitted successfully!
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Request Type</label>
                                        <select
                                            className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-4 rounded-small shadow-sm focus:outline-none focus:border-secondary-400 transition-all text-sm appearance-none cursor-pointer"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option>Book a Private Viewing</option>
                                            <option>Request Digital Brochure</option>
                                            <option>Video Walkthrough</option>
                                            <option>Financial Consultation</option>
                                        </select>
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-4 rounded-small shadow-sm focus:outline-none focus:border-secondary-400 transition-all text-sm placeholder-neutral-600"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            disabled={status === "loading"}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-4 rounded-small shadow-sm focus:outline-none focus:border-secondary-400 transition-all text-sm placeholder-neutral-600"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            disabled={status === "loading"}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-4 rounded-small shadow-sm focus:outline-none focus:border-secondary-400 transition-all text-sm placeholder-neutral-600"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            disabled={status === "loading"}
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={status === "loading"}
                                        className={`w-full text-neutral-900 font-bold py-5 rounded-small shadow-xl transition-all ${status === "loading" ? "bg-secondary-400/50 cursor-not-allowed" : "bg-gradient-to-r from-secondary-400 to-secondary-600"
                                            }`}
                                    >
                                        {status === "loading" ? "Submitting..." : "Schedule Appointment"}
                                    </motion.button>
                                </form>
                                <div className="mt-10 pt-8 border-t border-neutral-700">
                                    <p className="text-secondary-400 font-bold mb-4 flex items-center gap-2"><Phone className="w-4 h-4" /> Priority Concierge</p>
                                    <p className="text-neutral-400 text-sm leading-relaxed">
                                        Our executive consultants are available 24/7 for high-profile clients. Call <span className="text-white font-bold">+1 (555) LUX-0000</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
