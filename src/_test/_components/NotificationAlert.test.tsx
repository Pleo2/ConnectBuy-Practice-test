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

const mockCategory: Category = { id: "cat-notify", name: "Notify Cat" };
const mockStore: Store = { id: "store-notify", name: "Notify Store" };
const mockSpecialPromotion: Promotion = {
    id: "p-special-notify",
    title: "Oferta Especial Test",
    description: "Descripción de la oferta especial.",
    store: mockStore,
    category: mockCategory,
    imageUrl: "",
    isSpecial: true
};

const renderWithTheme = (component: React.ReactElement) => {
    const theme = createTheme();
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("NotificationAlert", () => {
    const user = userEvent.setup({});

    beforeEach(() => {
        act(() => {
            usePromoStore.setState({ ...storeInitialState });
        });
    });

    it("should not render Snackbar when specialPromotionNotification is null", () => {
        renderWithTheme(<NotificationAlert />);
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        expect(
            screen.queryByText(mockSpecialPromotion.title)
        ).not.toBeInTheDocument();
    });

    it("should render Snackbar with promotion details when specialPromotionNotification is set", () => {
        act(() => {
            usePromoStore.setState({
                specialPromotionNotification: mockSpecialPromotion
            });
        });

        renderWithTheme(<NotificationAlert />);

        const alert = screen.getByRole("alert");
        expect(alert).toBeInTheDocument();
        expect(screen.getByText(/¡Oferta Especial!/i)).toBeInTheDocument();
        expect(
            within(alert).getByText(new RegExp(mockSpecialPromotion.title))
        ).toBeInTheDocument();
        expect(
            within(alert).getByText(
                new RegExp(mockSpecialPromotion.description)
            )
        ).toBeInTheDocument();
    });

    it("should call clearSpecialPromotionNotification when Snackbar is closed by user", async () => {
        act(() => {
            usePromoStore.setState({
                specialPromotionNotification: mockSpecialPromotion
            });
        });

        renderWithTheme(<NotificationAlert />);

        expect(usePromoStore.getState().specialPromotionNotification).toEqual(
            mockSpecialPromotion
        );

        const closeButton = screen.getByRole("button", { name: /close/i });
        expect(closeButton).toBeInTheDocument();

        await user.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        });

        expect(
            usePromoStore.getState().specialPromotionNotification
        ).toBeNull();
    });

    it("should close automatically after autoHideDuration", async () => {
        jest.useFakeTimers();

        act(() => {
            usePromoStore.setState({
                specialPromotionNotification: mockSpecialPromotion
            });
        });

        renderWithTheme(<NotificationAlert />);

        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(
            usePromoStore.getState().specialPromotionNotification
        ).not.toBeNull();

        act(() => {
            jest.advanceTimersByTime(6000);
        });

        await waitFor(() => {
            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        });

        expect(
            usePromoStore.getState().specialPromotionNotification
        ).toBeNull();

        jest.useRealTimers();
    });
});
