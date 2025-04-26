import { memo } from "react";

import { Promotion } from "../types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CategoryIcon from "@mui/icons-material/Category";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

interface PromotionCardProps {
    promotion: Promotion;
}

function formatDate(isoString: string | undefined): string | null {
    if (!isoString) return null;
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return null;
        return date.toLocaleDateString("es-ES");
    } catch (e) {
        console.error("Error formatting date:", isoString, e);
        return null;
    }
}

function PromotionCardComponent({ promotion }: PromotionCardProps) {
    const {
        title,
        description,
        imageUrl,
        store,
        category,
        discountPercentage,
        discountCode,
        validUntil,
        isSpecial
    } = promotion;

    const formattedValidUntil = formatDate(validUntil);
    const isExpired =
        validUntil && new Date(validUntil).getTime() < Date.now()
            ? true
            : false;

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                opacity: isExpired ? 0.6 : 1, // Dim if expired
                border: isSpecial ? "2px solid" : "none", // Highlight if special
                borderColor: isSpecial ? "primary.main" : "transparent"
            }}
        >
            <CardMedia
                component="img"
                height="140"
                image={
                    imageUrl ||
                    "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                }
                alt={title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 1 }}
                    alignItems="center"
                >
                    <Chip
                        icon={<CategoryIcon fontSize="small" />}
                        label={category.name}
                        size="small"
                        color="secondary"
                        variant="outlined"
                    />
                    {isSpecial && (
                        <Chip
                            icon={<NewReleasesIcon fontSize="small" />}
                            label="Especial"
                            size="small"
                            color="error"
                            variant="filled"
                        />
                    )}
                </Stack>
                <Typography gutterBottom variant="h6" component="div">
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                >
                    {description}
                </Typography>
                {discountPercentage && (
                    <Typography
                        variant="body2"
                        color="error.main"
                        sx={{ fontWeight: "bold" }}
                    >
                        {discountPercentage}% de descuento
                    </Typography>
                )}
                {discountCode && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                    >
                        Código: <Chip label={discountCode} size="small" />
                    </Typography>
                )}
                <Box
                    display="flex"
                    alignItems="center"
                    mt={1.5}
                    color="text.secondary"
                >
                    <StorefrontIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="caption">{store.name}</Typography>
                </Box>
                {formattedValidUntil && (
                    <Box
                        display="flex"
                        alignItems="center"
                        mt={0.5}
                        color={isExpired ? "error.light" : "text.secondary"}
                    >
                        <EventBusyIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="caption">
                            {isExpired ? "Expirada el" : "Válida hasta"}{" "}
                            {formattedValidUntil}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export const PromotionCard = memo(PromotionCardComponent);
