import React, { useState, useRef, useEffect } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { generatePromptsFromImage, generatePromptsFromText, PromptAnalysisResult } from '../services/geminiService';
import { CloseIcon, DocumentTextIcon } from './icons';
import type { AiModel } from '../types';
import { PROMPT_TEMPLATES, DEFAULT_TEMPLATES } from '../data/promptTemplates';
import { PromptTemplateModal } from './PromptTemplateModal';

const AI_MODELS: { id: AiModel; name: string }[] = [
    { id: 'sdxl', name: 'SDXL' },
    { id: 'gemini', name: 'Gemini' },
    { id: 'midjourney', name: 'Midjourney' },
    { id: 'nanoBanana', name: 'Nano-Banana' },
    { id: 'flux', name: 'FLUX' },
    { id: 'seedream', name: 'SEEDREAM 4.0' },
    { id: 'qwen', name: 'QWEN' },
    { id: 'wan2_2', name: 'WAN2.2' },
];

type Language = 'korean' | 'english';

const PromptDisplay: React.FC<{ title: string, prompts: { korean: string; english: string } }> = ({ title, prompts }) => {
    const [lang, setLang] = useState<Language>('korean');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompts[lang]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-lg text-[var(--text-primary)] flex items-center gap-2">
                    {title === '이미지 프롬프트' ? '🖼️' : '🎬'} {title}
                </h4>
                <div className="flex items-center gap-2">
                    <div className="bg-[var(--bg-primary)] p-1 rounded-lg flex gap-1">
                        <button onClick={() => setLang('korean')} className={`px-3 py-1 text-xs rounded-md ${lang === 'korean' ? 'bg-[var(--bg-accent)] text-[var(--text-on-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>한국어</button>
                        <button onClick={() => setLang('english')} className={`px-3 py-1 text-xs rounded-md ${lang === 'english' ? 'bg-[var(--bg-accent)] text-[var(--text-on-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>English</button>
                    </div>
                    <button onClick={handleCopy} className="bg-[var(--bg-interactive)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-xs px-3 py-1.5 rounded-lg">
                        {copied ? '복사됨!' : '복사'}
                    </button>
                </div>
            </div>
            <pre className="bg-[var(--bg-primary)] p-4 rounded-lg text-sm text-[var(--text-primary)] whitespace-pre-wrap font-sans">{prompts[lang]}</pre>
        </div>
    );
};

export const PromptGeneratorTool: React.FC = () => {
    const [sourceImage, setSourceImage] = useState<{ data: string; mime: string; url: string } | null>(null);
    const [additionalPrompt, setAdditionalPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState<'image' | 'text' | null>(null);
    const [progress, setProgress] = useState(0);
    const [analysisResult, setAnalysisResult] = useState<Partial<PromptAnalysisResult> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const [selectedModels, setSelectedModels] = useState<Set<AiModel>>(() => new Set(['sdxl', 'gemini', 'midjourney']));
    const [modelTemplates, setModelTemplates] = useState<Record<AiModel, { image: string; video?: string }>>(DEFAULT_TEMPLATES);
    const [templateModalState, setTemplateModalState] = useState<{ isOpen: boolean; model: AiModel | null; type: 'image' | 'video' | null }>({ isOpen: false, model: null, type: null });
    
    const processFile = async (file: File) => {
        if (file && file.type.startsWith('image/')) {
            try {
                const { base64, mimeType } = await fileToBase64(file);
                setSourceImage({ data: base64, mime: mimeType, url: `data:${mimeType};base64,${base64}` });
                setAnalysisResult(null);
                setError(null);
            } catch (err) {
                setError("이미지 파일을 불러올 수 없습니다.");
            }
        } else {
            setError("유효한 이미지 파일을 업로드해주세요.");
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) await processFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingOver(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingOver(false); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
    };

    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const file = event.clipboardData?.items?.[0]?.getAsFile();
            if (file?.type.startsWith('image/')) processFile(file);
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    const handleRemoveImage = () => {
        setSourceImage(null);
        setAnalysisResult(null);
    };

    const handleModelToggle = (modelId: AiModel) => {
        setSelectedModels(prev => {
            const newSet = new Set(prev);
            if (newSet.has(modelId)) {
                newSet.delete(modelId);
            } else {
                newSet.add(modelId);
            }
            return newSet;
        });
    };

    const handleAnalysis = async (type: 'image' | 'text') => {
        if (type === 'image' && !sourceImage) {
             setError("먼저 이미지를 업로드해주세요.");
             return;
        }
        if (type === 'text' && !additionalPrompt.trim()) {
            setError("프롬프트를 먼저 입력해주세요.");
            return;
        }
        if (selectedModels.size === 0) {
            setError("하나 이상의 모델을 선택해주세요.");
            return;
        }

        setLoadingAction(type);
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        setProgress(0);

        try {
            const modelsToGenerate: AiModel[] = Array.from(selectedModels);
            const templatesForApi = modelsToGenerate.reduce((acc, modelId) => {
                const imageTemplateId = modelTemplates[modelId].image;
                const videoTemplateId = modelTemplates[modelId].video;
                
                const imageTemplate = PROMPT_TEMPLATES[modelId].image.find(t => t.id === imageTemplateId);
                const videoTemplate = PROMPT_TEMPLATES[modelId].video?.find(t => t.id === videoTemplateId);

                acc[modelId] = {
                  image: imageTemplate ? imageTemplate.content : PROMPT_TEMPLATES[modelId].image[0].content,
                  video: videoTemplate ? videoTemplate.content : PROMPT_TEMPLATES[modelId].video?.[0].content,
                };
                return acc;
            }, {} as Record<AiModel, { image: string; video?: string }>);
            
            setProgress(10);
            
            const result = type === 'image'
                ? await generatePromptsFromImage(sourceImage!.data, sourceImage!.mime, additionalPrompt, modelsToGenerate, true, templatesForApi)
                : await generatePromptsFromText(additionalPrompt, modelsToGenerate, true, templatesForApi);
            
            setProgress(90);

            setAnalysisResult(result);
            if (result.prompts && Object.keys(result.prompts).length > 0) {
                setActiveTab(Object.keys(result.prompts)[0] as AiModel);
            }
            setProgress(100);
        } catch (err) {
            setError("프롬프트 생성 중 오류가 발생했습니다.");
            setProgress(0);
        } finally {
            setIsLoading(false);
            setLoadingAction(null);
        }
    };
    
    const [activeTab, setActiveTab] = useState<AiModel>('gemini');
    
    const resultModels = analysisResult?.prompts ? Object.keys(analysisResult.prompts) as AiModel[] : [];

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex-shrink-0 bg-[var(--bg-secondary)] p-6 rounded-lg shadow-xl">
                <div className="flex justify-center items-center gap-4 mb-2">
                    <h2 className="text-3xl font-bold text-[var(--text-primary)]">프롬프트 생성기</h2>
                    <a 
                        href="https://ai.studio/apps/drive/1yd2DpdIgndBL6joow-m0DlKSah-muikR"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[var(--bg-info)] text-[var(--text-on-accent)] text-sm font-semibold py-1 px-3 rounded-full hover:bg-[var(--bg-info-hover)] transition-colors whitespace-nowrap"
                    >
                        (디테일 영상프롬프트 앱실행)
                    </a>
                </div>
                <p className="text-center text-[var(--text-secondary)]">
                    이미지나 텍스트를 분석하여 다양한 AI 모델에 맞는 최적의 프롬프트를 생성합니다.
                </p>
            </div>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
                <PromptTemplateModal
                    isOpen={templateModalState.isOpen}
                    onClose={() => setTemplateModalState({ isOpen: false, model: null, type: null })}
                    modelName={AI_MODELS.find(m => m.id === templateModalState.model)?.name || ''}
                    templates={templateModalState.model && templateModalState.type ? (PROMPT_TEMPLATES[templateModalState.model] as any)[templateModalState.type] || [] : []}
                    selectedTemplateId={templateModalState.model && templateModalState.type ? (modelTemplates[templateModalState.model] as any)[templateModalState.type] : ''}
                    onSelect={(templateId) => {
                        if (templateModalState.model && templateModalState.type) {
                            setModelTemplates(prev => ({...prev, [templateModalState.model!]: { ...prev[templateModalState.model!], [templateModalState.type!]: templateId }}));
                        }
                    }}
                    templateType={templateModalState.type}
                />
                {/* Left Panel */}
                <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-xl flex flex-col gap-6 overflow-y-auto">
                    <div 
                        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-lg p-4 h-64 flex items-center justify-center transition-colors ${isDraggingOver ? 'border-[var(--border-accent)] bg-[var(--bg-tertiary)]/50' : 'border-[var(--border-secondary)]'}`}
                    >
                        {sourceImage ? (
                            <>
                                <img src={sourceImage.url} alt="Uploaded" className="max-h-full max-w-full object-contain rounded" />
                                <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-[var(--bg-primary)] p-1.5 rounded-full hover:bg-[var(--bg-tertiary)]">
                                    <CloseIcon className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                             <label htmlFor="prompt-gen-upload" className="cursor-pointer text-center">
                                <h3 className="text-lg font-semibold">이미지를 드래그 앤 드롭하거나 클릭하여 업로드하세요.</h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-1">또는 클립보드에서 이미지를 붙여넣으세요.</p>
                            </label>
                        )}
                         <input id="prompt-gen-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                    <div>
                        <label htmlFor="additional-prompt" className="block text-md font-medium text-[var(--text-primary)] mb-2">추가 프롬프트</label>
                        <textarea id="additional-prompt" rows={2} value={additionalPrompt} onChange={(e) => setAdditionalPrompt(e.target.value)}
                            placeholder="선택) 간단한 이미지 설명 또는 생성할 프롬프트에 대한 설명"
                            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg p-3 text-sm focus:ring-[var(--ring-accent)] focus:border-[var(--border-accent)]"
                        />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-md font-medium text-[var(--text-primary)] mb-2">생성할 모델 선택</label>
                            <div className="space-y-2">
                               {AI_MODELS.map(model => {
                                    const hasVideo = !!PROMPT_TEMPLATES[model.id].video;
                                    return (
                                    <div key={model.id} className="flex items-center justify-between bg-[var(--bg-tertiary)]/50 p-2 rounded-lg">
                                        <label htmlFor={`model-${model.id}`} className="flex items-center cursor-pointer flex-grow">
                                            <input type="checkbox" id={`model-${model.id}`} checked={selectedModels.has(model.id)} onChange={() => handleModelToggle(model.id)}
                                              className="h-4 w-4 rounded border-gray-300 text-[var(--bg-accent)] focus:ring-[var(--ring-accent)]"
                                            />
                                            <span className="ml-3 font-medium text-[var(--text-primary)]">{model.name}</span>
                                        </label>
                                        {hasVideo ? (
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => setTemplateModalState({ isOpen: true, model: model.id, type: 'image' })} className="text-xs p-1.5 rounded-md hover:bg-[var(--bg-interactive)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1">
                                                    🖼️ 이미지
                                                </button>
                                                <button onClick={() => setTemplateModalState({ isOpen: true, model: model.id, type: 'video' })} className="text-xs p-1.5 rounded-md hover:bg-[var(--bg-interactive)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1">
                                                    🎬 영상
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setTemplateModalState({ isOpen: true, model: model.id, type: 'image' })} className="p-1.5 rounded-md hover:bg-[var(--bg-interactive)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                                <DocumentTextIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                )})}
                            </div>
                        </div>
                        <div className="space-y-3 pt-2">
                            <button onClick={() => handleAnalysis('image')} disabled={!sourceImage || isLoading}
                                className="w-full bg-[var(--bg-accent)] text-[var(--text-on-accent)] font-bold py-3 px-4 rounded-lg hover:bg-[var(--bg-accent-hover)] transition-colors disabled:bg-[var(--bg-disabled)]">
                                {isLoading && loadingAction === 'image' ? `분석 중... ${progress}%` : '이미지로 프롬프트 분석'}
                            </button>
                            <button onClick={() => handleAnalysis('text')} disabled={!additionalPrompt.trim() || isLoading}
                                className="w-full bg-[var(--bg-positive)] text-[var(--text-on-accent)] font-bold py-3 px-4 rounded-lg hover:bg-[var(--bg-positive-hover)] transition-colors disabled:bg-[var(--bg-disabled)]">
                                {isLoading && loadingAction === 'text' ? `생성 중... ${progress}%` : '텍스트로 프롬프트 생성'}
                            </button>
                        </div>
                        {error && <p className="text-[var(--bg-negative)] mt-2 text-center">{error}</p>}
                    </div>
                </div>
    
                {/* Right Panel */}
                <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-xl overflow-y-auto">
                    {isLoading && !analysisResult && (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--border-accent)] mb-4"></div>
                            <p className="text-lg font-semibold mb-2">{loadingAction === 'image' ? '이미지 분석 중...' : '프롬프트 생성 중...'}</p>
                            <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2.5"><div className="bg-[var(--bg-accent)] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                        </div>
                    )}
                    {analysisResult && (
                        <div className="space-y-6">
                            {analysisResult.contextAnalysis && <div>
                                <h3 className="font-bold text-xl mb-2 text-[var(--text-accent)]">컨텍스트 분석</h3>
                                <p className="text-sm text-[var(--text-primary)] bg-[var(--bg-primary)] p-4 rounded-lg">{analysisResult.contextAnalysis}</p>
                            </div>}
                            
                            <div>
                                <div className="border-b border-[var(--border-primary)] mb-4">
                                    <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                                        {resultModels.map(modelId => (
                                            <button key={modelId} onClick={() => setActiveTab(modelId)}
                                                className={`${activeTab === modelId ? 'border-[var(--border-accent)] text-[var(--border-accent)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-3 px-2 border-b-2 font-medium text-sm`}>
                                                {AI_MODELS.find(m => m.id === modelId)?.name || modelId}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                                {analysisResult.prompts?.[activeTab] && <div className="space-y-4">
                                   <PromptDisplay title="이미지 프롬프트" prompts={analysisResult.prompts[activeTab]!.image} />
                                   {'video' in analysisResult.prompts[activeTab]! && (
                                       <PromptDisplay title="영상 프롬프트" prompts={(analysisResult.prompts[activeTab]! as any).video} />
                                   )}
                                </div>}
                            </div>
                        </div>
                    )}
                     {!isLoading && !analysisResult && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                             <h3 className="text-xl font-bold text-[var(--text-secondary)]">분석 결과가 여기에 표시됩니다.</h3>
                             <p className="text-[var(--text-secondary)] mt-2">이미지나 텍스트를 입력하고 분석을 시작하세요.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
