"use client";

import { Stage, Layer, Line, Group } from "react-konva";
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import MapImage from "./MapImage";
import StratIcon from "./StratIcon";
import { MapData } from "@/constants/maps";
import { ToolType, LineData, IconData } from "@/types/canvas";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";

interface MapCanvasProps {
  selectedMap: MapData;
  activeTool: ToolType;
  lines: LineData[];
  onLineAdd: (newLine: LineData) => void;
  icons: IconData[];
  onIconAdd: (newIcon: IconData) => void;
  onIconChange: (id: string, newAttrs: { x: number; y: number }) => void;
}

export interface MapCanvasHandle {
  exportImage: () => void;
}

const BASE_SIZE = 800;

const MapCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(({ 
  selectedMap, 
  activeTool, 
  lines, 
  onLineAdd,
  icons,
  onIconAdd,
  onIconChange 
}, ref) => {
  
  const [isClient, setIsClient] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0); 
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [currentLine, setCurrentLine] = useState<LineData | null>(null);
  const isDrawing = useRef(false);
  const stageRef = useRef<Konva.Stage>(null);

  useImperativeHandle(ref, () => ({
    exportImage: () => {
      if (!stageRef.current) return;
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `strat-${selectedMap.name.toLowerCase()}.png`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }));

  useEffect(() => {
    setIsClient(true);
    const updateWidth = () => {
      if (containerRef.current) {
        const width = Math.min(containerRef.current.offsetWidth, 800);
        setContainerWidth(width);
      }
    };

    updateWidth();
    setTimeout(updateWidth, 100);

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    window.addEventListener('resize', updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const scale = containerWidth > 0 ? containerWidth / BASE_SIZE : 1;

  const handleMouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    const pos = {
      x: pointerPos.x / scale,
      y: pointerPos.y / scale
    };

    if (activeTool === 'pencil') {
      isDrawing.current = true;
      setCurrentLine({ 
        id: Date.now().toString(),
        tool: 'pencil', 
        points: [pos.x, pos.y], 
        color: '#fbbf24', 
        strokeWidth: 2
      });
      return;
    }

    if (['smoke', 'flash', 'molotov', 'he'].includes(activeTool)) {
      onIconAdd({
        id: Date.now().toString(),
        tool: activeTool,
        x: pos.x,
        y: pos.y
      });
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current || activeTool !== 'pencil' || !currentLine) return;
    const stage = e.target.getStage();
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    const pos = {
      x: pointerPos.x / scale,
      y: pointerPos.y / scale
    };

    const newPoints = currentLine.points.concat([pos.x, pos.y]);
    setCurrentLine({ ...currentLine, points: newPoints });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    if (currentLine) {
      onLineAdd(currentLine);
      setCurrentLine(null);
    }
  };

  if (!isClient) return <div className="text-zinc-500 h-[300px] flex items-center justify-center">Carregando...</div>;

  return (
    <div 
      ref={containerRef} 
      className="touch-none border-4 border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative bg-zinc-900 w-full h-full"
    >
      {containerWidth > 0 && (
        <Stage 
          ref={stageRef}
          width={containerWidth} 
          height={containerWidth}
          scaleX={scale} 
          scaleY={scale}
          className={`bg-zinc-900 ${activeTool === 'pencil' ? 'cursor-crosshair' : activeTool === 'cursor' ? 'cursor-default' : 'cursor-copy'}`}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <Layer>
            <MapImage 
              imageUrl={selectedMap.imageUrl} 
              baseSize={BASE_SIZE} 
            />

            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                listening={false}
              />
            ))}

            {currentLine && (
              <Line
                points={currentLine.points}
                stroke={currentLine.color}
                strokeWidth={currentLine.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                listening={false}
              />
            )}

            {icons.map((icon) => (
              <StratIcon 
                key={icon.id} 
                data={icon} 
                isDraggable={activeTool === 'cursor'} 
                onChange={onIconChange}
              />
            ))}
          </Layer>
        </Stage>
      )}
    </div>
  );
});

MapCanvas.displayName = "MapCanvas";
export default MapCanvas;