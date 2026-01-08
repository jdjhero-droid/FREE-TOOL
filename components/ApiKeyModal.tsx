import React, { useState, useEffect, useRef } from 'react';
import { triggerKeySelection, testConnection } from '../services/apiKeyService';
import { CloseIcon, CheckIcon, SparklesIcon } from './icons';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivated?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onActivated }) => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'testing'>('idle');
  const [log, setLog] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setStatus('idle');
      setLog('');
      // 모달이 열리면 즉시 입력 가능하도록 포커스
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 200);
    }
  }, [isOpen]);

  const handleSaveAndTest = async () => {
    // 1. 입력값이 비어있는지 확인
    const trimmedKey = inputValue.trim();
    
    setIsProcessing(true);
    setStatus('testing');
    setLog('입력하신 키로 통신 엔진을 테스트 중입니다...');
    
    try {
      // 2. 입력된 키로 직접 테스트 시도 (이게 가장 확실함)
      let result = await testConnection(trimmedKey);
      
      // 3. 만약 직접 입력으로 실패했는데, 시스템 창을 띄워야 할 상황이라면 보조적으로 호출
      if (!result.success && !trimmedKey) {
        setLog('시스템 보안 창에서 키를 선택해주세요...');
        await triggerKeySelection();
        // 시스템 창이 닫힌 후 잠시 대기
        await new Promise(r => setTimeout(r, 1000));
        result = await testConnection(); // 이번엔 시스템 변수로 재시도
      }
      
      if (result.success) {
        setStatus('success');
        setLog(result.message);
      } else {
        setStatus('error');
        setLog(result.message);
      }
    } catch (e: any) {
      setStatus('error');
      setLog('연동 중 예상치 못한 오류가 발생했습니다.');
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
            키는 브라우저 보안 세션 내에서만 안전하게 사용됩니다.
        </p>

        {/* Real Input Field */}
        <div className="relative mb-8 group">
            <div className={`w-full bg-[#242938] border-2 rounded-2xl transition-all ${
                status === 'success' ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 
                status === 'error' ? 'border-rose-500' :
                'border-[#6d28d9] group-hover:border-[#8b5cf6]'
            }`}>
                <input 
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveAndTest()}
                    placeholder="AlzaSy... 키를 여기에 붙여넣으세요"
                    className="w-full bg-transparent border-none outline-none py-5 px-6 text-white text-base font-medium placeholder-slate-600"
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
                MANUAL KEY CONTROL V3.1
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
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};