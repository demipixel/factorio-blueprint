
module.exports = {
    entry: './src/index.ts',
    output: {
        filename: './factorio-blueprint.min.js',
        library: 'Blueprint',
        libraryTarget: 'umd',
        globalObject: 'this',
        libraryExport: 'default'
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
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
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    }
}
