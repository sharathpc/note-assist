module.exports = function (api) {
  api.cache(true);
  api.cache(true);
  return {
    presets: [['babel-preset-expo'], 'nativewind/babel'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],

          alias: {
            '@': './',
            'tailwind.config': './tailwind.config.js',
          },
        },
      ],
    ],
  };
};
