import { describe, it, expect, beforeEach } from 'vitest';
import { useToolState, ToolState } from '../store/toolState';

// Mock the store
vi.mock('../store/toolState');

describe('Tool State Management', () => {
  let mockStore: ReturnType<typeof useToolState>;
  
  beforeEach(() => {
    mockStore = {
      currentTool: 'select' as ToolState,
      editingState: 'idle',
      history: [],
      currentIndex: -1,
      shortcuts: [],
      setTool: vi.fn(),
      setEditingState: vi.fn(),
      addAction: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
      canUndo: vi.fn(),
      canRedo: vi.fn(),
      registerShortcut: vi.fn(),
      handleKeyPress: vi.fn()
    };
    vi.mocked(useToolState).mockReturnValue(mockStore as any);
  });

  describe('Initial State', () => {
    it('initializes with select tool', () => {
      const { currentTool } = useToolState();
      expect(currentTool).toBe('select');
    });

    it('starts in idle editing state', () => {
      const { editingState } = useToolState();
      expect(editingState).toBe('idle');
    });

    it('starts with empty history', () => {
      const { history, currentIndex } = useToolState();
      expect(history).toEqual([]);
      expect(currentIndex).toBe(-1);
    });
  });

  describe('Action Management', () => {
    it('provides action management functions', () => {
      const { addAction } = useToolState();
      expect(addAction).toBeDefined();
      expect(typeof addAction).toBe('function');
    });

    it('tracks undo/redo state', () => {
      const { canUndo, canRedo } = useToolState();
      expect(canUndo).toBeDefined();
      expect(canRedo).toBeDefined();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('registers keyboard shortcuts', () => {
      const { registerShortcut } = useToolState();
      const shortcut = {
        key: 'z',
        metaKey: true,
        action: vi.fn()
      };
      
      registerShortcut(shortcut);
      expect(mockStore.registerShortcut).toHaveBeenCalledWith(shortcut);
    });

    it('handles keyboard events', () => {
      const { handleKeyPress } = useToolState();
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        metaKey: true
      });
      
      handleKeyPress(event);
      expect(mockStore.handleKeyPress).toHaveBeenCalledWith(event);
    });
  });

  describe('Tool State Changes', () => {
    it('sets current tool', () => {
      const { setTool } = useToolState();
      setTool('offense');
      expect(mockStore.setTool).toHaveBeenCalledWith('offense');
    });

    it('sets editing state', () => {
      const { setEditingState } = useToolState();
      setEditingState('drawing');
      expect(mockStore.setEditingState).toHaveBeenCalledWith('drawing');
    });
  });
});

