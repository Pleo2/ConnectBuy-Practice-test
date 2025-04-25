module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Archivo para configurar mocks globales, etc.
  moduleNameMapper: {
    // Para manejar assets estáticos como CSS/imágenes si los importas en componentes
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1' // Si configuras alias en tsconfig/vite
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json', // Asegúrate que apunta a tu tsconfig
    }],
  },
  // Ignorar carpetas como node_modules, dist, etc.
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  // Cobertura (opcional pero recomendado)
  collectCoverage: true,
  coverageProvider: 'v8', // o 'babel'
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts', // No incluir archivos de definición de tipos
    '!src/main.tsx', // Usualmente no se testea el punto de entrada
    '!src/vite-env.d.ts',
    // Puedes excluir otros archivos/carpetas aquí
  ],
};
