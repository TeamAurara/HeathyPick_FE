import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface WeeklyStatsChartProps {
  data?: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

const screenWidth = Dimensions.get('window').width;

export default function WeeklyStatsChart({ data }: WeeklyStatsChartProps) {
  // 기본 데이터 (실제로는 props로 받아올 예정)
  const defaultData = {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    datasets: [
      {
        data: [1200, 1350, 1100, 1400, 1300, 1500, 1250], // 칼로리 데이터
      },
    ],
  };

  const chartData = data || defaultData;

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // green-500
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#22c55e',
    },
  };

  return (
    <View className="bg-white rounded-2xl p-4 mx-4 mb-4 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
        주간 칼로리 섭취량
      </Text>
      
      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      
      <View className="mt-4 flex-row justify-between">
        <View className="items-center">
          <Text className="text-sm text-gray-600">평균</Text>
          <Text className="text-lg font-bold text-green-600">
            {Math.round(chartData.datasets[0].data.reduce((a, b) => a + b, 0) / chartData.datasets[0].data.length)}kcal
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-sm text-gray-600">최고</Text>
          <Text className="text-lg font-bold text-green-600">
            {Math.max(...chartData.datasets[0].data)}kcal
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-sm text-gray-600">최저</Text>
          <Text className="text-lg font-bold text-green-600">
            {Math.min(...chartData.datasets[0].data)}kcal
          </Text>
        </View>
      </View>
    </View>
  );
}
