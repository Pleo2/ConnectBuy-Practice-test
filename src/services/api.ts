import { Promotion, Store, Category } from "../types";

const mockCategories: Category[] = [
    { id: "cat-1", name: "Electrónica" },
    { id: "cat-2", name: "Moda" },
    { id: "cat-1", name: "Electrónica" },
    { id: "cat-2", name: "Moda" },
    { id: "cat-3", name: "Hogar" },
    { id: "cat-4", name: "Alimentación" }
];

const mockStores: Store[] = [
    {
        id: "store-1",
        name: "Tienda Tech",
        latitude: 40.4168,
        longitude: -3.7038
    },
    {
        id: "store-2",
        name: "Moda Express",
        latitude: 40.453,
        longitude: -3.6883
    },
    {
        id: "store-3",
        name: "Hogar Ideal",
        latitude: 40.3885,
        longitude: -3.7158
    },
    {
        id: "store-4",
        name: "Super Descuento",
        latitude: 40.4168,
        longitude: -3.7038
    },
    {
        id: "store-5",
        name: "Ganga Gadgets",
        latitude: 41.3851,
        longitude: 2.1734
    }
];

const mockPromotions: Promotion[] = [
    {
        id: "promo-1",
        title: "50% en Smart TVs",
        description: "Renueva tu salón con la última tecnología",
        store: mockStores[0],
        category: mockCategories[0],
        imageUrl:
            "https://nuweapp.com/media/catalog/product/1/2/12000010729_tv-65_ltk-k65b53g_4k_led_gtv_kenwood_2.jpg?auto=webp&format=pjpg&width=640&height=800&fit=cover",
        discountPercentage: 50,
        validUntil: "2024-12-31T23:59:59Z",
        isSpecial: false
    },
    {
        id: "promo-2",
        title: "Jeans a 20€",
        description: "Colección de verano ya disponible",
        store: mockStores[1],
        category: mockCategories[1],
        imageUrl:
            "https://www.zevadenim.com/wp-content/uploads/2024/05/El-Origen-y-Evolucion-de-los-Pantalones-Vaqueros-Jeans.webp",
        discountCode: "VERANOJEANS",
        isSpecial: false
    },
    {
        id: "promo-3",
        title: "Todo para tu cocina",
        description: "Ofertas en pequeño electrodoméstico",
        store: mockStores[2],
        category: mockCategories[2],
        imageUrl:
            "https://e6oe5g5k44d.exactdn.com/wp-content/uploads/2021/04/electrodomesticos-cocina.jpg?strip=all&lossy=1&ssl=1",
        discountPercentage: 15,
        isSpecial: false
    },
    {
        id: "promo-4",
        title: "Oferta Flash: Portátil X",
        description: "¡Solo hoy! Unidades limitadas.",
        store: mockStores[4],
        category: mockCategories[0],
        imageUrl:
            "https://cdsassets.apple.com/live/SZLF0YNV/images/sp/111901_mbp16-gray.png",
        discountPercentage: 30,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        isSpecial: true
    },
    {
        id: "promo-5",
        title: "2x1 en Camisetas",
        description: "Combina como quieras",
        store: mockStores[1],
        category: mockCategories[1],
        imageUrl:
            "https://content-management-files.canva.com/cdn-cgi/image/f=auto,q=70/bc99bf75-9b20-4368-a522-312fa502bae7/01_Fitsstyles_608X456.png",
        isSpecial: false
    },
    {
        id: "promo-6",
        title: "Compra semanal Ahorro",
        description: "Productos básicos al mejor precio",
        store: mockStores[3],
        category: mockCategories[3],
        imageUrl:
            "https://enraizaderechos.org/wp-content/uploads/2024/01/Indice-de-precios-de-los-alimentos.jpg",
        isSpecial: false
    },
    {
        id: "promo-7",
        title: "Gadget Increíble",
        description: "Un gadget que no sabías que necesitabas",
        store: mockStores[0],
        category: mockCategories[0],
        imageUrl:
            "https://www.apple.com/es/apple-watch-se/images/overview/hero/hero__gk2727ue87qm_large.jpg",
        discountCode: "GADGETNOW",
        isSpecial: false
    }
];

// --- Simulated API Functions ---

const API_LATENCY = 500;

export function fetchPromotions(): Promise<Promotion[]> {
    console.log("API Call: fetchPromotions (simulated)");
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockPromotions]);
        }, API_LATENCY);
    });
}

export function fetchCategories(): Promise<Category[]> {
    console.log("API Call: fetchCategories (simulated)");
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockCategories]);
        }, API_LATENCY / 2);
    });
}

export function fetchStores(): Promise<Store[]> {
    console.log("API Call: fetchStores (simulated)");
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockStores]);
        }, API_LATENCY / 2);
    });
}

// Note: In a real API, you would probably have an endpoint that returns
// the promotions already filtered, or at least the available categories and stores
// so you don't always have to request them separately. Here we separate them for clarity.
