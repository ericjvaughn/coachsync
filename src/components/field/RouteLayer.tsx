import { Line, Group } from 'react-konva';
import React, { useState } from 'react';
import { useToolState } from '../../store/toolState';
import { calculateRoutePoints, flattenPoints } from '../../utils/routeUtils';
import { Point } from '../../types';

interface RouteLayerProps {
  width: number;
  height: number;
}



export function RouteLayer({ width, height }: RouteLayerProps) {
  const { currentTool, editingState, setEditingState, addAction } = useToolState();
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  
  const handleMouseDown = (e: any) => {
    if (currentTool !== 'path') return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    setCurrentPoints([point]);
    setEditingState('drawing');
    
    addAction(
      'ROUTE_START',
      { point },
      { position: { x: point.x, y: point.y } }
    );
  };
  
  const handleMouseMove = (e: any) => {
    if (editingState !== 'drawing') return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    setCurrentPoints(prev => [...prev, point]);
    
    addAction(
      'ROUTE_UPDATE',
      { points: [...currentPoints, point] },
      { position: { x: point.x, y: point.y } }
    );
  };
  
  const handleMouseUp = () => {
    if (editingState !== 'drawing') return;
    
    setEditingState('idle');
    
    addAction(
      'ROUTE_END',
      { points: currentPoints },
      { position: currentPoints[currentPoints.length - 1] }
    );
    
    setCurrentPoints([]);
  };

  return (
    <Group
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {currentPoints.length > 1 && (
        <Line
          points={flattenPoints(calculateRoutePoints(currentPoints))}
          stroke="white"
          strokeWidth={2}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
        />
      )}
      {/* Saved routes will be rendered here based on state */}
    </Group>
  );
}
