import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProperties } from "@/lib/properties";
import PropertiesClient from "./PropertiesClient";

export default async function PropertiesPage() {
    const properties = await getProperties();

    return (
        <div className="min-h-screen bg-neutral-900 text-white font-body overflow-x-hidden">
            <Navbar />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary-400"></div></div>}>
                <PropertiesClient properties={properties} />
            </Suspense>
            <Footer />
        </div>
    );
}
