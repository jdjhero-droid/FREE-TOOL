import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { GeneratedImage } from '../types';
import { editImageWithNanoBanana } from '../services/geminiService';
import { ViewGridIcon } from './icons';

interface InstagramGridPosterToolProps {
  addToHistory: (image: GeneratedImage) => void;
}

const GRID_SIZES = [
    { cols: 3, rows: 1 }, { cols: 3, rows: 2 }, { cols: 3, rows: 3 },
    { cols: 3, rows: 4 }, { cols: 3, rows: 5 }, { cols: 3, rows: 6 }
];

const GridDisplayIcon: React.FC<{ cols: number; rows: number }> = ({ cols, rows }) => (
    <div className="flex flex-col items-center justify-center">
        <div className={`grid gap-0.5 w-6 h-6`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {[...Array(cols * rows)].map((_, i) => (
                <div key={i} className="bg-white/80 rounded-sm" />
            ))}
        </div>
        <span className="text-[10px] font-black mt-1 uppercase opacity-60">{cols}x{rows}</span>
    </div>
);

export const InstagramGridPosterTool: React.FC<InstagramGridPosterToolProps> = ({ addToHistory }) => {
    const [sourceImage, setSourceImage] = useState<{ url: string; element: HTMLImageElement } | null>(null);
    const [prompt, setPrompt] = useState('이 이미지의 디테일을 향상시키고 더욱 선명하게 만들어주세요.');
    const [gridSize, setGridSize] = useState(GRID_SIZES[1]);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [fillEmpty, setFillEmpty] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const panState = useRef({ isPanning: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0 });

    const processFile = (file: File) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target?.result as string;
            const img = new Image();
            img.onload = () => { setSourceImage({ url, element: img }); setScale(1); setPosition({ x: 0, y: 0 }); };
            img.src = url;
        };
        reader.readAsDataURL(file);
    };
    
    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const file = event.clipboardData?.items?.[0]?.getAsFile();
            if (file) processFile(file);
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    const handleGenerate = async () => {
        if (!sourceImage || !imageContainerRef.current) return;
        setIsGenerating(true);
        const container = imageContainerRef.current;
        const { width: cw, height: ch } = container.getBoundingClientRect();
        const targetRes = 720 * Math.max(gridSize.cols, gridSize.rows);
        const resScale = targetRes / cw;
        const mainCanvas = document.createElement('canvas');
        mainCanvas.width = targetRes; mainCanvas.height = targetRes;
        const ctx = mainCanvas.getContext('2d');
        if (!ctx) { setIsGenerating(false); return; }
        ctx.fillStyle = '#000'; ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
        if (fillEmpty) {
            ctx.filter = 'blur(20px) brightness(0.6)';
            const ia = sourceImage.element.width / sourceImage.element.height;
            const ca = cw / ch;
            let bw, bh, bx, by;
            if (ia > ca) { bh = ch; bw = bh * ia; bx = (cw - bw) / 2; by = 0; } else { bw = cw; bh = bw / ia; by = (ch - bh) / 2; bx = 0; }
            ctx.drawImage(sourceImage.element, bx * resScale, by * resScale, bw * resScale, bh * resScale);
            ctx.filter = 'none';
        }
        const dw = sourceImage.element.width * scale * resScale;
        const dh = sourceImage.element.height * scale * resScale;
        const dx = (cw / 2 + position.x) * resScale - dw / 2;
        const dy = (ch / 2 + position.y) * resScale - dh / 2;
        ctx.drawImage(sourceImage.element, dx, dy, dw, dh);
        try {
            const regeneratedURL = await editImageWithNanoBanana(mainCanvas.toDataURL('image/jpeg', 0.95).split(',')[1], 'image/jpeg', prompt);
            const rImg = new Image();
            rImg.onload = () => {
                const fCanvas = document.createElement('canvas'); fCanvas.width = rImg.width; fCanvas.height = rImg.height;
                const fCtx = fCanvas.getContext('2d'); if (!fCtx) return; fCtx.drawImage(rImg, 0, 0);
                const sw = fCanvas.width / gridSize.cols; const sh = fCanvas.height / gridSize.rows;
                const ts = Date.now(); const folder = `인스타그리드_${ts}`;
                for (let r = 0; r < gridSize.rows; r++) {
                    for (let c = 0; c < gridSize.cols; c++) {
                        const sCanvas = document.createElement('canvas'); sCanvas.width = sw; sCanvas.height = sh;
                        const sCtx = sCanvas.getContext('2d'); if (!sCtx) continue;
                        sCtx.drawImage(fCanvas, c * sw, r * sh, sw, sh, 0, 0, sw, sh);
                        addToHistory({ id: `${ts}-${r}-${c}`, src: sCanvas.toDataURL('image/jpeg', 0.95), name: `Grid_${gridSize.rows-r}_${c+1}`, folder, timestamp: ts });
                    }
                }
                alert("그리드 분할 완료! 다운로드 패널에서 확인하세요.");
            };
            rImg.src = regeneratedURL;
        } catch (e) { alert("오류 발생"); } finally { setIsGenerating(false); }
    };

    return (
        <div className="flex h-full gap-8">
            <aside className="w-[400px] flex-shrink-0 flex flex-col gap-6">
                <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl border-b-4 border-[var(--bg-accent)]">
                    <h2 className="text-2xl font-black flex items-center gap-3">
                        <ViewGridIcon className="w-8 h-8 text-[var(--bg-accent)]" />
                        인스타 그리드 생성기
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium">하나의 이미지를 여러 조각으로 나누어 매력적인 인스타그램 피드를 만듭니다.</p>
                </div>

                <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-xl border border-[var(--border-primary)] space-y-6">
                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest px-1">1. 이미지 및 프롬프트</h3>
                    {sourceImage ? (
                        <button onClick={() => setSourceImage(null)} className="w-full bg-red-500 text-white font-black py-2 rounded-xl text-xs shadow-md">초기화</button>
                    ) : (
                        <label className="w-full block text-center cursor-pointer bg-[var(--bg-accent)] text-white font-black py-3 rounded-2xl hover:bg-[var(--bg-accent-hover)] transition-all shadow-lg text-sm">이미지 선택<input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && processFile(e.target.files[0])} /></label>
                    )}
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-2xl p-4 text-xs focus:ring-2 focus:ring-[var(--ring-accent)] outline-none resize-none" placeholder="품질 향상 가이드를 입력하세요." />
                </div>

                <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-xl border border-[var(--border-primary)]">
                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest px-1 mb-4">2. 그리드 옵션</h3>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {GRID_SIZES.map(size => (
                            <button key={`${size.cols}x${size.rows}`} onClick={() => setGridSize(size)} className={`p-3 rounded-xl border-2 transition-all ${gridSize.cols === size.cols && gridSize.rows === size.rows ? 'bg-[var(--bg-accent)]/10 border-[var(--bg-accent)] scale-105 shadow-md' : 'bg-[var(--bg-tertiary)] border-transparent hover:border-[var(--border-primary)]'}`}><GridDisplayIcon cols={size.cols} rows={size.rows} /></button>
                        ))}
                    </div>
                    <label className="flex items-center justify-between cursor-pointer px-1">
                        <span className="text-xs font-black text-[var(--text-secondary)] uppercase">FILL EMPTY SPACE</span>
                        <input type="checkbox" className="sr-only" checked={fillEmpty} onChange={() => setFillEmpty(p => !p)} />
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${fillEmpty ? 'bg-[var(--bg-accent)]' : 'bg-[var(--bg-tertiary)]'}`}><div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${fillEmpty ? 'translate-x-5' : ''}`}></div></div>
                    </label>
                </div>

                <button onClick={handleGenerate} disabled={!sourceImage || isGenerating} className="w-full bg-[var(--bg-positive)] text-white font-black py-5 px-4 rounded-2xl hover:bg-[var(--bg-positive-hover)] transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-3 text-lg mt-auto">
                    {isGenerating ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <ViewGridIcon className="w-6 h-6" />}
                    {isGenerating ? '그리드 분할 중...' : '그리드 생성하기'}
                </button>
            </aside>

            <main className="flex-1 bg-[var(--bg-primary)] p-10 rounded-3xl shadow-2xl border border-[var(--border-primary)] flex flex-col items-center justify-center">
                <div
                    ref={imageContainerRef}
                    className="w-full aspect-square max-w-[600px] bg-[var(--bg-secondary)] rounded-3xl overflow-hidden relative shadow-2xl border border-[var(--border-primary)]"
                    onMouseDown={(e) => { if (!sourceImage) return; panState.current = { isPanning: true, startX: e.clientX, startY: e.clientY, startPosX: position.x, startPosY: position.y }; }}
                    onMouseMove={(e) => { if (!panState.current.isPanning || !sourceImage) return; setPosition({ x: panState.current.startPosX + (e.clientX - panState.current.startX), y: panState.current.startPosY + (e.clientY - panState.current.startY) }); }}
                    onMouseUp={() => panState.current.isPanning = false}
                    onMouseLeave={() => panState.current.isPanning = false}
                    onWheel={(e) => { if (!sourceImage) return; setScale(prev => Math.max(0.1, prev + (-e.deltaY * 0.001))); }}
                    style={{ cursor: panState.current.isPanning ? 'grabbing' : (sourceImage ? 'grab' : 'default') }}
                >
                    {!sourceImage ? (
                        <div className="flex flex-col items-center justify-center h-full opacity-20"><ViewGridIcon className="w-20 h-20 mb-4" /><p className="font-black uppercase">PREVIEW WORKSPACE</p></div>
                    ) : (
                        <>
                            {fillEmpty && <img src={sourceImage.url} className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110" alt="bg" />}
                            <img src={sourceImage.url} alt="src" className="absolute top-1/2 left-1/2" style={{ transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`, willChange: 'transform', maxWidth: 'none' }} />
                            <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`, gridTemplateRows: `repeat(${gridSize.rows}, 1fr)` }}>
                                {[...Array(gridSize.cols * gridSize.rows)].map((_, i) => <div key={i} className="border border-white/40 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]" />)}
                            </div>
                        </>
                    )}
                </div>
                {sourceImage && <p className="text-[10px] font-black text-[var(--text-secondary)] mt-6 bg-[var(--bg-tertiary)] px-4 py-1.5 rounded-full shadow-inner uppercase tracking-widest">Scroll to Zoom • Drag to Move</p>}
            </main>
        </div>
    );
};