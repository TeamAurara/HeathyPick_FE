import { Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import StatsSummaryCard from "../../components/ui/StatsSummaryCard";
import WeeklyStatsChart from "../../components/ui/WeeklyStatsChart";
import WeeklySummaryCard from "../../components/ui/WeeklySummaryCard";
import { useMealStore } from "../../stores/mealStore";

// 날짜 형식을 YYYY-MM-DD 문자열로 변환하는 함수
const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

// 지난 7일간의 날짜 배열 생성
const getLast7Days = (): Date[] => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date);
  }
  return days;
};

// 1주일치 목업 데이터 생성
const createMockWeeklyData = () => {
  const last7Days = getLast7Days();
  const mockData: Record<string, Record<string, any[]>> = {};

  // 각 날짜별로 다양한 칼로리의 음식 데이터 생성
  const dailyCalories = [1200, 1350, 1100, 1400, 1300, 1500, 1250];
  const foodNames = [
    ["토스트", "우유", "바나나"],
    ["샐러드", "닭가슴살", "현미밥"],
    ["요거트", "견과류", "사과"],
    ["스테이크", "감자", "브로콜리"],
    ["파스타", "샐러드", "빵"],
    ["피자", "콜라", "치킨"],
    ["국수", "김치", "계란"],
  ];

  last7Days.forEach((date, index) => {
    const dateKey = formatDateKey(date);
    const targetCalories = dailyCalories[index];
    const foods = foodNames[index];

    // 각 식사 타입별로 음식 분배
    const breakfast = [
      {
        name: foods[0],
        calories: Math.floor(targetCalories * 0.3).toString(),
        carbs: "20",
        protein: "10",
        fat: "5",
      },
    ];

    const lunch = [
      {
        name: foods[1],
        calories: Math.floor(targetCalories * 0.4).toString(),
        carbs: "30",
        protein: "20",
        fat: "8",
      },
    ];

    const dinner = [
      {
        name: foods[2],
        calories: Math.floor(targetCalories * 0.3).toString(),
        carbs: "25",
        protein: "15",
        fat: "6",
      },
    ];

    mockData[dateKey] = {
      breakfast,
      lunch,
      dinner,
    };

    console.log(`목업 데이터 생성 - ${dateKey}:`, {
      breakfast: breakfast[0].calories,
      lunch: lunch[0].calories,
      dinner: dinner[0].calories,
      total:
        parseInt(breakfast[0].calories) +
        parseInt(lunch[0].calories) +
        parseInt(dinner[0].calories),
    });
  });

  return mockData;
};

export default function StatisticsScreen() {
  const [weeklyCalories, setWeeklyCalories] = useState<number[]>([]);
  const [averageCalories, setAverageCalories] = useState(0);
  const [averageWater, setAverageWater] = useState(0);

  // weeklyCalories 상태 변경 감지
  useEffect(() => {
    console.log("weeklyCalories 상태 변경:", weeklyCalories);
  }, [weeklyCalories]);

  const getMealDataByDate = useMealStore((state) => state.getMealDataByDate);

  // 주간 데이터 로드 함수
  const loadWeeklyData = useCallback(() => {
    const last7Days = getLast7Days();
    const caloriesData: number[] = [];
    const mockData = createMockWeeklyData();

    last7Days.forEach((date) => {
      const dateKey = formatDateKey(date);

      // 목업 데이터를 우선 사용 (실제 데이터는 나중에 통합)
      const breakfastData = mockData[dateKey]?.breakfast || [];
      const lunchData = mockData[dateKey]?.lunch || [];
      const dinnerData = mockData[dateKey]?.dinner || [];

      // 실제 데이터가 있으면 추가로 합산
      const realBreakfastData = getMealDataByDate(dateKey, "breakfast") || [];
      const realLunchData = getMealDataByDate(dateKey, "lunch") || [];
      const realDinnerData = getMealDataByDate(dateKey, "dinner") || [];

      const dailyCalories = [
        ...breakfastData,
        ...lunchData,
        ...dinnerData,
        ...realBreakfastData,
        ...realLunchData,
        ...realDinnerData,
      ].reduce((sum, meal) => sum + parseInt(meal.calories || "0"), 0);

      caloriesData.push(dailyCalories);
    });

    setWeeklyCalories(caloriesData);

    // 디버깅을 위한 콘솔 로그
    console.log("주간 칼로리 데이터:", caloriesData);

    // 평균 계산
    const avgCalories =
      caloriesData.reduce((sum, cal) => sum + cal, 0) / caloriesData.length;

    setAverageCalories(Math.round(avgCalories));
    setAverageWater(2.1); // 임시 데이터 (나중에 waterStore에서 가져올 수 있음)
  }, [getMealDataByDate]);

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      loadWeeklyData();
    }, [loadWeeklyData])
  );

  // 초기 데이터 로드
  useEffect(() => {
    console.log("StatisticsScreen 초기 로드");
    loadWeeklyData();
  }, [loadWeeklyData]);

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
            value={averageCalories.toLocaleString()}
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
          <StatsSummaryCard title="운동 횟수" value="4" unit="회" change={20} />
          <StatsSummaryCard
            title="수분 섭취"
            value={averageWater.toString()}
            unit="L"
            change={-5}
          />
        </View>

        {/* 주간 차트 */}
        <WeeklyStatsChart
          data={{
            labels: ["월", "화", "수", "목", "금", "토", "일"],
            datasets: [
              {
                data:
                  weeklyCalories.length > 0
                    ? weeklyCalories
                    : [0, 0, 0, 0, 0, 0, 0],
              },
            ],
          }}
        />

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
                  <View
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (averageCalories / 1500) * 100,
                        100
                      )}%`,
                    }}
                  />
                </View>
                <Text className="text-sm font-medium text-gray-800">
                  {Math.round((averageCalories / 1500) * 100)}%
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">운동 목표</Text>
              <View className="flex-row items-center">
                <View className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <View
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "80%" }}
                  />
                </View>
                <Text className="text-sm font-medium text-gray-800">80%</Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">수분 섭취 목표</Text>
              <View className="flex-row items-center">
                <View className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <View
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min((averageWater / 2.5) * 100, 100)}%`,
                    }}
                  />
                </View>
                <Text className="text-sm font-medium text-gray-800">
                  {Math.round((averageWater / 2.5) * 100)}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
