import { Point } from '../types';

export type PlayerType = 'offense' | 'defense';

interface FieldDimensions {
  width: number;
  height: number;
}

export const calculatePlayerPosition = (clickPoint: Point, fieldDimensions: FieldDimensions): Point => {
  return {
    x: Math.max(0, Math.min(clickPoint.x, fieldDimensions.width)),
    y: Math.max(0, Math.min(clickPoint.y, fieldDimensions.height))
  };
};

export const isValidPlayerPosition = (position: Point, fieldDimensions: FieldDimensions): boolean => {
  return position.x >= 0 && 
         position.x <= fieldDimensions.width && 
         position.y >= 0 && 
         position.y <= fieldDimensions.height;
};
