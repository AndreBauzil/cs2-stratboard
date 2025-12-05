"use client";

import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { useMemo } from "react";

interface MapImageProps {
  imageUrl: string;
  // O tamanho base do nosso mundo lógico (800)
  baseSize: number; 
}

export default function MapImage({ imageUrl, baseSize }: MapImageProps) {
  const [image] = useImage(imageUrl);

  const layout = useMemo(() => {
    if (!image) return null;

    // Calcula a proporção para caber no quadrado baseSize (ex: 800x800)
    const scale = Math.min(
      baseSize / image.width,
      baseSize / image.height
    );

    const width = image.width * scale;
    const height = image.height * scale;

    const x = (baseSize - width) / 2;
    const y = (baseSize - height) / 2;

    return { x, y, width, height };
  }, [image, baseSize]);

  if (!image || !layout) return null;

  return (
    <KonvaImage
      image={image}
      x={layout.x}
      y={layout.y}
      width={layout.width}
      height={layout.height}
      listening={false}
    />
  );
}