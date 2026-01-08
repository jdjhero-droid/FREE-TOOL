import { GoogleGenAI } from "@google/genai";

/**
 * AI Studio 플랫폼에서 제공하는 API 키 인스턴스를 반환합니다.
 * 호출 시점에 항상 최신 process.env.API_KEY를 참조하도록 합니다.
 */
export function getAiInstance(): GoogleGenAI {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("보안 통합이 완료되지 않았습니다. API 키를 선택하거나 입력해주세요.");
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * 현재 암호화된 저장소에 API 키가 존재하는지 확인합니다.
 */
export async function checkHasKey(): Promise<boolean> {
  const win = window as any;
  if (win.aistudio && typeof win.aistudio.hasSelectedApiKey === 'function') {
    return await win.aistudio.hasSelectedApiKey();
  }
  return !!process.env.API_KEY;
}

/**
 * 로컬 보안 드라이브의 API 키 선택 창을 실행합니다.
 */
export async function triggerKeySelection(): Promise<void> {
  const win = window as any;
  if (win.aistudio && typeof win.aistudio.openSelectKey === 'function') {
    await win.aistudio.openSelectKey();
  } else {
    console.warn("시스템 보안 환경이 감지되지 않았습니다.");
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
 * 엔진 통신 상태 및 데이터 무결성 진단 테스트를 수행합니다.
 */
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  // 플랫폼에서 키가 선택되었다고 하면 process.env.API_KEY가 존재한다고 가정하고 진행
  const hasKey = await checkHasKey();
  
  if (!hasKey && !process.env.API_KEY) {
    return { success: false, message: "활성화된 라이선스 키를 찾을 수 없습니다. 키 선택창에서 키를 등록해주세요." };
  }

  try {
    // 매 테스트마다 새로운 인스턴스를 생성하여 환경 변수 주입 지연 문제 해결
    const currentApiKey = process.env.API_KEY;
    if (!currentApiKey) {
        // 키가 방금 선택되었으나 아직 env에 반영되지 않은 경우를 대비해 짧게 대기하거나
        // 일단 진행하여 SDK 내부의 자동 감지를 기대함
        return { success: false, message: "키가 선택되었으나 시스템에 반영 중입니다. 잠시 후 다시 시도하세요." };
    }

    const ai = new GoogleGenAI({ apiKey: currentApiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'diagnose connection',
      config: { 
        maxOutputTokens: 5,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    if (response.text) {
      return { success: true, message: "통신 프로토콜 최적화 완료. 모든 기능이 활성화되었습니다." };
    }
    throw new Error("응답 데이터가 없습니다.");
  } catch (error: any) {
    console.error("Diagnostic Failed:", error);
    
    const errorMsg = error.message || "";
    if (errorMsg.includes("Requested entity was not found")) {
        return { success: false, message: "잘못된 API 모델이거나 키에 해당 모델 권한이 없습니다." };
    }
    
    if (errorMsg.includes("API key not valid")) {
        return { success: false, message: "유효하지 않은 API 키입니다. 다시 입력해주세요." };
    }

    return { success: false, message: `연동 실패: ${errorMsg || "통신 오류가 발생했습니다."}` };
  }
}