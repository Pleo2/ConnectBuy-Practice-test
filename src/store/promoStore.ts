import { create } from "zustand";
import { Promotion, Category, Store } from "../types";
import { fetchPromotions, fetchCategories, fetchStores } from "../services/api";

// --- Types for Filters ---
export interface Filters {
    categoryId: string | null; // null or '' means no filter
    storeId: string | null;
    maxDistanceKm: number | null; // null means no distance filter
    userLatitude: number | null; // Simulated user latitude
    userLongitude: number | null; // Simulated user longitude
}

// --- State Interface ---
export interface PromoState {
    allPromotions: Promotion[];
    categories: Category[];
    stores: Store[];
    filters: Filters;
    loadingStatus: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    specialPromotionNotification: Promotion | null; // For notification
}

// --- Actions Interface ---
interface PromoActions {
    fetchInitialData: () => Promise<void>;
    setCategoryFilter: (categoryId: string | null) => void;
    setStoreFilter: (storeId: string | null) => void;
    // We will simulate user location and a radius
    setProximityFilter: (
        userLat: number,
        userLon: number,
        maxDistance: number | null
    ) => void;
    clearFilters: () => void;
    // Simulation of external event (WebSocket/Reverb)
    triggerSpecialPromotion: (promotion: Promotion) => void;
    clearSpecialPromotionNotification: () => void;
}

// --- Initial State ---
export const _initialState: PromoState = {
    allPromotions: [],
    categories: [],
    stores: [],
    filters: {
        categoryId: null,
        storeId: null,
        maxDistanceKm: null,
        userLatitude: 40.4168, // Default location: Madrid Center (simulated)
        userLongitude: -3.7038
    },
    loadingStatus: "idle",
    error: null,
    specialPromotionNotification: null
};
export const initialState = _initialState;

// --- Helper to Calculate Distance (Simplified Haversine Formula) ---
// Returns distance in KM
function getDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity; // Cannot calculate

    const R = 6371; // Earth radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

// --- Store Creation ---
export const usePromoStore = create<PromoState & PromoActions>((set, get) => ({
    ..._initialState,

    // --- Actions ---
    fetchInitialData: async () => {
        if (get().loadingStatus === "loading") return; // Avoid concurrent calls
        set({ loadingStatus: "loading", error: null });
        try {
            // Run calls in parallel for efficiency
            const [promotions, categories, stores] = await Promise.all([
                fetchPromotions(),
                fetchCategories(),
                fetchStores()
            ]);
            set({
                allPromotions: promotions,
                categories: categories,
                stores: stores,
                loadingStatus: "succeeded"
            });
        } catch (err) {
            console.error("Failed to fetch initial data:", err);
            set({
                loadingStatus: "failed",
                error: "No se pudieron cargar los datos iniciales.",
            });
        }
    },

    setCategoryFilter: (categoryId) => {
        set((state) => ({
            filters: { ...state.filters, categoryId: categoryId || null }
        }));
    },

    setStoreFilter: (storeId) => {
        set((state) => ({
            filters: { ...state.filters, storeId: storeId || null }
        }));
    },

    setProximityFilter: (userLat, userLon, maxDistance) => {
        set((state) => ({
            filters: {
                ...state.filters,
                userLatitude: userLat,
                userLongitude: userLon,
                maxDistanceKm: maxDistance
            }
        }));
    },

    clearFilters: () => {
        set(() => ({
            filters: { ..._initialState.filters }
        }));
    },

    triggerSpecialPromotion: (promotion) => {
        // Only trigger if it is really special and not already notified
        if (
            promotion.isSpecial &&
            get().specialPromotionNotification?.id !== promotion.id
        ) {
            set({ specialPromotionNotification: promotion });
        }
    },

    clearSpecialPromotionNotification: () => {
        set({ specialPromotionNotification: null });
    }
}));

// --- Selectors (Functions outside create) ---
// Selector to get filtered promotions
// This will recalculate every time relevant state (promotions or filters) changes
export function selectFilteredPromotions(state: PromoState): Promotion[] {
    const { allPromotions, filters } = state;

    return allPromotions.filter((promo) => {
        // Filter by category
        if (filters.categoryId && promo.category.id !== filters.categoryId)
            return false;

        // Filter by store
        if (filters.storeId && promo.store.id !== filters.storeId) return false;

        // Filter by proximity
        if (
            filters.maxDistanceKm !== null &&
            filters.userLatitude !== null &&
            filters.userLongitude !== null &&
            promo.store.latitude !== undefined && // Ensure store has lat/lon
            promo.store.longitude !== undefined
        ) {
            const distance = getDistanceKm(
                filters.userLatitude,
                filters.userLongitude,
                promo.store.latitude,
                promo.store.longitude
            );
            if (distance > filters.maxDistanceKm) return false;
        }

        // If it passes all filters, include it
        return true;
    });
}

// You can add more selectors if needed, for example, to get
// only the categories or stores that have active promotions.

