import React, { useState } from 'react';
import { Group, Image, Line, Rect } from 'react-konva';
import useImage from 'use-image';
import fieldSvg from '../../assets/Field-SVG.svg';
import { PlayerLayer } from './PlayerLayer';
import { RouteLayer } from './RouteLayer';
import { useToolState } from '../../store/toolState';

// LOS position at 65.8% from top of field
export const LOS_Y_POSITION = 0.658;

// Grid settings
export const GRID_SIZE = 10; // Grid cell size in pixels
export const GRID_SNAP_THRESHOLD = 15; // Distance in pixels to snap to grid

interface FieldProps {
  width: number;
  height: number;
}

export function Field({ width, height }: FieldProps) {
  const [image] = useImage(fieldSvg);
  const losY = height * LOS_Y_POSITION;
  const { gridEnabled } = useToolState();

  // Create grid lines
  const renderGridLines = () => {
    if (!gridEnabled) return null;
    
    const lines = [];
    const gridOpacity = 0.2;
    
    // Vertical grid lines
    for (let x = 0; x <= width; x += GRID_SIZE) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, 0, x, height]}
          stroke="#FFFFFF"
          strokeWidth={0.5}
          opacity={gridOpacity}
        />
      );
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= height; y += GRID_SIZE) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[0, y, width, y]}
          stroke="#FFFFFF"
          strokeWidth={0.5}
          opacity={gridOpacity}
        />
      );
    }
    
    return lines;
  };

  return (
    <Group>
      <Image
        image={image}
        width={width}
        height={height}
      />
      {/* Grid */}
      {renderGridLines()}
      {/* Line of Scrimmage */}
      <Line
        points={[0, losY, width, losY]}
        stroke="#FF0000" // Bright red color
        strokeWidth={1.5}
        opacity={1}
      />
      <PlayerLayer width={width} height={height} />
      <RouteLayer width={width} height={height} />      
    </Group>
  );
}
