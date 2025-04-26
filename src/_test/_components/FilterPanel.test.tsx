import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { FilterPanel } from "@/components/FilterPanel";
import { usePromoStore, initialState } from "@/store/promoStore";
import { Category, Store } from "@/types";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Mock Data (sin cambios)
const mockCategories: Category[] = [
    { id: "cat-1", name: "Electrónica Test" },
    { id: "cat-2", name: "Moda Test" }
];
const mockStores: Store[] = [
    { id: "store-1", name: "Tienda Test A" },
    { id: "store-2", name: "Tienda Test B" }
];

// Helper (sin cambios)
const renderWithTheme = (component: React.ReactElement) => {
    const theme = createTheme();
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("FilterPanel", () => {
    const user = userEvent.setup();

    beforeEach(() => {
        act(() => {
            usePromoStore.setState({
                ...initialState,
                categories: [...mockCategories],
                stores: [...mockStores],
                filters: {
                    ...initialState.filters,
                    userLatitude: 40.4168,
                    userLongitude: -3.7038
                }
            });
        });
    });

    it("should render filters correctly with initial state", () => {
        renderWithTheme(<FilterPanel />);

        expect(screen.getByLabelText("Categoría")).toBeInTheDocument();
        expect(screen.getByLabelText("Tienda")).toBeInTheDocument();
        expect(
            screen.getByLabelText("Distancia Máxima (km)")
        ).toBeInTheDocument();

        // CORREGIDO: Verificar textContent del combobox (puede ser espacio de ancho cero o vacío)
        const categoryCombobox = screen.getByRole("combobox", {
            name: "Categoría"
        });
        // Usar un matcher flexible para vacío o espacio raro
        expect(categoryCombobox.textContent).toMatch(/^(\u200B)?$/); // \u200B es zero-width space

        const storeCombobox = screen.getByRole("combobox", { name: "Tienda" });
        expect(storeCombobox.textContent).toMatch(/^(\u200B)?$/);

        expect(screen.getByLabelText("Distancia Máxima (km)")).toHaveValue(
            null
        );
        expect(
            screen.getByText(/Desde tu ubicación simulada \(40\.42, -3\.70\)/i)
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Limpiar Filtros/i })
        ).toBeDisabled();
    });

    it("should populate select options from store", async () => {
        renderWithTheme(<FilterPanel />);

        const categoryCombobox = screen.getByRole("combobox", {
            name: "Categoría"
        });
        await user.click(categoryCombobox);

        // Verificar opciones (sin cambios)
        await waitFor(() => {
            expect(
                screen.getByRole("option", { name: "Todas las Categorías" })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: mockCategories[0].name })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: mockCategories[1].name })
            ).toBeInTheDocument();
        });

        // CORREGIDO: Cerrar el primer dropdown explícitamente con la tecla Escape
        await user.keyboard("{Escape}");

        // Esperar un instante para asegurar que el DOM se actualiza tras cerrar
        await waitFor(() => {
            // Puedes verificar que el primer dropdown ya no está expandido (opcional)
            expect(categoryCombobox).toHaveAttribute("aria-expanded", "false");
        });

        // --- Test Tiendas ---
        // Ahora sí deberíamos poder encontrar e interactuar con el segundo combobox
        const storeCombobox = screen.getByRole("combobox", { name: "Tienda" });
        await user.click(storeCombobox);

        // Verificar opciones de tienda (sin cambios)
        await waitFor(() => {
            expect(
                screen.getByRole("option", { name: "Todas las Tiendas" })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: mockStores[0].name })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("option", { name: mockStores[1].name })
            ).toBeInTheDocument();
        });

        // Opcional: cerrar el último dropdown
        await user.keyboard("{Escape}"); // O user.click(document.body) podría funcionar aquí
    });

    it("should update category filter in store when selected", async () => {
        renderWithTheme(<FilterPanel />);
        const categorySelect = screen.getByRole("combobox", {
            name: "Categoría"
        }); // Usar combobox

        // Seleccionar la primera categoría mock
        await user.click(categorySelect);
        const option = await screen.findByRole("option", {
            name: mockCategories[0].name
        });
        await user.click(option);

        expect(usePromoStore.getState().filters.categoryId).toBe(
            mockCategories[0].id
        );
        // Verificar que el combobox ahora muestra el texto correcto
        expect(categorySelect).toHaveTextContent(mockCategories[0].name);

        // Seleccionar "Todas las Categorías" para limpiar
        await user.click(categorySelect);
        const allOption = await screen.findByRole("option", {
            name: "Todas las Categorías"
        });
        await user.click(allOption);

        expect(usePromoStore.getState().filters.categoryId).toBeNull();
        expect(categorySelect.textContent).toMatch(/^(\u200B)?$/); // Verificar que está vacío de nuevo
        expect(
            screen.getByRole("button", { name: /Limpiar Filtros/i })
        ).toBeDisabled();
    });

    it("should update store filter in store when selected", async () => {
        renderWithTheme(<FilterPanel />);
        const storeSelect = screen.getByRole("combobox", { name: "Tienda" });

        // Seleccionar Tienda B
        await user.click(storeSelect);
        const option = await screen.findByRole("option", {
            name: mockStores[1].name
        });
        await user.click(option);

        expect(usePromoStore.getState().filters.storeId).toBe(mockStores[1].id);
        expect(storeSelect).toHaveTextContent(mockStores[1].name);
        expect(
            screen.getByRole("button", { name: /Limpiar Filtros/i })
        ).toBeEnabled();

        // Limpiar
        await user.click(storeSelect);
        const allOption = await screen.findByRole("option", {
            name: "Todas las Tiendas"
        });
        await user.click(allOption);

        expect(usePromoStore.getState().filters.storeId).toBeNull();
        expect(storeSelect.textContent).toMatch(/^(\u200B)?$/);
        expect(
            screen.getByRole("button", { name: /Limpiar Filtros/i })
        ).toBeDisabled();
    });

    it("should update distance filter in store when typed", async () => {
        renderWithTheme(<FilterPanel />);
        const distanceInput = screen.getByLabelText("Distancia Máxima (km)");

        // Escribir una distancia válida
        await user.clear(distanceInput);
        await user.type(distanceInput, "15");
        expect(distanceInput).toHaveValue(15);
        expect(usePromoStore.getState().filters.maxDistanceKm).toBe(15);
        expect(
            screen.getByRole("button", { name: /Limpiar Filtros/i })
        ).toBeEnabled();

        // Borrar el contenido
        await user.clear(distanceInput);
        expect(distanceInput).toHaveValue(null);
        expect(usePromoStore.getState().filters.maxDistanceKm).toBeNull();
        expect(
            screen.getByRole("button", { name: /Limpiar Filtros/i })
        ).toBeDisabled();

        // Escribir '0'
        await user.clear(distanceInput); // Asegurar limpieza previa
        await user.type(distanceInput, "0");
        // IMPORTANTE: El input puede quedarse con '0' visualmente antes del re-render por el store
        // Pero el ESTADO FINAL esperado después de que el store se actualice a null y refresque
        // el input es que este quede vacío. Puede necesitar waitFor.
        await waitFor(() => {
            expect(distanceInput).toHaveValue(null);
        });
        expect(usePromoStore.getState().filters.maxDistanceKm).toBeNull();

        // Escribir '-5'
        await user.clear(distanceInput);
        await user.type(distanceInput, "-5");
        await waitFor(() => {
            expect(distanceInput).toHaveValue(null); // El input type=number no permite negativos por defecto o los trata como invalidos
        });
        expect(usePromoStore.getState().filters.maxDistanceKm).toBeNull();

        // Escribir texto
        await user.clear(distanceInput);
        await user.type(distanceInput, "abc");
        await waitFor(() => {
            expect(distanceInput).toHaveValue(null);
        });
        expect(usePromoStore.getState().filters.maxDistanceKm).toBeNull();
    });

    it('should clear all filters when "Limpiar Filtros" is clicked', async () => {
        renderWithTheme(<FilterPanel />);

        // Aplicar filtro de categoría
        const categorySelect = screen.getByRole("combobox", {
            name: "Categoría"
        });
        await user.click(categorySelect);
        const categoryOption = await screen.findByRole("option", {
            name: mockCategories[0].name
        });
        await user.click(categoryOption);

        // Aplicar filtro de distancia
        const distanceInput = screen.getByLabelText("Distancia Máxima (km)");
        await user.type(distanceInput, "10");

        // Verificar que los filtros están activos (sin cambios)
        expect(usePromoStore.getState().filters.categoryId).toBe(
            mockCategories[0].id
        );
        expect(usePromoStore.getState().filters.maxDistanceKm).toBe(10);
        const clearButton = screen.getByRole("button", {
            name: /Limpiar Filtros/i
        });
        expect(clearButton).toBeEnabled();

        const userLat = usePromoStore.getState().filters.userLatitude;
        const userLon = usePromoStore.getState().filters.userLongitude;

        // Hacer clic en limpiar
        await user.click(clearButton);

        // Verificar que los filtros se limpiaron en el store (sin cambios)
        const finalFilters = usePromoStore.getState().filters;
        expect(finalFilters.categoryId).toBeNull();
        expect(finalFilters.storeId).toBeNull();
        expect(finalFilters.maxDistanceKm).toBeNull();
        expect(finalFilters.userLatitude).toBe(userLat);
        expect(finalFilters.userLongitude).toBe(userLon);

        // CORREGIDO: Verificar que los inputs visuales se resetearon usando textContent y toHaveValue
        const finalCategoryCombobox = screen.getByRole("combobox", {
            name: "Categoría"
        });
        expect(finalCategoryCombobox.textContent).toMatch(/^(\u200B)?$/);

        const finalDistanceInput = screen.getByLabelText(
            "Distancia Máxima (km)"
        );
        expect(finalDistanceInput).toHaveValue(null);

        // Verificar que el botón se deshabilitó (sin cambios)
        expect(clearButton).toBeDisabled();
    });
});
