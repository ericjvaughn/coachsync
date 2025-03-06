# Football Play Designer PRD (Product Requirements Document)

## Overview
The Football Play Designer is a web-based application that allows coaches and analysts to create, save, and manage football plays digitally. The application provides an intuitive interface for drawing plays, managing formations, and organizing playbooks.

## Technical Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: Zustand
- **Canvas Framework**: Konva.js with React-Konva
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: npm/pnpm

### Backend & Data Layer
- **Database**: Supabase (PostgreSQL)
- **Real-time Updates**: Supabase Realtime
- **Authentication**: Supabase Auth with @supabase/auth-helpers-react
- **API Client**: @supabase/supabase-js with TypeScript types
- **Storage**: Supabase Storage (for play images/thumbnails)
- **Type Generation**: Supabase CLI

### Development Tools
- **Version Control**: Git
- **Code Quality**: ESLint + Prettier
- **Type Checking**: TypeScript
- **Testing**: Vitest + React Testing Library + MSW
- **Documentation**: TypeDoc + Storybook
- **API Documentation**: Swagger/OpenAPI

## UI/UX Flow

### Layout Structure
```typescript
interface LayoutStructure {
  topNav: {
    newPlayButton: Button;
    formationType: ToggleGroup; // Toggle between Offense/Defense
    formationSelect: ComboBox;
    playNameInput: Input;
    createPlayButton: Button;
    defenseControls?: {
      coverageSelect: Select;
      personnelSelect: Select;
      blitzToggle: Toggle;
      situationSelect: MultiSelect;
    };
  };
  canvas: {
    field: FootballField;
    players: PlayerLayer;
    routes: RouteLayer;
  };
  toolbar: {
    handTool: ToggleButton;
    playerTools: PlayerToolGroup;
    routeTools: RouteToolGroup;
    utilityTools: UtilityToolGroup;
  };
}
```

### User Flows

1. **Play Creation**
```typescript
type PlayCreationFlow =
  | 'initiate'    // Click "New Play"
  | 'formation'   // Select/Create Formation
  | 'naming'      // Name the Play
  | 'creation'    // Click "Create Play"
  | 'editing';    // Enter Edit Mode
```

2. **Player Management**
```typescript
type PlayerFlow =
  | 'selectType'  // Choose O/X/OL
  | 'placement'   // Click Field to Place
  | 'adjustment'  // Drag to Adjust
  | 'numbering'   // Assign Number
  | 'deletion';   // Remove Player
```

3. **Route Drawing**
```typescript
type RouteFlow =
  | 'selectPlayer' // Click Player
  | 'selectTool'   // Choose Route Type
  | 'drawing'      // Draw Route
  | 'completion'   // End Route
  | 'editing';     // Modify Route
```

### Keyboard Shortcuts
```typescript
const SHORTCUTS = {
  tools: {
    hand: 'h',
    offense: 'o',
    defense: 'x',
    oline: 'l',
    route: 'r'
  },
  actions: {
    delete: 'Backspace',
    undo: 'Cmd+Z',
    redo: 'Cmd+Shift+Z',
    save: 'Cmd+S'
  }
} as const;
```

### State Transitions
```typescript
type ToolState =
  | 'select'
  | 'hand'
  | 'offense'
  | 'defense'
  | 'oline'
  | 'route';

type EditingState =
  | 'idle'
  | 'placing'
  | 'drawing'
  | 'dragging';
```

### Field Layout
```typescript
// Field dimensions and layout configuration
interface FieldConfig {
  dimensions: {
    width: 1000;  // Fixed width in pixels
    height: 569;  // Fixed height in pixels
    aspectRatio: 1.757; // Maintain this ratio when scaling
  };
  layout: {
    container: 'flex-1 flex items-center justify-center';
    background: 'bg-gray-900';
    minHeight: 'min-h-0'; // Prevent container growth
  };
}

// Field Container Component
const FieldContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-900 min-h-0">
      <div className="relative w-[1000px] h-[569px]">
        <Stage
          width={1000}
          height={569}
          className="bg-white"
        >
          <Layer>
            <Field />
            <PlayersLayer />
            <RoutesLayer />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
```

## Formation and Play Variation System

### Component Structure
```typescript
interface FormationSystem {
  // Formation Selection and Management
  interface FormationOption {
    id: string;
    name: string;
    type: 'offense' | 'defense';
    players: PlayerPosition[];
    isDefault: boolean;
    lastUsed: Date;
    tags?: string[];
    thumbnail?: string;
    // Defense-specific properties
    coverage?: string;
    blitz?: boolean;
    personnelPackage?: string;
  }

  // Formation Preview Component
  interface FormationPreview {
    formation: FormationOption;
    scale?: number;
    interactive?: boolean;
    onSelect?: (formation: FormationOption) => void;
  }

  // Formation Select Component
  interface FormationSelect {
    value?: FormationOption;
    formationType: 'offense' | 'defense';
    onChange: (formation: FormationOption) => void;
    onCreateNew?: () => void;
    recentLimit?: number;
    showPreview?: boolean;
    // Defense-specific filters
    coverageFilter?: string[];
    personnelFilter?: string[];
    blitzFilter?: boolean;
  }
}

interface PlaySystem {
  // Play Variation Management
  interface PlayVariation {
    id: string;
    basePlayId: string;
    name: string;
    changes: {
      playerMoves: PlayerPositionChange[];
      routeChanges: RouteChange[];
      addedPlayers: Player[];
      removedPlayers: string[];
    };
    createdAt: Date;
    tags?: string[];
  }

  // Play Selection Component
  interface PlaySelect {
    value?: Play;
    formation?: FormationOption;
    onChange: (play: Play) => void;
    onCreateVariation?: (basePlay: Play) => void;
    showVariations?: boolean;
    recentLimit?: number;
  }
}
```

### State Management
```typescript
// Formation Store
interface FormationStore {
  formations: Record<string, FormationOption>;
  recentFormations: {
    offense: string[];
    defense: string[];
  };
  defaultFormations: {
    offense: string[];
    defense: string[];
  };
  
  // Actions
  loadFormation: (id: string) => Promise<void>;
  createFormation: (formation: Partial<FormationOption>) => Promise<string>;
  updateFormation: (id: string, updates: Partial<FormationOption>) => Promise<void>;
  deleteFormation: (id: string) => Promise<void>;
  setDefaultFormation: (id: string, type: 'offense' | 'defense') => void;
  
  // Defense-specific actions
  saveCoverage: (formationId: string, coverage: string) => Promise<void>;
  setPersonnelPackage: (formationId: string, personnel: string) => Promise<void>;
  toggleBlitz: (formationId: string) => Promise<void>;
}

// Play Store
interface PlayStore {
  plays: Record<string, Play>;
  variations: Record<string, PlayVariation>;
  recentPlays: string[];
  
  // Actions
  loadPlay: (id: string, asVariation?: boolean) => Promise<void>;
  createPlay: (play: Partial<Play>) => Promise<string>;
  createVariation: (basePlayId: string, changes?: Partial<PlayVariation>) => Promise<string>;
  updatePlay: (id: string, updates: Partial<Play>) => Promise<void>;
  deletePlay: (id: string) => Promise<void>;
}
```

### Database Updates
```sql
-- Add variation tracking to plays table
ALTER TABLE plays
ADD COLUMN base_play_id uuid REFERENCES plays(id),
ADD COLUMN variation_changes jsonb,
ADD COLUMN is_variation boolean DEFAULT false;

-- Add usage tracking and defensive properties to formations
ALTER TABLE formations
ADD COLUMN last_used timestamp with time zone,
ADD COLUMN usage_count integer DEFAULT 0,
ADD COLUMN is_default boolean DEFAULT false,
ADD COLUMN formation_type text CHECK (formation_type IN ('offense', 'defense')),
ADD COLUMN coverage text,
ADD COLUMN personnel_package text,
ADD COLUMN is_blitz boolean DEFAULT false,
ADD COLUMN situation text[];

-- Create defensive formation stats table
CREATE TABLE formation_stats (
  id uuid default uuid_generate_v4() primary key,
  formation_id uuid references formations(id) not null,
  success_rate decimal,
  yards_allowed decimal,
  turnover_rate decimal,
  pressure_rate decimal,
  usage_situations text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Key Features

1. **Smart Formation Selection**
   - Separate offense/defense formation management
   - Recent formations prioritized by type
   - Live search with fuzzy matching
   - Visual preview on hover
   - Quick creation workflow
   - Default formation flagging
   - Defense-specific filters:
     * Coverage type (Man, Zone, Mixed)
     * Personnel packages (4-3, 3-4, Nickel, Dime, etc.)
     * Blitz packages
     * Situational formations (Red Zone, 3rd Down, etc.)

2. **Play Variations**
   - Create variations from any play
   - Track specific changes
   - Visual diff comparison
   - Maintain relationship hierarchy
   - Batch variation creation

3. **Usage Analytics**
   - Track formation popularity
   - Monitor variation success
   - Identify common modifications
   - Usage-based suggestions

4. **Performance Optimizations**
   - Lazy load previews
   - Cached recent items
   - Debounced search
   - Virtualized lists
   - Preloaded defaults

## Database Schema (Supabase)

### Tables

#### users
```sql
create table users (
  id uuid references auth.users primary key,
  email text unique,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

#### playbooks
```sql
create table playbooks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_public boolean default false
);
```

#### formations
```sql
create table formations (
  id uuid default uuid_generate_v4() primary key,
  playbook_id uuid references playbooks(id) not null,
  name text not null,
  player_positions jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

#### plays
```sql
create table plays (
  id uuid default uuid_generate_v4() primary key,
  playbook_id uuid references playbooks(id) not null,
  formation_id uuid references formations(id) not null,
  name text not null,
  description text,
  offensive_players jsonb not null,
  defensive_players jsonb,
  routes jsonb not null,
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

#### tags
```sql
create table tags (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

#### play_tags
```sql
create table play_tags (
  play_id uuid references plays(id) not null,
  tag_id uuid references tags(id) not null,
  primary key (play_id, tag_id)
);
```

## Core Components

### 1. Field Component (`src/components/Field.tsx`)
```typescript
interface FieldProps {
  width: number;
  height: number;
  gridVisible: boolean;
  onFieldClick?: (coords: Coordinates) => void;
}

const Field: React.FC<FieldProps> = ({ width, height, gridVisible, onFieldClick }) => {
  const yardToPixel = useCallback((coords: Coordinates): Coordinates => {
    // Convert yard coordinates to pixel coordinates
  });

  const pixelToYard = useCallback((coords: Coordinates): Coordinates => {
    // Convert pixel coordinates to yard coordinates
  });

  return (
    <Layer>
      <Rect width={width} height={height} fill="green" />
      {gridVisible && <GridLines />}
      {/* Field markings */}
    </Layer>
  );
};
```

### 2. Player Component (`src/components/Player.tsx`)
```typescript
interface PlayerProps {
  id: string;
  type: PlayerType;
  position: Coordinates;
  number: string;
  color: string;
  isSelected: boolean;
  onSelect?: (id: string) => void;
  onMove?: (id: string, newPos: Coordinates) => void;
}

const Player: React.FC<PlayerProps> = ({
  id, type, position, number, color, isSelected, onSelect, onMove
}) => {
  return (
    <Group
      draggable
      onDragEnd={(e) => onMove?.(id, { x: e.target.x(), y: e.target.y() })}
      onClick={() => onSelect?.(id)}
    >
      <Circle /* Player styling */ />
      <Text /* Player number */ />
    </Group>
  );
};
```

### 3. Route Component (`src/components/Route.tsx`)
```typescript
interface RouteProps {
  id: string;
  points: Coordinates[];
  type: RouteType;
  color: string;
  isDrawing: boolean;
  onPointAdded?: (point: Coordinates) => void;
  onComplete?: () => void;
}

const Route: React.FC<RouteProps> = ({
  points, type, color, isDrawing, onPointAdded, onComplete
}) => {
  return (
    <Line
      points={points.flatMap(p => [p.x, p.y])}
      stroke={color}
      strokeWidth={2}
      onClick={isDrawing ? undefined : onComplete}
    />
  );
};
```

### 4. Store and State Management (`src/store/playStore.ts`)
```typescript
interface PlayState {
  currentMode: Mode;
  selectedPlayer: string | null;
  players: Record<string, Player>;
  routes: Record<string, Route>;
  currentFormation: Formation | null;
  
  setMode: (mode: Mode) => void;
  selectPlayer: (playerId: string) => void;
  addPlayer: (type: PlayerType, position: Coordinates) => void;
  removePlayer: (playerId: string) => void;
  startRoute: (playerId: string) => void;
  completeRoute: () => void;
  savePlay: () => Promise<void>;
  loadPlay: (playId: string) => Promise<void>;
}

const usePlayStore = create<PlayState>((set, get) => ({
  // State implementation with Zustand
}));
```

## UI Components

### 1. Toolbar Component (`src/components/Toolbar/index.tsx`)
```typescript
interface ToolbarProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
  onSave: () => Promise<void>;
  onLoad: () => void;
}

const Toolbar: React.FC<ToolbarProps> = () => {
  return (
    <div className="flex gap-4 p-4 bg-gray-800 text-white">
      <ModeSelector />
      <PlayerTypeSelector />
      <RouteTypeSelector />
      <ColorPicker />
      <FormationControls />
      <PlayControls />
    </div>
  );
};
```

### 2. Canvas Component (`src/components/Canvas/index.tsx`)
```typescript
interface CanvasProps {
  width: number;
  height: number;
}

const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const store = usePlayStore();
  
  return (
    <Stage width={width} height={height}>
      <Layer>
        <Field />
        <PlayersLayer />
        <RoutesLayer />
        {store.currentMode === 'drawRoute' && <RouteDrawingLayer />}
      </Layer>
    </Stage>
  );
};
```

### 3. Hooks and Event Handlers (`src/hooks/useCanvasEvents.ts`)
```typescript
interface CanvasEvents {
  onPlayerDrag: (id: string, pos: Coordinates) => void;
  onRoutePoint: (point: Coordinates) => void;
  onFieldClick: (point: Coordinates) => void;
}

const useCanvasEvents = (): CanvasEvents => {
  const store = usePlayStore();

  const handleFieldClick = useCallback((point: Coordinates) => {
    switch (store.currentMode) {
      case 'addPlayer':
        store.addPlayer(store.currentPlayerType, point);
        break;
      case 'drawRoute':
        store.addRoutePoint(point);
        break;
    }
  }, [store.currentMode]);

  return {
    onPlayerDrag: store.movePlayer,
    onRoutePoint: store.addRoutePoint,
    onFieldClick: handleFieldClick,
  };
};
```

## Constants and Types

### Configuration (`src/config/constants.ts`)
```typescript
export const FIELD_CONFIG = {
  dimensions: {
    width: 1000,
    height: 569,
    pixelsPerYard: 18.75, // 1000px / 53.3 yards
  },
  hashMarks: {
    left: 333,  // 1000px * (1/3)
    right: 667, // 1000px * (2/3)
  },
  yardLines: {
    start: 100,  // 10-yard buffer
    end: 900,    // Field width - 10-yard buffer
  },
} as const;

export const PLAYER_CONFIG = {
  radius: 15,
  fontSize: 20,
  clickRadius: 22.5,
} as const;

export type Mode =
  | 'select'
  | 'addOffense'
  | 'addDefense'
  | 'addOLine'
  | 'drawRoute';

export type LineType = 'plain' | 'arrow' | 'block';

export type PlayerType = 'offense' | 'defense' | 'oline';

export interface Coordinates {
  x: number;
  y: number;
}
```

## Implementation Phases

### Phase 1: Project Foundation
1. Initialize React + TypeScript project with Vite
2. Configure ESLint, Prettier, and TypeScript
3. Set up Tailwind CSS and design system
4. Implement Husky for git hooks
5. Configure testing environment (Vitest + RTL)

### Phase 2: Authentication & Data Layer
1. Set up Supabase client with type generation
2. Implement authentication hooks and context
3. Create database hooks (useQuery pattern)
4. Set up row-level security policies
5. Implement real-time subscriptions

### Phase 3: Canvas Infrastructure
1. Set up React-Konva structure
2. Implement responsive canvas container
3. Create coordinate system utilities
4. Set up field grid and markings
5. Implement basic event handling

### Phase 4: State Management
1. Set up Zustand store
2. Implement core state slices
3. Create action creators
4. Set up persistence middleware
5. Implement undo/redo system

### Phase 5: Core Components
1. Create Field component
2. Implement Player components
3. Build Route system
4. Create Formation templates
5. Implement drag-and-drop system

### Phase 6: UI and Controls
1. Build Toolbar component
2. Implement mode system
3. Create color picker
4. Build formation manager
5. Implement play controls

### Phase 7: Data Synchronization
1. Implement save/load system
2. Create formation templates
3. Set up real-time collaboration
4. Implement conflict resolution
5. Add offline support

### Phase 8: Performance & Polish
1. Implement React.memo and useMemo optimizations
2. Add loading states and error boundaries
3. Implement responsive design
4. Add keyboard shortcuts
5. Create onboarding tour

## Testing Strategy

### Unit Tests (Vitest)
```typescript
// Example test structure
describe('Store Tests', () => {
  it('should handle player movement', () => {
    const store = usePlayStore();
    store.movePlayer('player1', { x: 100, y: 100 });
    expect(store.getState().players['player1'].position)
      .toEqual({ x: 100, y: 100 });
  });
});
```

### Component Tests (React Testing Library)
```typescript
describe('Player Component', () => {
  it('should render and handle selection', () => {
    const onSelect = vi.fn();
    render(<Player id="1" position={{ x: 0, y: 0 }} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByTestId('player-1'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
```

### Integration Tests
- Component interaction testing
  - Player-Route connections

## Future Enhancements

### Phase 2: AI-Powered Analysis

1. **Computer Vision Integration**
   - Convert game film into digital plays
   - Automatically detect formations
   - Track player routes and timing
   - Match formations to similar ones in our database

2. **Play Analysis Engine**
   - Predict play success probability
   - Analyze offensive vs defensive matchups
   - Identify field vulnerabilities
   - Suggest tactical adjustments

3. **Natural Language Processing**
   - Generate play descriptions
   - Enable voice-controlled play design
   - Natural language play search
   - Voice command recognition

### Phase 3: Advanced Features

1. **Mobile App**
   - iOS and Android support
   - Tablet-optimized interface
   - Offline play viewing
   - Quick formation adjustments

2. **Team Collaboration**
   - Real-time collaborative editing
   - Comment and annotation system
   - Role-based permissions
   - Version control for plays

3. **Game Day Tools**
   - Play calling assistance
   - Situation-based suggestions
   - Quick access play sheets
   - In-game statistics tracking
  - Toolbar-Canvas communication
  - State updates across components
- Supabase integration
  - Real-time subscriptions
  - Authentication flow
  - Data persistence

### End-to-End Tests (Playwright)
```typescript
test('complete play creation flow', async ({ page }) => {
  await page.goto('/playbook');
  await page.click('[data-testid=add-player-btn]');
  await page.click('[data-testid=canvas]', { position: { x: 100, y: 100 } });
  
  // Verify player placement
  expect(await page.locator('[data-testid=player]').count()).toBe(1);
});
```

## Performance Requirements
- Initial load time < 2 seconds
- Canvas operations < 16ms (60fps)
- Save operation < 1 second
- Load operation < 500ms

## Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Security Considerations
1. Authentication using Supabase Auth
2. Row Level Security (RLS) policies
3. Input validation
4. CORS configuration
5. Content Security Policy

## Monitoring and Analytics
1. Error tracking
2. Performance monitoring
3. Usage analytics
4. User feedback system

## Documentation Requirements
1. API documentation
2. Component documentation
3. User guide
4. Developer guide
5. Deployment guide

## Future Considerations
1. Team collaboration features
2. Play animation
3. Video export
4. Mobile app
5. API access for third-party integration

## Success Metrics
1. User engagement
2. Performance metrics
3. Error rates
4. User satisfaction
5. Feature adoption rates
