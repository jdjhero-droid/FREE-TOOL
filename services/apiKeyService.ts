import { GoogleGenAI } from "@google/genai";

// 메모리 내에 현재 활성화된 키를 보관합니다.
let activeSessionKey = localStorage.getItem('WILD_TEACHER_API_KEY') || '';

/**
 * 전역적으로 사용될 API 키를 설정합니다.
 */
export function setGlobalApiKey(key: string) {
  activeSessionKey = key;
  localStorage.setItem('WILD_TEACHER_API_KEY', key);
}

/**
 * AI Studio 플랫폼 또는 수동 입력된 키를 바탕으로 GoogleGenAI 인스턴스를 반환합니다.
 * 호출 시점에 항상 가장 최신의 키를 참조합니다.
 */
export function getAiInstance(): GoogleGenAI {
  // 1. 사용자가 직접 입력한 키가 있다면 최우선 사용
  // 2. 없다면 시스템 환경 변수 사용
  const apiKey = activeSessionKey || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("활성화된 API 키가 없습니다. 설정에서 키를 입력해주세요.");
  }
  
  return new GoogleGenAI({ apiKey });
}

/**
 * 현재 시스템에 유효한 키가 존재하는지 확인합니다.
 */
export async function checkHasKey(): Promise<boolean> {
  if (activeSessionKey) return true;
  
  const win = window as any;
  if (win.aistudio && typeof win.aistudio.hasSelectedApiKey === 'function') {
    const hasPlatformKey = await win.aistudio.hasSelectedApiKey();
    if (hasPlatformKey) return true;
  }
  
  return !!process.env.API_KEY;
}

/**
 * 시스템 보안 드라이브의 API 키 선택 창을 실행합니다.
 */
export async function triggerKeySelection(): Promise<void> {
  const win = window as any;
  if (win.aistudio && typeof win.aistudio.openSelectKey === 'function') {
    await win.aistudio.openSelectKey();
  }
}

/**
 * Pro 엔진 사용 시 권한을 확인합니다.
 */
export async function ensureProApiKey(): Promise<void> {
  const hasKey = await checkHasKey();
  if (!hasKey) {
    await triggerKeySelection();
  }
}

/**
 * 엔진 통신 상태를 테스트하고, 성공 시 해당 키를 시스템 전역 키로 등록합니다.
 */
export async function testConnection(manualKey?: string): Promise<{ success: boolean; message: string }> {
  // 테스트할 키 결정 (인자로 넘어온 키 -> 세션 키 -> 환경 변수 순)
  const keyToTest = (manualKey || activeSessionKey || process.env.API_KEY || '').trim();
  
  if (!keyToTest) {
    return { success: false, message: "입력된 키가 없습니다. AI Studio에서 발급받은 키를 입력해주세요." };
  }

  try {
    // 테스트용 인스턴스 생성
    const testAi = new GoogleGenAI({ apiKey: keyToTest });
    
    // 모델 통신 시도 (가장 가벼운 설정으로 최소한의 확인만 수행)
    // .text 프로퍼티 접근 시 발생할 수 있는 잠재적 이슈를 방지하기 위해 호출 성공 여부 확인
    const response = await testAi.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'test',
      config: { 
        maxOutputTokens: 10,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    // 응답 객체가 존재하면 (에러가 발생하지 않고 여기까지 왔다면) 키는 유효함
    if (response) {
      setGlobalApiKey(keyToTest);
      return { 
        success: true, 
        message: "연동 성공! 모든 AI 엔진이 정상적으로 가동되었습니다." 
      };
    }
    
    throw new Error("응답을 수신하지 못했습니다.");
  } catch (error: any) {
    console.error("API Connectivity Test Error:", error);
    
    const errorMsg = error.message || "";
    
    // 403 Forbidden: 주로 키가 유효하지 않거나 제한된 경우
    if (errorMsg.includes("403") || errorMsg.includes("API key not valid") || errorMsg.includes("invalid")) {
      return { success: false, message: "유효하지 않은 API 키입니다. 키의 철자를 확인하거나 다시 발급받아주세요." };
    }
    
    // 404 Not Found: 모델 이름이 잘못되었거나 해당 리전에 서비스가 안되는 경우
    if (errorMsg.includes("404") || errorMsg.includes("not found")) {
      return { success: false, message: "해당 API 키로 선택된 AI 모델을 사용할 수 없습니다." };
    }

    // 429 Too Many Requests: 할당량 초과
    if (errorMsg.includes("429") || errorMsg.includes("quota")) {
      return { success: false, message: "API 할당량이 초과되었습니다. 잠시 후 다시 시도하거나 다른 키를 사용하세요." };
    }
    
    return { success: false, message: `통신 실패: ${errorMsg.length > 50 ? errorMsg.slice(0, 50) + "..." : errorMsg}` };
  }
}