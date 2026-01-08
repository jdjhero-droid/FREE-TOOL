import React, { useState, useEffect } from 'react';
import { checkHasKey, triggerKeySelection, testConnection } from '../services/apiKeyService';
// Fix: Added SparklesIcon to the imports from ./icons
import { CloseIcon, KeyIcon, CheckIcon, SparklesIcon } from './icons';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [hasKey, setHasKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen) {
      refreshStatus();
    }
  }, [isOpen]);

  const refreshStatus = async () => {
    const active = await checkHasKey();
    setHasKey(active);
    if (active) setStatus('success');
    else setStatus('idle');
  };

  const handleActivate = async () => {
    setIsTesting(true);
    try {
      // 보안 가이드라인에 따라 시스템 제공 보안창을 통해 키를 입력/선택합니다.
      await triggerKeySelection();
      
      // 키 선택 후 즉시 상태 업데이트 시도
      const active = await checkHasKey();
      setHasKey(active);
      
      if (active) {
        const result = await testConnection();
        setStatus(result.success ? 'success' : 'error');
      }
    } catch (e) {
      setStatus('error');
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[2000] flex items-center justify-center p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1f2e] rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] w-full max-w-[420px] border border-white/10 relative overflow-hidden p-10 flex flex-col animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                {status === 'success' ? <CheckIcon className="w-6 h-6" /> : <KeyIcon className="w-6 h-6" />}
            </div>
            <div>
                <h2 className="text-xl font-black text-white leading-tight">API 보안 설정</h2>
                <p className={`text-[10px] font-black uppercase tracking-widest ${status === 'success' ? 'text-emerald-500' : 'text-slate-500'}`}>
                    {status === 'success' ? 'System Active' : 'Waiting for activation'}
                </p>
            </div>
        </div>

        <div className="space-y-6">
            {/* Simulated Input Field Area */}
            <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Gemini API Key</label>
                <div 
                    onClick={handleActivate}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-indigo-500/50 transition-all group shadow-inner"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <KeyIcon className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        <span className="text-sm font-mono text-slate-400 truncate">
                            {hasKey ? '••••••••••••••••••••••••••••' : 'API 키를 입력하세요...'}
                        </span>
                    </div>
                    {!hasKey && (
                        <span className="text-[10px] font-black text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">입력하기</span>
                    )}
                </div>
            </div>

            {/* Connection Feedback Area */}
            <div className="bg-black/20 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">연동 상태</span>
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse' : 'bg-slate-700'}`}></div>
                    <span className={`text-[11px] font-bold ${status === 'success' ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {status === 'success' ? '연동 완료' : '미연동'}
                    </span>
                </div>
            </div>

            {/* Main Action Button */}
            <button
                onClick={handleActivate}
                disabled={isTesting}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
                    status === 'success'
                    ? 'bg-slate-800 text-white hover:bg-slate-700 border border-white/5'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20'
                }`}
            >
                {isTesting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                    <>
                        <SparklesIcon className="w-4 h-4" />
                        <span>{status === 'success' ? 'API키 선택하기' : '키 입력 및 활성화'}</span>
                    </>
                )}
            </button>
        </div>

        {status === 'error' && (
            <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <p className="text-[11px] font-bold text-rose-500 text-center leading-relaxed">
                    활성화에 실패했습니다.<br/>유효한 API 키인지 다시 확인해 주세요.
                </p>
            </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[9px] text-slate-600 font-bold text-center leading-relaxed italic">
                * 보안을 위해 실제 키 입력은 시스템 보안 대화상자에서 처리됩니다.
            </p>
        </div>
      </div>

      <style>{`
        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-zoom-in {
          animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};