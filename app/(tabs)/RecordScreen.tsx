import CustomCalendars from '@/components/record/CustomCalendars';
import { CalendarIcon } from '@/components/ui/CalendarIcon';
import { MealCard } from '@/components/ui/MealCard';
import { SupplementAddModal } from '@/components/ui/SupplementAddModal';
import { SupplementCard } from '@/components/ui/SupplementCard';
import { WaterInputModal } from '@/components/ui/WaterInputModal';
import { WeightCard } from '@/components/ui/WeightCard';
import { WeightInputModal } from '@/components/ui/WeightInputModal';
import { Food } from '@/constants/schemas/food';
import { useSupplementStore } from '@/stores/supplementStore';
import { useQueryClient } from '@tanstack/react-query';
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

// 날짜 형식을 YYYY-MM-DD 문자열로 변환하는 함수
const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// API 기반 식사 데이터 타입
interface MealData {
  breakfast: {
    foodItems: Food[];
    currentValue: number;
    maxValue: number;
    kcal?: number;
  };
  lunch: {
    foodItems: Food[];
    currentValue: number;
    maxValue: number;
    kcal?: number;
  };
  dinner: {
    foodItems: Food[];
    currentValue: number;
    maxValue: number;
    kcal?: number;
  };
  water: {
    description: string;
    currentValue: number;
    maxValue: number;
    foodItems: Food[];
  };
}

// 초기 빈 식사 데이터 생성 함수
const createEmptyMealData = (): MealData => ({
  breakfast: {
    foodItems: [],
    currentValue: 0,
    maxValue: 800,
    kcal: 0,
  },
  lunch: {
    foodItems: [],
    currentValue: 0,
    maxValue: 800,
    kcal: 0,
  },
  dinner: {
    foodItems: [],
    currentValue: 0,
    maxValue: 800,
    kcal: 0,
  },
  water: {
    description: '-',
    currentValue: 0,
    maxValue: 200,
    foodItems: []
  }
});

// 로컬 상태로 식사 데이터 관리
const mealDataStore: Record<string, MealData> = {};

// 임시 영양제 데이터
const mockSupplementData = {
  // 오늘 날짜
  [formatDateKey(new Date())]: [
    { id: 1, name: '종합 비타민', timeToTake: '아침 식사 후', isTaken: true },
    { id: 2, name: '오메가3', timeToTake: '저녁 식사 후', isTaken: false },
    { id: 3, name: '칼슘 마그네슘', timeToTake: '취침 전', isTaken: false }
  ],
  // 어제 날짜
  [formatDateKey(new Date(new Date().setDate(new Date().getDate() - 1)))]: [
    { id: 1, name: '종합 비타민', timeToTake: '아침 식사 후', isTaken: true },
    { id: 2, name: '오메가3', timeToTake: '저녁 식사 후', isTaken: true },
    { id: 3, name: '칼슘 마그네슘', timeToTake: '취침 전', isTaken: true }
  ],
  // 내일 날짜
  [formatDateKey(new Date(new Date().setDate(new Date().getDate() + 1)))]: [
    { id: 1, name: '종합 비타민', timeToTake: '아침 식사 후', isTaken: false },
    { id: 2, name: '오메가3', timeToTake: '저녁 식사 후', isTaken: false },
    { id: 3, name: '칼슘 마그네슘', timeToTake: '취침 전', isTaken: false }
  ]
};

// 임시 체중 데이터
const mockWeightData = {
  // 오늘 날짜
  [formatDateKey(new Date())]: {
    currentWeight: 68.5,
    previousWeight: 69.2,
    targetWeight: 65.0
  },
  // 어제 날짜
  [formatDateKey(new Date(new Date().setDate(new Date().getDate() - 1)))]: {
    currentWeight: 69.2,
    previousWeight: 69.5,
    targetWeight: 65.0
  },
  // 내일 날짜 (데이터 없음)
  [formatDateKey(new Date(new Date().setDate(new Date().getDate() + 1)))]: null
};

export default function RecordScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealData, setMealData] = useState<any>(null);
  const [supplementData, setSupplementData] = useState<any[]>([]);
  const [weightData, setWeightData] = useState<any>(null);
  const [isWaterModalVisible, setIsWaterModalVisible] = useState(false);
  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isSupplementModalVisible, setIsSupplementModalVisible] = useState(false);
  
  // 영양제 스토어 사용
  const { addSupplement, toggleTaken, getSupplement } = useSupplementStore();
  
  // 날짜가 변경될 때마다 해당 날짜의 데이터를 불러옴
  useEffect(() => {
    const dateKey = formatDateKey(currentDate);
    
    // 식사 데이터 불러오기 - 로컬 스토어에서 가져오거나 빈 데이터 생성
    const mData = mealDataStore[dateKey] || createEmptyMealData();
    setMealData(mData);
    
    // 영양제 데이터 불러오기 - Zustand 스토어에서 먼저 확인하고, 없으면 목업 데이터 사용
    const supplementsFromStore = getSupplement(dateKey);
    if (supplementsFromStore.length > 0) {
      setSupplementData(supplementsFromStore);
    } else {
      const sData = mockSupplementData[dateKey] || [];
      setSupplementData(sData);
    }
    
    // 체중 데이터 불러오기
    const wData = mockWeightData[dateKey] || null;
    setWeightData(wData);
    
    // 실제 앱에서는 여기서 API 호출을 통해 해당 날짜의 데이터를 가져올 수 있습니다
    // fetchData(dateKey).then(data => {
    //   setMealData(data.meals);
    //   setSupplementData(data.supplements);
    //   setWeightData(data.weight);
    // });
  }, [currentDate, getSupplement]);

  // 영양제 데이터 자동 업데이트를 위한 useEffect
  useEffect(() => {
    const dateKey = formatDateKey(currentDate);
    const supplementsFromStore = getSupplement(dateKey);
    if (supplementsFromStore.length > 0) {
      setSupplementData(supplementsFromStore);
    }
  }, [currentDate, getSupplement]);
  
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
    
    // 물 섭취 카드를 클릭한 경우 모달 표시
    if (mealType === '물 섭취') {
      setIsWaterModalVisible(true);
      return;
    }
    
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

  // 영양제 카드 클릭 핸들러
  const handleSupplementCardPress = (supplementId: number) => {
    console.log(`영양제 ID ${supplementId} 카드가 클릭되었습니다. 날짜: ${formatDateKey(currentDate)}`);
    // 영양제 복용 상태 토글
    const dateKey = formatDateKey(currentDate);
    toggleTaken(dateKey, supplementId);
    
    // useEffect에서 자동으로 업데이트되므로 여기서는 별도 처리 불필요
  };
  
  // 영양제 추가 핸들러
  const handleAddSupplement = () => {
    setIsSupplementModalVisible(true);
  };

  // 복용 시간 설정 핸들러
  const handleSchedulePress = (supplementName: string) => {
    router.push({
      pathname: '/meal/SupplementTimeSettingScreen',
      params: { name: supplementName }
    });
  };
  
  // 영양제 저장 핸들러
  const handleSaveSupplement = (name: string, timeToTake: string) => {
    const dateKey = formatDateKey(currentDate);
    addSupplement(dateKey, { name, timeToTake, isTaken: false });
    
    // 모달 닫기
    setIsSupplementModalVisible(false);
    
    // useEffect에서 자동으로 업데이트되므로 여기서는 별도 처리 불필요
  };

  // 음식 추가 핸들러 (API 기반)
  const handleAddFood = (mealType: 'breakfast' | 'lunch' | 'dinner', food: Food) => {
    const dateKey = formatDateKey(currentDate);
    
    // 로컬 스토어에서 해당 날짜의 데이터 가져오기
    const currentMealData = mealDataStore[dateKey] || createEmptyMealData();
    
    // 해당 식사 타입에 음식 추가
    currentMealData[mealType].foodItems.push(food);
    
    // 칼로리 계산
    const totalKcal = currentMealData[mealType].foodItems.reduce((sum, item) => sum + item.calories, 0);
    currentMealData[mealType].kcal = totalKcal;
    
    // 진행률 계산 (칼로리 기준)
    const progressValue = Math.min(Math.round((totalKcal / currentMealData[mealType].maxValue) * 100), 100);
    currentMealData[mealType].currentValue = progressValue;
    
    // 로컬 스토어 업데이트
    mealDataStore[dateKey] = currentMealData;
    
    // 상태 업데이트
    setMealData(currentMealData);
    
    // QueryClient 무효화하여 캐시 갱신
    queryClient.invalidateQueries({ queryKey: ['meals', dateKey] });
  };

  // 체중 카드 클릭 핸들러
  const handleWeightCardPress = () => {
    console.log(`체중 카드가 클릭되었습니다. 날짜: ${formatDateKey(currentDate)}`);
    setIsWeightModalVisible(true);
  };
  
  // 체중 저장 핸들러
  const handleSaveWeight = (weight: number) => {
    console.log(`체중 ${weight}kg 저장, 날짜: ${formatDateKey(currentDate)}`);
    
    // 현재 날짜의 데이터 복사
    const dateKey = formatDateKey(currentDate);
    const updatedWeightData = { ...mockWeightData };
    
    // 이전 체중 값 저장 (현재 값이 이전 값이 됨)
    const previousWeight = updatedWeightData[dateKey]?.currentWeight || weight;
    
    // 체중 데이터 업데이트
    updatedWeightData[dateKey] = {
      currentWeight: weight,
      previousWeight: previousWeight,
      targetWeight: updatedWeightData[dateKey]?.targetWeight || 65.0 // 기본 목표 체중
    };
    
    // 데이터 업데이트
    setWeightData(updatedWeightData[dateKey]);
    
    // 실제 앱에서는 API를 통해 서버에 저장할 수 있습니다
    // saveWeightData(dateKey, weight).then(() => {
    //   fetchWeightData(dateKey).then(data => setWeightData(data));
    // });
  };

  // 물 섭취량 저장 핸들러
  const handleSaveWaterAmount = (amount: number) => {
    console.log(`물 섭취량 ${amount}L 저장, 날짜: ${formatDateKey(currentDate)}`);
    
    // 현재 날짜의 데이터 복사
    const dateKey = formatDateKey(currentDate);
    const updatedMealData = { ...mealDataStore };
    
    if (!updatedMealData[dateKey]) {
      updatedMealData[dateKey] = {
        breakfast: { foodItems: [], currentValue: 0, maxValue: 800 },
        lunch: { foodItems: [], currentValue: 0, maxValue: 800 },
        dinner: { foodItems: [], currentValue: 0, maxValue: 800 },
        water: { description: '-', currentValue: 0, maxValue: 200, foodItems: [] }
      };
    }
    
    // 물 섭취 데이터 업데이트
    const waterValue = Math.min(Math.round(amount * 100), 200); // 0.1L = 10, 최대 200
    updatedMealData[dateKey].water = {
      description: `${amount}L`,
      currentValue: waterValue,
      maxValue: 200,
      foodItems: []
    };
    
    // 데이터 업데이트
    setMealData(updatedMealData[dateKey]);
    
    // 실제 앱에서는 API를 통해 서버에 저장할 수 있습니다
    // saveWaterData(dateKey, amount).then(() => {
    //   fetchMealData(dateKey).then(data => setMealData(data));
    // });
  };

  // 달력 아이콘 클릭 핸들러
  const handleCalendarIconPress = () => {
    setIsCalendarVisible(true);
  };

  // 날짜 선택 핸들러
  const handleSelectDate = (dateString: string) => {
    // 선택한 날짜로 currentDate 업데이트
    setCurrentDate(new Date(dateString));
    setIsCalendarVisible(false);
  };

      // 데이터가 있는 날짜에 마커 표시하는 함수
  const getMarkedDates = () => {
    const markedDates: Record<string, any> = {};
    
    // 식사 데이터가 있는 날짜에 마커 추가
    Object.keys(mealDataStore).forEach(dateKey => {
      markedDates[dateKey] = { 
        marked: true, 
        dotColor: '#22c55e' 
      };
    });
    
    return markedDates;
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
        <TouchableOpacity 
          className="absolute right-4 top-12"
          onPress={handleCalendarIconPress}
        >
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
      
      {/* 메인 콘텐츠 영역 - 스크롤 가능하도록 ScrollView로 변경 */}
      <ScrollView className="flex-1 px-4">
        {/* 식사 카드 섹션 */}
        <View className="flex-row flex-wrap justify-between mb-6">
          {/* 아침 카드 */}
          <MealCard 
            title="아침" 
            foodItems={mealData.breakfast.foodItems}
            currentValue={mealData.breakfast.currentValue}
            maxValue={mealData.breakfast.maxValue}
            kcal={mealData.breakfast.kcal}
            progressColor="bg-green-400"
            onPress={() => handleMealCardPress('아침')}
          />
          
          {/* 점심 카드 */}
          <MealCard 
            title="점심" 
            foodItems={mealData.lunch.foodItems}
            currentValue={mealData.lunch.currentValue}
            maxValue={mealData.lunch.maxValue}
            kcal={mealData.lunch.kcal}
            progressColor={mealData.lunch.currentValue >= mealData.lunch.maxValue ? "bg-red-400" : "bg-green-400"}
            onPress={() => handleMealCardPress('점심')}
          />
          
          {/* 저녁 카드 */}
          <MealCard 
            title="저녁" 
            foodItems={mealData.dinner.foodItems}
            currentValue={mealData.dinner.currentValue}
            maxValue={mealData.dinner.maxValue}
            kcal={mealData.dinner.kcal}
            onPress={() => handleMealCardPress('저녁')}
          />
          
          {/* 물 섭취 카드 */}
          <MealCard 
            title="물 섭취" 
            foodItems={mealData.water.description ? [{ name: mealData.water.description }] : []}
            currentValue={mealData.water.currentValue}
            maxValue={mealData.water.maxValue}
            onPress={() => handleMealCardPress('물 섭취')}
          />
        </View>
        
        {/* 영양제 알림 섹션 */}
        {supplementData.length > 0 && (
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-bold">영양제 알림</Text>
              <TouchableOpacity onPress={handleAddSupplement}>
                <Text className="text-green-500">+ 추가</Text>
              </TouchableOpacity>
            </View>
            
            {supplementData.map((supplement) => (
              <SupplementCard
                key={supplement.id}
                name={supplement.name}
                timeToTake={supplement.timeToTake}
                isTaken={supplement.isTaken}
                onPress={() => handleSupplementCardPress(supplement.id)}
                onSchedulePress={() => handleSchedulePress(supplement.name)}
              />
            ))}
          </View>
        )}
        
        {/* 체중 기록 섹션 */}
        {weightData && (
          <View className="mb-6">
            <WeightCard 
              currentWeight={weightData.currentWeight}
              previousWeight={weightData.previousWeight}
              targetWeight={weightData.targetWeight}
              onPress={handleWeightCardPress}
            />
          </View>
        )}
        
        {/* 하단 여백 */}
        <View className="h-6" />
      </ScrollView>
      
      {/* 물 섭취량 입력 모달 */}
      <WaterInputModal 
        isVisible={isWaterModalVisible}
        onClose={() => setIsWaterModalVisible(false)}
        onSave={handleSaveWaterAmount}
        currentAmount={mealData?.water?.description !== '-' ? parseFloat(mealData.water.description) : 0}
      />
      
      {/* 체중 입력 모달 */}
      <WeightInputModal
        isVisible={isWeightModalVisible}
        onClose={() => setIsWeightModalVisible(false)}
        onSave={handleSaveWeight}
        currentWeight={weightData?.currentWeight}
      />
      
      {/* 영양제 추가 모달 */}
      <SupplementAddModal
        isVisible={isSupplementModalVisible}
        onClose={() => setIsSupplementModalVisible(false)}
        onSave={handleSaveSupplement}
      />

      {/* 캘린더 모달 */}
      <Modal
        transparent={true}
        visible={isCalendarVisible}
        animationType="fade"
        onRequestClose={() => setIsCalendarVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsCalendarVisible(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-lg p-4 w-11/12 max-w-md">
                <CustomCalendars
                  currentDate={currentDate}
                  handleSelectDate={handleSelectDate}
                  getMarkedDates={getMarkedDates}
                  formatDateKey={formatDateKey}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
