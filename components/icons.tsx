import React from 'react';

// 3D 느낌을 위한 풍부한 그라데이션 정의
const IconDefs = () => (
  <svg width="0" height="0" className="absolute">
    <defs>
      <linearGradient id="grad-blue-3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="50%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#3730a3" />
      </linearGradient>
      <linearGradient id="grad-purple-3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="50%" stopColor="#9333ea" />
        <stop offset="100%" stopColor="#7e22ce" />
      </linearGradient>
      <linearGradient id="grad-emerald-3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="grad-amber-3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="grad-rose-3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="50%" stopColor="#e11d48" />
        <stop offset="100%" stopColor="#be123c" />
      </linearGradient>
      <linearGradient id="grad-cyan-3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#0891b2" />
        <stop offset="100%" stopColor="#0e7490" />
      </linearGradient>
      <filter id="inner-shadow">
        <feOffset dx="0" dy="1" />
        <feGaussianBlur stdDeviation="0.5" result="offset-blur" />
        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
        <feFlood floodColor="black" floodOpacity="0.2" result="color" />
        <feComposite operator="in" in="color" in2="inverse" result="shadow" />
        <feComposite operator="over" in="shadow" in2="SourceGraphic" />
      </filter>
    </defs>
  </svg>
);

// 이미지 생성 (Sparkles)
export const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" filter="url(#inner-shadow)">
    <IconDefs />
    <path d="M12 3L14.5 9L21 12L14.5 15L12 21L9.5 15L3 12L9.5 9L12 3Z" fill="url(#grad-cyan-3d)" />
    <circle cx="19" cy="5" r="3" fill="url(#grad-blue-3d)" />
    <path d="M5 18L7 19L5 20L4 22L3 20L1 19L3 18L4 16L5 18Z" fill="url(#grad-purple-3d)" />
  </svg>
);

// 스타트/앤드 생성 (Film Frame/Clapper)
export const StoryboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" filter="url(#inner-shadow)">
    <rect x="2" y="6" width="20" height="12" rx="2" fill="url(#grad-blue-3d)" />
    <path d="M2 10H22M7 6V18M17 6V18" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" />
    <path d="M2 6L22 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
    <circle cx="12" cy="13" r="2" fill="white" fillOpacity="0.8" />
  </svg>
);

// 스토리 생성기 (Book/Script)
export const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" filter="url(#inner-shadow)">
    <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20V4H6.5C5.11929 4 4 5.11929 4 6.5V19.5Z" fill="url(#grad-amber-3d)" />
    <path d="M6.5 17C5.11929 17 4 18.1193 4 19.5C4 20.8807 5.11929 22 6.5 22H20V17H6.5Z" fill="#92400e" />
    <path d="M8 7H16M8 10H16M8 13H12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
  </svg>
);

// 코스프레/촬영장 (Mask)
export const MaskIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" filter="url(#inner-shadow)">
    <path d="M12 4C7 4 3 8 3 13C3 16 5 19 8 20L12 22L16 20C19 19 21 16 21 13C21 8 17 4 12 4Z" fill="url(#grad-rose-3d)" />
    <circle cx="8.5" cy="12" r="2" fill="white" fillOpacity="0.3" />
    <circle cx="15.5" cy="12" r="2" fill="white" fillOpacity="0.3" />
    <path d="M9 16.5C9 16.5 10.5 18 12 18C13.5 18 15 16.5 15 16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
  </svg>
);

// 광고모델 (Professional Camera/Studio Light)
export const PhotoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" filter="url(#inner-shadow)">
    <rect x="3" y="5" width="18" height="14" rx="3" fill="url(#grad-emerald-3d)" />
    <circle cx="12" cy="12" r="4" fill="#064e3b" />
    <circle cx="12" cy="12" r="2.5" fill="url(#grad-cyan-3d)" />
    <rect x="17" y="7" width="2" height="2" rx="1" fill="white" fillOpacity="0.5" />
    <path d="M8 5L9 3H15L16 5" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" />
  </svg>
);

// 스냅사진 (Polaroid/Instax)
export const CameraIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" filter="url(#inner-shadow)">
    <rect x="4" y="4" width="16" height="16" rx="1" fill="#e2e8f0" />
    <rect x="5" y="5" width="14" height="11" fill="url(#grad-purple-3d)" />
    <circle cx="12" cy="10.5" r="3" fill="white" fillOpacity="0.2" />
    <rect x="14" y="17" width="4" height="1" fill="#94a3b8" />
  </svg>
);

// 프로필사진 (User/Avatar)
export const UserCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" filter="url(#inner-shadow)">
    <circle cx="12" cy="12" r="10" fill="url(#grad-blue-3d)" />
    <circle cx="12" cy="9" r="3" fill="white" fillOpacity="0.9" />
    <path d="M6 18C6 15.5 8.5 13.5 12 13.5C15.5 13.5 18 15.5 18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.8" />
  </svg>
);

// 캐릭터시트 (Blueprint/Roll)
export const FilmIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" filter="url(#inner-shadow)">
    <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z" fill="url(#grad-cyan-3d)" />
    <path d="M3 10H21M3 14H21M7 5V19M11 5V19M15 5V19" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
    <rect x="5" y="8" width="14" height="8" rx="1" fill="white" fillOpacity="0.1" />
  </svg>
);

// 표정/포즈 (Happy Emoji)
export const FaceSmileIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" filter="url(#inner-shadow)">
    <circle cx="12" cy="12" r="10" fill="url(#grad-amber-3d)" />
    <circle cx="8.5" cy="10" r="1.5" fill="#78350f" />
    <circle cx="15.5" cy="10" r="1.5" fill="#78350f" />
    <path d="M8 15C8 15 10 17.5 12 17.5C14 17.5 16 15 16 15" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 앵글 변경 (Camera with arrows)
export const AngleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" filter="url(#inner-shadow)">
    <path d="M21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19Z" fill="url(#grad-purple-3d)" />
    <path d="M12 7L12 17M12 7L9 10M12 7L15 10M12 17L9 14M12 17L15 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" />
  </svg>
);

// 조명/색감 (Lightbulb)
export const LightBulbIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" filter="url(#inner-shadow)">
    <path d="M12 2C8.134 2 5 5.134 5 9C5 11.382 6.19 13.484 7.994 14.731C8.618 15.163 9 15.86 9 16.611V18C9 19.1046 9.89543 20 11 20H13C14.1046 20 15 19.1046 15 18V16.611C15 15.86 15.382 15.163 16.006 14.731C17.81 13.484 19 11.382 19 9C19 5.134 15.866 2 12 2Z" fill="url(#grad-amber-3d)" />
    <path d="M9 22H15" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 6V8M14.5 7.5L13.5 8.5M9.5 7.5L10.5 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
  </svg>
);

// 인스타 그리드 생성기 (Grid tiles)
export const ViewGridIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" filter="url(#inner-shadow)">
    <rect x="3" y="3" width="8" height="8" rx="1.5" fill="url(#grad-blue-3d)" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" fill="url(#grad-purple-3d)" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" fill="url(#grad-emerald-3d)" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" fill="url(#grad-rose-3d)" />
  </svg>
);

// 기타 보조 아이콘
export const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3V16M12 16L7 11M12 16L17 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H21M19 6L18.105 19.423C18.047 20.301 17.318 21 16.438 21H7.562C6.682 21 5.953 20.301 5.895 19.423L5 6M8 6V4C8 2.895 8.895 2 10 2H14C15.105 2 16 2.895 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CopyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 16V6C4 4.89543 4.89543 4 6 4H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 13L10 18L20 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PencilIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.232 5.232L18.768 8.768M16.732 3.732C17.708 2.756 19.291 2.756 20.267 3.732C21.243 4.708 21.243 6.291 20.267 7.267L6.5 21H3V17.5L16.732 3.732Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ArrowLeftCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M14 8L10 12L14 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ArrowRightCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 8L14 12L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChatBubbleOvalLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4876 3.36011 14.8911 4 16.1264L3 21L7.87355 20C9.10893 20.6399 10.5124 21 12 21Z" fill="currentColor" stroke="none" />
  </svg>
);

export const KeyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 4C12.7909 4 11 5.79086 11 8C11 8.88214 11.2863 9.69733 11.7719 10.3581L3 19.1299V22H5.8701L6.7402 21.1299V19.1299H8.7402V17.1299H10.7402L12.5645 15.3056C13.2721 15.7483 14.1065 16 15 16C17.2091 16 19 14.2091 19 12C19 11.2091 19 4 15 4Z" fill="currentColor" stroke="none" />
    <circle cx="15" cy="8" r="1.5" fill="white" />
  </svg>
);

// Fix: Added SpotlightIcon for LightingColorTool
export const SpotlightIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
  </svg>
);

// Fix: Added DocumentTextIcon for PromptGeneratorTool
export const DocumentTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// Fix: Added PlusCircleIcon for ExpressionPoseTool and SnapshotGeneratorTool
export const PlusCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Fix: Added RectangleGroupIcon for FinalSheetTool
export const RectangleGroupIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);
