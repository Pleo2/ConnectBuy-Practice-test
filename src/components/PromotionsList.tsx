import { Promotion } from "../types";
import { PromotionCard } from "./PromotionCard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

interface PromotionsListProps {
    promotions: Promotion[];
    isLoading?: boolean;
    error?: string | null;
}


export function PromotionsList({
    promotions,
    isLoading = false,
    error = null
}: PromotionsListProps) {
    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" my={4}>
                <Typography color="error" variant="h6">
                    Error al cargar promociones
                </Typography>
                <Typography color="error" variant="body1">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (promotions.length === 0) {
        return (
            <Box textAlign="center" my={4}>
                <Typography variant="h6" color="text.secondary">
                    No se encontraron promociones
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Intenta ajustar los filtros o vuelve más tarde.
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {promotions.map((promo) => (
                <Grid  key={promo.id} size={3}>
                    <PromotionCard promotion={promo} />
                </Grid>
            ))}
        </Grid>
    );
}
