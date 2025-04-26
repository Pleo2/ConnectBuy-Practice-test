import { usePromoStore, selectFilteredPromotions, initialState as promoInitialState } from './promoStore'
import { fetchPromotions, fetchCategories, fetchStores } from '../services/api'
import { Promotion, Category, Store } from '../types'

jest.mock('../services/api')

const mockCategory1: Category = { id: 'cat-1', name: 'Electrónica' }
const mockCategory2: Category = { id: 'cat-2', name: 'Moda' }
const mockStore1: Store = { id: 'store-1', name: 'Tienda A', latitude: 10, longitude: 10 }
const mockStore2: Store = { id: 'store-2', name: 'Tienda B', latitude: 10.1, longitude: 10.1 }
const mockPromo1: Promotion = { id: 'p1', title: 'Promo Elec', description: 'Desc', store: mockStore1, category: mockCategory1, imageUrl: '', isSpecial: false }
const mockPromo2: Promotion = { id: 'p2', title: 'Promo Moda', description: 'Desc', store: mockStore2, category: mockCategory2, imageUrl: '', isSpecial: false }
const mockPromo3: Promotion = { id: 'p3', title: 'Promo Elec Especial', description: 'Desc', store: mockStore1, category: mockCategory1, imageUrl: '', isSpecial: true }
const mockPromo4: Promotion = { id: 'p4', title: 'Promo Lejos', description: 'Desc', store: { id: 'store-3', name: 'Tienda C', latitude: 20, longitude: 20 }, category: mockCategory1, imageUrl: '', isSpecial: false }

const mockPromotionsData = [mockPromo1, mockPromo2, mockPromo3, mockPromo4]
const mockCategoriesData = [mockCategory1, mockCategory2]
const mockStoresData = [mockStore1, mockStore2]

const mockedFetchPromotions = fetchPromotions as jest.MockedFunction<typeof fetchPromotions>
const mockedFetchCategories = fetchCategories as jest.MockedFunction<typeof fetchCategories>
const mockedFetchStores = fetchStores as jest.MockedFunction<typeof fetchStores>

function resetApiMocks() {
  mockedFetchPromotions.mockReset()
  mockedFetchCategories.mockReset()
  mockedFetchStores.mockReset()
}

describe('promoStore', () => {
  beforeEach(() => {
    usePromoStore.setState({ ...usePromoStore.getState(), ...promoInitialState }, true)
    resetApiMocks()
    jest.clearAllMocks()
  })

  it('should have correct initial state', () => {
    const state = usePromoStore.getState()
    expect(state.allPromotions).toEqual([])
    expect(state.categories).toEqual([])
    expect(state.stores).toEqual([])
    expect(state.loadingStatus).toBe('idle')
    expect(state.error).toBeNull()
    expect(state.specialPromotionNotification).toBeNull()
    expect(state.filters.categoryId).toBeNull()
    expect(state.filters.storeId).toBeNull()
    expect(state.filters.maxDistanceKm).toBeNull()
  })

  it('fetchInitialData should update state on success', async () => {
    mockedFetchPromotions.mockResolvedValue(mockPromotionsData)
    mockedFetchCategories.mockResolvedValue(mockCategoriesData)
    mockedFetchStores.mockResolvedValue(mockStoresData)
    const { fetchInitialData } = usePromoStore.getState()
    await fetchInitialData()
    const state = usePromoStore.getState()
    expect(fetchPromotions).toHaveBeenCalledTimes(1)
    expect(fetchCategories).toHaveBeenCalledTimes(1)
    expect(fetchStores).toHaveBeenCalledTimes(1)
    expect(state.loadingStatus).toBe('succeeded')
    expect(state.allPromotions).toEqual(mockPromotionsData)
    expect(state.categories).toEqual(mockCategoriesData)
    expect(state.stores).toEqual(mockStoresData)
    expect(state.error).toBeNull()
  })

  it('fetchInitialData should update state on failure', async () => {
    mockedFetchPromotions.mockRejectedValueOnce(new Error('API Error'))
    const { fetchInitialData } = usePromoStore.getState()
    await fetchInitialData()
    const state = usePromoStore.getState()
    expect(state.loadingStatus).toBe('failed')
    expect(state.error).toBe('No se pudieron cargar los datos iniciales.')
    expect(state.allPromotions).toEqual([])
  })

  it('setCategoryFilter should update categoryId filter', () => {
    const { setCategoryFilter } = usePromoStore.getState()
    const testCategoryId = mockCategoriesData[0].id
    setCategoryFilter(testCategoryId)
    expect(usePromoStore.getState().filters.categoryId).toBe(testCategoryId)
    setCategoryFilter(null)
    expect(usePromoStore.getState().filters.categoryId).toBeNull()
  })

  it('setStoreFilter should update storeId filter', () => {
    const { setStoreFilter } = usePromoStore.getState()
    const testStoreId = mockStoresData[0].id
    setStoreFilter(testStoreId)
    expect(usePromoStore.getState().filters.storeId).toBe(testStoreId)
    setStoreFilter(null)
    expect(usePromoStore.getState().filters.storeId).toBeNull()
  })

  it('setProximityFilter should update distance and user location filters', () => {
    const { setProximityFilter } = usePromoStore.getState()
    const lat = 50
    const lon = -1
    const dist = 10
    setProximityFilter(lat, lon, dist)
    const filters = usePromoStore.getState().filters
    expect(filters.userLatitude).toBe(lat)
    expect(filters.userLongitude).toBe(lon)
    expect(filters.maxDistanceKm).toBe(dist)
    setProximityFilter(lat, lon, null)
    expect(usePromoStore.getState().filters.maxDistanceKm).toBeNull()
    expect(usePromoStore.getState().filters.userLatitude).toBe(lat)
    expect(usePromoStore.getState().filters.userLongitude).toBe(lon)
  })

  it('clearFilters should reset filters except user location', () => {
    const { setCategoryFilter, setStoreFilter, setProximityFilter, clearFilters } = usePromoStore.getState()

    const initialUserLat = usePromoStore.getState().filters.userLatitude
    const initialUserLon = usePromoStore.getState().filters.userLongitude

    setCategoryFilter('cat-1')
    setStoreFilter('store-1')
    setProximityFilter(100, -3, 20) // aqui estoy setiando el filtro de proximidad a algo diferente pero cuando se hace el clear se mantiene
    clearFilters()
    const filters = usePromoStore.getState().filters
    expect(filters.categoryId).toBeNull()
    expect(filters.storeId).toBeNull()
    expect(filters.maxDistanceKm).toBeNull()
    expect(filters.userLatitude).toBeCloseTo(initialUserLat, 1)
    expect(filters.userLongitude).toBeCloseTo(initialUserLon, 1)
  })

  describe('Filter Actions', () => {
    it('setCategoryFilter should update filters.categoryId', () => {
      const { setCategoryFilter } = usePromoStore.getState()
      setCategoryFilter('cat-1')
      expect(usePromoStore.getState().filters.categoryId).toBe('cat-1')
      setCategoryFilter(null)
      expect(usePromoStore.getState().filters.categoryId).toBeNull()
    })
  })

  describe('selectFilteredPromotions', () => {
    it('should filter promotions by filters', () => {
      usePromoStore.setState({
        ...usePromoStore.getState(),
        ...promoInitialState,
        allPromotions: mockPromotionsData,
        categories: mockCategoriesData,
        stores: mockStoresData,
        filters: { ...promoInitialState.filters, categoryId: 'cat-1', storeId: 'store-1', maxDistanceKm: null }
      }, true)
      const filtered = selectFilteredPromotions(usePromoStore.getState())
      expect(filtered.every(p => p.category.id === 'cat-1' && p.store.id === 'store-1')).toBe(true)
    })
  })

  describe('Notification Actions', () => {
    it('triggerSpecialPromotion should set notification only for special promos', () => {
      const { triggerSpecialPromotion } = usePromoStore.getState()
      const specialPromo = mockPromotionsData.find(p => p.isSpecial) as Promotion
      triggerSpecialPromotion(specialPromo)
      expect(usePromoStore.getState().specialPromotionNotification).toEqual(specialPromo)
      // Try with a non-special promo
      triggerSpecialPromotion(mockPromo1)
      expect(usePromoStore.getState().specialPromotionNotification).toEqual(specialPromo)
    })
    it('clearSpecialPromotionNotification should clear notification', () => {
      const { triggerSpecialPromotion, clearSpecialPromotionNotification } = usePromoStore.getState()
      const specialPromo = mockPromotionsData.find(p => p.isSpecial) as Promotion
      triggerSpecialPromotion(specialPromo)
      clearSpecialPromotionNotification()
      expect(usePromoStore.getState().specialPromotionNotification).toBeNull()
    })
  })
})
