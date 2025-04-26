import { usePromoStore } from "../store/promoStore";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert";
import Slide, { SlideProps } from "@mui/material/Slide";
import { forwardRef } from "react";

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="up" />;
}

const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
    function SnackbarAlert(props, ref) {
        return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
    }
);

export function NotificationAlert() {
    const notification = usePromoStore(
        (state) => state.specialPromotionNotification
    );
    const clearNotification = usePromoStore(
        (state) => state.clearSpecialPromotionNotification
    );

    const isOpen = notification !== null;

    function handleClose(
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) {
        if (reason === "clickaway") {
            return;
        }
        clearNotification();
    }

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={6000} // Automatically hide after 6 seconds
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            TransitionComponent={SlideTransition}
        >
            <SnackbarAlert
                key={notification?.id}
                onClose={handleClose}
                severity="info"
                sx={{ width: "100%" }}
            >
                <strong>¡Oferta Especial!</strong> {notification?.title} -{" "}
                {notification?.description}
            </SnackbarAlert>
        </Snackbar>
    );
}
