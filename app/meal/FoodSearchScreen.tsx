import { IconSymbol } from '@/components/ui/IconSymbol';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useMealStore } from '../../stores/mealStore';

// 네비게이션 헤더 숨기기
export const options = {
  headerShown: false,
};

// 음식 검색 결과 타입
interface FoodSearchResult {
  id: number;
  name: string;
  calorie: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  brand?: string;
}

export default function FoodSearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const setSearchedFood = useMealStore((state) => state.setSearchedFood);

  const handleGoBack = () => {
    router.back();
  };

  // 검색 함수 (실제 API 호출로 대체 예정)
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('알림', '검색어를 입력해주세요.');
      return;
    }

    setIsSearching(true);

    try {
      // TODO: 실제 검색 API 호출
      // const response = await searchFoodAPI(searchQuery);
      
      // 임시 더미 데이터
      await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
      
      const dummyResults: FoodSearchResult[] = [
        {
          id: 1,
          name: '황금올리브치킨',
          calorie: 500,
          carbohydrate: 50,
          protein: 30,
          fat: 20,
          brand: 'BBQ'
        },
        {
          id: 2,
          name: '치킨무',
          calorie: 10,
          carbohydrate: 2,
          protein: 1,
          fat: 0,
          brand: 'BBQ'
        },
        {
          id: 3,
          name: '콜라',
          calorie: 150,
          carbohydrate: 40,
          protein: 0,
          fat: 0,
          brand: '코카콜라'
        }
      ];

      setSearchResults(dummyResults);
    } catch (error) {
      console.error('검색 실패:', error);
      Alert.alert('오류', '검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  // 음식 선택 (저장하지 않고 데이터만 전달)
  const handleSelectFood = (food: FoodSearchResult) => {
    // 전역 상태에 선택된 음식 정보 저장
    setSearchedFood({
      menuName: food.name,
      calorie: food.calorie,
      carbohydrate: food.carbohydrate,
      protein: food.protein,
      fat: food.fat,
      brand: food.brand
    });

    console.log('선택된 음식:', food.name);
    Alert.alert('선택 완료', `${food.name}이(가) 선택되었습니다.`);
    router.back();
  };

  // 검색 결과 아이템 렌더링
  const renderSearchResult = ({ item }: { item: FoodSearchResult }) => (
    <TouchableOpacity
      className="bg-white border border-gray-200 rounded-lg p-4 mb-3"
      onPress={() => handleSelectFood(item)}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800 mb-1">
            {item.name}
          </Text>
          {item.brand && (
            <Text className="text-sm text-gray-500 mb-2">
              {item.brand}
            </Text>
          )}
          <View className="flex-row space-x-4">
            <Text className="text-sm text-gray-600">
              칼로리: {item.calorie}kcal
            </Text>
            <Text className="text-sm text-gray-600">
              탄수화물: {item.carbohydrate}g
            </Text>
          </View>
          <View className="flex-row space-x-4 mt-1">
            <Text className="text-sm text-gray-600">
              단백질: {item.protein}g
            </Text>
            <Text className="text-sm text-gray-600">
              지방: {item.fat}g
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="bg-green-500 px-3 py-1 rounded-full"
          onPress={() => handleSelectFood(item)}
        >
          <Text className="text-white text-sm font-medium">
            선택
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      {/* 상단 헤더 */}
      <View className="pt-14 px-5 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleGoBack} className="p-1">
            <IconSymbol name="chevron.left" size={24} color="black" />
          </TouchableOpacity>
          <View className="flex-row items-center justify-center flex-1">
            <Image
              source={{ uri: 'https://via.placeholder.com/40' }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              className="mr-2"
            />
            <Text className="text-xl font-bold">음식 검색</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      </View>

      {/* 검색바 */}
      <View className="px-5 mb-4">
        <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
          <IconSymbol name="magnifyingglass" size={20} color="#666" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="음식명을 검색해주세요"
            placeholderTextColor="#999"
            className="flex-1 ml-3 text-base text-gray-800"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            onPress={handleSearch}
            disabled={isSearching}
            className="ml-2"
          >
            <Text className={`font-medium ${isSearching ? 'text-gray-400' : 'text-green-500'}`}>
              {isSearching ? '검색 중...' : '검색'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 검색 결과 */}
      <View className="flex-1 px-5">
        {isSearching ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">검색 중...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : searchQuery ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">검색 결과가 없습니다.</Text>
            <Text className="text-gray-400 text-sm mt-2">다른 검색어를 시도해보세요.</Text>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">음식을 검색해보세요</Text>
            <Text className="text-gray-400 text-sm mt-2">예: 치킨, 피자, 사과</Text>
          </View>
        )}
      </View>
    </View>
  );
} 