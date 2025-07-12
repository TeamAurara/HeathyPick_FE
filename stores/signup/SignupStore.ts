import { create } from 'zustand';

// 활동 레벨 매핑 (한글 -> 백엔드 코드)
export const ACTIVITY_MAPPING: Record<string, string> = {
  '격한 운동을 많이 해요': 'MOVE_HARD',
  '잘 움직여요': 'MOVE_WELL',
  '약한 운동을 많이 해요': 'MOVE_LESS',
  '몸을 거의 움직이지 않아요': 'MOVE_NONE'
};

// 성별 매핑 (male/female -> 남자/여자)
export const GENDER_MAPPING: Record<string, string> = {
  'male': '남자',
  'female': '여자'
};

// 회원가입 상태 인터페이스 정의
interface SignUpState {
  // 사용자 기본 정보
  nickname: string;
  gender: 'male' | 'female' | null;
  age: number;
  activityLevel: string | null;
  ckdStage: string | null;
  
  // 신체 정보
  height: string;
  weight: string;
  targetWeight: string;
  
  // 회원가입 진행 상태
  currentStep: number;
  isCompleted: boolean;
  
  // 액션 (상태 변경 함수들)
  setNickname: (nickname: string) => void;
  setGender: (gender: 'male' | 'female' | null) => void;
  setAge: (age: number) => void;
  setActivityLevel: (level: string | null) => void;
  setCKDStage: (stage: string | null) => void;
  setHeight: (height: string) => void;
  setWeight: (weight: string) => void;
  setTargetWeight: (targetWeight: string) => void;
  
  // 단계 관리
  nextStep: () => void;
  prevStep: () => void;
  setCurrentStep: (step: number) => void;
  completeSignUp: () => void;
  resetSignUp: () => void;
  
  // 유효성 검사
  isCurrentStepValid: () => boolean;
  
  // 회원가입 데이터 가져오기
  getSignUpData: () => object;
}

// 회원가입 스토어 생성
export const useSignUpStore = create<SignUpState>((set, get) => ({
  // 초기 상태
  nickname: '',
  gender: null,
  age: 25,
  activityLevel: null,
  ckdStage: null,
  height: '',
  weight: '',
  targetWeight: '',
  currentStep: 1,
  isCompleted: false,
  
  // 상태 변경 함수들
  setNickname: (nickname) => set({ nickname }),
  setGender: (gender) => set({ gender }),
  setAge: (age) => set({ age }),
  setActivityLevel: (level) => set({ activityLevel: level }),
  setCKDStage: (stage) => set({ ckdStage: stage }),
  setHeight: (height) => set({ height }),
  setWeight: (weight) => set({ weight }),
  setTargetWeight: (targetWeight) => set({ targetWeight }),
  
  // 단계 관리
  nextStep: () => {
    const { currentStep, isCurrentStepValid } = get();
    if (isCurrentStepValid()) {
      set({ currentStep: currentStep + 1 });
    }
  },
  
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  completeSignUp: () => set({ isCompleted: true }),
  
  resetSignUp: () => set({
    nickname: '',
    gender: null,
    age: 25,
    activityLevel: null,
    ckdStage: null,
    height: '',
    weight: '',
    targetWeight: '',
    currentStep: 1,
    isCompleted: false
  }),
  
  // 현재 단계의 유효성 검사
  isCurrentStepValid: () => {
    const { 
      currentStep, 
      nickname, 
      gender, 
      age, 
      activityLevel, 
      ckdStage,
      height, 
      weight, 
      targetWeight 
    } = get();
    
    switch (currentStep) {
      case 1:
        return nickname.trim() !== '';
      case 2:
        return gender !== null;
      case 3:
        return age >= 10 && age <= 99;
      case 4:
        return activityLevel !== null;
      case 5:
        return ckdStage !== null;
      case 6:
        return height.trim() !== '' && weight.trim() !== '' && targetWeight.trim() !== '';
      default:
        return true;
    }
  },
  
  // 회원가입 데이터 가져오기 (서버 전송용)
  getSignUpData: () => {
    const { 
      nickname, 
      gender, 
      age, 
      activityLevel, 
      ckdStage,
      height, 
      weight, 
      targetWeight 
    } = get();
    
    // 백엔드 요구사항에 맞게 데이터 형식 변환
    return {
      nickname,
      gender: gender ? GENDER_MAPPING[gender] : null,
      age,
      activity: activityLevel ? ACTIVITY_MAPPING[activityLevel] : null,
      height: height ? parseInt(height) : null,
      weight: weight ? parseInt(weight) : null,
      goalWeight: targetWeight ? parseInt(targetWeight) : null,
      ckdLevel: ckdStage
    };
  }
})); 