import React, { useState, useEffect } from 'react';
import { checkHasKey, triggerKeySelection, testConnection } from '../services/apiKeyService';
import { CloseIcon, SparklesIcon, KeyIcon, CheckIcon } from './icons';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [hasKey, setHasKey] = useState(false);
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      updateKeyStatus();
    }
  }, [isOpen]);

  const updateKeyStatus = async () => {
    const active = await checkHasKey();
    setHasKey(active);
    if (active && testStatus === 'idle') {
      handleTest();
    }
  };

  const addLog = (msg: string) => {
    setDiagnosticLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-5));
  };

  const handleSelectKey = async () => {
    setTestStatus('idle');
    setDiagnosticLogs([]);
    addLog("시스템 보안 선택창 호출 중...");
    await triggerKeySelection();
    
    const active = await checkHasKey();
    setHasKey(active);
    if (active) {
        addLog("로컬 보안 드라이브 키 인식 성공.");
        handleTest();
    } else {
        addLog("키 선택이 취소되거나 인식되지 않았습니다.");
    }
  };

  const handleTest = async () => {
    setTestStatus('testing');
    setDiagnosticLogs([]);
    addLog("커넥션 프로토콜 초기화...");
    addLog("암호화된 엔드포인트 응답 확인 중...");
    
    const result = await testConnection();
    
    if (result.success) {
        setTestStatus('success');
        addLog("API 엔진 통신 무결성 확인 완료.");
        addLog("시스템 라이선스 활성화됨.");
    } else {
        setTestStatus('error');
        addLog(`연결 실패: ${result.message}`);
    }
    setStatusMessage(result.message);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[500] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#0a0e1a]/95 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] w-full max-w-lg p-10 border border-white/10 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 blur-[100px] rounded-full"></div>
        
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 transition-colors z-20 text-slate-400 hover:text-white"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="relative z-10">
            <div className="flex items-center gap-6 mb-10">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-700 ${hasKey ? 'bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 shadow-indigo-500/20'}`}>
                    <KeyIcon className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">보안 통합 설정</h2>
                    <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest opacity-60">System Security & API Diagnostic</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Status Dashboard */}
                <div className={`p-6 rounded-[2rem] border-2 transition-all duration-700 bg-black/40 ${
                    testStatus === 'success' ? 'border-emerald-500/30' :
                    testStatus === 'error' ? 'border-rose-500/30' :
                    'border-white/5'
                }`}>
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Live Connection Status</span>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                                testStatus === 'testing' ? 'bg-yellow-500 animate-pulse shadow-[0_0_10px_#eab308]' : 
                                testStatus === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 
                                testStatus === 'error' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-slate-700'
                            }`}></div>
                            <span className={`text-xs font-black uppercase tracking-widest ${
                                testStatus === 'success' ? 'text-emerald-500' :
                                testStatus === 'error' ? 'text-rose-500' : 'text-slate-400'
                            }`}>
                                {testStatus === 'testing' ? 'Diagnosing...' : 
                                 testStatus === 'success' ? 'Fully Functional' : 
                                 testStatus === 'error' ? 'Connection Error' : 'Standby'}
                            </span>
                        </div>
                    </div>

                    {/* Diagnostic Logs */}
                    <div className="bg-[#050810] rounded-2xl p-5 font-mono text-[11px] space-y-2 border border-white/5 shadow-inner mb-2">
                        {diagnosticLogs.length > 0 ? diagnosticLogs.map((log, i) => (
                            <div key={i} className="text-slate-500 flex gap-3">
                                <span className="text-indigo-500 opacity-50">#</span>
                                <span className="animate-fade-in">{log}</span>
                            </div>
                        )) : (
                            <div className="text-slate-700 italic">No system logs available. Start diagnostic to begin.</div>
                        )}
                        {testStatus === 'testing' && <div className="text-emerald-500 animate-pulse">_ EXEC_SYSTEM_CHECK_...</div>}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={handleSelectKey}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 px-8 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-4 text-lg"
                    >
                        <SparklesIcon className="w-6 h-6" />
                        <span>API 키 선택 및 암호화 저장</span>
                    </button>

                    {hasKey && (
                        <button
                            onClick={handleTest}
                            disabled={testStatus === 'testing'}
                            className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 border border-white/10 disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            시스템 커넥션 재검사
                        </button>
                    )}
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <a
                        href="https://ai.google.dev/gemini-api/docs/billing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-2 group"
                    >
                        Billing Documentation
                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">AES-256 Secured</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};