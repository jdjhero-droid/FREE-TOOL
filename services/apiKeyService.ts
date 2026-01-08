import { GoogleGenAI } from "@google/genai";

/**
 * AI Studio 플랫폼에서 제공하는 API 키 인스턴스를 반환합니다.
 */
export function getAiInstance(): GoogleGenAI {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API 키가 설정되지 않았습니다.");
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
 * 엔진 통신 상태를 테스트합니다. 
 * manualKey가 제공되면 해당 키를 우선 사용합니다.
 */
export async function testConnection(manualKey?: string): Promise<{ success: boolean; message: string }> {
  // 사용자가 직접 입력한 키가 있거나, 시스템에 이미 주입된 키가 있는지 확인
  const keyToUse = manualKey || process.env.API_KEY;
  
  if (!keyToUse) {
    // 키가 아예 없는 경우에만 플랫폼 체크 수행
    const hasPlatformKey = await checkHasKey();
    if (!hasPlatformKey) {
      return { success: false, message: "입력된 키가 없습니다. AlzaSy...로 시작하는 키를 입력해주세요." };
    }
    // 플랫폼에는 있지만 아직 process.env에 반영 안 된 경우 (드문 케이스)
    return { success: false, message: "시스템 연동 중입니다. 잠시 후 다시 '저장 및 테스트'를 눌러주세요." };
  }

  try {
    // 입력된 키로 직접 AI 인스턴스 생성 (가장 확실한 방법)
    const ai = new GoogleGenAI({ apiKey: keyToUse });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'hi',
      config: { 
        maxOutputTokens: 5,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    if (response && response.text) {
      return { success: true, message: "연동 성공! 엔진이 정상적으로 가동되었습니다." };
    }
    throw new Error("응답 형식이 올바르지 않습니다.");
  } catch (error: any) {
    console.error("Connection Test Error:", error);
    
    const errorMsg = error.message || "";
    if (errorMsg.includes("API key not valid") || errorMsg.includes("403")) {
      return { success: false, message: "유효하지 않은 API 키입니다. 키를 다시 확인해주세요." };
    }
    if (errorMsg.includes("Requested entity was not found")) {
      return { success: false, message: "해당 키로 이 모델을 사용할 권한이 없습니다." };
    }
    
    return { success: false, message: `통신 실패: ${errorMsg.slice(0, 50)}...` };
  }
}