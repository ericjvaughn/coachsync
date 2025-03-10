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
      {/* Background layer - just for the white rectangle */}
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
      </Layer>
      
      {/* Main content layer - for the football field and interactive elements */}
      <Layer>
        {children}
      </Layer>
    </Stage>
  );
}
