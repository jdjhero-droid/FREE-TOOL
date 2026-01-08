import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { GeneratedImage, FinalSheetItem, SheetFormat } from '../types';
import { DownloadIcon, TrashIcon, CloseIcon, RectangleGroupIcon, CopyIcon, CheckIcon, ViewGridIcon } from './icons';
import { fileToBase64 } from '../utils/fileUtils';

declare const saveAs: any;

interface FinalSheetToolProps {
    items: FinalSheetItem[];
    onRemove: (id: string) => void;
    onClear: () => void;
    onAdd: (images: GeneratedImage[]) => void;
    onUpdateItem: (id: string, updates: Partial<FinalSheetItem>) => void;
    onBringToFront: (id: string) => void;
    sheetFormat: SheetFormat;
    onSheetFormatChange: (format: SheetFormat) => void;
    customFormat: { width: number; height: number };
    onCustomFormatChange: (updates: { width: number; height: number }) => void;
    bgColor: string;
    onBgColorChange: (color: string) => void;
    onAutoArrange: () => void;
}

const DraggableResizableImage: React.FC<{
    item: FinalSheetItem;
    containerRef: React.RefObject<HTMLDivElement>;
    containerAspectRatio: number;
    onUpdate: (updates: Partial<FinalSheetItem>) => void;
    onBringToFront: () => void;
    onRemove: () => void;
}> = ({ item, containerRef, containerAspectRatio, onUpdate, onBringToFront, onRemove }) => {
    
    const itemRef = useRef<HTMLDivElement>(null);
    
    // Calculate height percentage to maintain aspect ratio
    const heightPercentage = (item.width * containerAspectRatio) / item.aspectRatio;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, action: 'drag' | 'resize') => {
        e.preventDefault();
        e.stopPropagation();
        onBringToFront();

        const container = containerRef.current;
        if (!container) return;

        const startX = e.clientX;
        const startY = e.clientY;
        const startRect = itemRef.current!.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            if (action === 'drag') {
                const newX = startRect.left + dx - containerRect.left;
                const newY = startRect.top + dy - containerRect.top;
                
                onUpdate({
                    x: (newX / containerRect.width) * 100,
                    y: (newY / containerRect.height) * 100,
                });

            } else if (action === 'resize') {
                const newWidthPx = startRect.width + dx;
                onUpdate({
                    width: (newWidthPx / containerRect.width) * 100,
                });
            }
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            ref={itemRef}
            className="absolute bg-[var(--bg-tertiary)] rounded-md shadow-lg group cursor-move select-none"
            style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: `${item.width}%`,
                height: `${heightPercentage}%`,
                zIndex: item.zIndex,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'drag')}
        >
            <img src={item.src} alt={item.name} className="w-full h-full object-cover rounded-md pointer-events-none" />
            <button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="absolute -top-2 -right-2 bg-[var(--bg-negative)] text-[var(--text-on-accent)] rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Remove image"
            >
                <CloseIcon className="w-4 h-4" />
            </button>
            <div
                className="absolute -bottom-2 -right-2 w-5 h-5 bg-[var(--bg-accent)] rounded-full border-2 border-white cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => handleMouseDown(e, 'resize')}
            />
        </div>
    );
};


export const FinalSheetTool: React.FC<FinalSheetToolProps> = ({ 
    items, onRemove, onClear, onAdd, onUpdateItem, onBringToFront,
    sheetFormat, onSheetFormatChange, customFormat, onCustomFormatChange, bgColor, onBgColorChange, onAutoArrange
}) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied'>('idle');
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    const processFiles = useCallback(async (files: FileList | DataTransferItemList) => {
        const imageFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
            const item = files[i];
            if (item instanceof File && item.type.startsWith('image/')) {
                imageFiles.push(item);
            } else if ('kind' in item && item.kind === 'file' && item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) imageFiles.push(file);
            }
        }
    
        if (imageFiles.length === 0) return;
    
        const imagesToAdd: GeneratedImage[] = await Promise.all(
            imageFiles.map(async (file) => {
                const { base64, mimeType } = await fileToBase64(file);
                return {
                    id: `pasted-${Date.now()}-${Math.random()}`,
                    src: `data:${mimeType};base64,${base64}`,
                    name: file.name,
                    folder: 'Final Sheet',
                    timestamp: Date.now(),
                };
            })
        );
        onAdd(imagesToAdd);
    }, [onAdd]);
    
    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            if (event.clipboardData?.items) {
                processFiles(event.clipboardData.items);
            }
        };
        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, [processFiles]);

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

        const historyData = e.dataTransfer.getData('application/x-ai-toolset-history-item');
        if (historyData) {
            try {
                const image = JSON.parse(historyData);
                const imageToAdd: GeneratedImage = {
                    ...image,
                    id: `dropped-${Date.now()}`,
                    folder: 'Final Sheet',
                    timestamp: Date.now()
                };
                onAdd([imageToAdd]);
            } catch (err) {
                console.error("Failed to parse dropped history item", err);
            }
            return;
        }
        
        if (e.dataTransfer.files) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleCustomDimChange = (dim: 'width' | 'height', value: string) => {
        const numValue = Math.min(3840, Math.max(1, parseInt(value, 10) || 1));
        onCustomFormatChange({ ...customFormat, [dim]: numValue });
    };
    
    const formatRatios: Record<Exclude<SheetFormat, 'custom'>, number> = {
        landscape: 16 / 9,
        portrait: 9 / 16,
        square: 1 / 1,
    };

    const getAspectRatio = () => {
        if (sheetFormat === 'custom') {
            return customFormat.width / customFormat.height;
        }
        return formatRatios[sheetFormat];
    };

    const generateSheetAsBlob = useCallback(async (): Promise<Blob | null> => {
        if (items.length === 0) return null;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            alert('시트를 생성하기 위한 캔버스를 만들 수 없습니다.');
            return null;
        }
        
        let finalWidth, finalHeight;
        if (sheetFormat === 'custom') {
            finalWidth = customFormat.width;
            finalHeight = customFormat.height;
        } else {
            const DOWNLOAD_WIDTH_BASE = 3840;
            const ratio = formatRatios[sheetFormat];
            if (ratio >= 1) { // landscape or square
                finalWidth = DOWNLOAD_WIDTH_BASE;
                finalHeight = DOWNLOAD_WIDTH_BASE / ratio;
            } else { // portrait
                finalHeight = DOWNLOAD_WIDTH_BASE;
                finalWidth = DOWNLOAD_WIDTH_BASE * ratio;
            }
        }
        
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const sortedItems = [...items].sort((a, b) => a.zIndex - b.zIndex);

        const drawPromises = sortedItems.map((itemData) => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    const x = (itemData.x / 100) * canvas.width;
                    const y = (itemData.y / 100) * canvas.height;
                    const width = (itemData.width / 100) * canvas.width;
                    const height = width / itemData.aspectRatio;
                    
                    ctx.drawImage(img, x, y, width, height);
                    resolve();
                };
                img.onerror = () => {
                    console.error(`Failed to load image: ${itemData.name}`);
                    resolve();
                };
                img.src = itemData.src;
            });
        });

        await Promise.all(drawPromises);

        return new Promise(resolve => {
            canvas.toBlob(blob => {
                resolve(blob);
            }, 'image/png');
        });
    }, [items, sheetFormat, customFormat, bgColor]);


    const handleDownloadSheet = async () => {
        setIsDownloading(true);
        try {
            const blob = await generateSheetAsBlob();
            if (blob) {
                saveAs(blob, `final_sheet_${Date.now()}.png`);
            }
        } catch (error) {
            console.error("Failed to download sheet:", error);
            alert('시트 다운로드에 실패했습니다.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleCopySheet = async () => {
        if (!navigator.clipboard || !window.ClipboardItem) {
            alert('클립보드 복사 기능이 이 브라우저에서는 지원되지 않습니다.');
            return;
        }
        
        setCopyStatus('copying');
        
        try {
            const blob = await generateSheetAsBlob();
            if (!blob) throw new Error("Blob generation failed");
            
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);

            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);

        } catch (error) {
            console.error("Failed to copy sheet:", error);
            alert('시트 복사에 실패했습니다.');
            setCopyStatus('idle');
        }
    };
    
    const containerAspectRatio = getAspectRatio();

    return (
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-xl h-full flex flex-col">
            <div className="flex-shrink-0 flex justify-between items-center mb-4 flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--text-primary)]">완성된 시트</h2>
                    <p className="text-[var(--text-secondary)]">이미지를 자유롭게 배치하고 크기를 조절하세요. (최대 10개)</p>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">배경색:</span>
                        <input type="color" value={bgColor} onChange={e => onBgColorChange(e.target.value)} className="w-8 h-8 bg-transparent border-none cursor-pointer" />
                    </div>
                     <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] p-1 rounded-lg">
                        {(['landscape', 'portrait', 'square', 'custom'] as SheetFormat[]).map(f => (
                            <button key={f} onClick={() => onSheetFormatChange(f)} className={`px-3 py-1 text-sm rounded-md capitalize ${sheetFormat === f ? 'bg-[var(--bg-accent)] text-[var(--text-on-accent)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-interactive)]'}`}>{f === 'landscape' ? '가로' : f === 'portrait' ? '세로' : f === 'square' ? '1:1' : '커스텀'}</button>
                        ))}
                    </div>
                    {sheetFormat === 'custom' && (
                        <div className="flex items-center gap-2 bg-[var(--bg-primary)] p-1 rounded-lg">
                            <input type="number" value={customFormat.width} onChange={(e) => handleCustomDimChange('width', e.target.value)} max="3840" min="1" className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] w-20 text-center rounded p-1" aria-label="Custom width"/>
                            <span className="text-[var(--text-secondary)]">x</span>
                            <input type="number" value={customFormat.height} onChange={(e) => handleCustomDimChange('height', e.target.value)} max="3840" min="1" className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] w-20 text-center rounded p-1" aria-label="Custom height"/>
                        </div>
                    )}
                    <button
                        onClick={onAutoArrange}
                        disabled={items.length === 0}
                        className="bg-[var(--bg-interactive)] text-[var(--text-primary)] font-bold py-2 px-4 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors disabled:bg-[var(--bg-disabled)] disabled:text-[var(--text-secondary)] disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <ViewGridIcon className="w-5 h-5" />
                        <span>자동 정렬</span>
                    </button>
                    <div className="h-6 w-px bg-[var(--border-secondary)]"></div>

                    <button
                        onClick={handleDownloadSheet}
                        disabled={items.length === 0 || isDownloading || copyStatus !== 'idle'}
                        className="bg-[var(--bg-accent)] text-[var(--text-on-accent)] font-bold py-2 px-4 rounded-lg hover:bg-[var(--bg-accent-hover)] transition-colors disabled:bg-[var(--bg-disabled)] flex items-center gap-2"
                    >
                        {isDownloading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <DownloadIcon className="w-5 h-5" />}
                        {isDownloading ? '생성 중...' : '시트 다운로드'}
                    </button>
                    <button
                        onClick={handleCopySheet}
                        disabled={items.length === 0 || isDownloading || copyStatus !== 'idle'}
                        className="bg-[var(--bg-info)] text-[var(--text-on-accent)] font-bold py-2 px-4 rounded-lg hover:bg-[var(--bg-info-hover)] transition-colors disabled:bg-[var(--bg-disabled)] flex items-center gap-2 min-w-[120px] justify-center"
                    >
                        {copyStatus === 'copying' ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : copyStatus === 'copied' ? (
                            <CheckIcon className="w-5 h-5" />
                        ) : (
                            <CopyIcon className="w-5 h-5" />
                        )}
                        <span>
                            {copyStatus === 'copying' ? '생성 중...' : copyStatus === 'copied' ? '복사됨!' : '시트 복사'}
                        </span>
                    </button>
                    <button
                        onClick={onClear}
                        disabled={items.length === 0}
                        className="bg-[var(--bg-negative)] text-[var(--text-on-accent)] font-bold py-2 px-4 rounded-lg hover:bg-[var(--bg-negative-hover)] transition-colors disabled:bg-[var(--bg-disabled)] flex items-center gap-2"
                    >
                        <TrashIcon className="w-5 h-5" />
                        <span>전체 비우기</span>
                    </button>
                </div>
            </div>

            <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex-grow bg-[var(--bg-primary)]/50 rounded-lg p-4 overflow-hidden flex items-center justify-center transition-colors ${isDraggingOver ? 'ring-2 ring-[var(--ring-accent)] ring-inset' : ''}`}
            >
                 <div
                    ref={canvasContainerRef}
                    className="relative w-full h-full"
                    style={{
                        backgroundColor: bgColor,
                        aspectRatio: containerAspectRatio,
                        maxWidth: `calc(100vh * ${containerAspectRatio})`,
                        maxHeight: `calc(100vw / ${containerAspectRatio})`,
                    }}
                 >
                     {items.map(item => (
                        <DraggableResizableImage
                            key={item.id}
                            item={item}
                            containerRef={canvasContainerRef}
                            containerAspectRatio={containerAspectRatio}
                            onUpdate={(updates) => onUpdateItem(item.id, updates)}
                            onBringToFront={() => onBringToFront(item.id)}
                            onRemove={() => onRemove(item.id)}
                        />
                     ))}

                    {items.length === 0 && !isDraggingOver &&(
                        <div className="flex flex-col items-center justify-center h-full text-center pointer-events-none">
                            <RectangleGroupIcon className="w-24 h-24 text-[var(--text-secondary)] mb-4"/>
                            <h3 className="text-xl font-bold text-[var(--text-secondary)]">시트가 비어 있습니다.</h3>
                            <p className="text-[var(--text-secondary)] mt-2 max-w-md">다른 도구에서 이미지를 보내거나, 이곳에 파일을 드래그 앤 드롭 또는 붙여넣기 하세요.</p>
                        </div>
                    )}
                     {isDraggingOver && (
                        <div className="flex flex-col items-center justify-center h-full text-center pointer-events-none">
                            <h3 className="text-xl font-bold text-[var(--border-accent)]">이미지를 놓아서 추가하세요.</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};