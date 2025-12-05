"use client";

import { 
  MousePointer2, 
  Pencil, 
  Cloud, 
  Zap, 
  Flame, 
  Bomb 
} from "lucide-react";
import { ToolItem, ToolType } from "@/types/canvas";

const TOOLS: ToolItem[] = [
  { id: 'cursor', label: 'Mover', icon: MousePointer2 },
  { id: 'pencil', label: 'Desenhar', icon: Pencil },
  { id: 'smoke', label: 'Smoke', icon: Cloud, color: 'text-gray-400' },
  { id: 'flash', label: 'Flash', icon: Zap, color: 'text-yellow-400' },
  { id: 'molotov', label: 'Molotov', icon: Flame, color: 'text-red-500' },
  { id: 'he', label: 'HE', icon: Bomb, color: 'text-emerald-600' },
];

interface ToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

export default function Toolbar({ activeTool, onToolChange }: ToolbarProps) {
  return (
    <div className="
      flex flex-row md:flex-col gap-2 
      bg-zinc-900 p-2 rounded-xl border border-zinc-800 shadow-xl
      overflow-x-auto md:overflow-visible max-w-full md:max-w-none justify-center
    ">
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;

        return (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            title={tool.label}
            className={`
              p-3 rounded-lg transition-all duration-200 group relative shrink-0
              ${isActive 
                ? "bg-zinc-800 text-white shadow-md border border-zinc-700" 
                : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
              }
            `}
          >
            <Icon 
              className={`w-6 h-6 ${isActive && tool.color ? tool.color : ""}`} 
            />
            {/* Tooltip escondido no mobile, visível no desktop */}
            <span className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-xs text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
              {tool.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}