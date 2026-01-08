import React, { useState, useCallback, useEffect } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { generateStoryPlan, generateStoryImageFromSource } from '../services/geminiService';
import type { GeneratedImage, BgPropImage, GenerationConfig } from '../types';
import { CloseIcon } from './icons';
import { GenerationConfigSelector } from './GenerationConfigSelector';
import { ensureProApiKey } from '../services/apiKeyService';

interface StoryCreatorToolProps {
  addToHistory: (image: GeneratedImage) => void;
  onImageClick: (image: GeneratedImage) => void;
  sourceImage: BgPropImage | null;
  onSourceImageChange: (image: BgPropImage | null) => void;
  generatedImages: GeneratedImage[];
  // Fix: Update type to allow functional updates for state setters. This resolves the error on line 144.
  onGeneratedImagesChange: React.Dispatch<React.SetStateAction<GeneratedImage[]>>;
}

export const StoryCreatorTool: React.FC<StoryCreatorToolProps> = ({
  addToHistory,
  onImageClick,
  sourceImage,
  onSourceImageChange,
  generatedImages,
  onGeneratedImagesChange,
}) => {
  const [prompt, setPrompt] = useState('');
  const [frameCount, setFrameCount] = useState(8);
  const [progression, setProgression] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [config, setConfig] = useState<GenerationConfig>({ model: 'nano-banana', aspectRatio: '1:1', imageSize: '1K' });
  
  const processFile = useCallback(async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const { base64, mimeType } = await fileToBase64(file);
        onSourceImageChange({ data: base64, mime: mimeType, url: `data:${mimeType};base64,${base64}` });
        onGeneratedImagesChange([]);
        setError(null);
      } catch (err) {
        setError("이미지 파일을 불러올 수 없습니다.");
      }
    } else {
      setError("유효한 이미지 파일을 업로드해주세요.");
    }
  }, [onSourceImageChange, onGeneratedImagesChange]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await processFile(file);
  };
    
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
        const items = event.clipboardData?.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if(file) {
                        processFile(file);
                    }
                    break; 
                }
            }
        }
    };
    window.addEventListener('paste', handlePaste);
    return () => {
        window.removeEventListener('paste', handlePaste);
    };
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleGenerateStory = useCallback(async () => {
    if (!sourceImage) {
      setError("먼저 시작 이미지를 업로드해주세요.");
      return;
    }
    if (!prompt.trim()) {
      setError("스토리 프롬프트를 입력해주세요.");
      return;
    }

    if (config.model === 'nano-banana-pro') {
        await ensureProApiKey();
    }

    setIsLoading(true);
    setLoadingMessage("스토리 계획 생성 중...");
    setError(null);
    onGeneratedImagesChange([]);

    try {
      const plan = await generateStoryPlan(prompt, frameCount, progression);

      if (!plan.frames || plan.frames.length === 0) {
        throw new Error("스토리 계획을 생성할 수 없습니다.");
      }

      const timestamp = Date.now();
      const date = new Date(timestamp);
      const folderName = `스토리_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;

      const originalForHistory: GeneratedImage = {
        id: `${timestamp}-original`,
        src: sourceImage.url,
        name: 'Story Start',
        folder: folderName,
        timestamp,
      };
      addToHistory(originalForHistory);
      onGeneratedImagesChange([originalForHistory]);

      for (const frame of plan.frames) {
        setLoadingMessage(`프레임 ${frame.frame_number} / ${plan.frames.length} 생성 중...`);
        try {
            const newImageSrc = await generateStoryImageFromSource(
              { data: sourceImage.data, mime: sourceImage.mime },
              frame.prompt_for_image_model,
              config
            );
            
            const newImageForHistory: GeneratedImage = {
              id: `${timestamp}-frame-${frame.frame_number}`,
              src: newImageSrc,
              name: `Frame ${frame.frame_number}`,
              folder: folderName,
              timestamp,
            };

            addToHistory(newImageForHistory);
            onGeneratedImagesChange(prev => [...prev, newImageForHistory]);
        } catch (frameError) {
            console.error(`프레임 ${frame.frame_number} 생성에 실패하여 건너뜁니다.`, frameError);
            // Silently skip the failed frame and continue with the next one.
        }
      }
    } catch (err) {
      console.error("Story generation failed:", err);
      setError("스토리 생성에 실패했습니다. 프롬프트를 수정하거나 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  }, [sourceImage, prompt, frameCount, progression, addToHistory, onGeneratedImagesChange, config]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex-shrink-0 bg-[var(--bg-secondary)] p-6 rounded-lg shadow-xl">
        <div className="flex justify-center items-center gap-4 mb-4">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">스토리 생성기</h2>
          <a
            href="https://ai.studio/apps/drive/1Y3pwHzxzwnvHid5S5d8giF0WxD8QzMaw"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[var(--bg-info)] text-[var(--text-on-accent)] text-sm font-semibold py-1 px-3 rounded-full hover:bg-[var(--bg-info-hover)] transition-colors whitespace-nowrap"
          >
            (디테일 앱실행)
          </a>
        </div>
        <p className="text-[var(--text-secondary)] text-center mb-6 max-w-2xl mx-auto">시작 이미지와 간단한 프롬프트를 입력하여 AI가 만들어내는 연속적인 스토리를 확인해보세요.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className={`h-64 flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-lg p-4 transition-colors ${isDraggingOver ? 'border-[var(--border-accent)] bg-[var(--bg-tertiary)]/50' : 'border-[var(--border-secondary)]'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {sourceImage ? (
              <div className="relative w-full h-full">
                <img src={sourceImage.url} alt="Story start" className="max-h-full max-w-full w-full h-full object-contain rounded" />
                <button onClick={() => onSourceImageChange(null)} className="absolute top-2 right-2 bg-[var(--bg-primary)] p-1.5 rounded-full hover:bg-[var(--bg-tertiary)]">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-center">시작 이미지 업로드</h3>
                <label htmlFor="story-file-upload" className="cursor-pointer bg-[var(--bg-accent)] text-[var(--text-on-accent)] font-bold py-2 px-4 rounded-lg hover:bg-[var(--bg-accent-hover)] transition-colors">
                  이미지 선택
                </label>
                <input id="story-file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                <p className="text-sm text-[var(--text-secondary)] mt-1">또는 드래그 앤 드롭, 붙여넣기</p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="예: 한 소년이 길에서 슬픈 강아지를 발견하고, 집으로 데려와 목욕시키고 함께 행복해지는 이야기"
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg p-3 text-sm focus:ring-[var(--ring-accent)] focus:border-[var(--border-accent)]"
            />
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">프레임 수: <span className="font-bold text-[var(--border-accent)]">{frameCount}</span></label>
              <input type="range" min="2" max="20" value={frameCount} onChange={(e) => setFrameCount(Number(e.target.value))} className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-[var(--bg-accent)] [&::-moz-range-thumb]:bg-[var(--bg-accent)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">스토리 전개 강도: <span className="font-bold text-[var(--border-accent)]">{progression}</span></label>
              <input type="range" min="1" max="10" value={progression} onChange={(e) => setProgression(Number(e.target.value))} className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-[var(--bg-accent)] [&::-moz-range-thumb]:bg-[var(--bg-accent)]" />
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
            <GenerationConfigSelector config={config} setConfig={setConfig} />
            <button
                onClick={handleGenerateStory}
                disabled={isLoading || !sourceImage}
                className="bg-[var(--bg-positive)] text-[var(--text-on-accent)] font-bold py-3 px-8 rounded-lg hover:bg-[var(--bg-positive-hover)] transition-colors disabled:bg-[var(--bg-disabled)] disabled:cursor-not-allowed flex items-center min-w-[200px] justify-center mx-auto"
            >
                {isLoading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>}
                {isLoading ? loadingMessage : '스토리 생성'}
            </button>
            {error && <p className="text-[var(--bg-negative)] mt-4 text-center">{error}</p>}
        </div>
      </div>
      <div className="flex-grow bg-[var(--bg-secondary)] p-6 rounded-lg shadow-xl overflow-hidden">
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">생성된 스토리</h3>
        {generatedImages.length > 0 ? (
          <div className="h-full overflow-y-auto pr-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {generatedImages.map((image, index) => (
                <button key={image.id} onClick={() => onImageClick(image)} className="relative aspect-square bg-[var(--bg-tertiary)] rounded-lg overflow-hidden shadow-md group">
                  <img src={image.src} alt={image.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"></div>
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded-full">{index === 0 ? '시작' : `프레임 ${index}`}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-[var(--text-secondary)]">생성된 스토리가 여기에 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};