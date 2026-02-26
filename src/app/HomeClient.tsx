"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyGallery from "@/components/PropertyGallery";
import FeatureItem from "@/components/FeatureItem";
import ContactInfo from "@/components/ContactInfo";
import Footer from "@/components/Footer";
import { Crown, ShieldCheck, Sparkles, Phone, Mail, MapPin, ArrowRight, Star, ChevronDown } from "lucide-react";
import Image from "next/image";
import { PropertyWithRelations } from "@/lib/properties";

interface HomeClientProps {
    properties: PropertyWithRelations[];
}

export default function HomeClient({ properties }: HomeClientProps) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        type: "Buying a Luxury Property",
        message: "",
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
        if (!formData.message.trim()) return "Please provide a brief message about your requirements.";
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
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: `Interested In: ${formData.type}\n\n${formData.message}`,
                }),
            });

            if (!response.ok) throw new Error("Submission failed");

            setStatus("success");
            setFormData({ name: "", phone: "", email: "", type: "Buying a Luxury Property", message: "" });
            setTimeout(() => setStatus("idle"), 3000);
        } catch {
            setStatus("error");
            setErrorMsg("We're having trouble submitting your request. Please try again or call us directly.");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white font-body selection:bg-secondary-400 selection:text-neutral-900 overflow-x-hidden">
            <Navbar />
            <Hero />

            {/* Featured Properties Section */}
            <section id="properties" className="py-24 bg-neutral-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary-400/50 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-secondary-400 font-bold uppercase tracking-wider text-sm mb-4 block">Exclusive Collection</span>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Featured Properties</h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto">Handpicked luxury estates that redefine modern living</p>
                    </motion.div>

                    <PropertyGallery properties={properties} />

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mt-16"
                    >
                        <motion.a
                            href="#"
                            whileHover={{ x: 5 }}
                            className="inline-flex items-center text-secondary-400 font-bold hover:text-secondary-500 transition-colors group text-lg"
                        >
                            Explore All Properties
                            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
                        </motion.a>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-gradient-to-b from-neutral-900 to-neutral-800 relative overflow-hidden">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative perspective-container"
                        >
                            <div className="relative transform transition-all duration-500">
                                <div className="relative h-[600px] w-full rounded-large overflow-hidden border border-neutral-700 shadow-custom">
                                    <Image
                                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"
                                        alt="Luxury Interior"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-secondary-400/20 to-secondary-600/20 rounded-large -z-10"></div>
                            </div>

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="absolute -top-10 -left-10 glass-effect p-8 rounded-large shadow-custom max-w-xs hidden xl:block"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="flex text-secondary-400 gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-current" />)}
                                    </div>
                                    <span className="ml-3 text-white font-bold text-2xl">4.9</span>
                                </div>
                                <p className="text-neutral-300 font-medium">Rated by 850+ satisfied high-profile clients</p>
                            </motion.div>
                        </motion.div>

                        <div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-secondary-400 font-bold uppercase tracking-wider text-sm mb-4 block"
                            >
                                Why Choose Us
                            </motion.span>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
                            >
                                Redefining the Luxury <br /> <span className="text-gradient">Real Estate Experience</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-neutral-300 mb-10 leading-relaxed text-lg"
                            >
                                We don&apos;t just sell properties—we curate extraordinary living experiences. With over 15 years of expertise in luxury real estate, we understand that your home is a reflection of your success and aspirations.
                            </motion.p>

                            <div className="space-y-8">
                                <FeatureItem icon={Crown} title="Exclusive Access" description="Unlock off-market listings and exclusive properties before they hit the public market." color="secondary" />
                                <FeatureItem icon={ShieldCheck} title="Trusted Expertise" description="Our seasoned agents bring decades of combined experience in luxury property transactions." color="primary" />
                                <FeatureItem icon={Sparkles} title="White-Glove Service" description="From first viewing to final closing, experience unparalleled personalized service." color="secondary" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-neutral-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary-400/50 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-secondary-400 font-bold uppercase tracking-wider text-sm mb-4 block">Get In Touch</span>
                            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">Let&apos;s Find Your Dream Property</h2>
                            <p className="text-neutral-300 mb-12 text-lg leading-relaxed">
                                Ready to take the next step? Our luxury real estate specialists are standing by to help you discover the perfect property that matches your vision and lifestyle.
                            </p>

                            <div className="space-y-8">
                                <ContactInfo icon={Phone} label="Call Us" value="+1 (555) 123-4567" color="secondary" />
                                <ContactInfo icon={Mail} label="Email Us" value="luxury@luxestate.com" color="primary" />
                                <ContactInfo icon={MapPin} label="Visit Us" value="123 Luxury Lane, Beverly Hills" color="secondary" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="perspective-container"
                        >
                            <div className="bg-neutral-800 p-8 md:p-10 rounded-large shadow-custom border border-neutral-700">
                                <h3 className="font-heading text-2xl font-bold text-white mb-8">Request a Confidential Callback</h3>
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    {errorMsg && (
                                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-small">
                                            {errorMsg}
                                        </div>
                                    )}
                                    {status === "success" && (
                                        <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded-small flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4" /> Request submitted successfully!
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-400 mb-2 font-body">Full Name</label>
                                            <input
                                                type="text"
                                                className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3.5 rounded-small focus:outline-none focus:border-secondary-400 transition-all placeholder-neutral-500"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                disabled={status === "loading"}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-400 mb-2 font-body">Phone Number</label>
                                            <input
                                                type="tel"
                                                className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3.5 rounded-small focus:outline-none focus:border-secondary-400 transition-all placeholder-neutral-500"
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                disabled={status === "loading"}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-2 font-body">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3.5 rounded-small focus:outline-none focus:border-secondary-400 transition-all placeholder-neutral-500"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            disabled={status === "loading"}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-2 font-body">I&apos;m Interested In</label>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3.5 rounded-small focus:outline-none focus:border-secondary-400 transition-all appearance-none cursor-pointer"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option>Buying a Luxury Property</option>
                                                <option>Selling a Luxury Property</option>
                                                <option>Exclusive Rental</option>
                                                <option>Investment Portfolio</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-2 font-body">Message</label>
                                        <textarea
                                            rows={4}
                                            className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3.5 rounded-small focus:outline-none focus:border-secondary-400 transition-all placeholder-neutral-500 resize-none"
                                            placeholder="Tell us about your requirements..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            disabled={status === "loading"}
                                        ></textarea>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={status === "loading"}
                                        className={`w-full text-neutral-900 font-bold py-4.5 px-6 rounded-small shadow-lg transition-all text-lg ${status === "loading" ? "bg-secondary-400/50 cursor-not-allowed" : "bg-gradient-to-r from-secondary-400 to-secondary-600"
                                            }`}
                                    >
                                        {status === "loading" ? "Submitting..." : "Submit Request"}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
