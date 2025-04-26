
import { usePromoStore } from '../store/promoStore'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'

// --- Componente Principal ---
export function FilterPanel() {
  // Obtener datos y acciones del store de Zustand
  const categories = usePromoStore((state) => state.categories)
  const stores = usePromoStore((state) => state.stores)
  const filters = usePromoStore((state) => state.filters)
  const setCategoryFilter = usePromoStore((state) => state.setCategoryFilter)
  const setStoreFilter = usePromoStore((state) => state.setStoreFilter)
  const setProximityFilter = usePromoStore((state) => state.setProximityFilter)
  const clearFilters = usePromoStore((state) => state.clearFilters)

  // --- ELIMINADOS ---
  // const [distanceInput, setDistanceInput] = useState<string>(...)
  // useEffect(() => { ... }, [filters.maxDistanceKm])

  // --- Manejadores de Eventos ---

  function handleCategoryChange(event: SelectChangeEvent<string | null>) {
    const value = event.target.value
    setCategoryFilter(value === '' ? null : value)
  }

  function handleStoreChange(event: SelectChangeEvent<string | null>) {
    const value = event.target.value
    setStoreFilter(value === '' ? null : value)
  }

  // Modificado: Solo llama a la acción del store
  function handleDistanceChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const distanceNum = parseInt(value, 10)

    // Actualiza el store directamente. Si el input está vacío o no es numérico > 0, pasa null.
    setProximityFilter(
      filters.userLatitude!,
      filters.userLongitude!,
      !isNaN(distanceNum) && distanceNum > 0 ? distanceNum : null
    )
    // Ya no hay setDistanceInput
  }

  function handleClearFilters() {
    clearFilters()
    // Ya no hay estado local que limpiar
  }

  return (
    <Box sx={{ mb: 4, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Filtrar Promociones
      </Typography>
      <Stack spacing={2}>
        {/* Filtro de Categoría (sin cambios) */}
        <FormControl fullWidth size="small">
          <InputLabel id="category-filter-label">Categoría</InputLabel>
          <Select
            labelId="category-filter-label"
            id="category-filter-select"
            value={filters.categoryId ?? ''}
            label="Categoría"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">
              <em>Todas las Categorías</em>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro de Tienda (sin cambios) */}
        <FormControl fullWidth size="small">
          <InputLabel id="store-filter-label">Tienda</InputLabel>
          <Select
            labelId="store-filter-label"
            id="store-filter-select"
            value={filters.storeId ?? ''}
            label="Tienda"
            onChange={handleStoreChange}
          >
            <MenuItem value="">
              <em>Todas las Tiendas</em>
            </MenuItem>
            {stores.map((store) => (
              <MenuItem key={store.id} value={store.id}>
                {store.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro de Cercanía - Modificado */}
        <TextField
          fullWidth
          size="small"
          label="Distancia Máxima (km)"
          type="number"
          // ¡Cambio Clave! Vincular value directamente al store
          value={filters.maxDistanceKm?.toString() ?? ''}
          onChange={handleDistanceChange} // El handler solo actualiza el store
          InputProps={{
            inputProps: {
              min: 0,
            },
          }}
          helperText={
            filters.userLatitude && filters.userLongitude
              ? `Desde tu ubicación simulada (${filters.userLatitude.toFixed(
                  2
                )}, ${filters.userLongitude.toFixed(2)})`
              : 'Ubicación del usuario no definida'
          }
        />

        {/* Botón Limpiar Filtros (sin cambios en el botón mismo) */}
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<FilterListOffIcon />}
          onClick={handleClearFilters}
          disabled={!filters.categoryId && !filters.storeId && filters.maxDistanceKm === null}
        >
          Limpiar Filtros
        </Button>
      </Stack>
    </Box>
  )
}
