
import React from 'react'
import { usePromoStore } from '../store/promoStore'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertProps } from '@mui/material/Alert'
import Slide, { SlideProps } from '@mui/material/Slide'

// --- Helper para la transición Slide ---
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />
}

// --- Componente Forwarded para Alert (necesario para Snackbar) ---
// Ver: https://mui.com/material-ui/react-snackbar/#customization
const SnackbarAlert = React.forwardRef<HTMLDivElement, AlertProps>(
  function SnackbarAlert(props, ref) {
    return <Alert elevation={6} ref={ref} variant="filled" {...props} />
  }
)

// --- Componente Principal de Notificación ---
export function NotificationAlert() {
  // Obtener la notificación actual y la acción para limpiarla
  const notification = usePromoStore((state) => state.specialPromotionNotification)
  const clearNotification = usePromoStore((state) => state.clearSpecialPromotionNotification)

  // Determinar si el Snackbar debe estar abierto
  const isOpen = notification !== null

  // Manejador para cerrar el Snackbar
  function handleClose(event?: React.SyntheticEvent | Event, reason?: string) {
    // Evitar cerrar si se hace clic fuera del snackbar
    if (reason === 'clickaway') {
      return
    }
    // Llamar a la acción del store para limpiar la notificación
    clearNotification()
  }

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000} // Ocultar automáticamente después de 6 segundos
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Posición
      TransitionComponent={SlideTransition} // Añadir animación
    >
      {/* Usamos el componente Alert dentro del Snackbar */}
      {/* El 'key' ayuda a React a reiniciar la animación si cambia la promo */}
      <SnackbarAlert
          key={notification?.id} // Añadir key si cambias el contenido dinámicamente
          onClose={handleClose}
          severity="info" // Tipo de alerta (info, warning, error, success)
          sx={{ width: '100%' }}
      >
        {/* Contenido de la notificación */}
        <strong>¡Oferta Especial!</strong> {notification?.title} - {notification?.description}
      </SnackbarAlert>
    </Snackbar>
  )
}
