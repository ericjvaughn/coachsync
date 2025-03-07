import { describe, it, expect, beforeEach } from 'vitest';
import { useToolState } from '../../store/toolState';
import { calculateRoutePoints, flattenPoints, isValidRoute } from '../../utils/routeUtils';
import { Point } from '../../types';

describe('Route Utils', () => {
  describe('calculateRoutePoints', () => {
    it('should maintain point sequence', () => {
      const points: Point[] = [
        { x: 100, y: 100 },
        { x: 200, y: 150 },
        { x: 300, y: 100 }
      ];
      const result = calculateRoutePoints(points);
      expect(result).toHaveLength(points.length);
      expect(result[0]).toEqual(points[0]);
      expect(result[result.length - 1]).toEqual(points[points.length - 1]);
    });

    it('should handle empty or single point routes', () => {
      expect(calculateRoutePoints([])).toEqual([]);
      const singlePoint = [{ x: 100, y: 100 }];
      expect(calculateRoutePoints(singlePoint)).toEqual(singlePoint);
    });
  });

  describe('isValidRoute', () => {
    it('should validate route length', () => {
      expect(isValidRoute([])).toBe(false);
      expect(isValidRoute([{ x: 100, y: 100 }])).toBe(false);
      expect(isValidRoute([{ x: 100, y: 100 }, { x: 200, y: 200 }])).toBe(true);
    });

    it('should validate point coordinates', () => {
      const validPoints: Point[] = [
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      ];
      expect(isValidRoute(validPoints)).toBe(true);
    });
  });

  describe('flattenPoints', () => {
    it('should convert points to flat array', () => {
      const points: Point[] = [
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      ];
      expect(flattenPoints(points)).toEqual([100, 100, 200, 200]);
    });

    it('should handle empty array', () => {
      expect(flattenPoints([])).toEqual([]);
    });
  });
});
