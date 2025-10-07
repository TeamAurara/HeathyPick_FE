import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  // 루트 경로(/)에 접근 시 홈 화면으로 리디렉션
  return <Redirect href="/(tabs)/HomeScreen" />;
}
