"use client";

import { useState, useRef } from "react";
import { Undo2, Redo2, Trash2, Download } from "lucide-react";
import MapCanvas, { MapCanvasHandle } from "@/components/Editor/MapCanvas";
import Toolbar from "@/components/Editor/Toolbar";
import { CS2_MAPS, MapData } from "@/constants/maps";
import { ToolType, LineData, IconData, CanvasItem } from "@/types/canvas";

export default function Home() {
  const [activeMap, setActiveMap] = useState<MapData>(CS2_MAPS[0]);
  const [activeTool, setActiveTool] = useState<ToolType>('cursor');
  const canvasRef = useRef<MapCanvasHandle>(null);

  const [history, setHistory] = useState<Record<string, CanvasItem[][]>>({});
  const [future, setFuture] = useState<Record<string, CanvasItem[][]>>({});

  const mapHistory = history[activeMap.id] || [];
  const currentItems = mapHistory.length > 0 ? mapHistory[mapHistory.length - 1] : [];
  const mapFuture = future[activeMap.id] || [];

  const currentMapLines = currentItems
    .filter(item => item.type === 'line')
    .map(item => item.data as LineData);

  const currentMapIcons = currentItems
    .filter(item => item.type === 'icon')
    .map(item => item.data as IconData);

  const pushToHistory = (newItems: CanvasItem[]) => {
    setHistory(prev => ({
      ...prev,
      [activeMap.id]: [...(prev[activeMap.id] || []), newItems]
    }));
    setFuture(prev => ({
      ...prev,
      [activeMap.id]: []
    }));
  };

  const handleAddLine = (newLine: LineData) => {
    const nextState = [...currentItems, { type: 'line', data: newLine } as CanvasItem];
    pushToHistory(nextState);
  };

  const handleAddIcon = (newIcon: IconData) => {
    const nextState = [...currentItems, { type: 'icon', data: newIcon } as CanvasItem];
    pushToHistory(nextState);
  };

  const handleIconChange = (id: string, newAttrs: { x: number; y: number }) => {
    const nextState = currentItems.map(item => {
      if (item.type === 'icon' && item.data.id === id) {
        return { ...item, data: { ...item.data, ...newAttrs } };
      }
      return item;
    });
    pushToHistory(nextState);
  };

  const handleUndo = () => {
    setHistory(prev => {
      const currentHist = prev[activeMap.id] || [];
      if (currentHist.length === 0) return prev;
      const stateToUndo = currentHist[currentHist.length - 1];
      const newHist = currentHist.slice(0, -1);
      setFuture(prevFuture => ({
        ...prevFuture,
        [activeMap.id]: [...(prevFuture[activeMap.id] || []), stateToUndo]
      }));
      return { ...prev, [activeMap.id]: newHist };
    });
  };

  const handleRedo = () => {
    setFuture(prev => {
      const currentFut = prev[activeMap.id] || [];
      if (currentFut.length === 0) return prev;
      const stateToRedo = currentFut[currentFut.length - 1];
      const newFut = currentFut.slice(0, -1);
      setHistory(prevHistory => ({
        ...prevHistory,
        [activeMap.id]: [...(prevHistory[activeMap.id] || []), stateToRedo]
      }));
      return { ...prev, [activeMap.id]: newFut };
    });
  };

  const handleClear = () => {
    if (confirm("Tem certeza que deseja limpar tudo deste mapa?")) {
      pushToHistory([]); 
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      canvasRef.current.exportImage();
    }
  };

  const hasItems = currentItems.length > 0;

  return (
    <main className="flex min-h-screen flex-col items-center p-2 md:p-8 bg-zinc-950 text-white select-none overflow-x-hidden w-full">
      
      {/* Header */}
      <div className="z-10 w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-3 mb-4 font-mono text-sm shrink-0">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
          CS2 StratBoard 
        </h1>
        
        <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
          <button 
            onClick={handleUndo}
            disabled={mapHistory.length === 0}
            className="flex items-center gap-1 px-3 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition-colors text-xs md:text-sm"
          >
            <Undo2 size={16} /> <span className="hidden sm:inline">Desfazer</span>
          </button>
          
          <button 
            onClick={handleRedo}
            disabled={mapFuture.length === 0}
            className="flex items-center gap-1 px-3 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition-colors text-xs md:text-sm"
          >
            <Redo2 size={16} /> <span className="hidden sm:inline">Refazer</span>
          </button>
          
          <button 
            onClick={handleClear}
            disabled={!hasItems}
            className="flex items-center gap-1 px-3 py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/40 disabled:opacity-50 transition-colors text-xs md:text-sm"
          >
            <Trash2 size={16} /> <span className="hidden sm:inline">Limpar</span>
          </button>

          <button 
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 rounded-lg hover:bg-emerald-600/30 transition-colors text-xs md:text-sm ml-1"
          >
            <Download size={16} /> <span className="hidden sm:inline">Baixar</span>
          </button>
        </div>
      </div>

      {/* LAYOUT PRINCIPAL */}
      <div className="flex flex-col lg:flex-row gap-6 w-full justify-center items-start h-full">
        
        {/* Sidebar */}
        <aside className="
          flex lg:flex-col gap-2 
          overflow-x-auto w-full lg:w-48 pb-2 lg:pb-0 scrollbar-hide shrink-0 
          lg:sticky lg:top-8
          justify-center lg:justify-start  /* <--- AQUI ESTÁ A CORREÇÃO DE ALINHAMENTO */
        ">
          {CS2_MAPS.map((map) => {
            const mapSnapshots = history[map.id] || [];
            const currentMapState = mapSnapshots.length > 0 ? mapSnapshots[mapSnapshots.length - 1] : [];
            const itemsCount = currentMapState.length;

            return (
              <button
                key={map.id}
                onClick={() => setActiveMap(map)}
                className={`
                  whitespace-nowrap px-4 py-3 rounded-lg text-left transition-all font-semibold border text-xs md:text-sm flex justify-between items-center gap-3 shrink-0
                  ${activeMap.id === map.id 
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800"}
                `}
              >
                {map.name}
                {itemsCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Container do Canvas + Toolbar */}
        <div className="relative w-full max-w-[800px]">
           <MapCanvas 
            ref={canvasRef}
            selectedMap={activeMap} 
            activeTool={activeTool}
            lines={currentMapLines}
            onLineAdd={handleAddLine}
            icons={currentMapIcons}
            onIconAdd={handleAddIcon}
            onIconChange={handleIconChange}
          />

          <div className="
            fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[95vw]
            md:absolute md:top-4 md:right-4 md:bottom-auto md:left-auto md:translate-x-0 md:max-w-none
          ">
             <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />
          </div>
        </div>
        
      </div>
    </main>
  );
}