import React from 'react';

interface PlaceholderToolProps {
  title: string;
}

export const PlaceholderTool: React.FC<PlaceholderToolProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[var(--bg-secondary)] rounded-lg p-8">
      <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">{title}</h2>
      <p className="text-[var(--text-secondary)]">This feature is currently under development. Please check back later!</p>
    </div>
  );
};