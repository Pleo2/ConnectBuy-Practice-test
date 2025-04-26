import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PromotionsList } from "@/components/PromotionsList";
import { Promotion, Store, Category } from "@/types";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// --- Mockear el componente hijo (PromotionCard) ---
// A menudo es útil mockear componentes hijos complejos para aislar la prueba
// al componente actual (PromotionsList). Verificaremos que se renderiza
// el número correcto de mocks con las props adecuadas.
jest.mock("@/components/PromotionCard", () => ({
    // La función mock debe tener el mismo nombre de exportación que el componente real
    PromotionCard: jest.fn(({ promotion }) => (
        // Renderizamos algo simple para identificarlo, incluyendo datos clave
        <div data-testid={`mock-promo-card-${promotion.id}`}>
            Mock Card: {promotion.title}
        </div>
    ))
}));

// --- Mock Data ---
const mockCategory: Category = { id: "cat-mock", name: "Mock Cat" };
const mockStore: Store = { id: "store-mock", name: "Mock Store" };
const mockPromotions: Promotion[] = [
    {
        id: "p-mock-1",
        title: "Promo Mock 1",
        description: "Desc Mock 1",
        store: mockStore,
        category: mockCategory,
        imageUrl: "img1.jpg",
        isSpecial: false
    },
    {
        id: "p-mock-2",
        title: "Promo Mock 2",
        description: "Desc Mock 2",
        store: mockStore,
        category: mockCategory,
        imageUrl: "img2.jpg",
        isSpecial: false
    }
];

// Helper para renderizar con ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
    const theme = createTheme();
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

// --- Bloque de Pruebas ---
describe("PromotionsList", () => {
    // Limpiar mocks de componentes después de cada prueba
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render loading indicator when isLoading is true", () => {
        renderWithTheme(<PromotionsList promotions={[]} isLoading={true} />);

        // Verificar que el CircularProgress (rol "progressbar") está presente
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        // Verificar que no se muestran mensajes de error o lista vacía
        expect(screen.queryByText(/Error al cargar/i)).not.toBeInTheDocument();
        expect(
            screen.queryByText(/No se encontraron promociones/i)
        ).not.toBeInTheDocument();
        // Verificar que no se renderiza ningún mock de PromotionCard
        expect(
            screen.queryByTestId(/mock-promo-card-/)
        ).not.toBeInTheDocument();
    });

    it("should render error message when error prop is provided", () => {
        const errorMessage = "Fallo de red simulado";
        renderWithTheme(
            <PromotionsList
                promotions={[]}
                isLoading={false}
                error={errorMessage}
            />
        );

        // Verificar mensaje de error principal y el detalle
        expect(
            screen.getByText(/Error al cargar promociones/i)
        ).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        // Verificar que no se muestran el loader o mensaje de lista vacía
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(
            screen.queryByText(/No se encontraron promociones/i)
        ).not.toBeInTheDocument();
        // Verificar que no se renderiza ningún mock de PromotionCard
        expect(
            screen.queryByTestId(/mock-promo-card-/)
        ).not.toBeInTheDocument();
    });

    it('should render "No se encontraron promociones" message when list is empty and not loading/error', () => {
        renderWithTheme(
            <PromotionsList promotions={[]} isLoading={false} error={null} />
        );

        // Verificar mensaje de lista vacía
        expect(
            screen.getByText(/No se encontraron promociones/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Intenta ajustar los filtros/i)
        ).toBeInTheDocument();
        // Verificar que no se muestran loader o error
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(screen.queryByText(/Error al cargar/i)).not.toBeInTheDocument();
        // Verificar que no se renderiza ningún mock de PromotionCard
        expect(
            screen.queryByTestId(/mock-promo-card-/)
        ).not.toBeInTheDocument();
    });

    it("should render PromotionCard for each promotion in the list", () => {
        renderWithTheme(
            <PromotionsList
                promotions={mockPromotions}
                isLoading={false}
                error={null}
            />
        );

        // Verificar que los mocks de PromotionCard se renderizaron
        const card1 = screen.getByTestId(
            `mock-promo-card-${mockPromotions[0].id}`
        );
        const card2 = screen.getByTestId(
            `mock-promo-card-${mockPromotions[1].id}`
        );
        expect(card1).toBeInTheDocument();
        expect(card2).toBeInTheDocument();

        // Verificar el contenido simple de los mocks para estar seguros
        expect(
            within(card1).getByText(`Mock Card: ${mockPromotions[0].title}`)
        ).toBeInTheDocument();
        expect(
            within(card2).getByText(`Mock Card: ${mockPromotions[1].title}`)
        ).toBeInTheDocument();

        // Verificar que el componente mock PromotionCard fue llamado con las props correctas
        // Importamos el componente mockeado para acceder a él
        const { PromotionCard: MockPromotionCard } = require("@/components/PromotionCard");
        expect(MockPromotionCard).toHaveBeenCalledTimes(mockPromotions.length);

        expect(MockPromotionCard).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({ promotion: mockPromotions[0] }),
            undefined
        );
        // Verificar las props de la segunda llamada
        expect(MockPromotionCard).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({ promotion: mockPromotions[1] }),
            undefined
        );

        // Verificar que no se muestran otros estados (loading, error, empty)
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(screen.queryByText(/Error al cargar/i)).not.toBeInTheDocument();
        expect(
            screen.queryByText(/No se encontraron promociones/i)
        ).not.toBeInTheDocument();
    });

    it("should render correct number of PromotionCards", () => {
        renderWithTheme(
            <PromotionsList
                promotions={mockPromotions}
                isLoading={false}
                error={null}
            />
        );

        expect(screen.getAllByTestId(/mock-promo-card-/)).toHaveLength(
            mockPromotions.length
        );
    });
});
