import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom' // Para matchers como .toBeInTheDocument()
import { PromotionCard } from '@/components/PromotionCard'
import { Promotion, Store, Category } from '@/types'
import { ThemeProvider, createTheme } from '@mui/material/styles' // Necesario para estilos MUI

// --- Mock Data ---
const mockCategory: Category = { id: 'cat-1', name: 'Electrónica' }
const mockStore: Store = { id: 'store-1', name: 'Tienda Guay' }

const mockPromoBase: Promotion = {
  id: 'p1',
  title: 'Super Oferta TV',
  description: 'Una TV increíble a buen precio.',
  store: mockStore,
  category: mockCategory,
  imageUrl: 'https://via.placeholder.com/150',
  isSpecial: false,
}

// Helper para renderizar con ThemeProvider (necesario para sx props)
const renderWithTheme = (component: React.ReactElement) => {
  const theme = createTheme()
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
}

// --- Bloque de Pruebas ---
describe('PromotionCard', () => {
  it('should render basic promotion details correctly', () => {
    renderWithTheme(<PromotionCard promotion={mockPromoBase} />)

    // Verificar que el título, descripción, categoría y tienda están presentes
    expect(screen.getByText(mockPromoBase.title)).toBeInTheDocument()
    expect(screen.getByText(mockPromoBase.description)).toBeInTheDocument()
    expect(screen.getByText(mockCategory.name)).toBeInTheDocument() // Chip de categoría
    expect(screen.getByText(mockStore.name)).toBeInTheDocument() // Nombre de tienda

    // Verificar imagen (por alt text)
    const image = screen.getByRole('img', { name: mockPromoBase.title })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockPromoBase.imageUrl)
  })

  it('should render discount percentage when provided', () => {
    const promoWithDiscount: Promotion = {
      ...mockPromoBase,
      discountPercentage: 25,
    }
    renderWithTheme(<PromotionCard promotion={promoWithDiscount} />)

    expect(screen.getByText(/25% de descuento/i)).toBeInTheDocument()
  })

  it('should render discount code when provided', () => {
    const promoWithCode: Promotion = {
      ...mockPromoBase,
      discountCode: 'PROMOCODE',
    }
    renderWithTheme(<PromotionCard promotion={promoWithCode} />)

    // Buscar por el texto del código dentro del chip
    expect(screen.getByText('PROMOCODE')).toBeInTheDocument()
    // También podríamos buscar por el texto "Código:" si quisiéramos ser más específicos
    expect(screen.getByText(/Código:/i)).toBeInTheDocument()
  })

  it('should render "Válida hasta" for future date', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7) // Válido por 7 días
    const promoValid: Promotion = {
      ...mockPromoBase,
      validUntil: futureDate.toISOString(),
    }
    const formattedDate = futureDate.toLocaleDateString('es-ES')

    renderWithTheme(<PromotionCard promotion={promoValid} />)

    expect(screen.getByText(`Válida hasta ${formattedDate}`)).toBeInTheDocument()
  })

  it('should render "Expirada el" and apply styles for past date', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 1) // Expiró ayer
    const promoExpired: Promotion = {
      ...mockPromoBase,
      validUntil: pastDate.toISOString(),
    }
    const formattedDate = pastDate.toLocaleDateString('es-ES')

    // Renderizamos y obtenemos el contenedor para verificar estilos
    const { container } = renderWithTheme(<PromotionCard promotion={promoExpired} />)

    expect(screen.getByText(`Expirada el ${formattedDate}`)).toBeInTheDocument()

    // Verificar la opacidad (esto es más un test de implementación, pero útil aquí)
    // Buscamos el elemento Card (o un contenedor padre)
    // Nota: La manera exacta de verificar estilos puede depender de cómo MUI los aplica (CSS-in-JS)
    const cardElement = container.firstChild // Asume que Card es el primer hijo del ThemeProvider
    expect(cardElement).toHaveStyle('opacity: 0.6')
  })

  it('should render "Especial" chip and apply border for special promotion', () => {
    const promoSpecial: Promotion = {
      ...mockPromoBase,
      isSpecial: true,
    }

    const { container } = renderWithTheme(<PromotionCard promotion={promoSpecial} />)

    // Verificar el chip "Especial"
    expect(screen.getByText('Especial')).toBeInTheDocument()

    // Verificar el borde (puede ser frágil, depende de la implementación exacta del estilo)
    const cardElement = container.firstChild
    // Chequeamos que tenga un borde de 2px y el color primario (o error si lo cambiamos)
    // La forma más segura es comprobar que *tiene* un estilo de borde, sin ser demasiado específico con el color exacto si el tema puede cambiar
    expect(cardElement).toHaveStyle('border: 2px solid')
    // Si quieres verificar el color exacto (más frágil):
    // const theme = createTheme();
    // expect(cardElement).toHaveStyle(`border-color: ${theme.palette.primary.main}`);
  })

   it('should not render date info if validUntil is not provided', () => {
        const promoNoDate: Promotion = { ...mockPromoBase, validUntil: undefined }
        renderWithTheme(<PromotionCard promotion={promoNoDate} />)

        // Asegurarse de que no aparecen textos relacionados con fechas
        expect(screen.queryByText(/Válida hasta/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/Expirada el/i)).not.toBeInTheDocument()
   })

   it('should render fallback image if imageUrl is missing', () => {
        const promoNoImage: Promotion = { ...mockPromoBase, imageUrl: '' } // O undefined
        renderWithTheme(<PromotionCard promotion={promoNoImage} />)

        const image = screen.getByRole('img', { name: promoNoImage.title })
        expect(image).toBeInTheDocument()
        // Verificar que el src apunta a la URL de placeholder que definimos
        expect(image).toHaveAttribute('src', expect.stringContaining('placeholder.com'))
   })
})
