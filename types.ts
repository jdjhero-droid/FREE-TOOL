// Fix: Import ComponentType from react to resolve namespace error.
import type { ComponentType } from 'react';

export type ToolId = 'nano-banana-gen' | 'character-sheet' | 'lighting-color' | 'angle-change' | 'unified-history' | 'prompt-generator' | 'expression-pose' | 'final-sheet' | 'cosplay' | 'background-prop' | 'prompt-library' | 'story-creator' | 'profile-photo' | 'instagram-grid-poster' | 'snapshot-generator' | 'start-end-frame';

export interface Tool {
  id: ToolId;
  name: string;
  // Fix: Use ComponentType directly instead of React.ComponentType
  icon: ComponentType<{ className?: string }>;
}

export interface GeneratedImage {
  id:string;
  src: string; // base64 data URL
  name: string;
  folder: string;
  timestamp: number;
}

export interface FinalSheetItem {
  id: string;
  src: string;
  name: string;
  x: number; // position as a percentage of the container width
  y: number; // position as a percentage of the container height
  width: number; // size as a percentage of the container width
  zIndex: number;
  aspectRatio: number; // original width / height of the image
}

export interface CosplayMainImage {
  data: string;
  mime: string;
  url: string;
  aspectRatio: number;
}

export interface CosplayRefImage {
  data: string;
  mime: string;
  url: string;
}

export interface BgPropImage {
  data: string;
  mime: string;
  url: string;
}

export type SheetFormat = 'landscape' | 'portrait' | 'square' | 'custom';

export type AiModel = 'sdxl' | 'gemini' | 'midjourney' | 'nanoBanana' | 'flux' | 'seedream' | 'qwen' | 'wan2_2';

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
}

export interface ModelTemplates {
  image: PromptTemplate[];
  video?: PromptTemplate[];
}

export interface Case {
  id: string;
  name: string;
  description: string;
  prompt: string;
  imageUploads: number;
  suggestionHint: string;
  author: string;
  href: string;
}

export interface Category {
  name: string;
  cases: Case[];
}

export interface VideoPrompts {
    wan2_5: string;
    kling2_5: string;
    midjourney: string;
    veo3_0: string;
}

export type StudioPromptCategory = 'professional' | 'casual' | 'high-fashion';
export type StudioPromptGender = 'female' | 'male' | 'unisex';

export interface StudioPrompt {
  category: StudioPromptCategory;
  gender: StudioPromptGender;
  text: string;
}

export type GenerationModelType = 'nano-banana' | 'nano-banana-pro';
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ImageSize = '1K' | '2K' | '4K';

export interface GenerationConfig {
  model: GenerationModelType;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
}