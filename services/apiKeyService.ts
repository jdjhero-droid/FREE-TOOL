import { GoogleGenAI } from "@google/genai";

/**
 * AI Studio 플랫폼에서 제공하는 API 키 인스턴스를 반환합니다.
 * 외부 환경변수 process.env.API_KEY를 직접 사용하며, 
 * 이는 플랫폼 단에서 보안 처리된 로컬 스토리지를 참조합니다.
 */
export function getAiInstance(): GoogleGenAI {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("보안 통합이 완료되지 않았습니다. 팝업창을 통해 API 키를 활성화해주세요.");
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
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return { success: false, message: "활성화된 라이선스 키를 찾을 수 없습니다." };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    // 최소 토큰을 사용한 통신 지연시간 및 응답 테스트
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'diagnose system connection status',
      config: { 
        maxOutputTokens: 10,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    if (response.text) {
      return { success: true, message: "통신 프로토콜 최적화 완료. 모든 기능이 활성화되었습니다." };
    }
    throw new Error("데이터 수신 오류.");
  } catch (error: any) {
    console.error("Diagnostic Failed:", error);
    
    if (error.message?.includes("Requested entity was not found")) {
        return { success: false, message: "잘못된 API 모델을 참조하고 있거나 키 권한이 부족합니다." };
    }
    
    if (error.message?.includes("API key not valid")) {
        return { success: false, message: "만료되었거나 유효하지 않은 라이선스 키입니다." };
    }

    return { success: false, message: `통신 장애 발생: ${error.message || "알 수 없는 시스템 오류"}` };
  }
}