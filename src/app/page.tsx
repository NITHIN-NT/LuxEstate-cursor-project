import { getProperties } from "@/lib/properties";
import HomeClient from "./HomeClient";
import { Suspense } from "react";

export default async function Home() {
  const properties = await getProperties();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary-400"></div>
      </div>
    }>
      <HomeClient properties={properties} />
    </Suspense>
  );
}
