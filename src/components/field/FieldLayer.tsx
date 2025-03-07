import { Line, Group } from 'react-konva';
import React from 'react';

interface FieldLayerProps {
  width: number;
  height: number;
}

export function FieldLayer({ width, height }: FieldLayerProps) {
  // Constants for field dimensions
  const YARDS_TO_PIXELS = width / 100; // Field is 100 yards
  
  // Generate yard lines (every 5 yards)
  const generateYardLines = () => {
    const lines = [];
    for (let yard = 0; yard <= 100; yard += 5) {
      const x = yard * YARDS_TO_PIXELS;
      lines.push(
        <Line
          key={`yard-${yard}`}
          points={[x, 0, x, height]}
          stroke="white"
          strokeWidth={yard % 10 === 0 ? 2 : 1}
          opacity={0.5}
        />
      );
    }
    return lines;
  };

  // Generate hash marks
  const generateHashMarks = () => {
    const marks = [];
    for (let yard = 0; yard <= 100; yard++) {
      const x = yard * YARDS_TO_PIXELS;
      // Top hash marks
      marks.push(
        <Line
          key={`hash-top-${yard}`}
          points={[x, height * 0.2, x, height * 0.22]}
          stroke="white"
          strokeWidth={1}
          opacity={0.5}
        />
      );
      // Bottom hash marks
      marks.push(
        <Line
          key={`hash-bottom-${yard}`}
          points={[x, height * 0.78, x, height * 0.8]}
          stroke="white"
          strokeWidth={1}
          opacity={0.5}
        />
      );
    }
    return marks;
  };

  return (
    <Group>
      {/* Base field outline */}
      <Line
        points={[0, 0, width, 0, width, height, 0, height, 0, 0]}
        stroke="white"
        strokeWidth={2}
        closed={true}
      />
      
      {/* Yard lines */}
      {generateYardLines()}
      
      {/* Hash marks */}
      {generateHashMarks()}
    </Group>
  );
}
