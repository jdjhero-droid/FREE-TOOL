import React, { useState, useCallback, useEffect } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { generateCosplayImage } from '../services/geminiService';
import type { GeneratedImage, CosplayMainImage, CosplayRefImage, GenerationConfig } from '../types';
import { CloseIcon, ArrowLeftCircleIcon, ArrowRightCircleIcon, MaskIcon } from './icons';
import { COSPLAY_PROMPT_TEMPLATES } from '../data/prompts/cosplayTemplates';
import { GenerationConfigSelector } from './GenerationConfigSelector';
import { ensureProApiKey } from '../services/apiKeyService';

interface CosplayToolProps {
  addToHistory: (image: GeneratedImage) => void;
  onImageClick: (image: GeneratedImage) => void;
  mainImage: CosplayMainImage | null;
  onMainImageChange: (image: CosplayMainImage | null) => void;
  refImage: CosplayRefImage | null;
  onRefImageChange: (image: CosplayRefImage | null) => void;
  mainPrompt: string;
  onMainPromptChange: (prompt: string) => void;
  backgroundPrompt: string;
  onBackgroundPromptChange: (prompt: string) => void;
  generatedImage: GeneratedImage | null;
  onGeneratedImageChange: (image: GeneratedImage | null) => void;
}

const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
};

const cropImage = async (imageUrl: string, mimeType: string, targetAspectRatio: number): Promise<{ data: string; mime: string; url: string }> => {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageUrl;
    });
    const sourceWidth = image.naturalWidth;
    const sourceHeight = image.naturalHeight;
    const sourceAspectRatio = sourceWidth / sourceHeight;
    let sx = 0, sy = 0, sWidth = sourceWidth, sHeight = sourceHeight;
    if (sourceAspectRatio > targetAspectRatio) {
        sWidth = sourceHeight * targetAspectRatio;
        sx = (sourceWidth - sWidth) / 2;
    } else if (sourceAspectRatio < targetAspectRatio) {
        sHeight = sourceWidth / targetAspectRatio;
        sy = (sourceHeight - sHeight) / 2;
    }
    const canvas = document.createElement('canvas');
    canvas.width = sWidth; canvas.height = sHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas Error');
    ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
    const croppedDataUrl = canvas.toDataURL(mimeType);
    const [header, data] = croppedDataUrl.split(',');
    return { data, mime: mimeType, url: croppedDataUrl };
};

const ImageUploader: React.FC<{
    title: string;
    image: { url: string } | null;
    onFileSelect: (file: File) => void;
    onClear: () => void;
}> = ({ title, image, onFileSelect, onClear }) => {
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const inputId = `file-upload-${title.replace(/\s/g, '-')}`;
    return (
        <div className="flex flex-col items-center group">
            <h3 className="text-sm font-black mb-3 text-[var(--text-secondary)] uppercase tracking-widest">{title}</h3>
            <div 
                className={`w-full h-64 bg-[var(--bg-tertiary)] rounded-3xl flex items-center justify-center border-2 border-dashed transition-all relative overflow-hidden ${isDraggingOver ? 'border-[var(--border-accent)] bg-[var(--bg-accent)]/5 scale-[0.98]' : 'border-[var(--border-primary)] hover:border-[var(--border-accent)]'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); if (e.dataTransfer.files[0]) onFileSelect(e.dataTransfer.files[0]); }}
            >
                {image ? (
                    <>
                        <img src={image.url} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <button onClick={onClear} className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-xl transition-all scale-0 group-hover:scale-100">
                            <CloseIcon className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <div className="text-center opacity-30">
                        <MaskIcon className="w-12 h-12 mx-auto mb-3" />
                        <p className="text-xs font-black">DROP IMAGE</p>
                    </div>
                )}
            </div>
            <label htmlFor={inputId} className="cursor-pointer bg-[var(--bg-interactive)] text-[var(--text-primary)] font-bold py-2 px-5 rounded-xl hover:bg-[var(--bg-accent)] hover:text-white transition-all mt-4 text-xs shadow-sm">
                이미지 선택
            </label>
            <input id={inputId} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} />
        </div>
    );
};

export const CosplayTool: React.FC<CosplayToolProps> = ({ 
    addToHistory, onImageClick, mainImage, onMainImageChange, refImage, onRefImageChange, mainPrompt, onMainPromptChange, backgroundPrompt, onBackgroundPromptChange, generatedImage, onGeneratedImageChange
}) => {
    const [croppedRefImage, setCroppedRefImage] = useState<{ data: string; mime: string; url: string } | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [config, setConfig] = useState<GenerationConfig>({ model: 'nano-banana', aspectRatio: '1:1', imageSize: '1K' });
    const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);

    const processAndSetImage = useCallback(async (file: File, target: 'main' | 'ref') => {
        if (file && file.type.startsWith('image/')) {
            try {
                const { base64, mimeType } = await fileToBase64(file);
                const url = `data:${mimeType};base64,${base64}`;
                if (target === 'main') {
                    const { width, height } = await getImageDimensions(url);
                    onMainImageChange({ data: base64, mime: mimeType, url, aspectRatio: (width > 0 && height > 0) ? width / height : 1 });
                } else onRefImageChange({ data: base64, mime: mimeType, url });
                onGeneratedImageChange(null); setError(null);
            } catch (err) { setError("파일 오류"); }
        }
    }, [onMainImageChange, onRefImageChange, onGeneratedImageChange]);
    
    useEffect(() => {
        if (!refImage) { setCroppedRefImage(null); return; }
        if (mainImage) cropImage(refImage.url, refImage.mime, mainImage.aspectRatio).then(setCroppedRefImage).catch(() => setCroppedRefImage(refImage));
        else setCroppedRefImage(refImage);
    }, [mainImage, refImage]);
    
    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const file = event.clipboardData?.items[0]?.getAsFile();
            if (file) processAndSetImage(file, !mainImage ? 'main' : 'ref');
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [mainImage, processAndSetImage]);

    useEffect(() => {
      if (COSPLAY_PROMPT_TEMPLATES[currentTemplateIndex]) onBackgroundPromptChange(COSPLAY_PROMPT_TEMPLATES[currentTemplateIndex].content);
    }, [currentTemplateIndex, onBackgroundPromptChange]);

    const handleGenerate = useCallback(async () => {
        if (!mainImage || !croppedRefImage) { setError("이미지를 모두 업로드하세요."); return; }
        if (config.model === 'nano-banana-pro') await ensureProApiKey();
        setIsGenerating(true); setError(null); onGeneratedImageChange(null);
        try {
            const newSrc = await generateCosplayImage(mainImage.data, mainImage.mime, croppedRefImage.data, croppedRefImage.mime, mainPrompt, backgroundPrompt, config);
            const ts = Date.now();
            const resImg: GeneratedImage = { id: `${ts}-res`, src: newSrc, name: 'Cosplay Result', folder: `코스프레_${ts}`, timestamp: ts };
            addToHistory(resImg); onGeneratedImageChange(resImg);
        } catch (err) { setError("생성 실패"); } finally { setIsGenerating(false); }
    }, [mainImage, croppedRefImage, mainPrompt, backgroundPrompt, addToHistory, onGeneratedImageChange, config]);

    return (
        <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl border-b-4 border-[var(--bg-accent)]">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <h2 className="text-3xl font-black flex items-center gap-3">
                    <MaskIcon className="w-8 h-8 text-[var(--bg-accent)]" />
                    코스프레/촬영장
                  </h2>
                  <a href="https://ai.studio/apps/drive/1BFWErMWSRUyUHYgjY_FyxdWI_qSBytJF" target="_blank" rel="noopener noreferrer" className="bg-[var(--bg-info)] text-white text-xs font-black py-1.5 px-4 rounded-full hover:bg-[var(--bg-info-hover)] transition-all">(디테일 앱실행)</a>
                </div>
                <p className="text-[var(--text-secondary)] text-center mb-10 max-w-2xl mx-auto font-medium">실제 인물을 참조하여 캐릭터와 배경이 완벽하게 조화된 코스프레 화보를 생성합니다.</p>
                <div className="grid md:grid-cols-2 gap-12 mb-10">
                    <ImageUploader title="메인 인물 모델" image={mainImage} onFileSelect={(f) => processAndSetImage(f, 'main')} onClear={() => onMainImageChange(null)} />
                    <ImageUploader title="참조 캐릭터 디자인" image={croppedRefImage} onFileSelect={(f) => processAndSetImage(f, 'ref')} onClear={() => onRefImageChange(null)} />
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-[var(--text-secondary)] mb-2 uppercase tracking-widest px-1">캐릭터 묘사 프롬프트</label>
                        <textarea rows={4} value={mainPrompt} onChange={(e) => onMainPromptChange(e.target.value)} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[var(--ring-accent)] outline-none resize-none font-medium" />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-[var(--text-secondary)] mb-2 uppercase tracking-widest px-1">배경 및 촬영장 분위기</label>
                        <input type="text" value={backgroundPrompt} onChange={(e) => onBackgroundPromptChange(e.target.value)} placeholder="배경에 대한 묘사를 입력하세요." className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[var(--ring-accent)] outline-none font-medium" />
                         <div className="mt-4 bg-[var(--bg-primary)]/50 p-4 rounded-2xl border border-[var(--border-primary)]">
                          <h4 className="text-xs font-black text-[var(--text-accent)] mb-4 uppercase tracking-tighter">촬영 컨셉 프리셋</h4>
                          <div className="flex items-center gap-4">
                            <div className="flex-grow flex items-center gap-4 bg-[var(--bg-tertiary)] p-3 rounded-xl shadow-inner">
                              <button onClick={() => setCurrentTemplateIndex(p => (p - 1 + COSPLAY_PROMPT_TEMPLATES.length) % COSPLAY_PROMPT_TEMPLATES.length)} className="p-1.5 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-accent)] hover:text-white transition-all">
                                <ArrowLeftCircleIcon className="w-6 h-6" />
                              </button>
                              <div className="flex-1 text-center font-black text-sm text-[var(--text-primary)]">
                                {COSPLAY_PROMPT_TEMPLATES[currentTemplateIndex]?.name}
                              </div>
                              <button onClick={() => setCurrentTemplateIndex(p => (p + 1) % COSPLAY_PROMPT_TEMPLATES.length)} className="p-1.5 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-accent)] hover:text-white transition-all">
                                <ArrowRightCircleIcon className="w-6 h-6" />
                              </button>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl text-center border border-[var(--border-primary)]">
                 <GenerationConfigSelector config={config} setConfig={setConfig} />
                 <button onClick={handleGenerate} disabled={!mainImage || !croppedRefImage || isGenerating} className="w-full max-w-sm bg-[var(--bg-positive)] text-white font-black py-4 px-10 rounded-2xl hover:bg-[var(--bg-positive-hover)] transition-all shadow-lg disabled:opacity-30 flex items-center justify-center mx-auto text-lg gap-3">
                    {isGenerating ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <MaskIcon className="w-6 h-6" />}
                    {isGenerating ? '화보 촬영 중...' : '코스프레 생성'}
                </button>
                {error && <p className="text-red-500 font-bold mt-4">{error}</p>}
            </div>
            
            {(isGenerating || generatedImage) && (
                 <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl border border-[var(--border-primary)] animate-fade-in">
                    <h2 className="text-xl font-black mb-6 text-[var(--text-primary)] border-l-4 border-[var(--bg-accent)] pl-4">촬영 결과물</h2>
                    <div className="flex justify-center">
                         <div className="w-full max-w-xl aspect-square bg-[var(--bg-tertiary)] rounded-3xl flex items-center justify-center relative group overflow-hidden shadow-2xl">
                            {isGenerating && <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--bg-accent)]"></div>}
                            {generatedImage && (
                                <button onClick={() => onImageClick(generatedImage)} className="w-full h-full relative">
                                    <img src={generatedImage.src} alt="Cosplay result" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                                        <p className="text-white text-lg font-black bg-[var(--bg-accent)] px-8 py-3 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">고화질 보기</p>
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