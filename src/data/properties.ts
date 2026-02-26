export interface Property {
    id: string;
    image: string;
    gallery: string[];
    title: string;
    price: string;
    location: string;
    beds: string;
    baths: string;
    size: string;
    tag: string;
    tagColor?: "primary" | "secondary";
    description: string;
    amenities: string[];
    features: { label: string; value: string }[];
}

export const properties: Property[] = [
    {
        id: "skyline-villa",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?ixlib=rb-4.0.3"
        ],
        title: "Skyline Villa",
        price: "$2,400,000",
        location: "Beverly Hills, California",
        beds: "4",
        baths: "3",
        size: "3,200 sqft",
        tag: "Featured",
        description: "Experience unparalleled luxury in this masterfully designed Skyline Villa. Perched atop the prestigious hills of Beverly, this architectural gem offers breathtaking panoramic views of the city skyline and the Pacific Ocean. Featuring an open-concept design with floor-to-ceiling windows, a private infinity pool, and a state-of-the-art home theater.",
        amenities: ["Infinity Pool", "Home Theater", "Wine Cellar", "Smart Home System", "Gym", "Outdoor Kitchen"],
        features: [
            { label: "Year Built", value: "2023" },
            { label: "Lot Size", value: "0.5 Acres" },
            { label: "Property Type", value: "Single Family" }
        ]
    },
    {
        id: "urban-penthouse",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?ixlib=rb-4.0.3"
        ],
        title: "Urban Penthouse",
        price: "$1,850,000",
        location: "Manhattan, New York",
        beds: "2",
        baths: "2",
        size: "1,800 sqft",
        tag: "New",
        tagColor: "primary",
        description: "Modern sophistication meets city convenience in this stunning Manhattan penthouse. Located in the heart of the city, this residence features industrial-chic aesthetics with exposed brick, high-end stainless steel appliances, and a private rooftop terrace with unobstructed views of the Empire State Building.",
        amenities: ["Rooftop Terrace", "Doorman", "Elevator", "Private Storage", "Pet Friendly"],
        features: [
            { label: "Neighborhood", value: "Chelsea" },
            { label: "HOA Fees", value: "$1,200/mo" },
            { label: "Floor", value: "42nd" }
        ]
    },
    {
        id: "coastal-estate",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?ixlib=rb-4.0.3"
        ],
        title: "Coastal Estate",
        price: "$3,200,000",
        location: "Malibu, California",
        beds: "5",
        baths: "4",
        size: "4,500 sqft",
        tag: "Hot",
        description: "A sanctuary of peace and privacy, this Malibu Coastal Estate sits directly on the sand. The sound of crashing waves provides a constant soundtrack to this serene property. With expansive decks, a chef's kitchen, and a master suite that opens directly to the ocean breeze, it's the ultimate beach-lover's dream.",
        amenities: ["Beach Access", "Guest House", "Gated Community", "Spa", "3-Car Garage"],
        features: [
            { label: "Waterfront", value: "Yes" },
            { label: "Renovated", value: "2022" },
            { label: "Style", value: "Mediterranean" }
        ]
    },
    {
        id: "modern-sanctuary",
        image: "https://images.unsplash.com/photo-1600566752355-35792bed65ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1600566752355-35792bed65ee?ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?ixlib=rb-4.0.3"
        ],
        title: "Modern Sanctuary",
        price: "$4,500,000",
        location: "Aspen, Colorado",
        beds: "6",
        baths: "5",
        size: "5,800 sqft",
        tag: "Luxury",
        description: "This architectural masterpiece in Aspen offers a unique blend of modern design and mountain warmth. Surrounded by towering pines and offering ski-in/ski-out access, the home features a dramatic three-story stone fireplace, custom wood craftsmanship throughout, and a heated outdoor patio for year-round entertaining.",
        amenities: ["Ski-in/Ski-out", "Sauna", "Heated Floors", "Massage Room", "Library", "Chef's Kitchen"],
        features: [
            { label: "Views", value: "Mountain Ranges" },
            { label: "Heating", value: "Geothermal" },
            { label: "Parking", value: "5-Car Heated Garage" }
        ]
    }
];
