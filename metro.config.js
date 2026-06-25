const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 * @type {import('@react-native/metro-config').MetroConfig}
 */

// 1️⃣ Get the default Metro config
const baseConfig = getDefaultConfig(__dirname);

// 2️⃣ Add any custom config here if needed
const customConfig = {};

// 3️⃣ Merge both configs
const mergedConfig = mergeConfig(baseConfig, customConfig);

// 4️⃣ Wrap Metro with NativeWind for TailwindCSS
module.exports = withNativeWind(mergedConfig, {
  input: './global.css', // 👈 path to your Tailwind CSS file
});
