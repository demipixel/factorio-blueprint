const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const baseConfig = {
  entry: './src/index.ts',
  mode: 'production',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env'],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: false,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new NodePolyfillPlugin()],
};

module.exports = [
  // CJS build
  {
    ...baseConfig,
    output: {
      filename: "factorio-blueprint.cjs.js",
      library: {
        type: "commonjs2",
      },
      globalObject: "this",
    },
  },

  // ESM build
  {
    ...baseConfig,
    experiments: {
      outputModule: true,
    },
    output: {
      filename: "factorio-blueprint.esm.js",
      library: {
        type: "module",
      },
      module: true,
      globalObject: "this",
    },
  },
];
