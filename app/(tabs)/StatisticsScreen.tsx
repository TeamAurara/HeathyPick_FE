import { Stack } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import StatsSummaryCard from "../../components/ui/StatsSummaryCard";
import WeeklyStatsChart from "../../components/ui/WeeklyStatsChart";
import WeeklySummaryCard from "../../components/ui/WeeklySummaryCard";

export default function StatisticsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "통계", headerShown: false }} />
      <ScrollView className="flex-1 bg-gray-50">
        {/* 헤더 */}
        <View className="bg-green-500 pt-12 pb-6 px-4">
          <Text className="text-white text-2xl font-bold text-center">
            통계
          </Text>
          <Text className="text-white text-center mt-2 opacity-90">
            이번 주 건강 관리 현황을 확인해보세요
          </Text>
        </View>

        {/* 요약 카드들 */}
        <View className="flex-row px-4 mt-6 mb-4">
          <StatsSummaryCard
            title="평균 칼로리"
            value="1,300"
            unit="kcal"
            change={5}
          />
          <StatsSummaryCard
            title="평균 체중"
            value="65.2"
            unit="kg"
            change={-1.2}
          />
        </View>

        <View className="flex-row px-4 mb-4">
          <StatsSummaryCard
            title="운동 횟수"
            value="4"
            unit="회"
            change={20}
          />
          <StatsSummaryCard
            title="수분 섭취"
            value="2.1"
            unit="L"
            change={-5}
          />
        </View>

        {/* 주간 차트 */}
        <WeeklyStatsChart />

        {/* AI 주간 요약 */}
        <WeeklySummaryCard />

        {/* 추가 통계 정보 */}
        <View className="bg-white rounded-2xl p-4 mx-4 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
            이번 주 목표 달성률
          </Text>
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">칼로리 목표</Text>
              <View className="flex-row items-center">
                <View className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <View className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                </View>
                <Text className="text-sm font-medium text-gray-800">85%</Text>
              </View>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">운동 목표</Text>
              <View className="flex-row items-center">
                <View className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <View className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }} />
                </View>
                <Text className="text-sm font-medium text-gray-800">80%</Text>
              </View>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">수분 섭취 목표</Text>
              <View className="flex-row items-center">
                <View className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <View className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }} />
                </View>
                <Text className="text-sm font-medium text-gray-800">70%</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
