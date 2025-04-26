import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PromotionCard } from "@/components/PromotionCard";
import { Promotion, Store, Category } from "@/types";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const mockCategory: Category = { id: "cat-1", name: "Electrónica" };
const mockStore: Store = { id: "store-1", name: "Tienda Guay" };

const mockPromoBase: Promotion = {
    id: "p1",
    title: "Super Oferta TV",
    description: "Una TV increíble a buen precio.",
    store: mockStore,
    category: mockCategory,
    imageUrl: "https://via.placeholder.com/150",
    isSpecial: false
};

const renderWithTheme = (component: React.ReactElement) => {
    const theme = createTheme();
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("PromotionCard", () => {
    it("should render basic promotion details correctly", () => {
        renderWithTheme(<PromotionCard promotion={mockPromoBase} />);

        expect(screen.getByText(mockPromoBase.title)).toBeInTheDocument();
        expect(screen.getByText(mockPromoBase.description)).toBeInTheDocument();
        expect(screen.getByText(mockCategory.name)).toBeInTheDocument();
        expect(screen.getByText(mockStore.name)).toBeInTheDocument();

        const image = screen.getByRole("img", { name: mockPromoBase.title });
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src", mockPromoBase.imageUrl);
    });

    it("should render discount percentage when provided", () => {
        const promoWithDiscount: Promotion = {
            ...mockPromoBase,
            discountPercentage: 25
        };
        renderWithTheme(<PromotionCard promotion={promoWithDiscount} />);

        expect(screen.getByText(/25% de descuento/i)).toBeInTheDocument();
    });

    it("should render discount code when provided", () => {
        const promoWithCode: Promotion = {
            ...mockPromoBase,
            discountCode: "PROMOCODE"
        };
        renderWithTheme(<PromotionCard promotion={promoWithCode} />);

        expect(screen.getByText("PROMOCODE")).toBeInTheDocument();
        expect(screen.getByText(/Código:/i)).toBeInTheDocument();
    });

    it('should render "Válida hasta" for future date', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        const promoValid: Promotion = {
            ...mockPromoBase,
            validUntil: futureDate.toISOString()
        };
        const formattedDate = futureDate.toLocaleDateString("es-ES");

        renderWithTheme(<PromotionCard promotion={promoValid} />);

        expect(
            screen.getByText(`Válida hasta ${formattedDate}`)
        ).toBeInTheDocument();
    });

    it('should render "Expirada el" and apply styles for past date', () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        const promoExpired: Promotion = {
            ...mockPromoBase,
            validUntil: pastDate.toISOString()
        };
        const formattedDate = pastDate.toLocaleDateString("es-ES");

        const { container } = renderWithTheme(
            <PromotionCard promotion={promoExpired} />
        );

        expect(
            screen.getByText(`Expirada el ${formattedDate}`)
        ).toBeInTheDocument();

        const cardElement = container.firstChild;
        expect(cardElement).toHaveStyle("opacity: 0.6");
    });

    it('should render "Especial" chip and apply border for special promotion', () => {
        const promoSpecial: Promotion = {
            ...mockPromoBase,
            isSpecial: true
        };

        const { container } = renderWithTheme(
            <PromotionCard promotion={promoSpecial} />
        );

        expect(screen.getByText("Especial")).toBeInTheDocument();

        const cardElement = container.firstChild;
        expect(cardElement).toHaveStyle("border: 2px solid");
    });

    it("should not render date info if validUntil is not provided", () => {
        const promoNoDate: Promotion = {
            ...mockPromoBase,
            validUntil: undefined
        };
        renderWithTheme(<PromotionCard promotion={promoNoDate} />);

        expect(screen.queryByText(/Válida hasta/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Expirada el/i)).not.toBeInTheDocument();
    });

    it("should render fallback image if imageUrl is missing", () => {
        const promoNoImage: Promotion = { ...mockPromoBase, imageUrl: "" };
        renderWithTheme(<PromotionCard promotion={promoNoImage} />);

        const image = screen.getByRole("img", { name: promoNoImage.title });
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute(
            "src",
            expect.stringContaining(
                "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
            )
        );
    });
});
