import React, { useState, useCallback, useEffect, useRef } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { editImageWithNanoBanana } from '../services/geminiService';
import { LIGHTING_OPTIONS, QUALITY_OPTIONS } from '../constants';
import type { GeneratedImage, GenerationConfig } from '../types';
import { SpotlightIcon } from './icons';
import { GenerationConfigSelector } from './GenerationConfigSelector';
import { ensureProApiKey } from '../services/apiKeyService';

interface LightingColorToolProps {
  addToHistory: (image: GeneratedImage) => void;
  sourceImage: string | null;
  onImageClick: (image: GeneratedImage) => void;
}

const convertAngleToText = (angle: number): { text: string; degrees: string } => {
    const normalizedAngle = (angle + 360) % 360;
    const degrees = `${Math.round(normalizedAngle)}°`;
    
    // 0 is right, 90 is top, 180 is left, 270 is bottom
    if (normalizedAngle >= 337.5 || normalizedAngle < 22.5) return { text: '우측', degrees };
    if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) return { text: '우측 상단', degrees };
    if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) return { text: '상단', degrees };
    if (normalizedAngle >= 112.5 && normalizedAngle < 157.5) return { text: '좌측 상단', degrees };
    if (normalizedAngle >= 157.5 && normalizedAngle < 202.5) return { text: '좌측', degrees };
    if (normalizedAngle >= 202.5 && normalizedAngle < 247.5) return { text: '좌측 하단', degrees };
    if (normalizedAngle >= 247.5 && normalizedAngle < 292.5) return { text: '하단', degrees };
    if (normalizedAngle >= 292.5 && normalizedAngle < 337.5) return { text: '우측 하단', degrees };

    return { text: '알 수 없음', degrees };
};


export const LightingColorTool: React.FC<LightingColorToolProps> = ({ addToHistory, sourceImage: initialSource, onImageClick }) => {
  const [sourceImage, setSourceImage] = useState<{ data: string; mime: string; url: string } | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingLight = useRef(false);

  // New state for fine-tuning
  const [lightingStrength, setLightingStrength] = useState(5);
  const [lightingAngle, setLightingAngle] = useState(45); // Angle in degrees
  const [config, setConfig] = useState<GenerationConfig>({ model: 'nano-banana', aspectRatio: '1:1', imageSize: '1K' });

  useEffect(() => {
    if (initialSource) {
      const mime = initialSource.substring(initialSource.indexOf(':') + 1, initialSource.indexOf(';'));
      const data = initialSource.substring(initialSource.indexOf(',') + 1);
      setSourceImage({ data, mime, url: initialSource });
      setError(null);
      // Reset fine-tuning when image changes
      setLightingStrength(5);
      setLightingAngle(45);
    }
  }, [initialSource]);

  const processFile = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
        try {
            const { base64, mimeType } = await fileToBase64(file);
            setSourceImage({ data: base64, mime: mimeType, url: `data:${mimeType};base64,${base64}` });
            setSelectedOptions(new Set());
            setGeneratedImages([]);
            setError(null);
            setLightingStrength(5);
            setLightingAngle(45);
        } catch (err) {
            console.error("Error converting file to base64", err);
            setError("이미지 파일을 불러올 수 없습니다.");
        }
    } else {
        setError("유효한 이미지 파일(PNG, JPG 등)을 업로드해주세요.");
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
        const items = event.clipboardData?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if(file) processFile(file);
                break;
            }
        }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

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
  
  const toggleOptionSelection = (optionId: string) => {
    setSelectedOptions(prev => {
        const newSet = new Set(prev);
        if (newSet.has(optionId)) {
            newSet.delete(optionId);
        } else {
            newSet.add(optionId);
        }
        return newSet;
    });
  };

    const handleLightDrag = useCallback((e: MouseEvent) => {
        if (!isDraggingLight.current || !imageContainerRef.current) return;
        const rect = imageContainerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        let angleDeg = angleRad * (180 / Math.PI);
        setLightingAngle(angleDeg);
    }, []);

    const handleLightDragEnd = useCallback(() => {
        isDraggingLight.current = false;
        window.removeEventListener('mousemove', handleLightDrag);
        window.removeEventListener('mouseup', handleLightDragEnd);
    }, [handleLightDrag]);

    const handleLightDragStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isDraggingLight.current = true;
        window.addEventListener('mousemove', handleLightDrag);
        window.addEventListener('mouseup', handleLightDragEnd);
    }, [handleLightDrag, handleLightDragEnd]);


  const handleGenerate = useCallback(async () => {
    if (!sourceImage) {
        setError("이미지를 업로드해주세요.");
        return;
    }
    const allOptions = [...LIGHTING_OPTIONS, ...QUALITY_OPTIONS];
    const optionsToGenerate = allOptions.filter(option => selectedOptions.has(option.id));

    if (optionsToGenerate.length === 0) {
        setError("하나 이상의 조명/색감 또는 화질 개선 프리셋을 선택해주세요.");
        return;
    }

    if (config.model === 'nano-banana-pro') {
        await ensureProApiKey();
    }
    
    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);

    const timestamp = Date.now();
    const date = new Date(timestamp);
    const folderName = `조명_색감_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
    
    const originalImageForHistory: GeneratedImage = {
        id: `${timestamp}-original`,
        src: sourceImage.url,
        name: 'Original',
        folder: folderName,
        timestamp: timestamp,
    };
    setGeneratedImages([originalImageForHistory]);
    
    const fineTuningParts: string[] = [];
    fineTuningParts.push(`with the light source coming from the ${convertAngleToText(lightingAngle).text}`);
    fineTuningParts.push(`with a lighting intensity of ${lightingStrength} out of 10`);
    const fineTuningPrompt = fineTuningParts.join(', ');

    const generationPromises = optionsToGenerate.map(option => {
        let finalPrompt = option.prompt;
        // Check if the option is a lighting option before adding fine-tuning
        if (LIGHTING_OPTIONS.some(lightOpt => lightOpt.id === option.id)) {
            finalPrompt = `${option.prompt}. ${fineTuningPrompt}.`;
        }
        return editImageWithNanoBanana(sourceImage.data, sourceImage.mime, finalPrompt, config)
            .then(newImageSrc => {
                const newImage: GeneratedImage = {
                    id: `${timestamp}-${option.id}`,
                    src: newImageSrc,
                    name: option.name,
                    folder: folderName,
                    timestamp: timestamp,
                };
                addToHistory(newImage);
                setGeneratedImages(prev => [...prev, newImage]);
            })
            .catch(err => {
                console.error(`Failed to generate ${option.name}:`, err);
            });
    });
    
    try {
      await Promise.all(generationPromises);
    } catch (err) {
      setError("이미지 생성 중 오류가 발생했습니다. 일부 이미지가 생성되지 않았을 수 있습니다.");
    } finally {
      setIsGenerating(false);
    }

  }, [sourceImage, selectedOptions, lightingStrength, lightingAngle, addToHistory, config]);

  const buttonText = isGenerating 
    ? '생성 중...' 
    : selectedOptions.size > 0 
    ? `${selectedOptions.size}개 스타일 생성`
    : '스타일 생성';

  const handleChangeImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const angleInfo = convertAngleToText(lightingAngle);
  
  return (
    <div className="flex flex-col h-full space-y-4">
      <input
        id="lighting-file-upload"
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div 
        className={`bg-[var(--bg-secondary)] p-6 rounded-lg shadow-xl text-center transition-colors ${isDraggingOver ? 'bg-[var(--bg-accent)]/20 ring-2 ring-[var(--ring-accent)]' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <h2 className="text-3xl font-bold mb-4 text-[var(--text-primary)]">조명 및 색감 변경</h2>
        
        {!sourceImage && (
             <div className="max-w-md mx-auto">
                <label htmlFor="lighting-file-upload" className="cursor-pointer block bg-[var(--bg-accent)] text-[var(--text-on-accent)] font-bold py-3 px-6 rounded-lg hover:bg-[var(--bg-accent-hover)] transition-colors w-full">
                이미지 선택
                </label>
                <p className="text-[var(--text-secondary)] mt-4 text-sm">또는 이미지를 이곳에 드래그 앤 드롭 하거나 붙여넣으세요.</p>
             </div>
        )}

        {sourceImage && (
            <div
              ref={imageContainerRef}
              className="relative max-w-md mx-auto mb-6 group"
            >
                 <img src={sourceImage.url} alt="Original source" className="w-full h-auto object-contain rounded-md max-h-96" />
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-11/12 h-11/12 border-2 border-dashed border-gray-500/50 rounded-full group-hover:border-purple-400/70 transition-all"></div>
                 </div>
                 <div
                    className="absolute top-1/2 left-1/2 w-16 h-16 -m-8 pointer-events-auto"
                    style={{
                        transform: `translateX(-50%) translateY(-50%) rotate(${lightingAngle}deg) translateX(calc(min(45vw, 224px) * 0.55))`,
                    }}
                    onMouseDown={handleLightDragStart}
                 >
                    <SpotlightIcon
                      className="w-full h-full text-[var(--bg-secondary)] cursor-grab active:cursor-grabbing"
                      style={{ transform: `rotate(${lightingAngle * -1 + 135}deg)` }}
                    />
                 </div>
            </div>
        )}
      </div>

      <div className="flex-grow bg-[var(--bg-secondary)] p-6 rounded-lg shadow-xl overflow-y-auto">
        <div className="mb-8 p-4 bg-[var(--bg-primary)]/50 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-[var(--text-accent)]">세부 조정 (조명 프리셋 전용)</h3>
            <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                    <label htmlFor="strength-slider" className="block text-md font-medium text-[var(--text-primary)] mb-2">
                        조명 강도: <span className="font-bold text-[var(--border-accent)]">{lightingStrength}</span>
                    </label>
                    <input 
                        id="strength-slider" 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={lightingStrength} 
                        onChange={(e) => setLightingStrength(Number(e.target.value))}
                        className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-[var(--bg-accent)] [&::-moz-range-thumb]:bg-[var(--bg-accent)]"
                    />
                </div>
                <div>
                    <label className="block text-md font-medium text-[var(--text-primary)] mb-2">조명 방향</label>
                    <div className="flex items-center gap-4 bg-[var(--bg-secondary)] p-2 rounded-lg">
                        <p className="text-[var(--text-primary)] text-sm flex-grow">
                            현재 방향: <span className="font-bold text-[var(--border-accent)]">{angleInfo.text} ({angleInfo.degrees})</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <h3 className="text-xl font-bold mb-2">조명/색감 프리셋</h3>
            <p className="text-[var(--text-secondary)] mb-6">생성하고 싶은 스타일을 모두 선택해 주세요.</p>
            <div className="flex flex-wrap gap-3 justify-center">
                {LIGHTING_OPTIONS.map(option => (
                    <button
                        key={option.id}
                        onClick={() => toggleOptionSelection(option.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border-2 ${
                            selectedOptions.has(option.id)
                            ? 'bg-[var(--bg-accent)] border-[var(--border-accent)] text-[var(--text-on-accent)]'
                            : 'bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-interactive)] hover:border-[var(--border-accent)]'
                        }`}
                    >
                        {option.name}
                    </button>
                ))}
            </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">
            화질 개선
            <span className="text-sm font-normal text-[var(--text-secondary)] ml-2">[미적용]</span>
          </h3>
          <p className="text-[var(--text-secondary)] mb-6">적용하고 싶은 화질 개선 효과를 모두 선택해 주세요.</p>
          <div className="flex flex-wrap gap-3 justify-center">
              {QUALITY_OPTIONS.map(option => (
                  <button
                      key={option.id}
                      onClick={() => toggleOptionSelection(option.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border-2 ${
                          selectedOptions.has(option.id)
                          ? 'bg-[var(--bg-accent)] border-[var(--border-accent)] text-[var(--text-on-accent)]'
                          : 'bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-interactive)] hover:border-[var(--border-accent)]'
                      }`}
                  >
                      {option.name}
                  </button>
              ))}
          </div>
        </div>

        {generatedImages.length > 0 && (
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">생성 결과</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {generatedImages.map(image => (
                        <button key={image.id} onClick={() => onImageClick(image)} className="relative aspect-square bg-[var(--bg-tertiary)] rounded-lg overflow-hidden shadow-md group">
                            <img src={image.src} alt={image.name} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"></div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2">
                                <p className="text-white text-center text-xs font-semibold truncate" title={image.name}>{image.name}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )}
      </div>
      
      <div className="flex-shrink-0 bg-[var(--bg-secondary)] p-4 rounded-lg shadow-xl flex flex-col items-center gap-4">
          <div className="w-full max-w-md">
                <GenerationConfigSelector config={config} setConfig={setConfig} />
          </div>
          <div className="flex items-center justify-center space-x-4 w-full">
              {sourceImage && (
                 <button onClick={handleChangeImageClick} className="bg-[var(--bg-interactive)] text-[var(--text-primary)] font-bold py-3 px-6 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                    이미지 변경
                 </button>
              )}
              <button 
                onClick={handleGenerate}
                disabled={!sourceImage || selectedOptions.size === 0 || isGenerating}
                className="bg-[var(--bg-positive)] text-[var(--text-on-accent)] font-bold py-3 px-8 rounded-lg hover:bg-[var(--bg-positive-hover)] transition-colors disabled:bg-[var(--bg-disabled)] disabled:cursor-not-allowed flex items-center min-w-[200px] justify-center"
              >
                {isGenerating && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>}
                {buttonText}
              </button>
          </div>
          {error && <p className="text-[var(--bg-negative)] text-sm">{error}</p>}
      </div>
    </div>
  );
};