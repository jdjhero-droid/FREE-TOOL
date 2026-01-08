import React, { useState, useCallback, useEffect, useRef } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { editImageWithOptionalReference } from '../services/geminiService';
import { EXPRESSION_OPTIONS, POSE_OPTIONS, HAIRSTYLE_OPTIONS, CLOTHING_OPTIONS } from '../constants';
import type { GeneratedImage, GenerationConfig } from '../types';
import { CloseIcon, PlusCircleIcon } from './icons';
import { GenerationConfigSelector } from './GenerationConfigSelector';
import { ensureProApiKey } from '../services/apiKeyService';

interface ExpressionPoseToolProps {
  addToHistory: (image: GeneratedImage) => void;
  sourceImage: string | null;
  onImageClick: (image: GeneratedImage) => void;
}

type RefImage = { data: string; mime: string; url: string };

const MiniImageUploader: React.FC<{
  image: RefImage | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  inputId: string;
}> = ({ image, onFileSelect, onClear, inputId }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
        onFileSelect(e.target.files[0]);
    }
    e.target.value = '';
  };

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
    if (e.dataTransfer.files?.[0]) {
        onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full h-24 bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center border-2 border-dashed ${isDraggingOver ? 'border-[var(--border-accent)]' : 'border-[var(--border-secondary)]'} transition-colors`}
    >
      {image ? (
        <>
          <img src={image.url} alt="Reference" className="w-full h-full object-contain rounded-md p-1" />
          <button onClick={onClear} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-[var(--bg-negative)]">
            <CloseIcon className="w-3 h-3" />
          </button>
        </>
      ) : (
        <label htmlFor={inputId} className="cursor-pointer text-center text-xs text-[var(--text-secondary)] p-2">
          <PlusCircleIcon className="w-6 h-6 mx-auto mb-1" />
          참조 이미지
        </label>
      )}
      <input id={inputId} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
    </div>
  );
};

export const ExpressionPoseTool: React.FC<ExpressionPoseToolProps> = ({ addToHistory, sourceImage: initialSource, onImageClick }) => {
  const [sourceImage, setSourceImage] = useState<RefImage | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  
  const [expressionRefImage, setExpressionRefImage] = useState<RefImage | null>(null);
  const [poseRefImage, setPoseRefImage] = useState<RefImage | null>(null);
  const [hairstyleRefImage, setHairstyleRefImage] = useState<RefImage | null>(null);
  const [clothingRefImage, setClothingRefImage] = useState<RefImage | null>(null);

  const [customExpression, setCustomExpression] = useState('');
  const [customPose, setCustomPose] = useState('');
  const [customHairstyle, setCustomHairstyle] = useState('');
  const [customClothing, setCustomClothing] = useState('');

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

  const processFile = async (file: File, target?: 'main' | 'expression' | 'pose' | 'hairstyle' | 'clothing') => {
    if (!file || !file.type.startsWith('image/')) {
        setError("유효한 이미지 파일(PNG, JPG 등)을 업로드해주세요.");
        return;
    }
    try {
        const { base64, mimeType } = await fileToBase64(file);
        const newImage = { data: base64, mime: mimeType, url: `data:${mimeType};base64,${base64}` };
        
        switch(target) {
            case 'expression': setExpressionRefImage(newImage); break;
            case 'pose': setPoseRefImage(newImage); break;
            case 'hairstyle': setHairstyleRefImage(newImage); break;
            case 'clothing': setClothingRefImage(newImage); break;
            default: // main image
                setSourceImage(newImage);
                setSelectedOptions(new Set());
                setCustomExpression(''); setCustomPose(''); setCustomHairstyle(''); setCustomClothing('');
                setExpressionRefImage(null); setPoseRefImage(null); setHairstyleRefImage(null); setClothingRefImage(null);
                setGeneratedImages([]);
                setError(null);
        }
    } catch (err) {
        console.error("Error converting file to base64", err);
        setError("이미지 파일을 불러올 수 없습니다.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) processFile(event.target.files[0]);
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingOver(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingOver(false); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDraggingOver(false);
      if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };
  
  const toggleOptionSelection = (optionId: string) => {
    setSelectedOptions(prev => {
        const newSet = new Set(prev);
        newSet.has(optionId) ? newSet.delete(optionId) : newSet.add(optionId);
        return newSet;
    });
  };

  const handleGenerate = useCallback(async () => {
    if (!sourceImage) {
      setError("먼저 이미지를 업로드해주세요.");
      return;
    }
    
    const tasks: { id: string, name: string, prompt: string, refImage: RefImage | null }[] = [];

    // Expressions
    if (expressionRefImage) {
        tasks.push({ id: `ref-expr`, name: `참조 표정`, prompt: `Change the expression of the person in the main image to match the expression of the person in the reference image.`, refImage: expressionRefImage });
    } else {
        const selectedExpressions = EXPRESSION_OPTIONS.filter(opt => selectedOptions.has(opt.id));
        tasks.push(...selectedExpressions.map(opt => ({...opt, refImage: null})));
        if (customExpression.trim()) {
            tasks.push({ id: `custom-expr-${Date.now()}`, name: `직접 입력: ${customExpression}`, prompt: `Change the expression to: ${customExpression}`, refImage: null });
        }
    }

    // Poses
    if (poseRefImage) {
        tasks.push({ id: `ref-pose`, name: `참조 포즈`, prompt: `Change the pose of the person in the main image to match the pose in the reference image.`, refImage: poseRefImage });
    } else {
        const selectedPoses = POSE_OPTIONS.filter(opt => selectedOptions.has(opt.id));
        tasks.push(...selectedPoses.map(opt => ({...opt, refImage: null})));
        if (customPose.trim()) {
            tasks.push({ id: `custom-pose-${Date.now()}`, name: `직접 입력: ${customPose}`, prompt: `Change the pose to: ${customPose}`, refImage: null });
        }
    }

    // Hairstyles
    if (hairstyleRefImage) {
        tasks.push({ id: `ref-hair`, name: `참조 헤어스타일`, prompt: `Change the hairstyle of the person in the main image to match the hairstyle in the reference image.`, refImage: hairstyleRefImage });
    } else {
        const selectedHairstyles = HAIRSTYLE_OPTIONS.filter(opt => selectedOptions.has(opt.id));
        tasks.push(...selectedHairstyles.map(opt => ({...opt, refImage: null})));
        if (customHairstyle.trim()) {
            tasks.push({ id: `custom-hair-${Date.now()}`, name: `직접 입력: ${customHairstyle}`, prompt: `Change the hairstyle to: ${customHairstyle}`, refImage: null });
        }
    }

    // Clothing
    if (clothingRefImage) {
        tasks.push({ id: `ref-cloth`, name: `참조 의상`, prompt: `Change the clothing of the person in the main image to match the clothing in the reference image.`, refImage: clothingRefImage });
    } else {
        const selectedClothing = CLOTHING_OPTIONS.filter(opt => selectedOptions.has(opt.id));
        tasks.push(...selectedClothing.map(opt => ({...opt, refImage: null})));
        if (customClothing.trim()) {
            tasks.push({ id: `custom-cloth-${Date.now()}`, name: `직접 입력: ${customClothing}`, prompt: `Change the clothing to: ${customClothing}`, refImage: null });
        }
    }

    if (tasks.length === 0) {
      setError("옵션을 선택하거나 직접 값을 입력해주세요.");
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
    const folderName = `표정_포즈_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`;
    
    const originalImageForHistory: GeneratedImage = { id: `${timestamp}-original`, src: sourceImage.url, name: 'Original', folder: folderName, timestamp };
    setGeneratedImages([originalImageForHistory]);

    const generationPromises = tasks.map(task => 
      editImageWithOptionalReference(
        { data: sourceImage.data, mime: sourceImage.mime },
        task.prompt,
        task.refImage ? { data: task.refImage.data, mime: task.refImage.mime } : null,
        config
      ).then(newImageSrc => {
          const newImage: GeneratedImage = { id: `${timestamp}-${task.id}`, src: newImageSrc, name: task.name, folder: folderName, timestamp };
          addToHistory(newImage);
          setGeneratedImages(prev => [...prev, newImage]);
      }).catch(err => {
          console.error(`Failed to generate ${task.name}:`, err);
      })
    );
    
    await Promise.all(generationPromises);
    setIsGenerating(false);

  }, [sourceImage, selectedOptions, customExpression, customPose, customHairstyle, customClothing, expressionRefImage, poseRefImage, hairstyleRefImage, clothingRefImage, addToHistory, config]);
  
  const totalSelections =
    (expressionRefImage ? 1 : EXPRESSION_OPTIONS.filter(o => selectedOptions.has(o.id)).length + (customExpression.trim() ? 1 : 0)) +
    (poseRefImage ? 1 : POSE_OPTIONS.filter(o => selectedOptions.has(o.id)).length + (customPose.trim() ? 1 : 0)) +
    (hairstyleRefImage ? 1 : HAIRSTYLE_OPTIONS.filter(o => selectedOptions.has(o.id)).length + (customHairstyle.trim() ? 1 : 0)) +
    (clothingRefImage ? 1 : CLOTHING_OPTIONS.filter(o => selectedOptions.has(o.id)).length + (customClothing.trim() ? 1 : 0));

  const buttonText = isGenerating ? '생성 중...' : totalSelections > 0 ? `${totalSelections}개 변경 생성` : '변경 생성';

  return (
    <div className="flex flex-col h-full space-y-4">
      <input
        ref={fileInputRef}
        id="expression-pose-file-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div 
        className={`bg-[var(--bg-secondary)] p-6 rounded-lg shadow-xl text-center transition-colors ${isDraggingOver ? 'bg-[var(--bg-accent)]/20 ring-2 ring-[var(--ring-accent)]' : ''}`}
        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
      >
        <h2 className="text-3xl font-bold mb-4 text-[var(--text-primary)]">표정 / 포즈 / 헤어 / 의상 변경</h2>
        {!sourceImage ? (
             <div className="max-w-md mx-auto">
                <label htmlFor="expression-pose-file-upload" className="cursor-pointer block bg-[var(--bg-accent)] text-[var(--text-on-accent)] font-bold py-3 px-6 rounded-lg hover:bg-[var(--bg-accent-hover)] transition-colors w-full">
                이미지 선택
                </label>
                <p className="text-[var(--text-secondary)] mt-4 text-sm">또는 이미지를 이곳에 드래그 앤 드롭 하거나 붙여넣으세요.</p>
             </div>
        ) : (
            <div className="max-w-md mx-auto mb-6">
                 <img src={sourceImage.url} alt="Original source" className="w-full h-auto object-contain rounded-md max-h-96" />
            </div>
        )}
      </div>

      <div className="flex-grow bg-[var(--bg-secondary)] p-6 rounded-lg shadow-xl overflow-y-auto space-y-6">
        {/* Expression */}
        <div>
            <h3 className="text-xl font-bold mb-3">1. 표정 변경</h3>
            <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
              <MiniImageUploader image={expressionRefImage} onFileSelect={(f) => processFile(f, 'expression')} onClear={() => setExpressionRefImage(null)} inputId="expr-ref-upload"/>
              <div>
                <div className="flex flex-wrap gap-2">
                    {EXPRESSION_OPTIONS.map(option => (
                        <button key={option.id} onClick={() => toggleOptionSelection(option.id)} disabled={!!expressionRefImage}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border ${selectedOptions.has(option.id) ? 'bg-[var(--bg-accent)] border-[var(--border-accent)] text-[var(--text-on-accent)]' : 'bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-interactive)]'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                            {option.name}
                        </button>
                    ))}
                </div>
                <input type="text" value={customExpression} onChange={(e) => setCustomExpression(e.target.value)} placeholder="또는 직접 표정 입력..." disabled={!!expressionRefImage}
                    className="mt-3 w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg p-2 text-sm focus:ring-[var(--ring-accent)] focus:border-[var(--border-accent)] disabled:opacity-50"/>
              </div>
            </div>
        </div>
        
        {/* Pose */}
        <div>
            <h3 className="text-xl font-bold mb-3">2. 포즈 변경</h3>
             <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
              <MiniImageUploader image={poseRefImage} onFileSelect={(f) => processFile(f, 'pose')} onClear={() => setPoseRefImage(null)} inputId="pose-ref-upload"/>
              <div>
                <div className="flex flex-wrap gap-2">
                    {POSE_OPTIONS.map(option => (
                        <button key={option.id} onClick={() => toggleOptionSelection(option.id)} disabled={!!poseRefImage}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border ${selectedOptions.has(option.id) ? 'bg-[var(--bg-accent)] border-[var(--border-accent)] text-[var(--text-on-accent)]' : 'bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-interactive)]'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                            {option.name}
                        </button>
                    ))}
                </div>
                <input type="text" value={customPose} onChange={(e) => setCustomPose(e.target.value)} placeholder="또는 직접 포즈 입력..." disabled={!!poseRefImage}
                    className="mt-3 w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg p-2 text-sm focus:ring-[var(--ring-accent)] focus:border-[var(--border-accent)] disabled:opacity-50"/>
              </div>
            </div>
        </div>

        {/* Hairstyle */}
        <div>
            <h3 className="text-xl font-bold mb-3">3. 헤어스타일 변경</h3>
             <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
                <MiniImageUploader image={hairstyleRefImage} onFileSelect={(f) => processFile(f, 'hairstyle')} onClear={() => setHairstyleRefImage(null)} inputId="hair-ref-upload"/>
                <div>
                    <div className="flex flex-wrap gap-2">
                        {HAIRSTYLE_OPTIONS.map(option => (
                            <button key={option.id} onClick={() => toggleOptionSelection(option.id)} disabled={!!hairstyleRefImage}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border ${selectedOptions.has(option.id) ? 'bg-[var(--bg-accent)] border-[var(--border-accent)] text-[var(--text-on-accent)]' : 'bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-interactive)]'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                                {option.name}
                            </button>
                        ))}
                    </div>
                    <input type="text" value={customHairstyle} onChange={(e) => setCustomHairstyle(e.target.value)} placeholder="또는 직접 헤어스타일 입력..." disabled={!!hairstyleRefImage}
                        className="mt-3 w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg p-2 text-sm focus:ring-[var(--ring-accent)] focus:border-[var(--border-accent)] disabled:opacity-50"/>
                </div>
            </div>
        </div>

        {/* Clothing */}
        <div>
            <h3 className="text-xl font-bold mb-3">4. 의상 변경</h3>
             <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
                <MiniImageUploader image={clothingRefImage} onFileSelect={(f) => processFile(f, 'clothing')} onClear={() => setClothingRefImage(null)} inputId="cloth-ref-upload"/>
                <div>
                    <div className="flex flex-wrap gap-2">
                        {CLOTHING_OPTIONS.map(option => (
                            <button key={option.id} onClick={() => toggleOptionSelection(option.id)} disabled={!!clothingRefImage}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border ${selectedOptions.has(option.id) ? 'bg-[var(--bg-accent)] border-[var(--border-accent)] text-[var(--text-on-accent)]' : 'bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-interactive)]'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                                {option.name}
                            </button>
                        ))}
                    </div>
                    <input type="text" value={customClothing} onChange={(e) => setCustomClothing(e.target.value)} placeholder="또는 직접 의상 입력..." disabled={!!clothingRefImage}
                        className="mt-3 w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg p-2 text-sm focus:ring-[var(--ring-accent)] focus:border-[var(--border-accent)] disabled:opacity-50"/>
                </div>
            </div>
        </div>

        {generatedImages.length > 0 && (
            <div className="mt-4">
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
                <button onClick={() => fileInputRef.current?.click()} className="bg-[var(--bg-interactive)] text-[var(--text-primary)] font-bold py-3 px-6 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                    이미지 변경
                </button>
            )}
            <button onClick={handleGenerate} disabled={!sourceImage || totalSelections === 0 || isGenerating}
                className="bg-[var(--bg-positive)] text-[var(--text-on-accent)] font-bold py-3 px-8 rounded-lg hover:bg-[var(--bg-positive-hover)] transition-colors disabled:bg-[var(--bg-disabled)] disabled:cursor-not-allowed flex items-center min-w-[200px] justify-center">
                {isGenerating && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>}
                {buttonText}
            </button>
          </div>
          {error && <p className="text-[var(--bg-negative)] text-sm">{error}</p>}
      </div>
    </div>
  );
};