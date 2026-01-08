import React from 'react';
import type { GenerationConfig, GenerationModelType, AspectRatio, ImageSize } from '../types';
import { ChevronDownIcon } from './icons';

interface GenerationConfigSelectorProps {
  config: GenerationConfig;
  setConfig: (config: GenerationConfig) => void;
  hideAspectRatio?: boolean;
}

export const GenerationConfigSelector: React.FC<GenerationConfigSelectorProps> = ({ config, setConfig, hideAspectRatio = false }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleModelChange = (model: GenerationModelType) => {
    setConfig({ ...config, model });
  };

  const handleRatioChange = (aspectRatio: AspectRatio) => {
    setConfig({ ...config, aspectRatio });
  };

  const handleSizeChange = (imageSize: ImageSize) => {
    setConfig({ ...config, imageSize });
  };

  return (
    <div className="bg-[var(--bg-tertiary)]/50 rounded-lg p-3 border border-[var(--border-primary)] mb-4">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--text-primary)]">모델 설정:</span>
            <span className="text-sm text-[var(--text-accent)] font-bold">
                {config.model === 'nano-banana' ? '일반 Nano Banana' : 'Nano Banana Pro'}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
                {!hideAspectRatio && `(${config.aspectRatio})`}
                {config.model === 'nano-banana-pro' && `, ${config.imageSize}`}
            </span>
        </div>
        <ChevronDownIcon className={`w-4 h-4 transition-transform text-[var(--text-secondary)] ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="mt-3 space-y-3 pt-3 border-t border-[var(--border-primary)]">
          {/* Model Selection */}
          <div className="grid grid-cols-2 gap-2 bg-[var(--bg-primary)] p-1 rounded-lg">
            <button
              onClick={() => handleModelChange('nano-banana')}
              className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                config.model === 'nano-banana'
                  ? 'bg-[var(--bg-accent)] text-[var(--text-on-accent)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              일반 (빠름)
            </button>
            <button
              onClick={() => handleModelChange('nano-banana-pro')}
              className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                config.model === 'nano-banana-pro'
                  ? 'bg-[var(--bg-accent)] text-[var(--text-on-accent)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              Pro (고화질)
            </button>
          </div>

          <div className="space-y-3 animate-fade-in-fast">
              {/* Aspect Ratio - Available for both models */}
              {!hideAspectRatio && (
                  <div>
                    <span className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">비율 (Aspect Ratio)</span>
                    <div className="grid grid-cols-5 gap-1">
                      {(['1:1', '3:4', '4:3', '9:16', '16:9'] as AspectRatio[]).map((ratio) => (
                        <button
                          key={ratio}
                          onClick={() => handleRatioChange(ratio)}
                          className={`py-1 text-[10px] font-bold rounded border ${
                            config.aspectRatio === ratio
                              ? 'bg-[var(--bg-interactive)] border-[var(--border-accent)] text-[var(--text-primary)]'
                              : 'bg-[var(--bg-secondary)] border-transparent text-[var(--text-secondary)] hover:border-[var(--border-secondary)]'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>
              )}

              {/* Resolution - Pro Only */}
              {config.model === 'nano-banana-pro' && (
                  <div>
                    <span className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">해상도 (Resolution)</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeChange(size)}
                          className={`py-1 text-xs font-bold rounded border ${
                            config.imageSize === size
                              ? 'bg-[var(--bg-interactive)] border-[var(--border-accent)] text-[var(--text-primary)]'
                              : 'bg-[var(--bg-secondary)] border-transparent text-[var(--text-secondary)] hover:border-[var(--border-secondary)]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
              )}
            </div>
        </div>
      )}
    </div>
  );
};