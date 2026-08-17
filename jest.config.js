module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '\\.(png|jpg|jpeg|gif|webp|wav|mp3)$': '<rootDir>/jest.fileMock.js',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/functions/lib/',
    '/functions/node_modules/',
  ],
  forceExit: true,
};
