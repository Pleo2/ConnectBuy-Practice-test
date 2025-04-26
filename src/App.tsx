// src/App.tsx
import React, { useEffect, useMemo } from 'react'
// Importa el store y el selector por separado
import { usePromoStore, selectFilteredPromotions, PromoState } from './store/promoStore'
import { FilterPanel } from './components/FilterPanel'
import { PromotionsList } from './components/PromotionsList'
import { NotificationAlert } from './components/NotificationAlert'

// MUI Imports (sin cambios)
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// Theme (sin cambios)
const theme = createTheme({})

// --- Hook Personalizado para seleccionar el estado de la App ---
// Separar selectores para evitar renders innecesarios y loops
function useAppPromoState() {
    const fetchInitialData = usePromoStore((state) => state.fetchInitialData);
    const loadingStatus = usePromoStore((state) => state.loadingStatus);
    const error = usePromoStore((state) => state.error);
    const allPromotions = usePromoStore((state) => state.allPromotions);
    const filters = usePromoStore((state) => state.filters);
    const triggerSpecialPromotion = usePromoStore((state) => state.triggerSpecialPromotion);

    // Memoize filteredPromotions to avoid infinite render loop
    const filteredPromotions = useMemo(
        () => selectFilteredPromotions({ allPromotions, filters } as PromoState),
        [allPromotions, filters]
    );

    return {
        fetchInitialData,
        loadingStatus,
        error,
        filteredPromotions,
        allPromotions,
        triggerSpecialPromotion,
        // hasActiveFilters
    };
}

// --- Componente Principal App ---
function App() {
    // --- Usar el Hook Personalizado ---
    const {
        fetchInitialData,
        loadingStatus,
        error,
        filteredPromotions,
        allPromotions,
        triggerSpecialPromotion,
        // hasActiveFilters
    } = useAppPromoState()

    // --- Cargar datos iniciales (sin cambios) ---
    useEffect(() => {
        fetchInitialData()
        // console.log('App mounted');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // Solo intentar simular si los datos ya se cargaron correctamente
        if (loadingStatus === 'succeeded' && allPromotions.length > 0) {
            // Buscar la promoción especial en los datos cargados
            const specialPromo = allPromotions.find(promo => promo.isSpecial)

            if (specialPromo) {
                // Simular un retraso de 5 segundos antes de que "llegue" la notificación
                const timerId = setTimeout(() => {
                    console.log('Simulating special promotion arrival:', specialPromo.title)
                    triggerSpecialPromotion(specialPromo)
                }, 5000) // 5 segundos de retraso

                // Limpiar el temporizador si el componente se desmonta antes
                return () => clearTimeout(timerId)
            }
        }
        // Dependencias: se ejecuta cuando cambian el estado de carga o las promociones
    }, [loadingStatus, allPromotions, triggerSpecialPromotion])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ py: 4, }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Promo Finder
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Encuentra las mejores ofertas cerca de ti
                    </Typography>
                </Box>

                {/* FilterPanel ahora podría recibir 'hasActiveFilters' si es necesario */}
                {/* o calcularlo internamente */}
                <FilterPanel />

                {/* PromotionsList (sin cambios aquí) */}
                <PromotionsList
                    promotions={filteredPromotions}
                    isLoading={loadingStatus === 'loading'}
                    error={error}
                />

                <NotificationAlert />
            </Container>
        </ThemeProvider>
    )
}

export default App
