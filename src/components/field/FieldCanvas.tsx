import { Stage, Layer, Rect } from 'react-konva';
import React from 'react';

interface FieldCanvasProps {
  width: number;
  height: number;
  children?: React.ReactNode;
}

export function FieldCanvas({ width, height, children }: FieldCanvasProps) {
  return (
    <Stage 
      width={width}
      height={height}
      className="rounded-lg p-4"
      style={{ padding: '16px' }}
    >
      <Layer>
        <Rect
          width={width}
          height={height}
          fill="white"
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.1}
          cornerRadius={4}
        />
        {children}
      </Layer>
    </Stage>
  );
}
