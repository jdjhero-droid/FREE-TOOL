import React, { useState, useCallback, useEffect } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { editImageWithNanoBanana } from '../services/geminiService';
import { CHARACTER_SHEET_VIEWS } from '../constants';
import type { GeneratedImage, GenerationConfig } from '../types';
import { GenerationConfigSelector } from './GenerationConfigSelector';
import { ensureProApiKey } from '../services/apiKeyService';
import { FilmIcon, SparklesIcon, PhotoIcon } from './icons';

interface CharacterSheetToolProps {
  addToHistory: (image: GeneratedImage) => void;
  sourceImage: string | null;
  onImageClick: (image: GeneratedImage) => void;
}

const ImageCard: React.FC<{ name: string; image?: GeneratedImage; isLoading: boolean; onClick: () => void; }> = ({ name, image, isLoading, onClick }) => (
  <button 
    onClick={onClick}
    disabled={isLoading}
    className="relative text-left aspect-square bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-lg flex items-center justify-center group disabled:cursor-not-allowed border border-[var(--border-primary)] transition-all hover:ring-2 hover:ring-[var(--border-accent)]"
  >
    {isLoading && (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    )}
    {image ? (
      <img src={image.src} alt={name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
    ) : (
      !isLoading && <PhotoIcon className="w-8 h-8 opacity-20" />
    )}
    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
      <p className="text-white text-center text-[10px] font-black uppercase tracking-widest truncate">{name}</p>
    </div>
  </button>
);

export const CharacterSheetTool: React.FC<CharacterSheetToolProps> = ({ addToHistory, sourceImage: initialSource, onImageClick }) => {
  const [sourceImage, setSourceImage] = useState<{ data: string; mime: string; url: string } | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<string, GeneratedImage>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [folderName, setFolderName] = useState<string | null>(null);
  const [config, setConfig] = useState<GenerationConfig>({ model: 'nano-banana', aspectRatio: '1:1', imageSize: '1K' });

  useEffect(() => {
    if (initialSource) {
      const mime = initialSource.substring(initialSource.indexOf(':') + 1, initialSource.indexOf(';'));
      const data = initialSource.substring(initialSource.indexOf(',') + 1);
      setSourceImage({ data, mime, url: initialSource }); setGeneratedImages({}); setFolderName(null);
    }
  }, [initialSource]);

  const processFile = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
        try {
            const { base64, mimeType } = await fileToBase64(file);
            setSourceImage({ data: base64, mime: mimeType, url: `data:${mimeType};base64,${base64}` });
            setGeneratedImages({}); setError(null); setFolderName(null);
        } catch (err) { setError("파일 오류"); }
    }
  };

  const handleGenerateSheet = useCallback(async () => {
    if (!sourceImage) return;
    if (config.model === 'nano-banana-pro') await ensureProApiKey();
    setIsGeneratingAll(true); setError(null); setGeneratedImages({});
    const timestamp = Date.now();
    const currentFolderName = `캐릭터시트_${timestamp}`;
    setFolderName(currentFolderName);
    addToHistory({ id: `${timestamp}-orig`, src: sourceImage.url, name: 'Original', folder: currentFolderName, timestamp });
    const views = CHARACTER_SHEET_VIEWS;
    const initialLoading: Record<string, boolean> = {};
    views.forEach(v => initialLoading[v.id] = true);
    setLoadingStates(initialLoading);
    const promises = views.map(view => editImageWithNanoBanana(sourceImage.data, sourceImage.mime, view.prompt, config).then(src => {
      const res = { id: `${timestamp}-${view.id}`, src, name: view.name, folder: currentFolderName, timestamp };
      addToHistory(res);
      setGeneratedImages(prev => ({ ...prev, [view.id]: res }));
      setLoadingStates(prev => ({ ...prev, [view.id]: false }));
    }).catch(() => setLoadingStates(prev => ({ ...prev, [view.id]: false }))));
    await Promise.all(promises); setIsGeneratingAll(false);
  }, [sourceImage, addToHistory, config]);

  return (
    <div className="space-y-8">
      <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl border-b-4 border-[var(--bg-accent)]">
        <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
            <FilmIcon className="w-8 h-8 text-[var(--bg-accent)]" />
            캐릭터시트
        </h2>
        <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
          <div 
            className={`w-64 h-64 bg-[var(--bg-tertiary)] rounded-3xl flex items-center justify-center border-2 border-dashed transition-all relative overflow-hidden ${isDraggingOver ? 'border-[var(--border-accent)] bg-[var(--bg-accent)]/5' : 'border-[var(--border-primary)] hover:border-[var(--border-accent)]'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }}
          >
            {sourceImage ? (
              <img src={sourceImage.url} alt="Orig" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center opacity-30 group"><PhotoIcon className="w-12 h-12 mx-auto mb-3" /><p className="text-[10px] font-black uppercase">DROP HERO IMAGE</p></div>
            )}
          </div>
          <div className="space-y-6">
            <div className="max-w-sm">
                <GenerationConfigSelector config={config} setConfig={setConfig} />
            </div>
            <div className="flex gap-4">
                <label className="cursor-pointer bg-[var(--bg-interactive)] text-[var(--text-primary)] font-black py-3 px-8 rounded-2xl hover:bg-[var(--bg-tertiary)] transition-all shadow-sm">이미지 변경<input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} /></label>
                <button 
                  onClick={handleGenerateSheet}
                  disabled={!sourceImage || isGeneratingAll}
                  className="bg-[var(--bg-positive)] text-white font-black py-3 px-10 rounded-2xl hover:bg-[var(--bg-positive-hover)] transition-all shadow-lg disabled:opacity-30 flex items-center gap-3"
                >
                  {isGeneratingAll ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <SparklesIcon className="w-5 h-5" />}
                  {isGeneratingAll ? '시트 구성 중...' : '전체 시트 생성'}
                </button>
            </div>
            {error && <p className="text-red-500 font-bold">{error}</p>}
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl border border-[var(--border-primary)]">
        <h2 className="text-2xl font-black mb-8 border-l-4 border-[var(--bg-accent)] pl-4 uppercase tracking-tighter">Production Grid</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {CHARACTER_SHEET_VIEWS.map(view => (
            <ImageCard 
              key={view.id} name={view.name} image={generatedImages[view.id]} isLoading={loadingStates[view.id] || isGeneratingAll}
              onClick={() => !loadingStates[view.id] && !isGeneratingAll && (generatedImages[view.id] ? onImageClick(generatedImages[view.id]) : null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};