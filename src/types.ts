
export interface Store {
    id: string
    name: string
    // Podríamos añadir ubicación (lat, lon) para la cercanía simulada
    latitude?: number
    longitude?: number
  }

  export interface Category {
    id: string
    name: string
  }

  export interface Promotion {
    id: string
    title: string
    description: string
    store: Store // Relación con la tienda
    category: Category // Relación con la categoría
    imageUrl: string // URL de una imagen para la promo
    discountPercentage?: number // Opcional: % de descuento
    discountCode?: string // Opcional: Código de descuento
    validUntil?: string // Opcional: Fecha de validez (ISO string)
    isSpecial?: boolean // Para la notificación "en tiempo real"
  }
