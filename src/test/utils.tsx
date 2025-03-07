import React from 'react';
import { render } from '@testing-library/react';

// Mock Konva and Canvas
vi.mock('konva', () => ({
  Stage: class {
    constructor() { return mockStage; }
  }
}));

vi.mock('react-konva', () => ({
  Stage: ({ children }: { children: React.ReactNode }) => <div data-testid="konva-stage">{children}</div>,
  Layer: ({ children }: { children: React.ReactNode }) => <div data-testid="konva-layer">{children}</div>,
  Group: ({ children, ...props }: { children: React.ReactNode } & any) => (
    <div data-testid="konva-group" {...props}>{children}</div>
  ),
  Line: (props: any) => <div data-testid="konva-line" {...props} />,
  Circle: (props: any) => <div data-testid="konva-circle" {...props} />,
}));

// Mock Konva.Stage for pointer position
const mockStage = {
  getPointerPosition: () => ({ x: 100, y: 100 }),
  getStage: () => mockStage,
  on: () => {},
  off: () => {},
  draw: () => {},
  add: () => {},
  remove: () => {},
  destroy: () => {},
  toCanvas: () => ({}),
  getContext: () => ({}),
};

// Custom render for Konva components with event simulation
export function renderWithKonva(component: React.ReactNode) {
  const utils = render(
    <div data-testid="konva-stage" style={{ width: 1000, height: 569 }}>
      <div data-testid="konva-layer">
        {component}
      </div>
    </div>
  );

  // Add helper for simulating Konva events
  const simulateKonvaEvent = (eventName: string, target: Element | null, coords = { x: 100, y: 100 }) => {
    if (!target) return;
    const event = {
      target: {
        ...target,
        getStage: () => mockStage,
      },
      evt: {
        clientX: coords.x,
        clientY: coords.y,
      },
      preventDefault: () => {},
    };
    const handler = (target as any)[`on${eventName}`];
    if (handler) handler(event);
  };

  return {
    ...utils,
    simulateKonvaEvent,
  };
}




