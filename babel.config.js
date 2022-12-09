module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          actions: './src/actions',
          api: './src/api',
          assets: './src/assets',
          components: './src/components',
          hooks: './src/hooks',
          locales: './src/locales',
          navigators: './src/navigators',
          reducers: './src/reducers',
          screens: './src/screens',
          store: './src/store',
          utils: './src/utils',
          src: './src',
        },
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.json',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.jsx',
        ],
      },
    ],
  ],
};
