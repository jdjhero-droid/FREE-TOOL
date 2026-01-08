import React, { useState, useCallback, useEffect } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { generateProfilePhoto, modifyPromptForJob, modifyPromptForConcept } from '../services/geminiService';
import type { GeneratedImage, StudioPromptCategory, StudioPromptGender, GenerationConfig } from '../types';
import { STUDIO_PROMPTS } from '../data/prompts/studioPrompts';
import { CloseIcon, ChevronDownIcon, UserCircleIcon, SparklesIcon } from './icons';
import { GenerationConfigSelector } from './GenerationConfigSelector';
import { ensureProApiKey } from '../services/apiKeyService';

type UploadedImage = { data: string; mime: string; url: string };
type GenerationStatus = 'pending' | 'loading' | 'success' | 'failed';
interface GenerationSlot { image: GeneratedImage | null; status: GenerationStatus; prompt: string; }

export const ProfilePhotoTool: React.FC<{
  addToHistory: (image: GeneratedImage) => void;
  onImageClick: (image: GeneratedImage) => void;
}> = ({ addToHistory, onImageClick }) => {
    const [sourceImages, setSourceImages] = useState<UploadedImage[]>([]);
    const [gender, setGender] = useState<StudioPromptGender>('female');
    const [shootingScope, setShootingScope] = useState<'face' | 'upper-body' | 'full-body' | 'random'>('upper-body');
    const [styleTheme, setStyleTheme] = useState<StudioPromptCategory | 'mixed'>('professional');
    const [jobTitle, setJobTitle] = useState('');
    const [concept, setConcept] = useState('');
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [generationSlots, setGenerationSlots] = useState<GenerationSlot[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [generationCount, setGenerationCount] = useState(20);
    const [config, setConfig] = useState<GenerationConfig>({ model: 'nano-banana', aspectRatio: '1:1', imageSize: '1K' });

    const processFiles = useCallback(async (files: File[]) => {
        const imageFiles = files.filter(f => f.type.startsWith('image/')).slice(0, 5 - sourceImages.length);
        if (imageFiles.length === 0) return;
        try {
            const newImages = await Promise.all(imageFiles.map(async f => { const { base64, mimeType } = await fileToBase64(f); return { data: base64, mime: mimeType, url: `data:${mimeType};base64,${base64}` }; }));
            setSourceImages(prev => [...prev, ...newImages]);
            setGenerationSlots([]); setError(null);
        } catch (err) { setError("파일 로드 실패"); }
    }, [sourceImages.length]);

    const handleGenerate = useCallback(async () => {
        if (sourceImages.length === 0) { setError("사진을 업로드하세요."); return; }
        if (config.model === 'nano-banana-pro') await ensureProApiKey();
        setIsGenerating(true); setError(null);
        const prompts = STUDIO_PROMPTS.filter(p => p.gender === gender || p.gender === 'unisex').sort(() => 0.5 - Math.random()).slice(0, generationCount).map(p => `Preserve face identity from source. ${p.text}`);
        setGenerationSlots(prompts.map(p => ({ image: null, status: 'loading', prompt: p })));
        const ts = Date.now();
        const promises = prompts.map(async (p, i) => {
            try {
                let fp = p;
                if (jobTitle.trim()) fp = await modifyPromptForJob(p, jobTitle.trim());
                if (concept.trim()) fp = await modifyPromptForConcept(fp, concept.trim());
                const src = await generateProfilePhoto(sourceImages.map(img => ({ data: img.data, mime: img.mime })), fp, config);
                const res = { id: `${ts}-${i}`, src, name: `Profile ${i + 1}`, folder: `프로필사진_${ts}`, timestamp: ts };
                addToHistory(res);
                setGenerationSlots(prev => { const n = [...prev]; n[i] = { ...n[i], image: res, status: 'success' }; return n; });
            } catch (e) {
                setGenerationSlots(prev => { const n = [...prev]; n[i] = { ...n[i], status: 'failed' }; return n; });
            }
        });
        await Promise.all(promises); setIsGenerating(false);
    }, [sourceImages, gender, generationCount, addToHistory, jobTitle, concept, config]);

    return (
        <div className="flex h-full gap-8">
            <aside className="w-[420px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 pb-6">
                <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl border-b-4 border-[var(--bg-accent)]">
                    <h2 className="text-2xl font-black flex items-center gap-3">
                        <UserCircleIcon className="w-8 h-8 text-[var(--bg-accent)]" />
                        프로필사진
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium">스튜디오에서 촬영한 듯한 전문적인 AI 프로필 이미지를 생성합니다.</p>
                </div>
                
                <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-xl border border-[var(--border-primary)] space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--bg-accent)] text-white text-[10px] font-black">1</span>
                        <h3 className="text-sm font-black text-[var(--text-primary)]">원본 사진 업로드</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {sourceImages.map((img, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                                <img src={img.url} alt={`s ${i}`} className="w-full h-full object-cover"/>
                                <button onClick={() => setSourceImages(p => p.filter((_, idx) => idx !== i))} className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"><CloseIcon className="w-3 h-3"/></button>
                            </div>
                        ))}
                        {sourceImages.length < 5 && (
                            <label className={`aspect-square w-full flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all ${isDraggingOver ? 'border-[var(--border-accent)] bg-[var(--bg-accent)]/5' : 'border-[var(--border-primary)] hover:border-[var(--border-accent)]'}`} onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }} onDragLeave={() => setIsDraggingOver(false)} onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); processFiles(Array.from(e.dataTransfer.files)); }}>
                                <UserCircleIcon className="w-6 h-6 text-[var(--text-secondary)]" />
                                <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))} />
                            </label>
                        )}
                    </div>
                </div>

                <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-xl border border-[var(--border-primary)] space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--bg-accent)] text-white text-[10px] font-black">2</span>
                        <h3 className="text-sm font-black text-[var(--text-primary)]">스타일 커스터마이징</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-[var(--text-secondary)] mb-2 uppercase block">GENDER</label>
                            <div className="grid grid-cols-2 gap-2 bg-[var(--bg-primary)] p-1 rounded-xl">
                                <button onClick={() => setGender('female')} className={`py-2 text-xs font-bold rounded-lg ${gender === 'female' ? 'bg-[var(--bg-accent)] text-white shadow-md' : 'text-[var(--text-secondary)]'}`}>여성</button>
                                <button onClick={() => setGender('male')} className={`py-2 text-xs font-bold rounded-lg ${gender === 'male' ? 'bg-[var(--bg-accent)] text-white shadow-md' : 'text-[var(--text-secondary)]'}`}>남성</button>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-[var(--text-secondary)] mb-2 uppercase block">THEME</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[{id:'professional', name:'비즈니스'}, {id:'casual', name:'캐주얼'}, {id:'high-fashion', name:'하이패션'}, {id:'mixed', name:'랜덤스타일'}].map(opt => (
                                    <button key={opt.id} onClick={() => setStyleTheme(opt.id as any)} className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${styleTheme === opt.id ? 'bg-[var(--bg-accent)] border-[var(--bg-accent)] text-white shadow-md' : 'bg-[var(--bg-tertiary)] border-transparent text-[var(--text-secondary)] hover:border-[var(--border-primary)]'}`}>{opt.name}</button>
                                ))}
                            </div>
                        </div>
                        <details className="group" onToggle={(e) => setIsAdvancedOpen((e.target as any).open)}>
                            <summary className="cursor-pointer text-[10px] font-black text-[var(--text-accent)] uppercase flex items-center justify-between py-2 border-t border-[var(--border-primary)] mt-4">
                                Advanced Options
                                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                            </summary>
                            <div className="pt-4 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold mb-2">원하는 직업군</label>
                                    <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="변호사, 아티스트 등" className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[var(--ring-accent)]"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-2">추가 컨셉</label>
                                    <input type="text" value={concept} onChange={e => setConcept(e.target.value)} placeholder="사이버펑크, 빈티지 등" className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[var(--ring-accent)]"/>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>
                
                <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-xl border border-[var(--border-primary)] mt-auto">
                    <div className="mb-6">
                        <label className="text-[10px] font-black text-[var(--text-secondary)] mb-2 uppercase block">GEN COUNT: <span className="text-[var(--text-accent)]">{generationCount}</span></label>
                        <input type="range" min="1" max="30" value={generationCount} onChange={(e) => setGenerationCount(Number(e.target.value))} className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-[var(--bg-accent)]" />
                    </div>
                    <GenerationConfigSelector config={config} setConfig={setConfig} />
                    <button onClick={handleGenerate} disabled={sourceImages.length === 0 || isGenerating} className="w-full bg-[var(--bg-positive)] text-white font-black py-4 px-6 rounded-2xl hover:bg-[var(--bg-positive-hover)] transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-3 text-lg">
                        {isGenerating ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <SparklesIcon className="w-6 h-6" />}
                        {isGenerating ? '촬영 연산 중...' : '프로필 생성하기'}
                    </button>
                    {error && <p className="text-red-500 font-bold mt-3 text-center text-xs">{error}</p>}
                </div>
            </aside>
            
            <main className="flex-1 bg-[var(--bg-primary)] p-8 rounded-3xl shadow-2xl border border-[var(--border-primary)] flex flex-col">
                 <h2 className="text-2xl font-black mb-8 text-[var(--text-primary)] border-l-4 border-[var(--bg-accent)] pl-4">스튜디오 갤러리</h2>
                 <div className="flex-grow overflow-y-auto pr-2">
                    {generationSlots.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                            {generationSlots.map((slot, i) => (
                                <div key={i} className="aspect-[3/4] bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-lg border border-[var(--border-primary)] relative group transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl">
                                    {slot.status === 'loading' && <div className="absolute inset-0 flex items-center justify-center bg-black/5 animate-pulse"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--bg-accent)]"></div></div>}
                                    {slot.status === 'success' && slot.image && (
                                        <button onClick={() => onImageClick(slot.image!)} className="w-full h-full"><img src={slot.image.src} alt="res" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/></button>
                                    )}
                                    {slot.status === 'failed' && <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"><p className="text-[10px] text-red-500 font-black uppercase mb-2">FAILED</p></div>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-20 text-center"><UserCircleIcon className="w-20 h-20 mb-4" /><p className="text-xl font-black uppercase tracking-tighter">Your Portfolio awaits</p></div>
                    )}
                 </div>
            </main>
        </div>
    );
};