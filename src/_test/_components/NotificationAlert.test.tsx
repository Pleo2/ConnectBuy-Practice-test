import { render, screen, act, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { NotificationAlert } from "@/components/NotificationAlert";
import {
    usePromoStore,
    initialState as storeInitialState
} from "@/store/promoStore";
import { Promotion, Store, Category } from "@/types";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// --- Mock Data ---
const mockCategory: Category = { id: "cat-notify", name: "Notify Cat" };
const mockStore: Store = { id: "store-notify", name: "Notify Store" };
const mockSpecialPromotion: Promotion = {
    id: "p-special-notify",
    title: "Oferta Especial Test",
    description: "Descripción de la oferta especial.",
    store: mockStore,
    category: mockCategory,
    imageUrl: "",
    isSpecial: true // Importante
};

// Helper para renderizar con ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
    const theme = createTheme();
    // El Snackbar se monta fuera del ThemeProvider por defecto si no está anidado,
    // pero como NotificationAlert SÍ está dentro del ThemeProvider en App.tsx, lo incluimos aquí.
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

// --- Bloque de Pruebas ---
describe("NotificationAlert", () => {
    const user = userEvent.setup({
        // Configurar delay para autoHideDuration si usamos fake timers
        // delay: null, // Descomentar si usas fake timers
    });

    // Resetear store antes de cada prueba
    beforeEach(() => {
        act(() => {
            usePromoStore.setState({ ...storeInitialState });
        });
        // Desactivar fake timers si se activaron en alguna prueba anterior
        // jest.useRealTimers()
    });

    it("should not render Snackbar when specialPromotionNotification is null", () => {
        // Estado inicial del store ya tiene la notificación como null
        renderWithTheme(<NotificationAlert />);

        // El Snackbar no debería estar en el DOM (o al menos no visible).
        // Buscamos por el rol 'alert' que usamos dentro. queryByRole no lanza error.
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        // También podemos buscar por el texto de la promo mock
        expect(
            screen.queryByText(mockSpecialPromotion.title)
        ).not.toBeInTheDocument();
    });

    it("should render Snackbar with promotion details when specialPromotionNotification is set", () => {
        // Establecer la notificación en el store ANTES de renderizar
        act(() => {
            usePromoStore.setState({
                specialPromotionNotification: mockSpecialPromotion
            });
        });

        renderWithTheme(<NotificationAlert />);

        // El Snackbar (y el Alert dentro) debería estar visible
        const alert = screen.getByRole("alert");
        expect(alert).toBeInTheDocument();

        // Verificar que el contenido del Alert es correcto
        expect(screen.getByText(/¡Oferta Especial!/i)).toBeInTheDocument();
        // Cambiado: usar RegExp para que coincida con el título, aunque esté fragmentado
        expect(
            within(alert).getByText(new RegExp(mockSpecialPromotion.title))
        ).toBeInTheDocument();
        // Cambiado: usar RegExp para que coincida con la descripción
        expect(
            within(alert).getByText(
                new RegExp(mockSpecialPromotion.description)
            )
        ).toBeInTheDocument();
    });

    it("should call clearSpecialPromotionNotification when Snackbar is closed by user", async () => {
        // Establecer la notificación
        act(() => {
            usePromoStore.setState({
                specialPromotionNotification: mockSpecialPromotion
            });
        });

        renderWithTheme(<NotificationAlert />);

        // Verificar que la notificación está presente en el store
        expect(usePromoStore.getState().specialPromotionNotification).toEqual(
            mockSpecialPromotion
        );

        // El Alert de MUI tiene un botón de cierre por defecto (rol 'button')
        const closeButton = screen.getByRole("button", { name: /close/i }); // El nombre puede variar por idioma/MUI
        expect(closeButton).toBeInTheDocument();

        // Simular clic en el botón de cierre
        await user.click(closeButton);

        // Esperar a que la animación de cierre termine y el estado se actualice
        // El Snackbar debería desaparecer del DOM
        await waitFor(() => {
            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        });

        // Verificar que la notificación se limpió en el store
        expect(
            usePromoStore.getState().specialPromotionNotification
        ).toBeNull();
    });

    // --- Prueba para autoHideDuration (opcional, puede ser flaky) ---
    it("should close automatically after autoHideDuration", async () => {
        // Usar fake timers para controlar setTimeout/setInterval
        jest.useFakeTimers();

        // Establecer la notificación
        act(() => {
            usePromoStore.setState({
                specialPromotionNotification: mockSpecialPromotion
            });
        });

        renderWithTheme(<NotificationAlert />);

        // Verificar que está visible inicialmente
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(
            usePromoStore.getState().specialPromotionNotification
        ).not.toBeNull();

        // Avanzar el tiempo justo hasta la duración del autoHide (6000ms)
        act(() => {
            jest.advanceTimersByTime(6000);
        });

        // Esperar a que desaparezca (la desaparición podría tener una pequeña demora/animación)
        await waitFor(() => {
            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        });

        // Verificar que el store también se limpió (porque onClose llama a clearNotification)
        expect(
            usePromoStore.getState().specialPromotionNotification
        ).toBeNull();

        // Restaurar timers reales al final
        jest.useRealTimers();
    });
});
