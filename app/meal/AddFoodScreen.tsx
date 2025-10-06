import { IconSymbol } from "@/components/ui/IconSymbol";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// 백엔드 API는 현재 사용하지 않으므로 주석 처리
// import { useRecordFoodMutation } from '../../hooks/record/mutation/useRecordFoodMutation';
// import { useRecordSelfMutation } from '../../hooks/record/mutation/useRecordSelfMutation';
import { useMealStore } from "../../stores/mealStore";

// 네비게이션 헤더 숨기기
export const options = {
  headerShown: false,
};

export default function AddFoodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // const [userId, setUserId] = useState<number | null>(null);

  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");

  const addMealData = useMealStore((state) => state.addMealData);
  const addMealDataByDate = useMealStore((state) => state.addMealDataByDate);
  const searchedFood = useMealStore((state) => state.searchedFood);
  const clearSearchedFood = useMealStore((state) => state.clearSearchedFood);
  // 백엔드 API는 현재 사용하지 않으므로 주석 처리
  // const { mutate, isPending, error, isSuccess } = useRecordSelfMutation();
  // const { mutate: saveSearchedFood } = useRecordFoodMutation();

  // 컴포넌트 마운트 시 userId 가져오기 (현재 사용하지 않음)
  // useEffect(() => {
  //   const getUserId = async () => {
  //     try {
  //       const storedUserId = await AsyncStorage.getItem('userId');
  //       if (storedUserId) {
  //         setUserId(parseInt(storedUserId));
  //       }
  //     } catch (error) {
  //       console.error('userId 가져오기 실패:', error);
  //     }
  //   };

  //   getUserId();
  // }, []);

  // 화면이 포커스될 때마다 검색된 음식 데이터 확인
  useFocusEffect(
    useCallback(() => {
      if (searchedFood) {
        // 검색된 음식 데이터로 입력 필드 채우기
        setFoodName(searchedFood.menuName);
        setCalories(searchedFood.calorie.toString());
        setCarbs(searchedFood.carbohydrate.toString());
        setProtein(searchedFood.protein.toString());
        setFat(searchedFood.fat.toString());

        // 데이터 사용 후 클리어
        clearSearchedFood();

        console.log("검색된 음식 데이터 적용:", searchedFood.menuName);
      }
    }, [searchedFood, clearSearchedFood])
  );

  const handleGoBack = () => {
    router.back();
  };

  const handleSearch = () => {
    router.push("/meal/FoodSearchScreen" as any);
  };

  const handleAddFood = () => {
    // 필수 필드 검증
    if (!foodName.trim()) {
      Alert.alert("알림", "음식 이름을 입력해주세요.");
      return;
    }

    // 현재 날짜와 식사 타입 가져오기 (라우터 파라미터에서)
    const today = new Date();
    const dateKey = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식
    const mealType = (params.type as string) || "breakfast"; // 파라미터에서 받거나 기본값

    // 영양 정보 기본값 설정 (입력되지 않은 경우 0으로 설정)
    const newFoodData = {
      name: foodName.trim(),
      calories: calories || "0",
      carbs: carbs || "0",
      protein: protein || "0",
      fat: fat || "0",
    };

    // 스토어에 날짜별로 음식 데이터 저장
    addMealDataByDate(dateKey, mealType, newFoodData);

    // 기존 방식도 유지 (호환성을 위해)
    addMealData(newFoodData);

    Alert.alert("성공", "음식이 성공적으로 저장되었습니다.");
    router.back();
  };

  // 에러 상태 처리 (현재 사용하지 않음)
  // useEffect(() => {
  //   if (error) {
  //     Alert.alert('오류', '음식 저장 중 오류가 발생했습니다.');
  //   }
  // }, [error]);

  return (
    <View className="flex-1 bg-white">
      {/* 상단 헤더 */}
      <View className="pt-14 px-5 pb-2">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleGoBack} className="p-1">
            <IconSymbol name="chevron.left" size={24} color="black" />
          </TouchableOpacity>
          <View className="flex-row items-center justify-center flex-1">
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              className="mr-2"
            />
            <Text className="text-xl font-bold">음식 추가</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      </View>

      {/* 입력 폼 */}
      <ScrollView className="flex-1 px-5 py-4">
        <View className="mb-6">
          <Text className="text-green-500 font-medium mb-2">
            음식 이름(필수)
          </Text>
          <View className="flex-row items-center border-b border-green-500 pb-2">
            <TextInput
              value={foodName}
              onChangeText={setFoodName}
              placeholder="ex) 사과, 초코케이크"
              placeholderTextColor="#999"
              className="flex-1 text-base text-gray-500"
            />
            <TouchableOpacity
              onPress={handleSearch}
              className="ml-3 bg-green-500 px-3 py-1 rounded-full"
            >
              <Text className="text-white text-sm font-medium">검색</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-bold mb-4 text-green-500">
            영양정보(선택)
          </Text>

          <View className="flex-row justify-between mb-6">
            <View className="w-[48%]">
              <Text className="text-green-500 font-medium mb-2">
                칼로리(kcal)
              </Text>
              <View className="border-b border-gray-300 pb-2">
                <TextInput
                  value={calories}
                  onChangeText={setCalories}
                  placeholder="ex) 130"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  className="text-base text-gray-500"
                />
              </View>
            </View>
            <View className="w-[48%]">
              <Text className="text-green-500 font-medium mb-2">
                탄수화물(g)
              </Text>
              <View className="border-b border-gray-300 pb-2">
                <TextInput
                  value={carbs}
                  onChangeText={setCarbs}
                  placeholder="ex) 200"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  className="text-base text-gray-500"
                />
              </View>
            </View>
          </View>

          <View className="flex-row justify-between mb-6">
            <View className="w-[48%]">
              <Text className="text-green-500 font-medium mb-2">단백질(g)</Text>
              <View className="border-b border-gray-300 pb-2">
                <TextInput
                  value={protein}
                  onChangeText={setProtein}
                  placeholder="ex) 130"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  className="text-base text-gray-500"
                />
              </View>
            </View>
            <View className="w-[48%]">
              <Text className="text-green-500 font-medium mb-2">지방(g)</Text>
              <View className="border-b border-gray-300 pb-2">
                <TextInput
                  value={fat}
                  onChangeText={setFat}
                  placeholder="ex) 200"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  className="text-base text-gray-500"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View className="px-5 pb-4 mt-4">
        <TouchableOpacity
          className="py-4 px-6 rounded-lg flex-row items-center justify-center w-full mb-8 bg-white border border-green-500"
          onPress={handleAddFood}
        >
          <Text className="font-medium text-lg text-center text-green-500">
            추가하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
