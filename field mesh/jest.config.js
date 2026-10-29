module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@nkzw/create-context-hook)"
  ],
  moduleNameMapper: {
    '^react-native$': require.resolve('react-native'),
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFiles: ['./jest.setup.js']
};
