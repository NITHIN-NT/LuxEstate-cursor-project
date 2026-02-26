"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Plus, X, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface PropertyData {
    id?: string;
    title: string;
    description: string;
    price: string | number;
    location: string;
    beds: string | number;
    baths: string | number;
    size: string;
    tag?: string | null;
    mainImage: string;
    amenities?: string[];
    gallery?: string[];
}

interface PropertyFormProps {
    initialData?: PropertyData;
    isEditing?: boolean;
}

export default function PropertyForm({ initialData, isEditing }: PropertyFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        price: initialData?.price || "",
        location: initialData?.location || "",
        beds: initialData?.beds || "",
        baths: initialData?.baths || "",
        size: initialData?.size || "",
        tag: initialData?.tag || "",
        mainImage: initialData?.mainImage || "",
    });

    const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || []);
    const [newAmenity, setNewAmenity] = useState("");
    const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);

    const handleAddAmenity = () => {
        const trimmed = newAmenity.trim();
        if (trimmed && !amenities.includes(trimmed)) {
            setAmenities([...amenities, trimmed]);
            setNewAmenity("");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "mainImage" | "gallery") => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const uploadFormData = new FormData();
        Array.from(files).forEach((file) => uploadFormData.append("files", file));

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            });

            const data = await res.json();
            if (res.ok) {
                if (field === "mainImage") {
                    setFormData({ ...formData, mainImage: data.urls[0] });
                } else {
                    setGallery([...gallery, ...data.urls]);
                }
            } else {
                alert(data.error || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("An error occurred during upload");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const url = isEditing ? `/api/properties/${initialData?.id}` : "/api/properties";
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                body: JSON.stringify({
                    ...formData,
                    amenities,
                    gallery,
                }),
            });

            if (res.ok) {
                router.push("/admin/properties");
                router.refresh();
            } else {
                alert(`Failed to ${isEditing ? "update" : "create"} property`);
            }
        } catch {
            alert(`Error ${isEditing ? "updating" : "creating"} property`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl pb-20">
            <header className="flex items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/properties">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {isEditing ? "Edit Property" : "Add New Property"}
                        </h1>
                    </div>
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {isEditing ? "Save Changes" : "Create Property"}
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="title">Property Title</Label>
                                <Input
                                    id="title"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Modern Villa"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    required
                                    rows={5}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Property description..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="500000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="City, State"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Features & Amenities</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="beds">Beds</Label>
                                    <Input
                                        id="beds"
                                        type="number"
                                        value={formData.beds}
                                        onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="baths">Baths</Label>
                                    <Input
                                        id="baths"
                                        type="number"
                                        value={formData.baths}
                                        onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="size">Sqft</Label>
                                    <Input
                                        id="size"
                                        value={formData.size}
                                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                        placeholder="2,500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Amenities</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newAmenity}
                                        onChange={(e) => setNewAmenity(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddAmenity();
                                            }
                                        }}
                                        placeholder="Add amenity (e.g. Pool)"
                                    />
                                    <Button type="button" variant="secondary" onClick={handleAddAmenity}>
                                        <Plus className="w-5 h-5" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {amenities.map((item, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-sm flex items-center gap-2 font-medium"
                                        >
                                            {item}
                                            <button type="button" onClick={() => setAmenities(amenities.filter((_, idx) => idx !== i))} className="hover:text-red-500 transition-colors">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Main Image</Label>
                                <div
                                    className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group"
                                    onClick={() => document.getElementById("main-image-input")?.click()}
                                >
                                    <input
                                        type="file"
                                        id="main-image-input"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, "mainImage")}
                                    />
                                    {formData.mainImage ? (
                                        <div className="aspect-[4/3] relative rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                            <Image src={formData.mainImage} fill className="object-cover" alt="Main preview" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Upload className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            {uploading ? (
                                                <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-2" />
                                            ) : (
                                                <Upload className="w-8 h-8 text-slate-300 mb-2" />
                                            )}
                                            <p className="text-sm font-medium text-slate-500">Click to upload main image</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Gallery Images</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {gallery.map((url, i) => (
                                        <div
                                            key={i}
                                            className="aspect-square relative rounded-lg overflow-hidden border border-slate-200 shadow-sm group"
                                        >
                                            <Image src={url} fill className="object-cover" alt="Gallery" />
                                            <button
                                                type="button"
                                                onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                                                className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById("gallery-input")?.click()}
                                        className="aspect-square border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600"
                                    >
                                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-6 h-6" />}
                                        <input
                                            type="file"
                                            id="gallery-input"
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, "gallery")}
                                        />
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>Label / Badge</Label>
                                <Select
                                    value={formData.tag || "none"}
                                    onValueChange={(value) => setFormData({ ...formData, tag: value === "none" ? "" : value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a badge" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="Featured">Featured</SelectItem>
                                        <SelectItem value="New">New</SelectItem>
                                        <SelectItem value="Sold">Sold</SelectItem>
                                        <SelectItem value="Under Offer">Under Offer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
