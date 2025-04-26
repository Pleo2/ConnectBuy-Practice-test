import { Promotion } from "../types";
import { PromotionCard } from "./PromotionCard"; // Importamos nuestro componente de tarjeta
import Grid from "@mui/material/Grid"; // <-- Cambiado aquí
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress"; // Para indicar carga

// --- Interfaz para las Props ---
interface PromotionsListProps {
    promotions: Promotion[];
    isLoading?: boolean; // Opcional: para mostrar indicador de carga
    error?: string | null; // Opcional: para mostrar mensaje de error
}

// --- Componente Principal ---
export function PromotionsList({
    promotions,
    isLoading = false, // Valor por defecto
    error = null // Valor por defecto
}: PromotionsListProps) {
    // Mostrar indicador de carga si isLoading es true
    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px" // Darle algo de altura
            >
                <CircularProgress />
            </Box>
        );
    }

    // Mostrar mensaje de error si existe
    if (error) {
        return (
            <Box textAlign="center" my={4}>
                <Typography color="error" variant="h6">
                    Error al cargar promociones
                </Typography>
                <Typography color="error" variant="body1">
                    {error}
                </Typography>
                {/* Aquí podrías añadir un botón para reintentar, si la lógica lo permite */}
            </Box>
        );
    }

    // Mostrar mensaje si no hay promociones (después de cargar y sin errores)
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

    // Renderizar la cuadrícula de promociones
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
