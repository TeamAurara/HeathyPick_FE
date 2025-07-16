import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Ionicons 타입을 위한 인터페이스 정의
interface MenuItem {
    id: string;
    title: string;
    icon: any; // Ionicons의 name 속성은 any 타입으로 처리
    action: () => void;
}

export default function MyPageScreen() {
    const router = useRouter();
    const [userData, setUserData] = useState<{ nickname: string, email: string } | null>(null);

    // 사용자 정보 불러오기
    useEffect(() => {
        const getUserData = async () => {
            try {
                const userString = await AsyncStorage.getItem('user');
                if (userString) {
                    const user = JSON.parse(userString);
                    setUserData(user);
                }
            } catch (error) {
                console.error("사용자 정보 로드 중 오류:", error);
            }
        };
        
        getUserData();
    }, []);

    // 로그아웃 처리 함수
    const handleLogout = async () => {
        try {
            // 확인 대화상자 표시
            Alert.alert(
                "로그아웃",
                "정말 로그아웃 하시겠습니까?",
                [
                    {
                        text: "취소",
                        style: "cancel"
                    },
                    {
                        text: "로그아웃",
                        onPress: async () => {
                            // AsyncStorage에서 토큰과 사용자 정보 삭제
                            await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user', 'userId']);
                            console.log("로그아웃 완료");
                            
                            // 로그인 화면으로 이동
                            router.replace("/login/KakaoScreen");
                        }
                    }
                ]
            );
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
            Alert.alert("오류", "로그아웃 처리 중 문제가 발생했습니다.");
        }
    };

    // 설정 메뉴 항목
    const menuItems: MenuItem[] = [
        { id: 'profile', title: '프로필 정보', icon: 'person-outline', action: () => console.log('프로필 정보') },
        { id: 'notification', title: '알림 설정', icon: 'notifications-outline', action: () => console.log('알림 설정') },
        { id: 'privacy', title: '개인정보 보호', icon: 'shield-outline', action: () => console.log('개인정보 보호') },
        { id: 'help', title: '도움말', icon: 'help-circle-outline', action: () => console.log('도움말') },
        { id: 'about', title: '앱 정보', icon: 'information-circle-outline', action: () => console.log('앱 정보') },
    ];

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* 헤더 */}
            <View className="px-6 pt-12 pb-4">
                <Text className="text-2xl font-bold">마이페이지</Text>
            </View>
            
            <ScrollView className="flex-1">
                {/* 사용자 프로필 섹션 */}
                <View className="mx-6 mb-6 bg-green-50 rounded-xl p-6 flex-row items-center">
                    {/* 프로필 이미지 */}
                    <View className="bg-green-100 rounded-full w-16 h-16 justify-center items-center">
                        <Ionicons name="person" size={30} color="#22c55e" />
                    </View>
                    
                    {/* 사용자 정보 */}
                    <View className="ml-4 flex-1">
                        <Text className="text-xl font-bold">{userData?.nickname || '사용자'}</Text>
                        <Text className="text-gray-500 mt-1">{userData?.email || 'user@example.com'}</Text>
                    </View>
                    
                    {/* 프로필 편집 버튼 */}
                    <TouchableOpacity 
                        className="bg-green-500 rounded-full p-2"
                        onPress={() => console.log('프로필 편집')}
                    >
                        <Ionicons name="pencil" size={18} color="white" />
                    </TouchableOpacity>
                </View>
                
                {/* 건강 정보 요약 */}
                <View className="mx-6 mb-6 bg-gray-50 rounded-xl p-4">
                    <Text className="font-bold mb-3">나의 건강 정보</Text>
                    <View className="flex-row justify-between">
                        <View className="items-center">
                            <Text className="text-gray-500">현재 체중</Text>
                            <Text className="font-bold text-lg">68kg</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-gray-500">목표 체중</Text>
                            <Text className="font-bold text-lg">65kg</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-gray-500">활동 레벨</Text>
                            <Text className="font-bold text-lg">보통</Text>
                        </View>
                    </View>
                </View>
                
                {/* 설정 메뉴 */}
                <View className="mx-6 mb-6 bg-gray-50 rounded-xl overflow-hidden">
                    {menuItems.map((item, index) => (
                        <TouchableOpacity 
                            key={item.id}
                            onPress={item.action}
                            className={`flex-row items-center p-4 ${
                                index < menuItems.length - 1 ? 'border-b border-gray-200' : ''
                            }`}
                        >
                            <Ionicons name={item.icon} size={22} color="#22c55e" />
                            <Text className="ml-3 flex-1">{item.title}</Text>
                            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                        </TouchableOpacity>
                    ))}
                </View>
                
                {/* 로그아웃 버튼 */}
                <View className="mx-6 mb-12">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-white border border-red-500 py-4 rounded-xl items-center"
                    >
                        <Text className="text-red-500 font-medium">로그아웃</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
