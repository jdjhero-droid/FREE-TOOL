import React, { useEffect } from 'react';
import { CloseIcon } from './icons';
import type { PromptTemplate } from '../types';

interface PromptTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
  templates: PromptTemplate[];
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
  templateType: 'image' | 'video' | null;
}

export const PromptTemplateModal: React.FC<PromptTemplateModalProps> = ({
  isOpen,
  onClose,
  modelName,
  templates,
  selectedTemplateId,
  onSelect,
  templateType,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="templateModalTitle"
    >
      <div
        className="bg-[var(--bg-secondary)] rounded-xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon className="w-6 h-6 text-[var(--text-secondary)]" />
        </button>

        <h2 id="templateModalTitle" className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          <span className="text-[var(--text-accent)]">{modelName}</span> {templateType === 'image' ? '이미지' : '영상'} 프롬프트 템플릿 선택
        </h2>
        
        <div className="flex-grow overflow-y-auto pr-2 space-y-3">
            {templates.map(template => (
                <button 
                    key={template.id}
                    onClick={() => {
                        onSelect(template.id);
                        onClose();
                    }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedTemplateId === template.id ? 'border-[var(--border-accent)] bg-[var(--bg-accent)]/10' : 'border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50 hover:border-[var(--border-accent)]/50'}`}
                >
                    <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-1">{template.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap font-mono">{template.content}</p>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};