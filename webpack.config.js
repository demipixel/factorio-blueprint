
module.exports = {
    entry: './src/index.js',
    output: {
        filename: './dist/factorio-blueprint.min.js',
        library: 'Blueprint',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env']
                    }
                }
            }
        ]
    }
}
