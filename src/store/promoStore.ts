import { create } from 'zustand'
import { Promotion, Category, Store } from '../types'
import { fetchPromotions, fetchCategories, fetchStores } from '../services/api'

// --- Tipos para los Filtros ---
export interface Filters {
  categoryId: string | null // null o '' significa sin filtro
  storeId: string | null
  maxDistanceKm: number | null // null significa sin filtro de distancia
  userLatitude: number | null // Latitud simulada del usuario
  userLongitude: number | null // Longitud simulada del usuario
}

// --- Interfaz del Estado ---
export interface PromoState {
  allPromotions: Promotion[]
  categories: Category[]
  stores: Store[]
  filters: Filters
  loadingStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  specialPromotionNotification: Promotion | null // Para la notificación
}

// --- Interfaz de las Acciones ---
interface PromoActions {
  fetchInitialData: () => Promise<void>
  setCategoryFilter: (categoryId: string | null) => void
  setStoreFilter: (storeId: string | null) => void
  // Simularemos la ubicación del usuario y un radio
  setProximityFilter: (
    userLat: number,
    userLon: number,
    maxDistance: number | null
  ) => void
  clearFilters: () => void
  // Simulación de evento externo (WebSocket/Reverb)
  triggerSpecialPromotion: (promotion: Promotion) => void
  clearSpecialPromotionNotification: () => void
}

// --- Estado Inicial ---
const initialState: PromoState = {
  allPromotions: [],
  categories: [],
  stores: [],
  filters: {
    categoryId: null,
    storeId: null,
    maxDistanceKm: null,
    userLatitude: 40.4168, // Ubicación por defecto: Madrid Centro (simulada)
    userLongitude: -3.7038,
  },
  loadingStatus: 'idle',
  error: null,
  specialPromotionNotification: null,
}

// --- Helper para Calcular Distancia (Fórmula Haversine simplificada) ---
// Devuelve distancia en KM
function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity // No se puede calcular

  const R = 6371 // Radio de la Tierra en km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distancia en km
  return d
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

// --- Creación del Store ---
export const usePromoStore = create<PromoState & PromoActions>((set, get) => ({
  ...initialState,

  // --- Acciones ---
  fetchInitialData: async () => {
    if (get().loadingStatus === 'loading') return // Evitar llamadas concurrentes
    set({ loadingStatus: 'loading', error: null })
    try {
      // Ejecutar llamadas en paralelo para eficiencia
      const [promotions, categories, stores] = await Promise.all([
        fetchPromotions(),
        fetchCategories(),
        fetchStores(),
      ])
      set({
        allPromotions: promotions,
        categories: categories,
        stores: stores,
        loadingStatus: 'succeeded',
      })
    } catch (err) {
      console.error('Failed to fetch initial data:', err)
      set({
        loadingStatus: 'failed',
        error: 'No se pudieron cargar los datos iniciales.',
      })
    }
  },

  setCategoryFilter: (categoryId) => {
    set((state) => ({
      filters: { ...state.filters, categoryId: categoryId || null },
    }))
  },

  setStoreFilter: (storeId) => {
    set((state) => ({
      filters: { ...state.filters, storeId: storeId || null },
    }))
  },

  setProximityFilter: (userLat, userLon, maxDistance) => {
    set((state) => ({
      filters: {
        ...state.filters,
        userLatitude: userLat,
        userLongitude: userLon,
        maxDistanceKm: maxDistance,
      },
    }))
  },

  clearFilters: () => {
    set((state) => ({
      filters: {
        ...initialState.filters, // Resetear a los valores por defecto
        userLatitude: state.filters.userLatitude, // Mantener la ubicación del usuario
        userLongitude: state.filters.userLongitude,
      },
    }))
  },

  triggerSpecialPromotion: (promotion) => {
    // Solo activar si es realmente especial y no está ya notificada
    if (promotion.isSpecial && get().specialPromotionNotification?.id !== promotion.id) {
        set({ specialPromotionNotification: promotion })
    }
  },

  clearSpecialPromotionNotification: () => {
    set({ specialPromotionNotification: null })
  },

}))

// --- Selectores (Funciones fuera del create) ---
// Selector para obtener las promociones filtradas
// Esto se recalculará cada vez que cambie el estado relevante (promotions o filters)
export function selectFilteredPromotions(state: PromoState): Promotion[] {
  const { allPromotions, filters } = state

  return allPromotions.filter((promo) => {
    // Filtro por categoría
    if (filters.categoryId && promo.category.id !== filters.categoryId)
      return false

    // Filtro por tienda
    if (filters.storeId && promo.store.id !== filters.storeId) return false

    // Filtro por cercanía
    if (
      filters.maxDistanceKm !== null &&
      filters.userLatitude !== null &&
      filters.userLongitude !== null &&
      promo.store.latitude !== undefined && // Asegurarse que la tienda tiene lat/lon
      promo.store.longitude !== undefined
    ) {
      const distance = getDistanceKm(
        filters.userLatitude,
        filters.userLongitude,
        promo.store.latitude,
        promo.store.longitude
      )
      if (distance > filters.maxDistanceKm) return false
    }

    // Si pasa todos los filtros, se incluye
    return true
  })
}

// Puedes añadir más selectores si los necesitas, por ejemplo, para obtener
// solo las categorías o tiendas que tienen promociones activas.
