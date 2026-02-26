import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPropertyById } from "@/lib/properties";
import PropertyDetailClient from "./PropertyDetailClient";
import Link from "next/link";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-white gap-4">
            <h1 className="text-3xl font-bold">Property Not Found</h1>
            <Link href="/properties" className="text-secondary-400 hover:underline">Return to Properties</Link>
        </div>
    );

    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-neutral-900"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary-400"></div></div>}>
                <PropertyDetailClient property={property} />
            </Suspense>
            <Footer />
        </>
    );
}
