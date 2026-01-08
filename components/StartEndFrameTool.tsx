import React, { useState, useCallback, useEffect } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { generateStartEndFrame, generateVideoPromptsForFrames } from '../services/geminiService';
import type { GeneratedImage, BgPropImage, VideoPrompts, GenerationConfig } from '../types';
import { PhotoIcon, SparklesIcon, CopyIcon, CheckIcon, StoryboardIcon } from './icons';
import { GenerationConfigSelector } from './GenerationConfigSelector';
import { ensureProApiKey } from '../services/apiKeyService';

interface StartEndFrameToolProps {
  addToHistory: (image: GeneratedImage) => void;
  onImageClick: (image: GeneratedImage) => void;
}

const ImagePlaceholder: React.FC<{ title: string, src?: string | null, isLoading?: boolean }> = ({ title, src, isLoading }) => (
    <div className="aspect-video bg-[var(--bg-tertiary)] rounded-2xl flex flex-col items-center justify-center relative shadow-inner w-full border border-[var(--border-primary)] overflow-hidden">
        {isLoading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        )}
        {src ? (
            <img src={src} alt={title} className="w-full h-full object-contain" />
        ) : (
            <div className="flex flex-col items-center opacity-30">
                <PhotoIcon className="w-16 h-16 text-[var(--text-secondary)] mb-2" />
                <p className="text-[var(--text-secondary)] font-bold">{title}</p>
            </div>
        )}
    </div>
);

const PromptResultDisplay: React.FC<{ prompts: VideoPrompts }> = ({ prompts }) => {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const handleCopy = (key: keyof VideoPrompts, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    return (
        <div className="space-y-4">
            {Object.entries(prompts).map(([key, value]) => (
                <div key={key} className="animate-fade-in">
                    <div className="flex justify-between items-center mb-1.5 px-1">
                        <h4 className="font-bold text-xs text-[var(--text-accent)] uppercase tracking-wider">{key.replace(/_/g, '.')}</h4>
                        <button 
                            onClick={() => handleCopy(key as keyof VideoPrompts, value as string)}
                            className="bg-[var(--bg-interactive)] hover:bg-[var(--bg-accent)] hover:text-white text-[var(--text-primary)] text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                        >
                            {copiedKey === key ? <CheckIcon className="w-3 h-3" /> : <CopyIcon className="w-3 h-3" />}
                            {copiedKey === key ? '복사됨' : '복사'}
                        </button>
                    </div>
                    <div className="bg-[var(--bg-primary)] p-3 rounded-xl text-xs text-[var(--text-secondary)] leading-relaxed font-mono border border-[var(--border-primary)] max-h-32 overflow-y-auto shadow-inner">
                        {value as string}
                    </div>
                </div>
            ))}
        </div>
    );
};

export const StartEndFrameTool: React.FC<StartEndFrameToolProps> = ({ addToHistory, onImageClick }) => {
    const [direction, setDirection] = useState<'start-to-end' | 'end-to-start'>('start-to-end');
    const [sourceImage, setSourceImage] = useState<BgPropImage | null>(null);
    const [storyPrompt, setStoryPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
    const [videoPrompts, setVideoPrompts] = useState<VideoPrompts | null>(null);
    const [isLoadingFrame, setIsLoadingFrame] = useState(false);
    const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [config, setConfig] = useState<GenerationConfig>({ model: 'nano-banana', aspectRatio: '1:1', imageSize: '1K' });

    const processFile = useCallback(async (file: File) => {
        if (file && file.type.startsWith('image/')) {
            try {
                const { base64, mimeType } = await fileToBase64(file);
                setSourceImage({ data: base64, mime: mimeType, url: `data:${mimeType};base64,${base64}` });
                setGeneratedImage(null);
                setVideoPrompts(null);
                setError(null);
            } catch (err) {
                setError("이미지 파일을 불러올 수 없습니다.");
            }
        } else {
            setError("유효한 이미지 파일을 업로드해주세요.");
        }
    }, []);

    // Fix: Added handleFileChange to call processFile from the file input.
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) await processFile(file);
    };

    const handleGenerateFrame = async () => {
        if (!sourceImage || !storyPrompt.trim()) {
            setError("이미지와 스토리 프롬프트를 모두 입력해주세요.");
            return;
        }

        if (config.model === 'nano-banana-pro') await ensureProApiKey();

        setIsLoadingFrame(true);
        setError(null);
        setGeneratedImage(null);
        setVideoPrompts(null);

        try {
            const newImageSrc = await generateStartEndFrame(sourceImage.data, sourceImage.mime, storyPrompt, direction, config);
            const timestamp = Date.now();
            const folderName = `스타트앤드_${timestamp}`;
            
            const sourceImgHistory: GeneratedImage = {
                id: `${timestamp}-source`,
                src: sourceImage.url,
                name: direction === 'start-to-end' ? 'Start Frame' : 'End Frame',
                folder: folderName,
                timestamp,
            };
            const newImgHistory: GeneratedImage = {
                id: `${timestamp}-generated`,
                src: newImageSrc,
                name: direction === 'start-to-end' ? 'End Frame' : 'Start Frame',
                folder: folderName,
                timestamp,
            };
            
            addToHistory(sourceImgHistory);
            addToHistory(newImgHistory);
            setGeneratedImage(newImgHistory);
        } catch (err) {
            setError("장면 생성에 실패했습니다.");
        } finally {
            setIsLoadingFrame(false);
        }
    };

    const handleGeneratePrompts = async () => {
        const startImg = direction === 'start-to-end' ? sourceImage : (generatedImage ? { data: generatedImage.src.split(',')[1], mime: generatedImage.src.match(/:(.*?);/)?.[1] || '' } : null);
        const endImg = direction === 'start-to-end' ? (generatedImage ? { data: generatedImage.src.split(',')[1], mime: generatedImage.src.match(/:(.*?);/)?.[1] || '' } : null) : sourceImage;

        if (!startImg || !endImg || !storyPrompt.trim()) {
            setError("프롬프트 추천을 위해 프레임이 생성되어야 합니다.");
            return;
        }

        setIsLoadingPrompts(true);
        setError(null);
        setVideoPrompts(null);

        try {
            const prompts = await generateVideoPromptsForFrames(startImg, endImg, storyPrompt);
            setVideoPrompts(prompts);
        } catch (err) {
            setError("추천 프롬프트 생성에 실패했습니다.");
        } finally {
            setIsLoadingPrompts(false);
        }
    };

    const startFrameSrc = direction === 'start-to-end' ? sourceImage?.url : generatedImage?.src;
    const endFrameSrc = direction === 'end-to-start' ? sourceImage?.url : generatedImage?.src;

    return (
        <div className="flex h-full gap-8">
            <aside className="w-[420px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-2">
                <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-xl border-b-4 border-[var(--bg-accent)]">
                    <h2 className="text-2xl font-black flex items-center gap-3">
                        <StoryboardIcon className="w-7 h-7 text-[var(--bg-accent)]" />
                        스타트/앤드 생성
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-2 font-medium">AI 영상 제작을 위한 최적의 시작과 끝 장면을 구성합니다.</p>
                </div>
                
                <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-xl space-y-6 border border-[var(--border-primary)]">
                    <h3 className="text-lg font-black text-[var(--text-primary)]">1. 프레임 설정</h3>
                    <div>
                        <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-widest">생성 시나리오</label>
                        <div className="grid grid-cols-2 gap-2 bg-[var(--bg-primary)] p-1 rounded-xl">
                            <button onClick={() => setDirection('start-to-end')} className={`py-2 text-xs font-black rounded-lg transition-all ${direction === 'start-to-end' ? 'bg-[var(--bg-accent)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>시작 ➜ 끝</button>
                            <button onClick={() => setDirection('end-to-start')} className={`py-2 text-xs font-black rounded-lg transition-all ${direction === 'end-to-start' ? 'bg-[var(--bg-accent)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>끝 ➜ 시작</button>
                        </div>
                    </div>
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                        onDragLeave={() => setIsDraggingOver(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }}
                        className={`group p-4 rounded-2xl border-2 border-dashed transition-all ${isDraggingOver ? 'border-[var(--border-accent)] bg-[var(--bg-accent)]/5' : 'border-[var(--border-primary)] hover:border-[var(--border-accent)]'}`}
                    >
                        <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-widest">{direction === 'start-to-end' ? '기준 시작 프레임' : '기준 마지막 프레임'}</label>
                        <div className="h-40 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center text-center text-[var(--text-secondary)] text-sm relative overflow-hidden group-hover:shadow-inner transition-shadow">
                            {sourceImage ? (
                                <img src={sourceImage.url} alt="Source" className="w-full h-full object-contain" />
                            ) : (
                                <div className="flex flex-col items-center opacity-40">
                                    <PhotoIcon className="w-10 h-10 mb-2" />
                                    <p className="font-bold">이미지 업로드 / 드래그</p>
                                </div>
                            )}
                            <input type="file" className="hidden" id="frame-upload" accept="image/*" onChange={handleFileChange} />
                            <label htmlFor="frame-upload" className="absolute inset-0 cursor-pointer" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="story-prompt" className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-widest">스토리 가이드</label>
                        <textarea id="story-prompt" rows={4} value={storyPrompt} onChange={e => setStoryPrompt(e.target.value)} placeholder={direction === 'start-to-end' ? '첫 장면 이후 어떤 변화가 일어나는지 입력하세요.' : '마지막 장면이 되기 전 어떤 상황이었는지 입력하세요.'} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[var(--ring-accent)] outline-none resize-none font-medium" />
                    </div>
                    <GenerationConfigSelector config={config} setConfig={setConfig} />
                    <button onClick={handleGenerateFrame} disabled={isLoadingFrame || isLoadingPrompts} className="w-full bg-[var(--bg-positive)] text-white font-black py-4 px-4 rounded-2xl hover:bg-[var(--bg-positive-hover)] transition-all shadow-lg disabled:opacity-30 flex items-center justify-center gap-2 text-lg">
                        {isLoadingFrame ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <SparklesIcon className="w-6 h-6" />}
                        {isLoadingFrame ? '장면 연산 중...' : '장면 생성하기'}
                    </button>
                </div>

                <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-xl flex-grow border border-[var(--border-primary)]">
                    <div className="flex items-center gap-2 mb-4">
                        <SparklesIcon className="w-5 h-5 text-[var(--bg-info)]" />
                        <h3 className="text-lg font-black text-[var(--text-primary)]">2. AI 영상 프롬프트 추천</h3>
                    </div>
                    <button onClick={handleGeneratePrompts} disabled={!generatedImage || isLoadingPrompts || isLoadingFrame} className="w-full bg-[var(--bg-info)] text-white font-bold py-3 px-4 rounded-xl hover:bg-[var(--bg-info-hover)] transition-all disabled:opacity-30 flex items-center justify-center gap-2 mb-6 shadow-sm">
                        {isLoadingPrompts ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <StoryboardIcon className="w-4 h-4" />}
                        {isLoadingPrompts ? '프롬프트 설계 중...' : '영상 프롬프트 추출'}
                    </button>
                    {videoPrompts ? <PromptResultDisplay prompts={videoPrompts} /> : (
                        <div className="text-center py-10 opacity-30">
                            <StoryboardIcon className="w-12 h-12 mx-auto mb-3" />
                            <p className="text-xs font-bold">장면 생성이 완료되면<br/>영상용 프롬프트를 추출할 수 있습니다.</p>
                        </div>
                    )}
                </div>
                 {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl font-bold text-xs text-center">{error}</div>}
            </aside>

            <main className="flex-1 flex flex-col gap-6">
                <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl border border-[var(--border-primary)]">
                    <h2 className="text-2xl font-black mb-8 text-[var(--text-primary)] border-l-4 border-[var(--bg-accent)] pl-4">스토리보드 미리보기</h2>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6">
                        <div className="space-y-3">
                            <p className="text-center text-xs font-black text-[var(--text-secondary)] uppercase">Initial State</p>
                            <ImagePlaceholder title="START FRAME" src={startFrameSrc} isLoading={direction === 'end-to-start' && isLoadingFrame} />
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-[var(--bg-accent)]/10 rounded-full flex items-center justify-center text-[var(--bg-accent)]">
                                <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-center text-xs font-black text-[var(--text-secondary)] uppercase">Final State</p>
                            <ImagePlaceholder title="END FRAME" src={endFrameSrc} isLoading={direction === 'start-to-end' && isLoadingFrame} />
                        </div>
                    </div>
                    {generatedImage && (
                        <div className="mt-8 pt-8 border-t border-[var(--border-primary)] flex justify-center">
                            <button 
                                onClick={() => onImageClick(generatedImage)}
                                className="bg-[var(--bg-interactive)] text-[var(--text-primary)] px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-2"
                            >
                                <PhotoIcon className="w-5 h-5" />
                                생성된 장면 크게 보기
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};