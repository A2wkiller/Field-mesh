module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@nkzw/create-context-hook)"
  ],
  moduleNameMapper: {
    '^react-native$': require.resolve('react-native'),
    '^@/(.*)$': '<rootDir>/$1',
    '^react-native/setup-env$': '<rootDir>/node_modules/react-native/jest/setup.js',
    '^react-native/asset-registry$': '<rootDir>/node_modules/react-native/Libraries/Image/AssetRegistry.js'
  },
  setupFiles: ['./jest.setup.js']
};
