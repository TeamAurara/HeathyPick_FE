const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// SVG 파일 변환을 위한 설정
const { transformer, resolver } = config;

// 기존 assetExts에서 svg 확장자 제거
config.resolver.assetExts = resolver.assetExts.filter((ext) => ext !== "svg");

// sourceExts에 svg 추가
config.resolver.sourceExts = [...resolver.sourceExts, "svg"];

// SVG 변환기 설정
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
