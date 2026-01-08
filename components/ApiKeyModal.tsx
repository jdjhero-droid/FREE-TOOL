import React, { useState, useEffect, useRef } from 'react';
import { testConnection } from '../services/apiKeyService';
import { CloseIcon, CheckIcon, SparklesIcon } from './icons';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivated?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onActivated }) => {
  // 초기값으로 로컬 저장소의 키를 가져옵니다.
  const [inputValue, setInputValue] = useState(() => localStorage.getItem('WILD_TEACHER_API_KEY') || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'testing'>('idle');
  const [log, setLog] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setLog('');
      // 모달이 열리면 입력창에 포커스하여 즉시 입력 가능하게 함
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 200);
    }
  }, [isOpen]);

  const handleSaveAndTest = async () => {
    const trimmedKey = inputValue.trim();
    
    if (!trimmedKey) {
        setStatus('error');
        setLog('키를 입력해주세요.');
        return;
    }

    setIsProcessing(true);
    setStatus('testing');
    setLog('AI 엔진에 라이선스 키를 등록 중입니다...');
    
    try {
      // 1. 입력된 키로 직접 통신 테스트 수행 (성공 시 내부적으로 전역 키로 등록됨)
      const result = await testConnection(trimmedKey);
      
      if (result.success) {
        setStatus('success');
        setLog(result.message);
        // 약간의 지연 후 메인으로 진입하도록 유도하거나 자동 진입
      } else {
        setStatus('error');
        setLog(result.message);
      }
    } catch (e: any) {
      setStatus('error');
      setLog('연동 중 예외가 발생했습니다. 키를 다시 확인해주세요.');
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
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[2000] flex items-center justify-center p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#1b1f2b] rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)] w-full max-w-[500px] border border-white/5 relative overflow-hidden p-10 flex flex-col animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight">API Key 설정</h2>
            <button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-white transition-colors"
            >
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed mb-10 font-medium">
            Gemini API 키를 입력해주세요. <br/>
            한 번 등록된 키는 브라우저에 안전하게 보관되어 즉시 사용 가능합니다.
        </p>

        {/* Actual Input Field - 텍스트 입력 오류 완벽 수정 */}
        <div className="relative mb-8 group">
            <div className={`w-full bg-[#242938] border-2 rounded-2xl transition-all ${
                status === 'success' ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 
                status === 'error' ? 'border-rose-500' :
                'border-[#6d28d9] group-hover:border-[#8b5cf6]'
            }`}>
                <input 
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveAndTest()}
                    placeholder="AlzaSy... 키를 여기에 입력하세요"
                    className="w-full bg-transparent border-none outline-none py-5 px-6 text-white text-base font-medium placeholder-slate-600"
                    spellCheck={false}
                    autoComplete="off"
                />
            </div>
            
            {status === 'success' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-fade-in">
                    <CheckIcon className="w-6 h-6 text-emerald-500" />
                </div>
            )}
        </div>

        {/* Log Display */}
        {log && (
            <div className="mb-8 px-1 min-h-[20px]">
                <p className={`text-xs font-bold leading-tight animate-fade-in ${
                    status === 'error' ? 'text-rose-400' : 
                    status === 'success' ? 'text-emerald-400' : 
                    'text-indigo-400'
                }`}>
                    {log}
                </p>
            </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-4 mt-2">
            {status === 'success' ? (
                <button
                    onClick={handleFinalStart}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl transition-all transform active:scale-[0.98] shadow-2xl shadow-emerald-900/30 flex items-center justify-center gap-3 text-lg"
                >
                    <SparklesIcon className="w-6 h-6" />
                    <span>메인 화면으로 진입하기</span>
                </button>
            ) : (
                <button
                    onClick={handleSaveAndTest}
                    disabled={isProcessing}
                    className="w-full bg-[#6d28d9] hover:bg-[#7c3aed] text-white font-black py-5 rounded-2xl transition-all transform active:scale-[0.98] shadow-2xl shadow-indigo-900/40 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                >
                    {status === 'testing' ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                        <span>저장 및 테스트</span>
                    )}
                </button>
            )}
            
            <p className="text-[10px] text-slate-700 text-center mt-6 uppercase tracking-[0.3em] font-black opacity-40">
                MANUAL KEY CONTROL V3.2
            </p>
        </div>
      </div>

      <style>{`
        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-zoom-in {
          animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};