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
      setStatus('success');
      setLog('기존 보안 인증 정보가 감지되었습니다.');
    } else {
      setStatus('idle');
      setLog('새로운 API 키 등록이 필요합니다.');
    }
  };

  const handleInputClick = async () => {
    setLog('시스템 보안 게이트웨이를 여는 중...');
    await triggerKeySelection();
    const active = await checkHasKey();
    setHasKey(active);
    if (active) {
      setLog('키 등록 완료. [연동 테스트 및 활성화]를 진행해주세요.');
      setStatus('idle'); // 테스트를 위해 대기 상태로
    }
  };

  const handleManualActivate = async () => {
    setIsProcessing(true);
    setStatus('testing');
    setLog('엔진 통신 무결성 테스트를 시작합니다...');
    
    try {
      // 1초 지연으로 시각적 피드백 제공
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await testConnection();
      
      if (result.success) {
        setStatus('success');
        setLog('인증 성공: 시스템이 활성화되었습니다.');
        // 앱 메인 상태 업데이트를 위해 약간의 지연 후 콜백
        if (onActivated) {
            setTimeout(onActivated, 800);
        }
      } else {
        setStatus('error');
        setLog(`인증 실패: ${result.message}`);
      }
    } catch (e) {
      setStatus('error');
      setLog('오류: 통신 프로토콜 응답 없음.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-[2000] flex items-center justify-center p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1117] rounded-[2.5rem] shadow-[0_0_100px_rgba(99,102,241,0.2)] w-full max-w-[450px] border border-white/10 relative overflow-hidden p-10 flex flex-col animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-5 mb-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                status === 'success' ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 
                status === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'
            }`}>
                {status === 'success' ? <CheckIcon className="w-8 h-8" /> : <KeyIcon className="w-8 h-8" />}
            </div>
            <div>
                <h2 className="text-2xl font-black text-white leading-tight tracking-tighter">Security Center</h2>
                <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${status === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`}></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        System {status === 'success' ? 'Active' : 'Locked'}
                    </p>
                </div>
            </div>
        </div>

        <div className="space-y-8">
            {/* Input Section */}
            <div className="group">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1 flex justify-between">
                    <span>Gemini API License Key</span>
                    {hasKey && <span className="text-emerald-500 text-[9px]">Registered</span>}
                </label>
                <div className="relative">
                    <input 
                        type="password"
                        readOnly
                        value={hasKey ? "************************" : ""}
                        placeholder="이곳을 클릭하여 키를 타이핑하세요..."
                        onClick={handleInputClick}
                        className="w-full bg-black/60 border border-white/5 rounded-2xl p-5 pl-14 text-sm font-mono text-indigo-300 cursor-pointer focus:outline-none focus:border-indigo-500/50 transition-all hover:bg-black/80 shadow-inner group-hover:border-white/20"
                    />
                    <KeyIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                    
                    {status === 'success' && (
                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                            <CheckIcon className="w-5 h-5 text-emerald-500" />
                        </div>
                    )}
                </div>
                <p className="mt-3 text-[10px] text-slate-500 font-bold leading-relaxed px-1">
                    * 보안을 위해 실제 타이핑은 암호화된 <span className="text-indigo-400">시스템 게이트웨이 창</span>에서 진행됩니다.
                </p>
            </div>

            {/* Diagnostic Console */}
            <div className="bg-black/40 rounded-2xl p-5 border border-white/5 shadow-inner">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Diagnostic Log</span>
                </div>
                <p className={`text-[12px] font-bold leading-relaxed ${
                    status === 'error' ? 'text-rose-400' : status === 'success' ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                    {log}
                </p>
            </div>

            {/* Activation Button */}
            <button
                onClick={handleManualActivate}
                disabled={!hasKey || isProcessing}
                className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-2xl ${
                    status === 'success'
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30'
                } disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed`}
            >
                {status === 'testing' ? (
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Verifying Connection...</span>
                    </div>
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5" />
                        <span>{status === 'success' ? '시스템 재연동 및 활성화' : '연동 테스트 및 활성화'}</span>
                    </>
                )}
            </button>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 text-center flex flex-col gap-3">
            <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] text-slate-500 hover:text-indigo-400 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
                <span>API 키 발급 가이드</span>
                <span className="text-[14px]">↗</span>
            </a>
            <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.3em]">
                Secure Encryption Standard v2.5
            </p>
        </div>
      </div>

      <style>{`
        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-zoom-in {
          animation: zoom-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};