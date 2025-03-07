import { describe, it, expect } from 'vitest';
import { calculatePlayerPosition, isValidPlayerPosition, PlayerType } from '../../utils/playerUtils';
import { Point } from '../../types';

describe('Player Utils', () => {
  describe('calculatePlayerPosition', () => {
    it('should calculate correct player position within field boundaries', () => {
      const clickPoint: Point = { x: 100, y: 100 };
      const fieldDimensions = { width: 1000, height: 569 };
      
      const position = calculatePlayerPosition(clickPoint, fieldDimensions);
      
      expect(position.x).toBe(100);
      expect(position.y).toBe(100);
    });

    it('should clamp player position to field boundaries', () => {
      const outOfBounds: Point = { x: -50, y: 1000 };
      const fieldDimensions = { width: 1000, height: 569 };
      
      const position = calculatePlayerPosition(outOfBounds, fieldDimensions);
      
      expect(position.x).toBeGreaterThanOrEqual(0);
      expect(position.x).toBeLessThanOrEqual(fieldDimensions.width);
      expect(position.y).toBeGreaterThanOrEqual(0);
      expect(position.y).toBeLessThanOrEqual(fieldDimensions.height);
    });
  });

  describe('isValidPlayerPosition', () => {
    it('should validate player position within field', () => {
      const validPosition: Point = { x: 500, y: 200 };
      const fieldDimensions = { width: 1000, height: 569 };
      
      expect(isValidPlayerPosition(validPosition, fieldDimensions)).toBe(true);
    });

    it('should reject invalid player positions', () => {
      const invalidPositions: Point[] = [
        { x: -10, y: 100 },
        { x: 1100, y: 100 },
        { x: 100, y: -10 },
        { x: 100, y: 600 }
      ];
      const fieldDimensions = { width: 1000, height: 569 };
      
      invalidPositions.forEach(pos => {
        expect(isValidPlayerPosition(pos, fieldDimensions)).toBe(false);
      });
    });
  });
});
