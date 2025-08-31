import { Food } from '@/constants/schemas/food';
import { useFoodSearchQuery } from '@/hooks/record/query/useFoodSearchQuery';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface FoodSearchComponentProps {
  onFoodSelect: (food: Food) => void;
  placeholder?: string;
}

export const FoodSearchComponent: React.FC<FoodSearchComponentProps> = ({
  onFoodSelect,
  placeholder = '음식을 검색하세요...'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTrigger, setSearchTrigger] = useState('');

  const { data, isLoading, error } = useFoodSearchQuery(searchTrigger);
  
  // 디버그 로그
  React.useEffect(() => {
    console.log('🔍 FoodSearchComponent 상태 업데이트:');
    console.log('  - 검색어:', searchQuery);
    console.log('  - 검색 트리거:', searchTrigger);
    console.log('  - 로딩 상태:', isLoading);
    console.log('  - 에러 상태:', !!error);
    console.log('  - 데이터 존재:', !!data);
    if (data) {
      console.log('  - 데이터 구조:', Array.isArray(data.data) ? '배열' : '단일 객체');
      console.log('  - 검색 결과 개수:', Array.isArray(data.data) ? data.data.length : (data.data ? 1 : 0));
      console.log('  - 실제 데이터:', data.data);
    }
  }, [searchQuery, searchTrigger, isLoading, error, data]);

  const handleSubmit = () => {
    if (searchQuery.trim().length > 0) {
      setSearchTrigger(searchQuery.trim());
      console.log('🔍 엔터 키로 검색 실행:', searchQuery.trim());
    }
  };

  const handleFoodSelect = (food: Food) => {
    onFoodSelect(food);
    setSearchQuery('');
    setSearchTrigger(''); // 검색 결과 초기화
  };

  const renderFoodItem = ({ item }: { item: Food }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-200 bg-white"
      onPress={() => handleFoodSelect(item)}
    >
      <Text className="text-lg font-semibold text-gray-800">{item.menuName}</Text>
      <View className="flex-row mt-2 space-x-4">
        <Text className="text-sm text-gray-600">칼로리: {item.calories}kcal</Text>
        <Text className="text-sm text-gray-600">단백질: {item.protein}g</Text>
        <Text className="text-sm text-gray-600">지방: {item.fat}g</Text>
        <Text className="text-sm text-gray-600">탄수화물: {item.carbohydrate}g</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1">
      <View className="flex-row space-x-2">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg"
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoFocus
        />
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green-500 px-6 py-3 rounded-lg justify-center items-center"
        >
          <Text className="text-white font-semibold text-lg">검색</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading && (
        <View className="py-8">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="text-center mt-2 text-gray-600">검색 중...</Text>
        </View>
      )}
      
      {error && (
        <View className="py-8">
          <Text className="text-center text-red-500">검색 중 오류가 발생했습니다.</Text>
        </View>
      )}
      
      {data?.data && (
        <FlatList
          data={Array.isArray(data.data) ? data.data : [data.data]}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.foodId.toString()}
          className="mt-4"
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {data?.data && (Array.isArray(data.data) ? data.data.length === 0 : !data.data) && searchTrigger.length > 0 && (
        <View className="py-8">
          <Text className="text-center text-gray-600">검색 결과가 없습니다.</Text>
        </View>
      )}
    </View>
  );
};
