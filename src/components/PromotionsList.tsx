import { Promotion } from "../types";
import { PromotionCard } from "./PromotionCard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";

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
        const skeletonCount = 8;
        return (
            <Grid container spacing={3} width={"100%"}>
                {Array.from(new Array(skeletonCount)).map((_, index) => (
                    <Grid
                        key={index}
                        size={{
                            xs: 12, // 1
                            sm: 6, // 2
                            md: 4, // 3
                            lg: 3 // 4
                        }}
                    >
                        <PromotionCardSkeleton />
                    </Grid>
                ))}
            </Grid>
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
        <Grid container spacing={3} width={"100%"}>
            {promotions.map((promo, index) => (
                <Grid
                    key={promo.id + index}
                    size={{
                        xs: 12, // 1
                        sm: 6, // 2
                        md: 4, // 3
                        lg: 3 // 4
                    }}
                >
                    <PromotionCard promotion={promo} />
                </Grid>
            ))}
        </Grid>
    );
}

function PromotionCardSkeleton() {
    return (
        <Box
            sx={{
                width: "100%",
                height: 395,
                boxShadow: 1,
                borderRadius: 1,
                overflow: "hidden",
                opacity: 0.5
            }}
        >
            <Skeleton
                variant="rectangular"
                height={140}
                width="100%"
                animation="wave"
            />
            <Box
                sx={{
                    pt: 1,
                    height: "230px",
                    paddingInline: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0
                }}
            >
                <Skeleton animation="wave" width="100%" />
                <Skeleton width="80%" animation="wave" />
                <Skeleton width="40%" animation="wave" />
                <Skeleton
                    sx={{
                        mt: 1,
                        mb: 1,
                        pt: 0
                    }}
                    width="100%"
                    height={200}
                    animation="wave"
                />
            </Box>
        </Box>
    );
}
