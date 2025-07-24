module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add 'react-native-reanimated/plugin' here as last plugin
      'react-native-reanimated/plugin',
    ],
  };
};
