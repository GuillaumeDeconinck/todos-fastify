module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/unit/**/*\\.test\\.ts?(x)"],
  setupFilesAfterEnv: ["<rootDir>/jest-unit-setup.ts"]
};
