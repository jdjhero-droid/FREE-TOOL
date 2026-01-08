import React, { useMemo, useState, useEffect } from 'react';
import type { GeneratedImage } from '../types';
import { DownloadIcon, TrashIcon, ChevronDownIcon, PhotoIcon } from './icons';

// These are expected to be available globally from the scripts in index.html
declare const JSZip: any;
declare const saveAs: any;

interface HistoryPanelProps {
  history: GeneratedImage[];
  onImageClick: (image: GeneratedImage) => void;
  clearHistory: () => void;
  deleteFolder: (folderName: string) => void;
}

const HistoryItem: React.FC<{ image: GeneratedImage, onClick: () => void }> = ({ image, onClick }) => {
    return (
        <div 
            onClick={onClick} 
            draggable="true"
            onDragStart={(e) => {
                const data = JSON.stringify({ id: image.id, src: image.src, name: image.name });
                e.dataTransfer.setData('application/x-ai-toolset-history-item', data);
                e.dataTransfer.effectAllowed = 'copy';
            }}
            className="w-full text-left bg-slate-900 rounded-xl overflow-hidden group relative transition-all duration-500 hover:ring-2 hover:ring-indigo-500/50 cursor-pointer shadow-sm hover:shadow-2xl"
        >
            <div className="aspect-square w-full relative">
                <img src={image.src} alt={image.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" draggable="false" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                    <span className="text-[9px] text-white font-black uppercase tracking-widest bg-indigo-600 px-2 py-1 rounded-md shadow-lg">Preview</span>
                </div>
            </div>
        </div>
    );
};

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onImageClick, clearHistory, deleteFolder }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const groupedHistory = useMemo(() => {
    return history.reduce((acc, image) => {
      const folder = image.folder || 'Uncategorized';
      if (!acc[folder]) acc[folder] = [];
      acc[folder].push(image);
      return acc;
    }, {} as Record<string, GeneratedImage[]>);
  }, [history]);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => {
        const newSet = new Set(prev);
        newSet.has(folderName) ? newSet.delete(folderName) : newSet.add(folderName);
        return newSet;
    });
  };
  
  const handleDownloadAll = async () => {
    if (history.length === 0) return;
    const zip = new JSZip();
    await Promise.all(Object.keys(groupedHistory).map(async (folderName) => {
      const images = groupedHistory[folderName];
      const folder = zip.folder(folderName);
      if(folder){
        await Promise.all(images.map(async (image) => {
          const fileName = `${image.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
          try {
            const response = await fetch(image.src);
            folder.file(fileName, await response.blob());
          } catch(e) { console.error(e); }
        }));
      }
    }));
    zip.generateAsync({ type: 'blob' }).then((content: any) => saveAs(content, `ai_creative_studio_${Date.now()}.zip`));
  };

  const handleDownloadFolder = async (folderName: string, images: GeneratedImage[]) => {
    if (images.length === 0) return;
    const zip = new JSZip();
    await Promise.all(images.map(async (image) => {
      const fileName = `${image.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
      try {
        const response = await fetch(image.src);
        zip.file(fileName, await response.blob());
      } catch(e) { console.error(e); }
    }));
    zip.generateAsync({ type: 'blob' }).then((content: any) => {
      const safeName = folderName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      saveAs(content, `folder_${safeName}.zip`);
    });
  };

  return (
    <aside className="w-80 bg-[#0d1222] flex flex-col border-l border-white/5 h-full overflow-hidden shadow-2xl z-20">
      <div className="p-8 flex-shrink-0 bg-black/10">
        <div className="flex items-center justify-between gap-2 mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600/10 rounded-xl text-indigo-400">
                    <PhotoIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black tracking-tighter text-white uppercase">Storage</h2>
            </div>
            <button onClick={clearHistory} className="p-2 text-slate-500 hover:text-rose-500 transition-colors" title="비우기">
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
        
        <button 
          onClick={handleDownloadAll}
          disabled={history.length === 0}
          className="w-full bg-indigo-600 text-white font-black py-4 px-4 rounded-2xl hover:bg-indigo-500 transition-all disabled:opacity-20 flex items-center justify-center gap-3 text-xs shadow-xl shadow-indigo-500/20"
        >
          <DownloadIcon className="w-4 h-4" />
          EXTRACT ALL (.ZIP)
        </button>
      </div>

      <div className="flex-grow overflow-y-auto px-6 pb-10 space-y-5 custom-scrollbar">
        {Object.keys(groupedHistory).length > 0 ? Object.keys(groupedHistory).map((folder) => {
          const images = groupedHistory[folder];
          const isExpanded = expandedFolders.has(folder);
          return (
          <div key={folder} className={`rounded-3xl border transition-all duration-300 ${isExpanded ? 'bg-slate-800/40 border-indigo-500/30 shadow-xl' : 'bg-slate-800/20 border-white/5 hover:border-white/10'}`}>
            <button 
                onClick={() => toggleFolder(folder)} 
                className="w-full flex items-center justify-between p-5 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                  <div className={`p-2.5 rounded-xl transition-colors ${isExpanded ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                    <PhotoIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-sm font-black truncate w-full text-white text-left uppercase tracking-tight">{folder}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{images.length} ITEMS</span>
                  </div>
              </div>
              <ChevronDownIcon className={`w-5 h-5 transition-transform duration-500 text-slate-600 ${isExpanded ? 'rotate-180 text-indigo-400' : 'group-hover:text-slate-400'}`} />
            </button>
            
            {isExpanded && (
                <div className="px-5 pb-5 pt-2 animate-fade-in space-y-4">
                  <div className="flex gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleDownloadFolder(folder, images); }}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-2 text-[10px]"
                    >
                        <DownloadIcon className="w-3.5 h-3.5" />
                        ZIP
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); deleteFolder(folder); }}
                        className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {images.map(image => (
                      <HistoryItem key={image.id} image={image} onClick={() => onImageClick(image)} />
                    ))}
                  </div>
                </div>
            )}
          </div>
        )}) : (
          <div className="flex flex-col items-center justify-center h-full opacity-20 text-center py-20">
             <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                <PhotoIcon className="w-10 h-10 text-slate-600" />
             </div>
             <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Storage is Empty</p>
          </div>
        )}
      </div>
    </aside>
  );
};