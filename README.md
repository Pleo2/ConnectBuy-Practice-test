# Promo Finder - Módulo de Promociones (React + TS + MUI + Zustand)

Este es un pequeño módulo construido con React y TypeScript que muestra una lista de promociones de tiendas, permite filtrarlas y simula una notificación en tiempo real.

## Funcionalidades Principales

- Muestra una lista de promociones obtenidas desde una API simulada.
- Permite filtrar promociones por:
    - Categoría
    - Tienda
    - Cercanía (basada en coordenadas simuladas de usuario y tiendas).
- Utiliza Material UI (MUI) para la interfaz de usuario.
- Gestiona el estado global con Zustand.
- Simula una notificación en tiempo real (usando `setTimeout`) para promociones especiales, mostrándola con un Snackbar de MUI.
- Incluye pruebas unitarias y de integración con Jest y React Testing Library.

## Stack Tecnológico

- **Framework/Librería:** React v19
- **Lenguaje:** TypeScript v5.7+
- **Build Tool:** Vite v6
- **UI:** Material UI v7 (con @emotion/react v11)
- **Gestión de Estado:** Zustand v5
- **Llamadas API:** Simulación interna (Axios v1.9 está instalado si se desea conectar a una API real)
- **Testing:** Jest v29, React Testing Library v16 (`@testing-library/react`), User Event v14 (`@testing-library/user-event`), Jest DOM v6 (`@testing-library/jest-dom`)
- **Gestor de Paquetes:** pnpm

## Requisitos Previos

- Node.js (v18 o superior recomendado)
- **pnpm** (v8 o superior recomendado - [Instrucciones de instalación de pnpm](https://pnpm.io/installation))

## Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
    cd TU_REPOSITORIO # O el nombre de tu carpeta
    ```

2.  **Instala las dependencias usando pnpm:**
    ```bash
    pnpm install
    ```
    _Nota: Si no tienes pnpm instalado, sigue las [instrucciones oficiales](https://pnpm.io/installation)._

## Ejecución

1.  **Iniciar el servidor de desarrollo:**

    ```bash
    pnpm dev
    ```

    La aplicación estará disponible generalmente en `http://localhost:5173` (o el puerto que indique Vite). Abre esta URL en tu navegador.

2.  **Ver la aplicación:**
    - Verás la lista de promociones después de una breve carga simulada.
    - Puedes usar los filtros en la parte superior para refinar la lista.
    - Después de unos 5 segundos de la carga inicial, debería aparecer una notificación en la esquina inferior derecha sobre una promoción especial.

## Ejecutar Pruebas

Para ejecutar todas las pruebas unitarias y de integración:

```bash
pnpm test
```

Para ejecutar pruebas y ver informe de covertura

```bash
pnpm test -- --coverage
```

Para ejecutar un archivo de prueba específico:

```bash
pnpm test -- <ruta/al/archivo.test.tsx>
# Ejemplo: pnpm test -- src/components/FilterPanel.test.tsx
```

## Estructura del Proyecto

A continuación se muestra una estructura más detallada del proyecto:

```
/Users/pleo2/Dev/ConnectBuy-Practice-test/
├── node_modules/
├── public/
│   └── vite.svg
├── src/
│   ├── services/
│   │   └── api.ts
│   ├── components/
│   │   ├── PromotionList.tsx
│   │   ├── PromotionCard.tsx
│   │   ├── FilterPanel.tsx
│   │   └── NotificationSnackbar.tsx
│   ├── store/
│   │   └── promotionsStore.ts
│   ├── types/
│   │   └── promotion.d.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── _tests/
│   ├── _components/
│   │   └── PromotionList.test.tsx
│   └── _store/
│       └── usePromotions.test.ts
├── .env
├── .gitignore
├── jest.config.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
└── README.md
```

- **src/api/**: Lógica de acceso a datos simulada o real.
- **src/components/**: Componentes reutilizables de la UI.
- **src/hooks/**: Custom hooks de React.
- **src/store/**: Estado global (Zustand).
- **src/types/**: Definiciones TypeScript.
- **src/utils/**: Utilidades y helpers.
- **tests/**: Pruebas unitarias y de integración.
