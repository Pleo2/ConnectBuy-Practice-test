import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PromotionsList } from "@/components/PromotionsList";
import { Promotion, Store, Category } from "@/types";
import { ThemeProvider, createTheme } from "@mui/material/styles";

jest.mock("@/components/PromotionCard", () => ({
    PromotionCard: jest.fn(({ promotion }) => (
        <div data-testid={`mock-promo-card-${promotion.id}`}>
            Mock Card: {promotion.title}
        </div>
    ))
}));

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

const renderWithTheme = (component: React.ReactElement) => {
    const theme = createTheme();
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("PromotionsList", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render loading indicator when isLoading is true", () => {
        renderWithTheme(<PromotionsList promotions={[]} isLoading={true} />);

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(screen.queryByText(/Error al cargar/i)).not.toBeInTheDocument();
        expect(
            screen.queryByText(/No se encontraron promociones/i)
        ).not.toBeInTheDocument();
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

        expect(
            screen.getByText(/Error al cargar promociones/i)
        ).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(
            screen.queryByText(/No se encontraron promociones/i)
        ).not.toBeInTheDocument();
        expect(
            screen.queryByTestId(/mock-promo-card-/)
        ).not.toBeInTheDocument();
    });

    it('should render "No se encontraron promociones" message when list is empty and not loading/error', () => {
        renderWithTheme(
            <PromotionsList promotions={[]} isLoading={false} error={null} />
        );

        expect(
            screen.getByText(/No se encontraron promociones/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Intenta ajustar los filtros/i)
        ).toBeInTheDocument();
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(screen.queryByText(/Error al cargar/i)).not.toBeInTheDocument();
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

        const card1 = screen.getByTestId(
            `mock-promo-card-${mockPromotions[0].id}`
        );
        const card2 = screen.getByTestId(
            `mock-promo-card-${mockPromotions[1].id}`
        );
        expect(card1).toBeInTheDocument();
        expect(card2).toBeInTheDocument();

        expect(
            within(card1).getByText(`Mock Card: ${mockPromotions[0].title}`)
        ).toBeInTheDocument();
        expect(
            within(card2).getByText(`Mock Card: ${mockPromotions[1].title}`)
        ).toBeInTheDocument();

        const { PromotionCard: MockPromotionCard } = require("@/components/PromotionCard");
        expect(MockPromotionCard).toHaveBeenCalledTimes(mockPromotions.length);

        expect(MockPromotionCard).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({ promotion: mockPromotions[0] }),
            undefined
        );
        expect(MockPromotionCard).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({ promotion: mockPromotions[1] }),
            undefined
        );

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
