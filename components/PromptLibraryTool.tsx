import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { creativeAndUtility } from '../data/prompts/creativeAndUtility';
import { objectsAndProducts } from '../data/prompts/objectsAndProducts';
import { peopleAndCharacters } from '../data/prompts/peopleAndCharacters';
import { scenesAndEnvironments } from '../data/prompts/scenesAndEnvironments';
import { stylesAndEffects } from '../data/prompts/stylesAndEffects';
import type { Category, Case, GeneratedImage, GenerationConfig } from '../types';
import { fileToBase64 } from '../utils/fileUtils';
import { editImageWithNanoBanana, regeneratePromptVariation } from '../services/geminiService';
import { CloseIcon, SparklesIcon, BookOpenIcon, PhotoIcon } from './icons';
import { GenerationConfigSelector } from './GenerationConfigSelector';
import { ensureProApiKey } from '../services/apiKeyService';

const ALL_CATEGORIES: Category[] = [ peopleAndCharacters, objectsAndProducts, scenesAndEnvironments, stylesAndEffects, creativeAndUtility ];

const CaseCard: React.FC<{ caseItem: Case, onSelect: () => void }> = ({ caseItem, onSelect }) => {
    return (
        <button
            onClick={onSelect}
            className="bg-[var(--bg-secondary)] rounded-2xl p-5 flex flex-col h-full shadow-lg border border-[var(--border-primary)] hover:border-[var(--border-accent)] hover:shadow-xl hover:translate-y-[-4px] transition-all text-left group"
        >
            <h3 className="text-base font-black text-[var(--text-accent)] mb-2 group-hover:text-[var(--bg-accent)]">{caseItem.name}</h3>
            <p className="text-sm text-[var(--text-primary)] font-medium flex-grow mb-4 leading-relaxed line-clamp-3">{caseItem.description}</p>
            <div className="bg-[var(--bg-tertiary)]/50 p-3 rounded-xl mb-4">
                <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase mb-1">PRO-TIP</p>
                <p className="text-xs text-[var(--text-primary)] italic">"{caseItem.suggestionHint}"</p>
            </div>
            <div className="mt-auto pt-3 border-t border-[var(--border-primary)] flex justify-between items-center">
                <span className="text-[10px] text-[var(--text-secondary)] font-bold">Author: {caseItem.author}</span>
                <a href={caseItem.href} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-[var(--bg-accent)] hover:underline" onClick={(e) => e.stopPropagation()}>SOURCE ↗</a>
            </div>
        </button>
    );
};

interface PromptLibraryToolProps {
  addToHistory: (image: GeneratedImage) => void;
  onImageClick: (image: GeneratedImage) => void;
}

export const PromptLibraryTool: React.FC<PromptLibraryToolProps> = ({ addToHistory, onImageClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sourceImage, setSourceImage] = useState<{ data: string; mime: string; url: string } | null>(null);
    const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
    const [currentPrompt, setCurrentPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegeneratingPrompt, setIsRegeneratingPrompt] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [config, setConfig] = useState<GenerationConfig>({ model: 'nano-banana', aspectRatio: '1:1', imageSize: '1K' });

    const processFile = useCallback(async (file: File) => {
        if (file && file.type.startsWith('image/')) {
            try {
                const { base64, mimeType } = await fileToBase64(file);
                setSourceImage({ data: base64, mime: mimeType, url: `data:${mimeType};base64,${base64}` });
                setGeneratedImage(null); setError(null);
            } catch (err) { setError("파일 로드 실패"); }
        }
    }, []);

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const f = e.clipboardData?.items[0]?.getAsFile();
            if(f) processFile(f);
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [processFile]);

    const handleGenerate = async () => {
        if (!sourceImage || !currentPrompt.trim()) { setError("이미지와 프롬프트가 필요합니다."); return; }
        if (config.model === 'nano-banana-pro') await ensureProApiKey();
        setIsLoading(true); setError(null); setGeneratedImage(null);
        try {
            const src = await editImageWithNanoBanana(sourceImage.data, sourceImage.mime, currentPrompt, config);
            const ts = Date.now();
            const res = { id: `${ts}-res`, src, name: 'Generated Image', folder: `FUN프롬포트_${ts}`, timestamp: ts };
            addToHistory(res); setGeneratedImage(res);
        } catch (err) { setError("생성 실패"); } finally { setIsLoading(false); }
    };
    
    const handleRegeneratePrompt = async () => {
        if (!sourceImage || !currentPrompt.trim()) return;
        setIsRegeneratingPrompt(true); setError(null);
        try { const p = await regeneratePromptVariation(sourceImage.data, sourceImage.mime, currentPrompt); setCurrentPrompt(p); } 
        catch (err) { setError("재생성 실패"); } finally { setIsRegeneratingPrompt(false); }
    };

    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) return ALL_CATEGORIES;
        const low = searchTerm.toLowerCase();
        return ALL_CATEGORIES.map(c => ({
            ...c, cases: c.cases.filter(caseItem => 
                caseItem.name.toLowerCase().includes(low) || caseItem.description.toLowerCase().includes(low) || caseItem.prompt.toLowerCase().includes(low)
            )
        })).filter(c => c.cases.length > 0);
    }, [searchTerm]);

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex-shrink-0 bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl border-b-4 border-[var(--bg-accent)] text-center">
                <h2 className="text-3xl font-black flex items-center justify-center gap-3">
                    <BookOpenIcon className="w-8 h-8 text-[var(--bg-accent)]" />
                    FUN 프롬포트
                </h2>
                <p className="text-[var(--text-secondary)] font-medium mt-2">전 세계의 창의적인 나노바나나 활용 사례와 프롬프트를 만나보세요.</p>
            </div>

            <div className="flex-shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl border border-[var(--border-primary)]">
                <div 
                    className={`h-[500px] flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-3xl p-6 transition-all relative overflow-hidden ${isDraggingOver ? 'border-[var(--border-accent)] bg-[var(--bg-accent)]/5 scale-[0.98]' : 'border-[var(--border-primary)] hover:border-[var(--border-accent)]'}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }}
                >
                    {sourceImage ? (
                        <div className="relative w-full h-full group">
                            <img src={sourceImage.url} alt="Uploaded" className="max-h-full max-w-full w-full h-full object-contain rounded-2xl shadow-xl" />
                            <button onClick={() => setSourceImage(null)} className="absolute top-4 right-4 bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 shadow-2xl transition-all scale-0 group-hover:scale-100">
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[var(--bg-accent)]/10 transition-all">
                                <PhotoIcon className="w-10 h-10 text-[var(--text-secondary)]" />
                            </div>
                            <h3 className="text-xl font-black text-[var(--text-primary)]">이미지 분석 & 편집</h3>
                            <label htmlFor="lib-file-upload" className="mt-6 cursor-pointer inline-block bg-[var(--bg-accent)] text-white font-black py-3 px-8 rounded-2xl hover:bg-[var(--bg-accent-hover)] transition-all shadow-lg active:scale-95">이미지 선택</label>
                            <input id="lib-file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
                        </div>
                    )}
                </div>
                
                <div className="flex flex-col gap-6">
                    <div className="flex-grow flex flex-col min-h-0">
                        <div className="flex justify-between items-center mb-3 px-1">
                            <label className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest">프롬프트 워크스페이스</label>
                            <button onClick={handleRegeneratePrompt} disabled={isLoading || isRegeneratingPrompt || !sourceImage || !currentPrompt.trim()} className="bg-[var(--bg-info)] text-white font-black py-1.5 px-4 rounded-xl hover:bg-[var(--bg-info-hover)] transition-all disabled:opacity-30 flex items-center gap-2 text-[10px]">
                                {isRegeneratingPrompt ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div> : <SparklesIcon className="w-3.5 h-3.5" />}
                                AI 보정
                            </button>
                        </div>
                        <textarea
                            value={currentPrompt}
                            onChange={(e) => setCurrentPrompt(e.target.value)}
                            placeholder="아래 라이브러리에서 케이스를 선택하거나, 원하는 편집 내용을 입력하세요."
                            className="flex-grow w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-3xl p-5 text-sm focus:ring-2 focus:ring-[var(--ring-accent)] outline-none resize-none font-medium shadow-inner"
                        />
                    </div>
                    <div className="space-y-4">
                        <GenerationConfigSelector config={config} setConfig={setConfig} />
                        <button onClick={handleGenerate} disabled={isLoading || !sourceImage} className="w-full bg-[var(--bg-positive)] text-white font-black py-4 px-8 rounded-2xl hover:bg-[var(--bg-positive-hover)] transition-all shadow-lg disabled:opacity-30 text-lg flex items-center justify-center gap-3">
                            {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <SparklesIcon className="w-6 h-6" />}
                            {isLoading ? '이미지 생성 중...' : '마법 실행'}
                        </button>
                    </div>
                    {error && <p className="text-red-500 font-bold text-center text-xs">{error}</p>}
                    <div className="h-52 bg-[var(--bg-tertiary)] rounded-3xl flex items-center justify-center relative group overflow-hidden border border-[var(--border-primary)] shadow-inner">
                        {isLoading && <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[var(--bg-accent)]"></div>}
                        {generatedImage && !isLoading && (
                            <button onClick={() => onImageClick(generatedImage)} className="w-full h-full relative">
                                <img src={generatedImage.src} alt="Result" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <span className="bg-white/90 text-black px-5 py-2 rounded-full font-black text-xs">상세 보기</span>
                                </div>
                            </button>
                        )}
                        {!generatedImage && !isLoading && <div className="text-center opacity-20"><SparklesIcon className="w-12 h-12 mx-auto mb-2" /><p className="text-[10px] font-black uppercase">Result Output</p></div>}
                    </div>
                </div>
            </div>

            <div className="flex-grow flex flex-col bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl overflow-hidden border border-[var(--border-primary)]">
                <div className="relative mb-8">
                    <input type="text" placeholder="아이디어 검색 (예: 3D, 레고, 일러스트...)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-2xl p-4 pl-12 text-md focus:ring-2 focus:ring-[var(--ring-accent)] outline-none font-bold shadow-sm" />
                    <BookOpenIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--text-secondary)]" />
                </div>
                <div className="flex-grow overflow-y-auto pr-2 space-y-12">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map(c => (
                            <div key={c.name} className="animate-fade-in">
                                <h2 className="text-2xl font-black text-[var(--text-primary)] mb-6 pb-2 border-b-2 border-[var(--bg-accent)]/20 inline-block">{c.name}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {c.cases.map(caseItem => (
                                        <CaseCard key={caseItem.id} caseItem={caseItem} onSelect={() => setCurrentPrompt(caseItem.prompt)} />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 opacity-20">
                            <BookOpenIcon className="w-20 h-20 mx-auto mb-4" />
                            <p className="text-xl font-black">검색 결과가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};