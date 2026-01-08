import React, { useState, useCallback, useEffect, useRef } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { editImageWithNanoBanana } from '../services/geminiService';
import { ANGLE_OPTIONS } from '../constants';
import type { GeneratedImage, GenerationConfig } from '../types';
import { GenerationConfigSelector } from './GenerationConfigSelector';
import { ensureProApiKey } from '../services/apiKeyService';

interface AngleChangeToolProps {
  addToHistory: (image: GeneratedImage) => void;
  sourceImage: string | null;
  onImageClick: (image: GeneratedImage) => void;
}

export const AngleChangeTool: React.FC<AngleChangeToolProps> = ({ addToHistory, sourceImage: initialSource, onImageClick }) => {
  const [sourceImage, setSourceImage] = useState<{ data: string; mime: string; url: string } | null>(null);
  const [selectedAngles, setSelectedAngles] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [config, setConfig] = useState<GenerationConfig>({ model: 'nano-banana', aspectRatio: '1:1', imageSize: '1K' });

  useEffect(() => {
    if (initialSource) {
      const mime = initialSource.substring(initialSource.indexOf(':') + 1, initialSource.indexOf(';'));
      const data = initialSource.substring(initialSource.indexOf(',') + 1);
      setSourceImage({ data, mime, url: initialSource });
      setError(null);
    }
  }, [initialSource]);

  const processFile = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
        try {
            const { base64, mimeType } = await fileToBase64(file);
            setSourceImage({ data: base64, mime: mimeType, url: `data:${mimeType};base64,${base64}` });
            setSelectedAngles(new Set());
            setGeneratedImages([]);
            setError(null);
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
  
  const toggleAngleSelection = (angleId: string) => {
    setSelectedAngles(prev => {
        const newSet = new Set(prev);
        if (newSet.has(angleId)) {
            newSet.delete(angleId);
        } else {
            newSet.add(angleId);
        }
        return newSet;
    });
  };

  const handleGenerate = useCallback(async () => {
    if (!sourceImage || selectedAngles.size === 0) {
      setError("이미지를 업로드하고 하나 이상의 앵글을 선택해주세요.");
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
    const folderName = `카메라_앵글_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
    
    const originalImageForHistory: GeneratedImage = {
        id: `${timestamp}-original`,
        src: sourceImage.url,
        name: 'Original',
        folder: folderName,
        timestamp: timestamp,
    };
    setGeneratedImages([originalImageForHistory]);

    const anglesToGenerate = ANGLE_OPTIONS.filter(angle => selectedAngles.has(angle.id));

    const generationPromises = anglesToGenerate.map(angle => 
      editImageWithNanoBanana(sourceImage.data, sourceImage.mime, angle.prompt, config)
        .then(newImageSrc => {
          const newImage: GeneratedImage = {
            id: `${timestamp}-${angle.id}`,
            src: newImageSrc,
            name: angle.name,
            folder: folderName,
            timestamp: timestamp,
          };
          addToHistory(newImage);
          setGeneratedImages(prev => [...prev, newImage]);
        })
        .catch(err => {
          console.error(`Failed to generate ${angle.name}:`, err);
          // Silently fail for now, or add individual error states
        })
    );
    
    try {
      await Promise.all(generationPromises);
    } catch (err) {
      setError("이미지 생성 중 오류가 발생했습니다. 일부 이미지가 생성되지 않았을 수 있습니다.");
    } finally {
      setIsGenerating(false);
    }

  }, [sourceImage, selectedAngles, addToHistory, config]);

  const buttonText = isGenerating 
    ? '생성 중...' 
    : selectedAngles.size > 0 
    ? `${selectedAngles.size}개 앵글 생성`
    : '앵글 생성';

  const handleChangeImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <input
        id="angle-file-upload"
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
        <div className="flex justify-center items-center gap-4 mb-4">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">자동 앵글 생성</h2>
          <a 
            href="https://ai.studio/apps/drive/1Dece95_fn5msQENyl3yH2nPWZ_U6wxD9"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[var(--bg-info)] text-[var(--text-on-accent)] text-sm font-semibold py-1 px-3 rounded-full hover:bg-[var(--bg-info-hover)] transition-colors whitespace-nowrap"
          >
            (디테일 앱 실행)
          </a>
        </div>
        
        {!sourceImage && (
             <div className="max-w-md mx-auto">
                <label htmlFor="angle-file-upload" className="cursor-pointer block bg-[var(--bg-accent)] text-[var(--text-on-accent)] font-bold py-3 px-6 rounded-lg hover:bg-[var(--bg-accent-hover)] transition-colors w-full">
                이미지 선택
                </label>
                <p className="text-[var(--text-secondary)] mt-4 text-sm">또는 이미지를 이곳에 드래그 앤 드롭 하거나 붙여넣으세요.</p>
             </div>
        )}

        {sourceImage && (
            <div className="max-w-md mx-auto mb-6">
                 <img src={sourceImage.url} alt="Original character" className="w-full h-auto object-contain rounded-md max-h-96" />
            </div>
        )}
      </div>

      <div className="flex-grow bg-[var(--bg-secondary)] p-6 rounded-lg shadow-xl overflow-y-auto">
        <div>
            <h3 className="text-xl font-bold mb-2">1. 앵글 선택</h3>
            <p className="text-[var(--text-secondary)] mb-6">생성하고 싶은 카메라 앵글을 모두 선택해 주세요.</p>
            <div className="flex flex-wrap gap-3 justify-center">
                {ANGLE_OPTIONS.map(angle => (
                    <button
                        key={angle.id}
                        onClick={() => toggleAngleSelection(angle.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border-2 ${
                            selectedAngles.has(angle.id)
                            ? 'bg-[var(--bg-accent)] border-[var(--border-accent)] text-[var(--text-on-accent)]'
                            : 'bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-interactive)] hover:border-[var(--border-accent)]'
                        }`}
                    >
                        {angle.name}
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
                disabled={!sourceImage || selectedAngles.size === 0 || isGenerating}
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