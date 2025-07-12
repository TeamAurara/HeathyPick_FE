import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {useSignUpStore} from "@/stores/signup/SignupStore";

// props 인터페이스는 더 이상 필요 없음
// 하지만 기존 코드와의 호환성을 위해 일단 유지
interface CKDStepProps {
  ckdStage?: string | null;
  setCKDStage?: (stage: string) => void;
  nickname?: string;
}

const CKDStep: React.FC<CKDStepProps> = () => {
  // Zustand 스토어에서 상태와 액션 가져오기
  const { ckdStage, setCKDStage, nickname } = useSignUpStore();

  // CKD 단계 옵션
  const ckdOptions = ['1', '2', '3A', '3B', '4', '5'];

  return (
    <View className="flex-1">
      <View className="mb-8">
        <Text className="text-2xl font-bold text-center mb-2">
          CKD 단계를
        </Text>
        <Text className="text-2xl font-bold text-center">
          골라주세요
        </Text>
        <Text className="text-green-500 text-center mt-2">
          이제 거의 다 왔어요!
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {ckdOptions.map((stage) => (
          <TouchableOpacity
            key={stage}
            onPress={() => setCKDStage(stage)}
            style={[
              styles.optionButton,
              ckdStage === stage ? styles.selectedOption : styles.unselectedOption
            ]}
          >
            <Text
              style={[
                styles.optionText,
                ckdStage === stage ? styles.selectedText : styles.unselectedText
              ]}
            >
              {stage}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    width: '100%'
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20, // 선택지 간 간격 (20px)
    alignItems: 'center'
  },
  selectedOption: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#22C55E' // green-500
  },
  unselectedOption: {
    backgroundColor: '#F3F4F6' // gray-100
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center'
  },
  selectedText: {
    color: '#22C55E' // green-500
  },
  unselectedText: {
    color: '#4B5563' // gray-600
  }
});

export default CKDStep;
