
export interface Theme {
  id: string;
  name: string;
  colors: Record<string, string>;
}

const darkPurpleColors = {
  '--bg-primary': '#111827', // gray-900
  '--bg-secondary': '#1F2937', // gray-800
  '--bg-tertiary': '#374151', // gray-700
  '--bg-interactive': '#4B5563', // gray-600
  '--bg-accent': '#7C3AED', // purple-600
  '--bg-accent-hover': '#6D28D9', // purple-700
  '--bg-positive': '#16A34A', // green-600
  '--bg-positive-hover': '#15803D', // green-700
  '--bg-negative': '#DC2626', // red-600
  '--bg-negative-hover': '#B91C1C', // red-700
  '--bg-info': '#2563EB', // blue-600
  '--bg-info-hover': '#1D4ED8', // blue-700
  '--bg-disabled': '#4B5563', // gray-600
  '--text-primary': '#F3F4F6', // gray-100
  '--text-secondary': '#9CA3AF', // gray-400
  '--text-accent': '#2DD4BF', // cyan-400
  '--text-on-accent': '#FFFFFF',
  '--border-primary': '#374151', // gray-700
  '--border-secondary': '#4B5563', // gray-600
  '--border-accent': '#8B5CF6', // purple-500
  '--ring-accent': '#8B5CF6', // purple-500
};

const lightBlueColors = {
  '--bg-primary': '#F3F4F6', // gray-100
  '--bg-secondary': '#FFFFFF', // white
  '--bg-tertiary': '#E5E7EB', // gray-200
  '--bg-interactive': '#D1D5DB', // gray-300
  '--bg-accent': '#3B82F6', // blue-500
  '--bg-accent-hover': '#2563EB', // blue-600
  '--bg-positive': '#22C55E', // green-500
  '--bg-positive-hover': '#16A34A', // green-600
  '--bg-negative': '#EF4444', // red-500
  '--bg-negative-hover': '#DC2626', // red-600
  '--bg-info': '#6366F1', // indigo-500
  '--bg-info-hover': '#4F46E5', // indigo-600
  '--bg-disabled': '#E5E7EB', // gray-200
  '--text-primary': '#111827', // gray-900
  '--text-secondary': '#6B7280', // gray-500
  '--text-accent': '#0EA5E9', // sky-500
  '--text-on-accent': '#FFFFFF',
  '--border-primary': '#D1D5DB', // gray-300
  '--border-secondary': '#9CA3AF', // gray-400
  '--border-accent': '#60A5FA', // blue-400
  '--ring-accent': '#60A5FA', // blue-400
};

const darkGreenColors = {
  ...darkPurpleColors,
  '--bg-accent': '#10B981', // emerald-500
  '--bg-accent-hover': '#059669', // emerald-600
  '--text-accent': '#34D399', // emerald-400
  '--border-accent': '#34D399', // emerald-400
  '--ring-accent': '#34D399', // emerald-400
  '--bg-positive': '#84CC16', // lime-500
  '--bg-positive-hover': '#65A30D', // lime-600
};


export const THEMES: Theme[] = [
  { id: 'dark-purple', name: '다크 퍼플', colors: darkPurpleColors },
  { id: 'light-blue', name: '라이트 블루 (기본)', colors: lightBlueColors },
  { id: 'dark-green', name: '다크 그린', colors: darkGreenColors },
];

export const DEFAULT_THEME = THEMES[2];
