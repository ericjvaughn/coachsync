import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'
import React from 'react'

type KonvaProps = {
  children?: React.ReactNode
  [key: string]: any
}

// Mock Konva and Canvas
vi.mock('konva', () => ({
  Stage: class {
    constructor() { return mockStage; }
  }
}))

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
}

vi.mock('react-konva', () => ({
  Stage: ({ children, ...props }: KonvaProps) => React.createElement('div', { 'data-testid': 'konva-stage', ...props }, children),
  Layer: ({ children, ...props }: KonvaProps) => React.createElement('div', { 'data-testid': 'konva-layer', ...props }, children),
  Group: ({ children, ...props }: KonvaProps) => React.createElement('div', { 'data-testid': 'konva-group', ...props }, children),
  Line: (props: KonvaProps) => React.createElement('div', { 'data-testid': 'konva-line', ...props }),
  Circle: (props: KonvaProps) => React.createElement('div', { 'data-testid': 'konva-circle', ...props }),
}))

// Define handlers for MSW
const handlers = [
  // Example handler - replace with actual API endpoints
  http.get('/api/test', () => {
    return HttpResponse.json({ message: 'Test API Response' })
  }),
]

// Setup MSW Server
const server = setupServer(...handlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers()
  cleanup() // Cleanup React Testing Library
})

// Clean up after all tests are done
afterAll(() => server.close())
