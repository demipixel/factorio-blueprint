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

// What `import` gets: the CommonJS build, re-exported. Two full builds meant
// two copies of the library, each with its own entity data, so an entity
// added through `require` was unknown to code that used `import`.
const ESM_ENTRY = `import Blueprint from './factorio-blueprint.cjs.js';

export default Blueprint;
`;

class EmitEsmEntry {
  apply(compiler) {
    const { Compilation, sources } = compiler.webpack;
    compiler.hooks.thisCompilation.tap('EmitEsmEntry', (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: 'EmitEsmEntry', stage: Compilation.PROCESS_ASSETS_STAGE_REPORT },
        () =>
          compilation.emitAsset(
            'factorio-blueprint.esm.mjs',
            new sources.RawSource(ESM_ENTRY),
          ),
      );
    });
  }
}

module.exports = {
  ...baseConfig,
  plugins: [...baseConfig.plugins, new EmitEsmEntry()],
  output: {
    filename: "factorio-blueprint.cjs.js",
    library: {
      type: "commonjs2",
      export: "default",
    },
    globalObject: "this",
    // nothing from an earlier build is left behind to be published
    clean: true,
  },
};
