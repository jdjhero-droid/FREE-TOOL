import React, { useState, useRef, useEffect } from 'react';
import type { GeneratedImage, ToolId } from '../types';
import { TOOLS } from '../constants';
import { DownloadIcon, SendIcon, CloseIcon, PencilIcon, ArrowLeftCircleIcon, ArrowRightCircleIcon } from './icons';

interface ImageModalProps {
    image: GeneratedImage | null;
    onClose: () => void;
    onSendToTool: (toolId: ToolId) => void;
    onDownload: () => void;
    onNextImage: () => void;
    onPrevImage: () => void;
    historyLength: number;
    onEdit: (originalImage: GeneratedImage, prompt: string) => Promise<void>;
}

export const ImageModal: React.FC<ImageModalProps> = ({ 
    image, 
    onClose, 
    onSendToTool, 
    onDownload,
    onNextImage,
    onPrevImage,
    historyLength,
    onEdit
}) => {
    const [showSendMenu, setShowSendMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editPrompt, setEditPrompt] = useState('');
    const [isProcessingEdit, setIsProcessingEdit] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setShowSendMenu(false);
            }
        };

        if (showSendMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSendMenu]);
    
    // This effect resets the editing state whenever the image prop changes (due to navigation or successful edit)
    useEffect(() => {
        if (image) {
            setShowSendMenu(false);
            setIsEditing(false);
            setEditPrompt('');
            setEditError(null);
        }
    }, [image]);

    if (!image) return null;

    const handleApplyEdit = async () => {
        if (!editPrompt.trim() || !image) return;
        setIsProcessingEdit(true);
        setEditError(null);
        try {
            await onEdit(image, editPrompt);
        } catch (error) {
            console.error("Edit failed in modal:", error);
            setEditError("이미지 편집에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsProcessingEdit(false);
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
            onClick={onClose}
        >
            {historyLength > 1 && (
                <>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onPrevImage(); }} 
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
                        aria-label="Previous image"
                    >
                        <ArrowLeftCircleIcon className="w-8 h-8"/>
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onNextImage(); }} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
                        aria-label="Next image"
                    >
                        <ArrowRightCircleIcon className="w-8 h-8"/>
                    </button>
                </>
            )}
            <div 
                className="bg-[var(--bg-secondary)] rounded-xl shadow-2xl max-w-4xl max-h-[90vh] w-full grid grid-rows-[auto_1fr_auto] relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-[var(--border-primary)] flex justify-between items-center">
                    <h3 className="font-bold text-lg truncate text-[var(--text-primary)]" title={image.name}>{image.name}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors">
                        <CloseIcon className="w-6 h-6 text-[var(--text-secondary)]" />
                    </button>
                </div>

                <div className="p-4 flex items-center justify-center overflow-hidden min-h-0">
                    <img src={image.src} alt={image.name} className="max-w-full max-h-full object-contain" />
                </div>
                
                <div className="p-4 border-t border-[var(--border-primary)]">
                    {isEditing ? (
                        <div className="flex flex-col gap-2 items-center">
                            <div className="w-full flex gap-2">
                                <input 
                                    type="text"
                                    value={editPrompt}
                                    onChange={(e) => setEditPrompt(e.target.value)}
                                    placeholder="이미지 편집 프롬프트를 입력하세요..."
                                    className="flex-grow bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg p-2 text-sm focus:ring-[var(--ring-accent)] focus:border-[var(--border-accent)]"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyEdit()}
                                />
                                <button
                                    onClick={handleApplyEdit}
                                    disabled={isProcessingEdit || !editPrompt.trim()}
                                    className="bg-[var(--bg-positive)] text-[var(--text-on-accent)] font-bold py-2 px-4 rounded-lg hover:bg-[var(--bg-positive-hover)] transition-colors disabled:bg-[var(--bg-disabled)] flex items-center"
                                >
                                    {isProcessingEdit && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>}
                                    적용
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-[var(--bg-interactive)] text-[var(--text-primary)] font-bold py-2 px-4 rounded-lg hover:bg-[var(--bg-tertiary)]"
                                >
                                    취소
                                </button>
                            </div>
                            {editError && <p className="text-sm text-center text-[var(--bg-negative)]">{editError}</p>}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center space-x-4">
                            <button 
                                onClick={onDownload}
                                className="bg-[var(--bg-accent)] text-[var(--text-on-accent)] font-bold py-2 px-5 rounded-lg hover:bg-[var(--bg-accent-hover)] transition-colors flex items-center gap-2"
                            >
                                <DownloadIcon className="w-5 h-5"/>
                                <span>다운로드</span>
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-purple-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                            >
                                <PencilIcon className="w-5 h-5"/>
                                <span>나노바나나 편집</span>
                            </button>
                            <div className="relative">
                                <button 
                                    ref={buttonRef}
                                    onClick={() => setShowSendMenu(prev => !prev)}
                                    className="bg-[var(--bg-info)] text-[var(--text-on-accent)] font-bold py-2 px-5 rounded-lg hover:bg-[var(--bg-info-hover)] transition-colors flex items-center gap-2"
                                >
                                    <SendIcon className="w-5 h-5"/>
                                    <span>메인으로 보내기</span>
                                </button>
                                {showSendMenu && (
                                    <div ref={menuRef} className="absolute bottom-full mb-2 w-56 bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg shadow-lg animate-fade-in-fast">
                                        <ul className="py-1">
                                            {TOOLS.map(tool => (
                                                <li key={tool.id}>
                                                    <button
                                                        onClick={() => onSendToTool(tool.id)}
                                                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-interactive)]"
                                                    >
                                                        <tool.icon className="w-5 h-5" />
                                                        <span>{tool.name}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Add animations for the modal */}
            <style>{`
                @keyframes fade-in-fast {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in-fast {
                    animation: fade-in-fast 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};