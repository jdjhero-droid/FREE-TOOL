import React, { useState, useEffect } from 'react';
import { checkHasKey, triggerKeySelection, testConnection } from '../services/apiKeyService';
import { CloseIcon, KeyIcon, CheckIcon, SparklesIcon } from './icons';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivated?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onActivated }) => {
  const [hasKey, setHasKey] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'testing'>('idle');
  const [log, setLog] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      refreshStatus();
    }
  }, [isOpen]);

  const refreshStatus = async () => {
    const active = await checkHasKey();
    setHasKey(active);
    if (active) {
      setLog('API 라이선스가 확인되었습니다. 저장 및 테스트를 진행하세요.');
    } else {
      setStatus('idle');
      setLog('');
    }
  };

  const handleInputAreaClick = async () => {
    try {
      await triggerKeySelection();
      const active = await checkHasKey();
      setHasKey(active);
      if (active) {
        setLog('키 연동 완료. [저장 및 테스트] 버튼을 눌러주세요.');
      }
    } catch (e) {
      setLog('연동 도중 오류가 발생했습니다.');
    }
  };

  const handleSaveAndTest = async () => {
    if (!hasKey) {
        await handleInputAreaClick();
        return;
    }

    setIsProcessing(true);
    setStatus('testing');
    setLog('통신 엔진 테스트 중...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const result = await testConnection();
      
      if (result.success) {
        setStatus('success');
        setLog('테스트 성공! 이제 시스템을 시작할 수 있습니다.');
      } else {
        setStatus('error');
        setLog(`오류: ${result.message}`);
      }
    } catch (e) {
      setStatus('error');
      setLog('통신 실패: 라이선스 정보를 다시 확인하세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalStart = () => {
      if (onActivated) onActivated();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#1e2530] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] w-full max-w-[480px] border border-white/5 relative overflow-hidden p-8 flex flex-col animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">API Key 설정</h2>
            <button
                onClick={onClose}
                className="p-1 text-slate-500 hover:text-white transition-colors"
            >
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed mb-8">
            Gemini API 키를 입력해주세요. 키는 당신의 브라우저에 암호화되어 안전하게 저장됩니다.
        </p>

        {/* Mock Input Field (Styled like the screenshot) */}
        <div className="relative mb-6">
            <div 
                onClick={handleInputAreaClick}
                className={`w-full bg-[#2a3241] border-2 rounded-xl p-4 h-16 flex items-center cursor-text transition-all ${
                    status === 'success' ? 'border-emerald-500/50' : 'border-[#6366f1]/50 hover:border-[#818cf8]'
                }`}
            >
                <div className="w-0.5 h-6 bg-indigo-400 animate-pulse mr-2"></div>
                <span className={`text-sm font-medium ${hasKey ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {hasKey ? '••••••••••••••••••••••••••••' : 'AlzaSy... 키를 여기에 붙여넣으세요'}
                </span>
                
                {status === 'success' && (
                    <div className="ml-auto">
                        <CheckIcon className="w-5 h-5 text-emerald-500" />
                    </div>
                )}
            </div>
            {hasKey && status !== 'success' && (
                <p className="absolute -bottom-6 left-1 text-[10px] text-indigo-400 font-bold animate-pulse">
                    키가 감지되었습니다. 아래 버튼을 눌러 활성화하세요.
                </p>
            )}
        </div>

        {/* Log Display */}
        {log && (
            <div className="mb-6 px-1">
                <p className={`text-xs font-bold ${
                    status === 'error' ? 'text-rose-400' : status === 'success' ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                    {log}
                </p>
            </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-4">
            {status === 'success' ? (
                <button
                    onClick={handleFinalStart}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                >
                    <SparklesIcon className="w-5 h-5" />
                    <span>메인 화면으로 진입하기</span>
                </button>
            ) : (
                <button
                    onClick={handleSaveAndTest}
                    disabled={isProcessing}
                    className="w-full bg-[#6d28d9] hover:bg-[#7c3aed] text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {status === 'testing' ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        <span>저장 및 테스트</span>
                    )}
                </button>
            )}
            
            <p className="text-[10px] text-slate-600 text-center mt-4 uppercase tracking-widest font-black opacity-50">
                Secure API Management v2.0
            </p>
        </div>
      </div>

      <style>{`
        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-zoom-in {
          animation: zoom-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};