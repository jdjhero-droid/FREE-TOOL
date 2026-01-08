import React, { useState, useCallback, useEffect } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { generateImage } from '../services/geminiService';
import type { GeneratedImage, GenerationConfig } from '../types';
import { CloseIcon, SparklesIcon, PhotoIcon } from './icons';
import { GenerationConfigSelector } from './GenerationConfigSelector';
import { ensureProApiKey } from '../services/apiKeyService';

interface NanoBananaGeneratorToolProps {
  addToHistory: (image: GeneratedImage) => void;
  onImageClick: (image: GeneratedImage) => void;
}

export const NanoBananaGeneratorTool: React.FC<NanoBananaGeneratorToolProps> = ({ addToHistory, onImageClick }) => {
  const [sourceImage, setSourceImage] = useState<{ data: string; mime: string; url: string } | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [config, setConfig] = useState<GenerationConfig>({ model: 'nano-banana', aspectRatio: '1:1', imageSize: '1K' });

  const processFile = useCallback(async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const { base64, mimeType } = await fileToBase64(file);
        setSourceImage({ data: base64, mime: mimeType, url: `data:${mimeType};base64,${base64}` });
        setError(null);
      } catch (err) {
        setError("이미지 파일을 불러올 수 없습니다.");
      }
    } else {
      setError("유효한 이미지 파일(PNG, JPG 등)을 업로드해주세요.");
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
        const items = event.clipboardData?.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if(file) processFile(file);
                    break;
                }
            }
        }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("프롬프트를 입력해주세요.");
      return;
    }

    if (config.model === 'nano-banana-pro') {
        await ensureProApiKey();
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const newImageSrc = await generateImage(
          prompt, 
          sourceImage ? { data: sourceImage.data, mime: sourceImage.mime } : null, 
          config
      );
      
      const timestamp = Date.now();
      const date = new Date(timestamp);
      const folderName = `이미지_생성_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      
      const newImage: GeneratedImage = {
        id: `${timestamp}-gen`,
        src: newImageSrc,
        name: 'Generated Image',
        folder: folderName,
        timestamp,
      };

      addToHistory(newImage);
      setGeneratedImage(newImage);
    } catch (err) {
      console.error("Generation failed:", err);
      setError("이미지 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-8 animate-fade-in">
      <div className="flex-shrink-0 bg-slate-800/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h2 className="text-4xl font-black mb-2 flex items-center gap-4">
          <SparklesIcon className="w-10 h-10 text-indigo-400" />
          이미지 생성
        </h2>
        <p className="text-slate-400 font-medium">나노바나나 AI를 통해 고퀄리티 이미지를 자유롭게 생성하세요.</p>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        {/* Left: Inputs */}
        <div className="bg-slate-800/20 backdrop-blur-sm p-8 rounded-[2.5rem] flex flex-col gap-8 overflow-y-auto border border-white/5 shadow-xl">
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <PhotoIcon className="w-6 h-6 text-indigo-400/70" />
              참조 이미지 (선택)
            </h3>
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-[2rem] p-6 h-72 flex flex-col items-center justify-center transition-all duration-500 ${isDraggingOver ? 'border-indigo-500 bg-indigo-500/10 scale-[0.98]' : 'border-slate-700 bg-slate-900/50'} hover:border-indigo-500/50`}
            >
              {sourceImage ? (
                <div className="relative group w-full h-full flex items-center justify-center">
                  <img src={sourceImage.url} alt="Reference" className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" />
                  <button onClick={() => setSourceImage(null)} className="absolute top-4 right-4 bg-rose-500 text-white p-2.5 rounded-full hover:bg-rose-600 shadow-xl opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label htmlFor="ref-upload" className="cursor-pointer text-center group w-full h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/10 transition-all group-hover:shadow-xl">
                    <PhotoIcon className="w-10 h-10 text-slate-500 group-hover:text-indigo-400" />
                  </div>
                  <p className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">이미지 업로드 / 드래그</p>
                  <p className="text-sm text-slate-500 mt-2">또는 클립보드에서 붙여넣기</p>
                </label>
              )}
              <input id="ref-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <SparklesIcon className="w-6 h-6 text-indigo-400/70" />
              프롬프트 입력
            </h3>
            <textarea
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="생성하고 싶은 이미지의 상세 묘사를 입력하세요..."
              className="w-full bg-slate-900/50 border border-white/5 rounded-[1.5rem] p-6 text-base text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none font-medium shadow-inner"
            />
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <GenerationConfigSelector config={config} setConfig={setConfig} />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-indigo-600 text-white font-black py-5 px-8 rounded-[1.5rem] hover:bg-indigo-500 transition-all transform active:scale-[0.98] shadow-2xl shadow-indigo-500/20 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-4 text-xl uppercase tracking-wider"
            >
              {isGenerating ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <SparklesIcon className="w-6 h-6" />}
              {isGenerating ? '프로세싱...' : '이미지 생성하기'}
            </button>
            {error && <p className="text-rose-500 mt-6 text-center text-sm font-bold bg-rose-500/5 py-4 rounded-2xl border border-rose-500/10">{error}</p>}
          </div>
        </div>

        {/* Right: Result */}
        <div className="bg-slate-800/20 backdrop-blur-sm p-8 rounded-[2.5rem] flex flex-col border border-white/5 shadow-xl">
          <h3 className="text-2xl font-black mb-6 text-white flex items-center gap-3">
            <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
            결과 미리보기
          </h3>
          <div className="flex-grow bg-slate-900/80 rounded-[2rem] flex items-center justify-center relative group overflow-hidden border border-white/5 shadow-2xl">
            {isGenerating && (
                <div className="flex flex-col items-center gap-8 animate-pulse">
                    <div className="w-24 h-24 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center shadow-2xl">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-400"></div>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-white tracking-tight">이미지 렌더링 중</p>
                        <p className="text-slate-500 font-medium mt-2">창의적인 작업이 진행되고 있습니다...</p>
                    </div>
                </div>
            )}
            {generatedImage && !isGenerating ? (
              <button onClick={() => onImageClick(generatedImage)} className="w-full h-full p-8 animate-fade-in flex items-center justify-center">
                <img src={generatedImage.src} alt="Generated" className="max-w-full max-h-full object-contain rounded-[1.5rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500">
                  <div className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all shadow-2xl uppercase tracking-tighter">
                    Full Resolution View
                  </div>
                </div>
              </button>
            ) : !isGenerating && (
              <div className="text-center text-slate-600 p-12 opacity-30 select-none">
                <SparklesIcon className="w-24 h-24 mx-auto mb-8 text-slate-700" />
                <p className="text-2xl font-black tracking-tight uppercase">Ready for Input</p>
                <p className="text-base mt-3 font-medium">프롬프트를 입력하여 작업을 시작하세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};