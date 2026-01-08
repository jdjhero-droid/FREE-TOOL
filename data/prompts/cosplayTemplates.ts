import type { PromptTemplate } from '../../types';

export const COSPLAY_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    // Fix: Updated properties to match PromptTemplate interface (id, name, content).
    id: 'cosplay-female-vfx',
    name: '여케릭VFX',
    content: '이미지의 케릭터를 코스프레한 예쁜 한국 아이돌 소녀 클로즈업 샷으로 만들어줘. VFX 촬영장에서 스태프와 대화 하는 장면, 현장감이 느껴지는 라이팅, 필름 촬영 느낌, 아주사실적인 사진'
  },
  {
    // Fix: Updated properties to match PromptTemplate interface (id, name, content).
    id: 'cosplay-female-outdoor',
    name: '여케릭야외촬영',
    content: '이미지의 케릭터를 코스프레한 예쁜 한국 아이돌 소녀 클로즈업 샷. 야외 촬영 현장에서 촬영 준비 중, 스태프와 담소를 나누거나 메이크업을 고치며 대기하는 장면. 카메라를 의식하지 않고 자연스럽게 웃거나 고개를 돌린 모습. 햇빛과 반사판으로 보정된 자연광, 주변에는 카메라 장비와 삼각대, 케이블, 소품이 흩어져 있어 실제 현장 같은 분위기. 필름 카메라 질감의 다큐멘터리 스타일, 사실적이고 순간을 포착한 느낌의 사진'
  },
  {
    // Fix: Updated properties to match PromptTemplate interface (id, name, content).
    id: 'cosplay-male-vfx',
    name: '남케릭VFX',
    content: '이미지의 케릭터를 코스프레한 잘생긴 한국 아이돌 소년 클로즈업 샷으로 만들어줘. VFX 촬영장에서 스태프와 대화 하는 장면, 현장감이 느껴지는 라이팅, 필름 촬영 느낌, 아주사실적인 사진'
  },
  {
    // Fix: Updated properties to match PromptTemplate interface (id, name, content).
    id: 'cosplay-male-outdoor',
    name: '남케릭야외촬영',
    content: '이미지의 케릭터를 코스프레한 잘생긴 한국 아이돌 소년 클로즈업 샷. 야외 촬영 현장에서 촬영 준비 중, 스태프와 담소를 나누거나 메이크업을 고치며 대기하는 장면. 카메라를 의식하지 않고 자연스럽게 웃거나 고개를 돌린 모습. 햇빛과 반사판으로 보정된 자연광, 주변에는 카메라 장비와 삼각대, 케이블, 소품이 흩어져 있어 실제 현장 같은 분위기. 필름 카메라 질감의 다큐멘터리 스타일, 사실적이고 순간을 포착한 느낌의 사진'
  },
];
