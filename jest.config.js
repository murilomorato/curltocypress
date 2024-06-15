module.exports = {
    verbose: true, // Mostra testes detalhados durante a execução
    testEnvironment: 'jsdom', // Define o ambiente de teste, 'node' ou 'jsdom'
    transform: {
        // Transformações a aplicar; geralmente necessário para TypeScript ou JSX
        '^.+\\.jsx?$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'], // Extensões de arquivo a considerar
    testPathIgnorePatterns: ['/node_modules/'], // Pastas ignoradas
    collectCoverage: true, // Habilita a coleta de informações de cobertura
    coverageDirectory: './coverage/', // Diretório onde os relatórios de cobertura serão salvos
    coverageReporters: ['text', 'lcov'], // Formatos de relatório de cobertura
};











