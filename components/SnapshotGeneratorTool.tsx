import React, { useState, useCallback, useEffect } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { generateSnapshotImage } from '../services/geminiService';
import type { GeneratedImage, GenerationConfig } from '../types';
// Fix: Added SparklesIcon to the imports from ./icons
import { CloseIcon, PlusCircleIcon, PhotoIcon, SparklesIcon } from './icons';
import { GenerationConfigSelector } from './GenerationConfigSelector';
import { ensureProApiKey } from '../services/apiKeyService';

type ShootingMode = 'personal' | 'couple';
type Gender = 'female' | 'male';
type StyleTheme = 'wedding' | 'daily' | 'travel' | 'film' | 'fashion' | 'party' | 'seasonal' | 'random';
type UploadedImage = { data: string; mime: string; url: string };

const THEMES: { id: StyleTheme, name: string }[] = [
    { id: 'wedding', name: '웨딩 스냅' },
    { id: 'daily', name: '일상 스냅' },
    { id: 'travel', name: '여행 스냅' },
    { id: 'film', name: '필름 / 레트로' },
    { id: 'fashion', name: '패션 화보'},
    { id: 'party', name: '파티 / 이벤트'},
    { id: 'seasonal', name: '계절 / 시즌'},
    { id: 'random', name: '랜덤 스냅'},
];

const ImageUploader: React.FC<{
    image: UploadedImage | null;
    onFileSelect: (file: File) => void;
    onClear: () => void;
    isDraggingOver: boolean;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    inputId: string;
}> = ({ image, onFileSelect, onClear, isDraggingOver, onDragOver, onDragLeave, onDrop, inputId }) => {
    return (
        <div
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            className={`relative w-full h-40 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center border-2 border-dashed transition-all overflow-hidden ${isDraggingOver ? 'border-[var(--border-accent)] bg-[var(--bg-accent)]/5 scale-[0.98]' : 'border-[var(--border-primary)] hover:border-[var(--border-accent)]'}`}
        >
            {image ? (
                <>
                    <img src={image.url} alt="Uploaded" className="w-full h-full object-cover" />
                    <button onClick={onClear} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-xl hover:bg-red-600 transition-colors">
                        <CloseIcon className="w-3.5 h-3.5" />
                    </button>
                </>
            ) : (
                <label htmlFor={inputId} className="cursor-pointer text-center group">
                    <PlusCircleIcon className="w-10 h-10 mx-auto mb-2 text-[var(--text-secondary)] group-hover:text-[var(--bg-accent)] transition-colors" />
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-tighter">Click or Drop</p>
                </label>
            )}
            <input id={inputId} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} />
        </div>
    );
};

export const SnapshotGeneratorTool: React.FC<{
  addToHistory: (image: GeneratedImage) => void;
  onImageClick: (image: GeneratedImage) => void;
}> = ({ addToHistory, onImageClick }) => {
    const [shootingMode, setShootingMode] = useState<ShootingMode>('personal');
    const [personalImage, setPersonalImage] = useState<UploadedImage | null>(null);
    const [coupleImage1, setCoupleImage1] = useState<UploadedImage | null>(null);
    const [coupleImage2, setCoupleImage2] = useState<UploadedImage | null>(null);
    const [gender, setGender] = useState<Gender>('female');
    const [coupleGenders, setCoupleGenders] = useState<[Gender, Gender]>(['female', 'male']);
    const [styleTheme, setStyleTheme] = useState<StyleTheme>('wedding');
    const [generationCount, setGenerationCount] = useState(8);
    const [generatedImages, setGeneratedImages] = useState<(GeneratedImage | null)[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragTarget, setDragTarget] = useState<string | null>(null);
    const [config, setConfig] = useState<GenerationConfig>({ model: 'nano-banana', aspectRatio: '1:1', imageSize: '1K' });

    const processFile = useCallback(async (file: File, target: 'personal' | 'couple1' | 'couple2') => {
        if (!file || !file.type.startsWith('image/')) return;
        try {
            const { base64, mimeType } = await fileToBase64(file);
            const newImage = { data: base64, mime: mimeType, url: `data:${mimeType};base64,${base64}` };
            if (target === 'personal') setPersonalImage(newImage);
            else if (target === 'couple1') setCoupleImage1(newImage);
            else setCoupleImage2(newImage);
            setError(null);
        } catch (err) { setError('파일 오류'); }
    }, []);

    const getPromptVariations = useCallback((count: number): string[] => {
        // ... (existing prompt dictionary)
        const variations: Record<Exclude<StyleTheme, 'random'>, string[]> = {
            wedding: ['in a romantic wedding ceremony setting', 'walking hand-in-hand through a beautiful garden, smiling', 'a close-up shot, looking lovingly at each other during sunset', 'joyfully celebrating with confetti falling around them'],
            daily: ['enjoying coffee at a cozy, sunlit cafe', 'strolling through a bustling city street, laughing together', 'cooking a meal together in a modern kitchen'],
            travel: ['posing in front of an iconic landmark like the Eiffel Tower', 'looking at a map together on a quaint European street'],
            film: ['in a retro 1980s style, with vibrant neon lights', 'in a grainy, high-contrast black and white photo'],
            fashion: ['posing for a high-fashion magazine cover shoot', 'confidently walking down a runway'],
            party: ['celebrating at a New Year\'s Eve party', 'dancing under a glittering disco ball'],
            seasonal: ['in a snowy winter landscape', 'relaxing on a bright, sunny beach during summer'],
        };
        const isRandom = styleTheme === 'random';
        const selectedVars = isRandom ? Object.values(variations).flat() : variations[styleTheme as keyof typeof variations] || variations['daily'];
        const base = `Generate a high-quality, photorealistic snapshot. Preserve the exact facial features of the subject. Real photograph quality.`;
        const personDesc = shootingMode === 'personal' ? `Features one ${gender}.` : `Features the couple together.`;
        return Array.from({ length: count }, (_, i) => `${base} ${personDesc} Scene: ${selectedVars[i % selectedVars.length]}.`);
    }, [styleTheme, gender, shootingMode, coupleGenders]);

    const handleGenerate = useCallback(async (isMore = false) => {
        if (shootingMode === 'personal' && !personalImage) return setError('사진을 업로드하세요.');
        if (shootingMode === 'couple' && (!coupleImage1 || !coupleImage2)) return setError('사진 2장을 모두 업로드하세요.');
        if (config.model === 'nano-banana-pro') await ensureProApiKey();
        setIsGenerating(true); setError(null); if (!isMore) setGeneratedImages([]);
        const prompts = getPromptVariations(generationCount);
        const startIndex = isMore ? generatedImages.length : 0;
        setGeneratedImages(prev => isMore ? [...prev, ...Array(generationCount).fill(null)] : Array(generationCount).fill(null));
        const ts = Date.now();
        const imgs = [];
        if (shootingMode === 'personal') imgs.push({ data: personalImage!.data, mimeType: personalImage!.mime });
        else { imgs.push({ data: coupleImage1!.data, mimeType: coupleImage1!.mime }); imgs.push({ data: coupleImage2!.data, mimeType: coupleImage2!.mime }); }
        const promises = prompts.map((p, i) => generateSnapshotImage(imgs, p, config).then(src => {
            const res = { id: `${ts}-${startIndex + i}`, src, name: `Snapshot ${startIndex + i + 1}`, folder: `스냅사진_${ts}`, timestamp: ts };
            addToHistory(res); setGeneratedImages(prev => { const u = [...prev]; u[startIndex + i] = res; return u; });
        }));
        await Promise.all(promises); setIsGenerating(false);
    }, [shootingMode, personalImage, coupleImage1, coupleImage2, getPromptVariations, addToHistory, generatedImages.length, generationCount, config]);

    const renderStep = (num: number, title: string, content: React.ReactNode) => (
        <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl shadow-xl border border-[var(--border-primary)]">
            <div className="flex items-center mb-5">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--bg-accent)] text-white font-black mr-3 text-xs">{num}</span>
                <h3 className="text-base font-black text-[var(--text-primary)]">{title}</h3>
            </div>
            {content}
        </div>
    );
    
    return (
        <div className="flex h-full gap-8">
            <aside className="w-[380px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-2">
                <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl shadow-xl border-b-4 border-[var(--bg-accent)]">
                    <h2 className="text-2xl font-black flex items-center gap-3">
                        <PhotoIcon className="w-7 h-7 text-[var(--bg-accent)]" />
                        스냅사진
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium">인물 사진을 바탕으로 영화 같은 일상 스냅을 자동 생성합니다.</p>
                </div>
                {renderStep(1, "촬영 모드", (
                    <div className="grid grid-cols-2 gap-2 bg-[var(--bg-primary)] p-1.5 rounded-2xl">
                       <button onClick={() => setShootingMode('personal')} className={`py-2 text-xs font-black rounded-xl transition-all ${shootingMode === 'personal' ? 'bg-[var(--bg-accent)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>개인 스냅</button>
                       <button onClick={() => setShootingMode('couple')} className={`py-2 text-xs font-black rounded-xl transition-all ${shootingMode === 'couple' ? 'bg-[var(--bg-accent)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>커플 스냅</button>
                    </div>
                ))}
                {renderStep(2, "모델 이미지", (
                    <div className="space-y-4">
                        {shootingMode === 'personal' ? (
                            <ImageUploader image={personalImage} onFileSelect={(f) => processFile(f, 'personal')} onClear={() => setPersonalImage(null)} isDraggingOver={dragTarget === 'personal'} onDragOver={(e) => { e.preventDefault(); setDragTarget('personal'); }} onDragLeave={() => setDragTarget(null)} onDrop={(e) => { e.preventDefault(); setDragTarget(null); processFile(e.dataTransfer.files[0], 'personal'); }} inputId="personal-upload" />
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <ImageUploader image={coupleImage1} onFileSelect={(f) => processFile(f, 'couple1')} onClear={() => setCoupleImage1(null)} isDraggingOver={dragTarget === 'couple1'} onDragOver={(e) => { e.preventDefault(); setDragTarget('couple1'); }} onDragLeave={() => setDragTarget(null)} onDrop={(e) => { e.preventDefault(); setDragTarget(null); processFile(e.dataTransfer.files[0], 'couple1'); }} inputId="couple1-upload" />
                                <ImageUploader image={coupleImage2} onFileSelect={(f) => processFile(f, 'couple2')} onClear={() => setCoupleImage2(null)} isDraggingOver={dragTarget === 'couple2'} onDragOver={(e) => { e.preventDefault(); setDragTarget('couple2'); }} onDragLeave={() => setDragTarget(null)} onDrop={(e) => { e.preventDefault(); setDragTarget(null); processFile(e.dataTransfer.files[0], 'couple2'); }} inputId="couple2-upload" />
                            </div>
                        )}
                        <p className="text-[10px] text-[var(--text-secondary)] text-center font-bold uppercase tracking-widest">Clear Face Photo Required</p>
                    </div>
                ))}
                {renderStep(3, "커스텀 옵션", (
                    <div className="space-y-5">
                        {shootingMode === 'personal' && (
                            <div>
                                <h4 className="text-[10px] font-black text-[var(--text-secondary)] mb-2 uppercase">GENDER</h4>
                                <div className="grid grid-cols-2 gap-2 bg-[var(--bg-primary)] p-1 rounded-xl">
                                    <button onClick={() => setGender('female')} className={`py-1.5 text-xs font-bold rounded-lg ${gender === 'female' ? 'bg-[var(--bg-accent)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>WOMAN</button>
                                    <button onClick={() => setGender('male')} className={`py-1.5 text-xs font-bold rounded-lg ${gender === 'male' ? 'bg-[var(--bg-accent)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>MAN</button>
                                </div>
                            </div>
                        )}
                        <div>
                            <h4 className="text-[10px] font-black text-[var(--text-secondary)] mb-2 uppercase">THEME CONCEPT</h4>
                            <div className="grid grid-cols-3 gap-1.5">
                                {THEMES.map(t => <button key={t.id} onClick={() => setStyleTheme(t.id)} className={`py-2 px-1 text-[10px] font-black rounded-lg transition-all ${styleTheme === t.id ? 'bg-[var(--bg-accent)] text-white shadow-md' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-primary)]'}`}>{t.name}</button>)}
                            </div>
                        </div>
                    </div>
                ))}
                <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl shadow-xl border border-[var(--border-primary)] mt-auto">
                    <GenerationConfigSelector config={config} setConfig={setConfig} />
                    <button onClick={() => handleGenerate(false)} disabled={isGenerating} className="w-full bg-[var(--bg-accent)] text-white font-black py-4 px-6 rounded-2xl hover:bg-[var(--bg-accent-hover)] transition-all shadow-lg disabled:opacity-30 flex items-center justify-center gap-3">
                        {isGenerating ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <SparklesIcon className="w-5 h-5" />}
                        {isGenerating ? '셔터 작동 중...' : '스냅 생성 시작'}
                    </button>
                    {error && <p className="text-red-500 font-bold text-center mt-3 text-xs">{error}</p>}
                </div>
            </aside>
            <main className="flex-1 bg-[var(--bg-primary)] p-8 rounded-3xl shadow-2xl border border-[var(--border-primary)] flex flex-col">
                 <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-[var(--text-primary)] border-l-4 border-[var(--bg-accent)] pl-4">스냅 갤러리</h2>
                    {generatedImages.length > 0 && !isGenerating && <button onClick={() => handleGenerate(true)} className="bg-[var(--bg-info)] text-white font-black py-2 px-6 rounded-full hover:bg-[var(--bg-info-hover)] transition-all flex items-center gap-2 text-xs shadow-md">+{generationCount}장 더 찍기</button>}
                 </div>
                 <div className="flex-grow overflow-y-auto pr-2">
                    {generatedImages.length > 0 || isGenerating ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {generatedImages.map((image, index) => (
                                <button key={index} onClick={() => image && onImageClick(image)} disabled={!image} className="relative aspect-[3/4] bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all border border-[var(--border-primary)]">
                                    {!image && isGenerating && <div className="absolute inset-0 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[var(--bg-accent)]"></div></div>}
                                    {image && <img src={image.src} alt={image.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-20 text-center"><PhotoIcon className="w-20 h-20 mb-4" /><p className="text-xl font-black uppercase">Your Snapshots will appear here</p></div>
                    )}
                 </div>
            </main>
        </div>
    );
};