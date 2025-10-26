export default {
  expo: {
    name: "healthypick",
    slug: "healthypick",
    version: "1.0.2",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "healthypick",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.healthypick.app",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "9e9efa91-7cd1-40c9-97e8-c92735250368",
      },

      backendUrl: "https://healthpick.store",
    },
  },
};
