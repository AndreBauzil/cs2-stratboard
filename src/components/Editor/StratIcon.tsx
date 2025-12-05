"use client";

import { Circle, Group, Text } from "react-konva";
import { IconData } from "@/types/canvas";
import { KonvaEventObject } from "konva/lib/Node";

// 'strokeColor' to border
const ICON_CONFIG: Record<string, { color: string; label: string; strokeColor: string }> = {
  smoke: { color: "#9ca3af", label: "S", strokeColor: "black" },   
  flash: { color: "#facc15", label: "F", strokeColor: "black" },   
  molotov: { color: "#ef4444", label: "M", strokeColor: "black" }, 
  he: { color: "#10b981", label: "H", strokeColor: "black" },      
};

interface StratIconProps {
  data: IconData;
  onChange: (id: string, newAttrs: { x: number; y: number }) => void;
  isDraggable: boolean;
}

export default function StratIcon({ data, onChange, isDraggable }: StratIconProps) {
  const config = ICON_CONFIG[data.tool];

  if (!config) return null;

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange(data.id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
    <Group
      x={data.x}
      y={data.y}
      draggable={isDraggable}
      onDragEnd={handleDragEnd}
      onMouseEnter={(e) => {
        if(isDraggable) {
            const container = e.target.getStage()?.container();
            if(container) container.style.cursor = "move";
        }
      }}
      onMouseLeave={(e) => {
        const container = e.target.getStage()?.container();
        if(container) container.style.cursor = "default";
      }}
    >
      <Circle
        radius={12}
        fill={config.color}
        shadowColor="black"
        shadowBlur={5}
        shadowOpacity={0.5}
      />
      <Circle
        radius={12}
        stroke={config.strokeColor} 
        strokeWidth={2}
      />
      <Text
        text={config.label}
        fontSize={14}
        fontStyle="bold"
        fill="black"
        offsetX={5} 
        offsetY={7}
        listening={false}
      />
    </Group>
  );
}