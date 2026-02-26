"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Edit2, Trash2, MapPin, BedDouble, Bath, Maximize, Building2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Property {
    id: string;
    title: string;
    price: number | string;
    location: string;
    beds: number;
    baths: number;
    size: string;
    tag?: string | null;
    mainImage: string;
}

interface PropertyGridProps {
    properties: Property[];
}

export default function PropertiesGrid({ properties }: PropertyGridProps) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/properties/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("Failed to delete property");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while deleting");
        } finally {
            setDeletingId(null);
        }
    };

    if (properties.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 bg-white border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 shadow-sm"
            >
                <Building2 className="w-12 h-12 mb-4 text-slate-300" />
                <p className="font-medium">No properties found. Start by adding a listing!</p>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
                <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="h-full"
                >
                    <Card className="h-full flex flex-col overflow-hidden group hover:border-slate-300 hover:shadow-md transition-all">
                        <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 border-b border-slate-100">
                            <Image
                                src={property.mainImage}
                                alt={property.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            <div className="absolute top-4 left-4">
                                <Badge
                                    variant={property.tag === "Featured" ? "default" : "secondary"}
                                    className={cn(
                                        "shadow-sm",
                                        property.tag === "Featured" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : "bg-white/90 backdrop-blur-sm"
                                    )}
                                >
                                    {property.tag || "Standard"}
                                </Badge>
                            </div>
                        </div>

                        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-1">{property.title}</h3>
                                <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">{property.location}</span>
                                </div>
                            </div>
                            <span className="text-blue-600 font-bold whitespace-nowrap">${Number(property.price).toLocaleString()}</span>
                        </CardHeader>

                        <CardContent className="flex-1">
                            <div className="flex items-center justify-between py-4 border-y border-slate-100/80 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <BedDouble className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">{property.beds} <span className="text-slate-400">Beds</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Bath className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">{property.baths} <span className="text-slate-400">Baths</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Maximize className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">{property.size} <span className="text-slate-400">Sqft</span></span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex items-center gap-3 pt-0">
                            <Button variant="outline" className="flex-1" asChild>
                                <Link href={`/admin/properties/edit/${property.id}`}>
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit
                                </Link>
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDelete(property.id)}
                                disabled={deletingId === property.id}
                            >
                                {deletingId === property.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
