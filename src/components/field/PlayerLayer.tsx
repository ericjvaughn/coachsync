import { Circle, Group } from 'react-konva';
import React from 'react';
import { useToolState } from '../../store/toolState';
import { LOS_Y_POSITION } from './Field';

interface PlayerLayerProps {
  width: number;
  height: number;
}

export function PlayerLayer({ width, height }: PlayerLayerProps) {
  const { currentTool, editingState, addAction } = useToolState();
  
  // Constants for player dimensions
  const PLAYER_RADIUS = width * 0.01; // 1% of field width
  
  const isValidPosition = (y: number, type: string): boolean => {
    const losY = height * LOS_Y_POSITION;
    
    // Add a small buffer (0.2% of height) to prevent edge cases
    const buffer = height * 0.002;
    
    // Offensive players must be below LOS
    if ((type === 'offense' || type === 'oline') && y < losY + buffer) {
      return false;
    }
    
    // Defensive players must be above LOS
    if (type === 'defense' && y > losY - buffer) {
      return false;
    }
    
    return true;
  };

  const handleClick = (e: any) => {
    if (currentTool !== 'offense' && currentTool !== 'defense' && currentTool !== 'oline') return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    // Validate position before adding player
    if (!isValidPosition(point.y, currentTool)) return;
    
    addAction(
      'PLAYER_ADD',
      {
        type: currentTool,
        x: point.x,
        y: point.y,
        radius: PLAYER_RADIUS
      },
      { position: { x: point.x, y: point.y } }
    );
  };

  const handleDragMove = (e: any) => {
    const player = e.target;
    const type = player.attrs.type;
    
    // Validate new position
    if (!isValidPosition(player.y(), type)) {
      // Reset to last valid position
      player.y(player.attrs.lastY);
      return;
    }
    
    // Store last valid position
    player.attrs.lastY = player.y();
  };

  return (
    <Group
      onMouseDown={handleClick}
      onTouchStart={handleClick}
      onDragMove={handleDragMove}
    >
      {/* Players will be rendered here based on state */}
    </Group>
  );
}
