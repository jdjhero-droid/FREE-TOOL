import React, { useState } from 'react';
import { TOOLS } from '../constants';
import type { ToolId } from '../types';
import type { Theme } from './themes';
import { ChatBubbleOvalLeftIcon, KeyIcon } from './icons';

interface SidebarProps {
  activeToolId: ToolId;
  setActiveToolId: (id: ToolId) => void;
  themes: Theme[];
  activeTheme: Theme;
  setTheme: (theme: Theme) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeToolId, setActiveToolId, themes, activeTheme, setTheme, onOpenSettings }) => {
  return (
    <aside className="w-72 bg-[#0a0e1a]/95 backdrop-blur-xl flex flex-col border-r border-white/10 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.7)] z-30">
      <div className="p-8 mb-4">
        <div className="flex items-center gap-4 mb-1">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_8px_20px_-5px_rgba(99,102,241,0.6)] transform rotate-3 hover:rotate-0 transition-transform duration-500">
             <span className="text-white text-2xl font-black drop-shadow-lg">🦁</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white leading-tight">Wild Teacher’s</h1>
            <p className="text-[10px] text-indigo-400 font-extrabold tracking-[0.2em] uppercase">AI & Utility Tools</p>
          </div>
        </div>
      </div>

      <nav className="flex-grow overflow-y-auto px-4 custom-scrollbar space-y-2">
        {TOOLS.map((tool) => {
          const isActive = activeToolId === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveToolId(tool.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-500 group relative ${
                isActive
                  ? 'bg-white/5 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_15px_#6366f1] animate-pulse"></div>
                  <div className="absolute inset-0 bg-indigo-500/5 blur-xl rounded-2xl"></div>
                </>
              )}
              <div className={`transition-all duration-500 transform ${isActive ? 'scale-125 translate-x-1 -rotate-3' : 'group-hover:scale-110 group-hover:-translate-y-1'} drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]`}>
                <tool.icon className="w-7 h-7" />
              </div>
              <span className={`text-[14px] tracking-tight transition-all duration-500 ${isActive ? 'font-black' : 'font-bold'}`}>
                {tool.name}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 mt-4 border-t border-white/5 bg-black/40 backdrop-blur-2xl">
         <button
            onClick={onOpenSettings}
            className="flex items-center justify-between w-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/40 hover:to-purple-600/40 text-white p-4 rounded-2xl mb-6 transition-all transform hover:scale-[1.02] active:scale-95 border border-white/10 shadow-lg group"
         >
            <div className="flex items-center gap-3">
                <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                    <KeyIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <p className="text-[11px] font-black uppercase tracking-widest leading-none">Security Center</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-1">API & Integration</p>
                </div>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
         </button>

         <div className="space-y-4">
             <p className="text-[10px] text-slate-500 text-center font-black uppercase tracking-[0.3em] opacity-80">AI&youtube 정보 공유방</p>
             <a 
                href="https://open.kakao.com/o/guhUuT5h" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-4 bg-[#FAE100] text-[#3B1E1E] p-4 rounded-2xl font-black text-xs shadow-[0_10px_20px_-10px_rgba(250,225,0,0.5)] transition-all hover:scale-[1.05] active:scale-95 group"
             >
                <div className="bg-[#3B1E1E] p-2 rounded-xl text-yellow-300 shadow-md group-hover:rotate-12 transition-transform">
                    <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                </div>
                <span>오픈카톡 입장</span>
             </a>
         </div>
      </div>
    </aside>
  );
};