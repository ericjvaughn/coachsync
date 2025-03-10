import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export type ToolState = 
  | 'select'
  | 'offense'
  | 'defense'
  | 'oline'
  | 'color'
  | 'path'
  | 'circle'
  | 'arrow'
  | 'block'
  | 'remove'

export type EditingState = 'idle' | 'placing' | 'drawing' | 'dragging'

type KeyboardShortcut = {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  altKey?: boolean
  action: () => void
}

export type ActionType = 
  | 'TOOL_CHANGE'
  | 'PLAYER_ADD'
  | 'PLAYER_MOVE'
  | 'PLAYER_DELETE'
  | 'ROUTE_START'
  | 'ROUTE_UPDATE'
  | 'ROUTE_END'
  | 'ROUTE_DELETE'

export type Action = {
  id: string
  type: ActionType
  payload: any
  timestamp: number
  metadata?: {
    position?: { x: number, y: number }
    tool?: ToolState
  }
}

interface ToolStateStore {
  // Formation state
  formationName: string
  isFormationSaving: boolean
  formationError: string | null
  
  // Formation actions
  setFormationName: (name: string) => void
  saveFormation: () => Promise<void>
  // Current tool and editing states
  currentTool: ToolState
  editingState: EditingState
  
  // Grid functionality
  gridEnabled: boolean
  toggleGrid: () => void
  alignmentGuidesEnabled: boolean
  toggleAlignmentGuides: () => void
  
  // History management
  history: Action[]
  currentIndex: number
  shortcuts: KeyboardShortcut[]
  
  // Actions
  setTool: (tool: ToolState) => void
  setEditingState: (state: EditingState) => void
  addAction: (type: ActionType, payload: any, metadata?: Action['metadata']) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  registerShortcut: (shortcut: KeyboardShortcut) => void
  handleKeyPress: (e: KeyboardEvent) => void
}

// Initialize keyboard event listener
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
  window.addEventListener('keydown', (e) => {
    useToolState.getState().handleKeyPress(e)
  })
}

export const useToolState = create<ToolStateStore>((set, get) => ({
  // Initial state
  currentTool: 'select',
  editingState: 'idle',
  history: [],
  currentIndex: -1,
  shortcuts: [],
  formationName: '',
  isFormationSaving: false,
  formationError: null,
  gridEnabled: true,
  alignmentGuidesEnabled: true,
  
  // Actions
  setTool: (tool) => set({ currentTool: tool }),
  setEditingState: (state) => set({ editingState: state }),
  
  addAction: (type, payload, metadata) => set((state) => {
    const newAction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      payload,
      timestamp: Date.now(),
      metadata: {
        ...metadata,
        tool: state.currentTool
      }
    }
    const newHistory = [...state.history.slice(0, state.currentIndex + 1), newAction]
    
    // Log action for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Action:', { type, payload, metadata })
    }
    
    return {
      history: newHistory,
      currentIndex: newHistory.length - 1
    }
  }),
  
  undo: () => set((state) => {
    if (state.currentIndex < 0) return state
    return { currentIndex: state.currentIndex - 1 }
  }),
  
  redo: () => set((state) => {
    if (state.currentIndex >= state.history.length - 1) return state
    return { currentIndex: state.currentIndex + 1 }
  }),
  
  canUndo: () => get().currentIndex >= 0,
  canRedo: () => get().currentIndex < get().history.length - 1,

  registerShortcut: (shortcut) => set((state) => ({
    shortcuts: [...state.shortcuts, shortcut]
  })),

  // Formation actions
  setFormationName: (name) => set({ formationName: name }),

  saveFormation: async () => {
    const state = get()
    if (!state.formationName) {
      set({ formationError: 'Formation name is required' })
      return
    }

    set({ isFormationSaving: true, formationError: null })

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Extract player positions from history
      const players = state.history
        .slice(0, state.currentIndex + 1)
        .filter(action => 
          action.type === 'PLAYER_ADD' || 
          action.type === 'PLAYER_MOVE'
        )
        .reduce((acc, action) => {
          if (action.type === 'PLAYER_ADD') {
            return [...acc, action.payload]
          }
          // Handle player moves by updating existing positions
          return acc.map(player => 
            player.id === action.payload.id ? action.payload : player
          )
        }, [])

      // Save formation to Supabase
      const { error } = await supabase
        .from('formations')
        .insert({
          name: state.formationName,
          type: state.currentTool === 'defense' ? 'defense' : 'offense',
          player_positions: { players },
          created_by: user.id
        })

      if (error) throw error

      // Reset formation name after successful save
      set({ 
        formationName: '',
        isFormationSaving: false,
        formationError: null
      })
    } catch (error) {
      set({ 
        isFormationSaving: false,
        formationError: error.message
      })
    }
  },

  // Grid functionality
  toggleGrid: () => set(state => ({ gridEnabled: !state.gridEnabled })),
  toggleAlignmentGuides: () => set(state => ({ alignmentGuidesEnabled: !state.alignmentGuidesEnabled })),
  
  handleKeyPress: (e) => {
    // Ignore shortcuts when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }
    
    const state = get()
    state.shortcuts.forEach(shortcut => {
      if (
        shortcut.key === e.key &&
        !!shortcut.ctrlKey === e.ctrlKey &&
        !!shortcut.shiftKey === e.shiftKey &&
        !!shortcut.metaKey === e.metaKey &&
        !!shortcut.altKey === e.altKey
      ) {
        e.preventDefault()
        shortcut.action()
      }
    })
  }
}))

// Register default shortcuts if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const store = useToolState.getState()
  
  // Grid toggle: G
  store.registerShortcut({
    key: 'g',
    action: () => store.toggleGrid()
  })
  
  // Alignment guides toggle: A
  store.registerShortcut({
    key: 'a',
    action: () => store.toggleAlignmentGuides()
  })

  // Undo: Cmd/Ctrl + Z
  store.registerShortcut({
    key: 'z',
    metaKey: true,
    action: () => store.undo()
  })

  // Redo: Cmd/Ctrl + Shift + Z
  store.registerShortcut({
    key: 'z',
    metaKey: true,
    shiftKey: true,
    action: () => store.redo()
  })

  // Select tool: V
  store.registerShortcut({
    key: 'v',
    action: () => store.setTool('select')
  })

  // Offense tool: O
  store.registerShortcut({
    key: 'o',
    action: () => store.setTool('offense')
  })

  // Defense tool: D
  store.registerShortcut({
    key: 'd',
    action: () => store.setTool('defense')
  })

  // Route tool: R
  store.registerShortcut({
    key: 'r',
    action: () => store.setTool('path')
  })

  // Remove tool: Delete
  store.registerShortcut({
    key: 'Delete',
    action: () => store.setTool('remove')
  })

  // Alternative Remove shortcut: Backspace
  store.registerShortcut({
    key: 'Backspace',
    action: () => store.setTool('remove')
  })
}
