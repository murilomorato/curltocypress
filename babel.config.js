
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current'  // Isso garante que o Babel compila o código para a versão atual do Node.js em uso.
                }
            }
        ]
    ]
};
