import React, { useState, useCallback, useEffect } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { generateBackgroundAndPropsImage, generatePromptForBgProp } from '../services/geminiService';
import type { GeneratedImage, BgPropImage, GenerationConfig } from '../types';
import { CloseIcon, SparklesIcon, PhotoIcon } from './icons';
import { GenerationConfigSelector } from './GenerationConfigSelector';
import { ensureProApiKey } from '../services/apiKeyService';

const ImageUploader: React.FC<{
    title: string;
    image: { url: string } | null;
    onFileSelect: (file: File) => void;
    onClear: () => void;
    className?: string;
}> = ({ title, image, onFileSelect, onClear, className = 'h-64' }) => {
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const inputId = `file-upload-${title.replace(/\s/g, '-')}`;
    return (
        <div className="flex flex-col items-center group">
            <h3 className="text-xs font-black mb-2 text-[var(--text-secondary)] uppercase tracking-tighter">{title}</h3>
            <div 
                className={`w-full ${className} bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center border-2 border-dashed transition-all relative overflow-hidden ${isDraggingOver ? 'border-[var(--border-accent)] bg-[var(--bg-accent)]/5 scale-[0.98]' : 'border-[var(--border-primary)] hover:border-[var(--border-accent)]'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); if (e.dataTransfer.files[0]) onFileSelect(e.dataTransfer.files[0]); }}
            >
                {image ? (
                    <>
                        <img src={image.url} alt={title} className="w-full h-full object-cover" />
                        <button onClick={onClear} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                            <CloseIcon className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <PhotoIcon className="w-8 h-8 opacity-20" />
                )}
            </div>
            <label htmlFor={inputId} className="cursor-pointer bg-[var(--bg-interactive)] text-[var(--text-primary)] font-bold py-1.5 px-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all mt-2 text-[10px] uppercase shadow-sm">
                이미지 선택
            </label>
            <input id={inputId} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} />
        </div>
    );
};

interface BackgroundPropToolProps {
  addToHistory: (image: GeneratedImage) => void;
  onImageClick: (image: GeneratedImage) => void;
  mainImage: BgPropImage | null;
  onMainImageChange: (image: BgPropImage | null) => void;
  backgrounds: (BgPropImage | null)[];
  onBackgroundsChange: (images: (BgPropImage | null)[]) => void;
  propsImages: (BgPropImage | null)[];
  onPropsImagesChange: (images: (BgPropImage | null)[]) => void;
  userPrompt: string;
  onUserPromptChange: (prompt: string) => void;
  generatedImage: GeneratedImage | null;
  onGeneratedImageChange: (image: GeneratedImage | null) => void;
}

export const BackgroundPropTool: React.FC<BackgroundPropToolProps> = ({
    addToHistory, onImageClick, mainImage, onMainImageChange, backgrounds, onBackgroundsChange, propsImages, onPropsImagesChange, userPrompt, onUserPromptChange, generatedImage, onGeneratedImageChange
}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
    const [config, setConfig] = useState<GenerationConfig>({ model: 'nano-banana', aspectRatio: '1:1', imageSize: '1K' });

    const processAndSetImage = useCallback(async (file: File, target: 'main' | 'bg' | 'prop', index: number) => {
        if (file && file.type.startsWith('image/')) {
            try {
                const { base64, mimeType } = await fileToBase64(file);
                const url = `data:${mimeType};base64,${base64}`;
                const newImage = { data: base64, mime: mimeType, url };
                if (target === 'main') onMainImageChange(newImage);
                else if (target === 'bg') { const b = [...backgrounds]; b[index] = newImage; onBackgroundsChange(b); }
                else if (target === 'prop') { const p = [...propsImages]; p[index] = newImage; onPropsImagesChange(p); }
                onGeneratedImageChange(null); setError(null);
            } catch (err) { setError("파일 오류"); }
        }
    }, [onMainImageChange, backgrounds, onBackgroundsChange, propsImages, onPropsImagesChange, onGeneratedImageChange]);

    const handleGeneratePrompt = useCallback(async () => {
        if (!mainImage) { setError("메인 이미지를 먼저 업로드하세요."); return; }
        setIsGeneratingPrompt(true); setError(null);
        try { const p = await generatePromptForBgProp(mainImage, backgrounds, propsImages); onUserPromptChange(p); } 
        catch (err) { setError("프롬프트 생성 실패"); } finally { setIsGeneratingPrompt(false); }
    }, [mainImage, backgrounds, propsImages, onUserPromptChange]);

    const handleGenerate = useCallback(async () => {
        if (!mainImage) { setError("메인 이미지를 업로드하세요."); return; }
        if (config.model === 'nano-banana-pro') await ensureProApiKey();
        setIsGenerating(true); setError(null); onGeneratedImageChange(null);
        try {
            const src = await generateBackgroundAndPropsImage(mainImage, backgrounds, propsImages, userPrompt, config);
            const ts = Date.now();
            const res = { id: `${ts}-res`, src, name: 'Ad-Model Result', folder: `광고모델_${ts}`, timestamp: ts };
            addToHistory(res); onGeneratedImageChange(res);
        } catch (err) { setError("생성 실패"); } finally { setIsGenerating(false); }
    }, [mainImage, backgrounds, propsImages, userPrompt, addToHistory, onGeneratedImageChange, config]);

    return (
        <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl border-b-4 border-[var(--bg-accent)]">
                <h2 className="text-3xl font-black mb-2 text-center flex items-center justify-center gap-3">
                    <PhotoIcon className="w-8 h-8 text-[var(--bg-accent)]" />
                    광고모델
                </h2>
                <p className="text-[var(--text-secondary)] text-center mb-10 max-w-2xl mx-auto font-medium">인물을 메인으로 다양한 배경과 소품을 조합하여 전문적인 광고 화보를 제작합니다.</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-1">
                        <ImageUploader title="메인 모델" image={mainImage} onFileSelect={(f) => processAndSetImage(f, 'main', 0)} onClear={() => onMainImageChange(null)} className="h-96 shadow-xl border-solid border-2 border-[var(--bg-accent)]/20"/>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <ImageUploader title="배경 참조 1" image={backgrounds[0]} onFileSelect={(f) => processAndSetImage(f, 'bg', 0)} onClear={() => { const b=[...backgrounds]; b[0]=null; onBackgroundsChange(b); }} />
                        <ImageUploader title="배경 참조 2" image={backgrounds[1]} onFileSelect={(f) => processAndSetImage(f, 'bg', 1)} onClear={() => { const b=[...backgrounds]; b[1]=null; onBackgroundsChange(b); }} />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        <ImageUploader title="소품 1" image={propsImages[0]} onFileSelect={(f) => processAndSetImage(f, 'prop', 0)} onClear={() => { const p=[...propsImages]; p[0]=null; onPropsImagesChange(p); }} className="h-28" />
                        <ImageUploader title="소품 2" image={propsImages[1]} onFileSelect={(f) => processAndSetImage(f, 'prop', 1)} onClear={() => { const p=[...propsImages]; p[1]=null; onPropsImagesChange(p); }} className="h-28" />
                        <ImageUploader title="소품 3" image={propsImages[2]} onFileSelect={(f) => processAndSetImage(f, 'prop', 2)} onClear={() => { const p=[...propsImages]; p[2]=null; onPropsImagesChange(p); }} className="h-28" />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest px-1">광고 컨셉 및 지시사항</label>
                        <button onClick={handleGeneratePrompt} disabled={!mainImage || isGenerating || isGeneratingPrompt} className="bg-[var(--bg-info)] text-white font-black py-1.5 px-4 rounded-xl hover:bg-[var(--bg-info-hover)] transition-all disabled:opacity-30 flex items-center gap-2 text-[10px] shadow-sm">
                            {isGeneratingPrompt ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div> : <SparklesIcon className="w-3.5 h-3.5" />}
                            AI가 프롬프트 작성
                        </button>
                    </div>
                    <textarea rows={3} value={userPrompt} onChange={(e) => onUserPromptChange(e.target.value)} placeholder="광고의 분위기, 모델의 포즈, 배경의 느낌 등을 자유롭게 입력하세요." className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[var(--ring-accent)] outline-none resize-none font-medium" />
                </div>
            </div>
            <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl text-center border border-[var(--border-primary)]">
                 <GenerationConfigSelector config={config} setConfig={setConfig} />
                 <button onClick={handleGenerate} disabled={!mainImage || isGenerating} className="w-full max-w-sm bg-[var(--bg-accent)] text-white font-black py-4 px-10 rounded-2xl hover:bg-[var(--bg-accent-hover)] transition-all shadow-lg disabled:opacity-30 flex items-center justify-center mx-auto text-lg gap-3">
                    {isGenerating ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <PhotoIcon className="w-6 h-6" />}
                    {isGenerating ? '광고 제작 중...' : '광고 이미지 생성'}
                </button>
                {error && <p className="text-red-500 font-bold mt-4">{error}</p>}
            </div>
            
            {(isGenerating || generatedImage) && (
                 <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl border border-[var(--border-primary)] animate-fade-in">
                    <h2 className="text-xl font-black mb-6 border-l-4 border-[var(--bg-accent)] pl-4">최종 결과물</h2>
                    <div className="flex justify-center">
                         <div className="w-full max-w-2xl aspect-square bg-[var(--bg-tertiary)] rounded-3xl flex items-center justify-center relative group overflow-hidden shadow-2xl">
                            {isGenerating && <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--bg-accent)]"></div>}
                            {generatedImage && (
                                <button onClick={() => onImageClick(generatedImage)} className="w-full h-full relative">
                                    <img src={generatedImage.src} alt="Ad result" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                                        <p className="text-white text-lg font-black bg-[var(--bg-accent)] px-8 py-3 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">원본 보기</p>
                                    </div>
                                </button>
                            )}
                         </div>
                    </div>
                 </div>
            )}
        </div>
    );
};