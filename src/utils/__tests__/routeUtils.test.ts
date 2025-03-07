import { describe, it, expect } from 'vitest';
import { calculateRoutePoints, isValidRoute, flattenPoints } from '../routeUtils';

describe('Route Utilities', () => {
  describe('calculateRoutePoints', () => {
    it('should return empty array for less than 2 points', () => {
      const singlePoint = [{ x: 100, y: 100 }];
      expect(calculateRoutePoints(singlePoint)).toEqual(singlePoint);
    });

    it('should return valid route points', () => {
      const points = [
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      ];
      expect(calculateRoutePoints(points)).toEqual(points);
    });
  });

  describe('isValidRoute', () => {
    it('should return false for routes with less than 2 points', () => {
      const singlePoint = [{ x: 100, y: 100 }];
      expect(isValidRoute(singlePoint)).toBe(false);
    });

    it('should return true for valid routes', () => {
      const points = [
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      ];
      expect(isValidRoute(points)).toBe(true);
    });
  });

  describe('flattenPoints', () => {
    it('should flatten points array into numbers', () => {
      const points = [
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
