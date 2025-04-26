import { useEffect, useMemo } from "react";
import {
    usePromoStore,
    selectFilteredPromotions,
    PromoState
} from "./store/promoStore";
import { FilterPanel } from "./components/FilterPanel";
import { PromotionsList } from "./components/PromotionsList";
import { NotificationAlert } from "./components/NotificationAlert";

import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({});

// --- Custom Hook to select App state ---
// Separate selectors to avoid unnecessary renders and loops
function useAppPromoState() {
    const fetchInitialData = usePromoStore((state) => state.fetchInitialData);
    const loadingStatus = usePromoStore((state) => state.loadingStatus);
    const error = usePromoStore((state) => state.error);
    const allPromotions = usePromoStore((state) => state.allPromotions);
    const filters = usePromoStore((state) => state.filters);
    const triggerSpecialPromotion = usePromoStore(
        (state) => state.triggerSpecialPromotion
    );

    // Memoize filteredPromotions to avoid infinite render loop
    const filteredPromotions = useMemo(
        () =>
            selectFilteredPromotions({ allPromotions, filters } as PromoState),
        [allPromotions, filters]
    );

    return {
        fetchInitialData,
        loadingStatus,
        error,
        filteredPromotions,
        allPromotions,
        triggerSpecialPromotion
        // hasActiveFilters
    };
}

function App() {
    const {
        fetchInitialData,
        loadingStatus,
        error,
        filteredPromotions,
        allPromotions,
        triggerSpecialPromotion
        // hasActiveFilters
    } = useAppPromoState();

    useEffect(() => {
        fetchInitialData();
        // console.log('App mounted');
    }, []);

    useEffect(() => {
        // Only attempt to simulate if data has loaded successfully
        if (loadingStatus === "succeeded" && allPromotions.length > 0) {
            // Find the special promotion in the loaded data
            const specialPromo = allPromotions.find((promo) => promo.isSpecial);

            if (specialPromo) {
                // Simulate a 5 second delay before the notification "arrives"
                const timerId = setTimeout(() => {
                    console.log(
                        "Simulating special promotion arrival:",
                        specialPromo.title
                    );
                    triggerSpecialPromotion(specialPromo);
                }, 5000); // 5 second delay

                // Clean up the timer if the component unmounts before
                return () => clearTimeout(timerId);
            }
        }
        // Dependencies: runs when loading status or promotions change
    }, [loadingStatus, allPromotions, triggerSpecialPromotion]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <body
                style={{
                    paddingInline: "10rem"
                }}
            >
                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Buscador de Promociones
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Encuentra las mejores ofertas y descuentos cerca de ti
                    </Typography>
                </Box>

                {/* FilterPanel could now receive 'hasActiveFilters' if needed */}
                {/* or calculate it internally */}
                <FilterPanel />

                <PromotionsList
                    promotions={filteredPromotions}
                    isLoading={loadingStatus === "loading"}
                    error={error}
                />

                <NotificationAlert />
            </body>
        </ThemeProvider>
    );
}

export default App;
