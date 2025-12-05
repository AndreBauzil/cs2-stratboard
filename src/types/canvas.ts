export type ToolType = 
  | 'cursor' 
  | 'pencil' 
  | 'smoke' 
  | 'flash' 
  | 'molotov' 
  | 'he';

export interface ToolItem {
  id: ToolType;
  label: string;
  icon: React.ElementType; // Type to Lucide Icons
  color?: string; // Color granade buttons
}

export interface LineData {
  id: string;
  tool: ToolType;
  points: number[];
  color: string;
  strokeWidth: number;
}

export interface IconData {
  id: string;
  tool: ToolType; // 'smoke', 'flash', etc.
  x: number;
  y: number;
}

export type CanvasItem = 
  | { type: 'line'; data: LineData }
  | { type: 'icon'; data: IconData };