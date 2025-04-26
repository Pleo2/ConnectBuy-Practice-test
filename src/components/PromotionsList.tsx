

import { Promotion } from '../types'
import { PromotionCard } from './PromotionCard' // Importamos nuestro componente de tarjeta
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress' // Para indicar carga

// --- Interfaz para las Props ---
interface PromotionsListProps {
  promotions: Promotion[]
  isLoading?: boolean // Opcional: para mostrar indicador de carga
  error?: string | null // Opcional: para mostrar mensaje de error
}

// --- Componente Principal ---
export function PromotionsList({
  promotions,
  isLoading = false, // Valor por defecto
  error = null, // Valor por defecto
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
    )
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
    )
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
    )
  }

  // Renderizar la cuadrícula de promociones
  return (
    <Grid container spacing={3}>
      {' '}
      {/* El 'container' es el contenedor flex/grid */}
      {promotions.map((promo) => (
        <Grid item key={promo.id} xs={12} sm={6} md={4} lg={3}>
          {' '}
          {/* 'item' es cada celda */}
          {/* xs, sm, md, lg definen cuántas columnas ocupa en diferentes tamaños de pantalla */}
          {/* 12 = ocupa todo el ancho en extra-small */}
          {/* 6 = ocupa la mitad (2 columnas) en small */}
          {/* 4 = ocupa un tercio (3 columnas) en medium */}
          {/* 3 = ocupa un cuarto (4 columnas) en large */}
          <PromotionCard promotion={promo} />
        </Grid>
      ))}
    </Grid>
  )
}
