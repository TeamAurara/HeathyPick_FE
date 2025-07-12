import CalendarIcon from '@/components/ui/CalendarIcon';
import MealCard from '@/components/ui/MealCard';
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// 날짜 형식을 YYYY-MM-DD 문자열로 변환하는 함수
const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 임시 데이터 - 실제로는 API에서 가져오거나 상태 관리 라이브러리에서 관리할 수 있습니다
const mockMealData = {
  // 오늘 날짜
  [formatDateKey(new Date())]: {
    breakfast: {
      description: '빵, 토마토, 치즈',
      currentValue: 350,
      maxValue: 500,
      kcal: 300,
    },
    lunch: {
      description: '스파게티',
      currentValue: 500,
      maxValue: 500,
      kcal: 800,
    },
    dinner: {
      description: '-',
      currentValue: 25,
      maxValue: 500,
    },
    water: {
      description: '-',
      currentValue: 10,
      maxValue: 200,
    }
  },
  // 어제 날짜
  [formatDateKey(new Date(new Date().setDate(new Date().getDate() - 1)))]: {
    breakfast: {
      description: '샐러드, 계란',
      currentValue: 250,
      maxValue: 500,
      kcal: 200,
    },
    lunch: {
      description: '불고기 덮밥',
      currentValue: 450,
      maxValue: 500,
      kcal: 650,
    },
    dinner: {
      description: '닭가슴살',
      currentValue: 300,
      maxValue: 500,
      kcal: 350,
    },
    water: {
      description: '2L',
      currentValue: 180,
      maxValue: 200,
    }
  },
  // 내일 날짜 (빈 데이터)
  [formatDateKey(new Date(new Date().setDate(new Date().getDate() + 1)))]: {
    breakfast: {
      description: '-',
      currentValue: 0,
      maxValue: 500,
    },
    lunch: {
      description: '-',
      currentValue: 0,
      maxValue: 500,
    },
    dinner: {
      description: '-',
      currentValue: 0,
      maxValue: 500,
    },
    water: {
      description: '-',
      currentValue: 0,
      maxValue: 200,
    }
  }
};

export default function RecordScreen() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealData, setMealData] = useState<any>(null);
  
  // 날짜가 변경될 때마다 해당 날짜의 식사 데이터를 불러옴
  useEffect(() => {
    const dateKey = formatDateKey(currentDate);
    
    // 해당 날짜의 데이터가 있으면 불러오고, 없으면 빈 데이터 생성
    const data = mockMealData[dateKey] || {
      breakfast: { description: '-', currentValue: 0, maxValue: 500 },
      lunch: { description: '-', currentValue: 0, maxValue: 500 },
      dinner: { description: '-', currentValue: 0, maxValue: 500 },
      water: { description: '-', currentValue: 0, maxValue: 200 }
    };
    
    setMealData(data);
    
    // 실제 앱에서는 여기서 API 호출을 통해 해당 날짜의 데이터를 가져올 수 있습니다
    // fetchMealData(dateKey).then(data => setMealData(data));
  }, [currentDate]);
  
  // 날짜 포맷팅 함수
  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };
  
  // 이전 날짜로 이동
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };
  
  // 다음 날짜로 이동
  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // 각 카드 클릭 핸들러
  const handleMealCardPress = (mealType: string) => {
    console.log(`${mealType} 카드가 클릭되었습니다. 날짜: ${formatDateKey(currentDate)}`);
    
    // 식사 타입에 따른 라우팅
    let type = '';
    switch(mealType) {
      case '아침':
        type = 'breakfast';
        break;
      case '점심':
        type = 'lunch';
        break;
      case '저녁':
        type = 'dinner';
        break;
      case '물 섭취':
        type = 'water';
        break;
    }
    
    // 식사 상세 페이지로 이동
    router.push({
      pathname: '/meal/MealDetailScreen',
      params: {
        type,
        date: formatDateKey(currentDate)
      }
    });
  };

  // 데이터가 로딩 중일 때 표시할 내용
  if (!mealData) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: "기록", headerShown: false }} />
      
      {/* 상단 헤더 부분 */}
      <View className="pt-12 pb-4 px-4">
        <Text className="text-center text-2xl font-bold">기록</Text>
        
        {/* 달력 아이콘 */}
        <TouchableOpacity className="absolute right-4 top-12">
          <View className="w-10 h-10 justify-center items-center">
            <CalendarIcon width={28} height={28} />
          </View>
        </TouchableOpacity>
      </View>
      
      {/* 날짜 네비게이션 */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <TouchableOpacity onPress={goToPreviousDay} className="w-10 h-10 justify-center items-center">
          <Text className="text-3xl text-gray-400">&lt;</Text>
        </TouchableOpacity>
        
        <View className="flex-row items-center">
          <Text className="text-2xl font-semibold">{formatDate(currentDate)}</Text>
     
        </View>
        
        <TouchableOpacity onPress={goToNextDay} className="w-10 h-10 justify-center items-center">
          <Text className="text-3xl text-gray-400">&gt;</Text>
        </TouchableOpacity>
      </View>
      
      {/* 메인 콘텐츠 영역 */}
      <View className="flex-1 p-4">
        <View className="flex-row flex-wrap justify-between">
          {/* 아침 카드 */}
          <MealCard 
            title="아침" 
            description={mealData.breakfast.description}
            currentValue={mealData.breakfast.currentValue}
            maxValue={mealData.breakfast.maxValue}
            kcal={mealData.breakfast.kcal}
            progressColor="bg-green-400"
            onPress={() => handleMealCardPress('아침')}
          />
          
          {/* 점심 카드 */}
          <MealCard 
            title="점심" 
            description={mealData.lunch.description}
            currentValue={mealData.lunch.currentValue}
            maxValue={mealData.lunch.maxValue}
            kcal={mealData.lunch.kcal}
            progressColor={mealData.lunch.currentValue >= mealData.lunch.maxValue ? "bg-red-400" : "bg-green-400"}
            onPress={() => handleMealCardPress('점심')}
          />
          
          {/* 저녁 카드 */}
          <MealCard 
            title="저녁" 
            description={mealData.dinner.description}
            currentValue={mealData.dinner.currentValue}
            maxValue={mealData.dinner.maxValue}
            kcal={mealData.dinner.kcal}
            onPress={() => handleMealCardPress('저녁')}
          />
          
          {/* 물 섭취 카드 */}
          <MealCard 
            title="물 섭취" 
            description={mealData.water.description}
            currentValue={mealData.water.currentValue}
            maxValue={mealData.water.maxValue}
            onPress={() => handleMealCardPress('물 섭취')}
          />
        </View>
      </View>
    </View>
  );
}
