# DL-OL Alignment Display System

## Overview
This document outlines the implementation plan for adding defensive line (DL) alignment indicators on offensive line (OL) players. This feature will allow coaches to precisely indicate how defensive linemen are positioned relative to offensive linemen - a critical aspect of football strategy that most playbook software fails to represent properly.

## Football Context
In football, defensive linemen align themselves in specific positions relative to offensive linemen:

1. **Head-up (0-technique)**: DL is directly in front of OL
2. **Inside shoulder (i-technique)**: DL is aligned to the inside shoulder of OL
3. **Outside shoulder (o-technique)**: DL is aligned to the outside shoulder of OL

These alignments are crucial for:
- Determining gap responsibilities
- Setting up stunts and twists
- Establishing defensive fronts (Over, Under, Even, Odd)
- Communicating defensive strategy

## Technical Implementation

### 1. Data Model Extensions

```typescript
// New enum for alignment types
enum DLAlignmentType {
  NONE = 'none',
  HEAD_UP = 'headup',
  INSIDE = 'inside',
  OUTSIDE = 'outside'
}

// New interface for alignment relationship
interface DLAlignment {
  dlPlayerId: string;      // ID of the defensive player
  alignmentType: DLAlignmentType;
}

// Extension to Player interface for OL players
interface Player {
  // Existing fields...
  id: string;
  type: string;
  x: number;
  y: number;
  radius: number;
  
  // New fields
  dlAlignments?: DLAlignment[];  // Array of alignments (multiple DL can align to one OL)
}
```

### 2. State Management

```typescript
// In toolState.ts - Add new action types
const PLAYER_SET_ALIGNMENT = 'PLAYER_SET_ALIGNMENT';
const PLAYER_REMOVE_ALIGNMENT = 'PLAYER_REMOVE_ALIGNMENT';

// Add new reducer handlers
case PLAYER_SET_ALIGNMENT: {
  const { olId, dlId, alignmentType } = action.payload;
  
  // Find the current state of the OL player
  const playerActions = history
    .slice(0, currentIndex + 1)
    .filter(a => 
      (a.type === 'PLAYER_ADD' || a.type === 'PLAYER_MOVE') && 
      a.payload.id === olId
    );
  
  if (playerActions.length === 0) return state;
  
  // Get the latest state of this player
  const latestAction = playerActions[playerActions.length - 1];
  const olPlayer = {...latestAction.payload};
  
  // Update alignments array
  const existingAlignments = olPlayer.dlAlignments || [];
  const existingAlignmentIndex = existingAlignments.findIndex(a => a.dlPlayerId === dlId);
  
  let updatedAlignments;
  if (existingAlignmentIndex >= 0) {
    // Update existing alignment
    updatedAlignments = [...existingAlignments];
    updatedAlignments[existingAlignmentIndex] = {
      dlPlayerId: dlId,
      alignmentType
    };
  } else {
    // Add new alignment
    updatedAlignments = [
      ...existingAlignments,
      { dlPlayerId: dlId, alignmentType }
    ];
  }
  
  // Create a new action that merges the previous state with the updated alignments
  const updatedAction = {
    ...latestAction,
    payload: {
      ...olPlayer,
      dlAlignments: updatedAlignments
    }
  };
  
  // Replace the latest action for this player with our updated one
  const newHistory = [...history];
  newHistory[history.indexOf(latestAction)] = updatedAction;
  
  return {
    ...state,
    history: newHistory
  };
}
```

### 3. UI Implementation

#### 3.1 Visual Indicators on OL

Each OL player will display alignment indicators based on the DL players aligned to them:

```typescript
// In PlayerLayer.tsx - Extend the Circle component for OL players

// Helper to render alignment indicators
const renderAlignmentIndicators = (player) => {
  if (!player.dlAlignments || player.dlAlignments.length === 0) return null;
  
  return player.dlAlignments.map((alignment, index) => {
    const { dlPlayerId, alignmentType } = alignment;
    
    // Base props for all indicators
    const baseProps = {
      key: `alignment-${dlPlayerId}-${index}`,
      x: 0,
      y: 0,
      fill: '#555555', // Medium gray color
      opacity: 0.7
    };
    
    switch(alignmentType) {
      case 'headup':
        // Vertical line down the middle
        return (
          <Line
            {...baseProps}
            points={[0, -player.radius, 0, player.radius]}
            stroke="#000000"
            strokeWidth={2}
          />
        );
        
      case 'inside':
        // Fill the inside half of the circle
        return (
          <Arc
            {...baseProps}
            angle={180}
            rotation={270} // Positions on inside half (toward center)
            innerRadius={0}
            outerRadius={player.radius}
          />
        );
        
      case 'outside':
        // Fill the outside half of the circle
        return (
          <Arc
            {...baseProps}
            angle={180}
            rotation={90} // Positions on outside half (away from center)
            innerRadius={0}
            outerRadius={player.radius}
          />
        );
        
      default:
        return null;
    }
  });
};

// Updated Circle rendering for OL players
{player.type === 'oline' && (
  <Group key={player.id}>
    <Circle
      id={player.id}
      x={player.x}
      y={player.y}
      radius={player.radius || PLAYER_RADIUS}
      fill="#FFFFFF"
      stroke="#000000"
      strokeWidth={2}
      draggable={true}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={handlePlayerClick}
      // Store custom data
      attrs={{
        playerType: player.type,
        playerPosition: player.position,
        dlAlignments: player.dlAlignments || []
      }}
    />
    {/* Add alignment indicators as children in the group */}
    {renderAlignmentIndicators(player)}
  </Group>
)}
```

#### 3.2 Alignment Tool in Toolbar

Add a new tool option for setting DL alignments:

```typescript
// In ToolBar.tsx
<ToolButton 
  icon={<AlignmentIcon />} 
  active={currentTool === 'dl-align'} 
  onClick={() => setCurrentTool('dl-align')}
  tooltip="Set DL Alignment"
/>
```

#### 3.3 Alignment Interaction Flow

1. User selects "DL Align" tool
2. User clicks on a DL player to select it
3. Eligible OL players highlight with a glow effect
4. User clicks on an OL player to establish a relationship
5. A contextual menu appears with alignment options:
   - Head-up
   - Inside shoulder
   - Outside shoulder
   - Remove alignment
6. User selects an option to set the alignment type

```typescript
// In PlayerLayer.tsx - Handle DL alignment tool interactions
const handlePlayerClick = (e) => {
  if (currentTool !== 'dl-align') return;
  
  const player = e.target;
  const playerType = player.attrs.playerType;
  
  if (!selectedDL && playerType === 'defense') {
    // First click - select a DL
    setSelectedDL(player);
    highlightEligibleOL(true);
    return;
  }
  
  if (selectedDL && playerType === 'oline') {
    // Second click - select an OL
    const olPlayer = player;
    
    // Show alignment options modal/flyout
    setAlignmentTarget(olPlayer);
    setShowAlignmentOptions(true);
    return;
  }
  
  // Reset selection if clicking elsewhere
  setSelectedDL(null);
  highlightEligibleOL(false);
};

// Handle alignment option selection
const setAlignment = (alignmentType) => {
  if (!selectedDL || !alignmentTarget) return;
  
  // Add alignment to state via action
  addAction(
    'PLAYER_SET_ALIGNMENT',
    {
      olId: alignmentTarget.id(),
      dlId: selectedDL.id(),
      alignmentType
    }
  );
  
  // Reset UI state
  setSelectedDL(null);
  setAlignmentTarget(null);
  setShowAlignmentOptions(false);
  highlightEligibleOL(false);
};
```

### 4. Formation Detection & Analysis

One powerful feature will be automatic detection of defensive fronts based on alignments:

```typescript
const detectDefensiveFront = (players) => {
  // Extract OL and DL players
  const olPlayers = players.filter(p => p.type === 'oline');
  const dlPlayers = players.filter(p => p.type === 'defense');
  
  // No analysis possible without enough players
  if (olPlayers.length < 5 || dlPlayers.length < 3) return 'Unknown';
  
  // Map OL positions (LT, LG, C, RG, RT) to their alignments
  const positionMap = {
    0: { position: 'LT', alignments: [] },
    1: { position: 'LG', alignments: [] },
    2: { position: 'C', alignments: [] },
    3: { position: 'RG', alignments: [] },
    4: { position: 'RT', alignments: [] }
  };
  
  // Populate the position map with alignment data
  olPlayers.forEach(ol => {
    if (ol.position !== undefined && ol.dlAlignments) {
      positionMap[ol.position].alignments = ol.dlAlignments;
    }
  });
  
  // Analyze for common fronts
  
  // 4-3 Over Front: 3-technique on strong side (usually right) guard, 1-technique on weak side
  const isOver = 
    hasAlignmentType(positionMap[3], 'outside') &&  // 3-tech on RG
    hasAlignmentType(positionMap[1], 'inside');     // 1-tech on LG
  
  // 4-3 Under Front: 3-technique on weak side guard, 1-technique on strong side
  const isUnder = 
    hasAlignmentType(positionMap[1], 'outside') &&  // 3-tech on LG
    hasAlignmentType(positionMap[3], 'inside');     // 1-tech on RG
  
  // Even Front: Symmetrical alignment (4-4, 4-2-5, etc.)
  const isEven = 
    (hasAlignmentType(positionMap[2], 'inside') &&   // DL on both sides of center
     hasAlignmentType(positionMap[2], 'outside')) || 
    (hasAlignmentType(positionMap[1], 'outside') &&  // Or on both guards
     hasAlignmentType(positionMap[3], 'outside'));
  
  if (isOver) return '4-3 Over';
  if (isUnder) return '4-3 Under';
  if (isEven) return 'Even Front';
  
  return 'Custom Front';
};

// Helper function to check for alignment type
const hasAlignmentType = (positionData, alignmentType) => {
  return positionData.alignments.some(a => a.alignmentType === alignmentType);
};
```

### 5. Saving & Loading

Extend the play data structure to include alignment information:

```typescript
// When saving a play
const serializePlay = (history) => {
  // Extract the latest state of all players
  const playerMap = new Map();
  
  history.filter(action => 
    action.type === 'PLAYER_ADD' || 
    action.type === 'PLAYER_MOVE' ||
    action.type === 'PLAYER_DELETE' ||
    action.type === 'PLAYER_SET_ALIGNMENT'
  ).forEach(action => {
    // Process each action to build the current state
    // [existing code]
  });
  
  // Convert to serializable array with all properties preserved
  return Array.from(playerMap.values());
};

// When loading a play
const deserializePlay = (playData) => {
  return playData.map(player => {
    // Convert to actions
    return {
      type: 'PLAYER_ADD',
      payload: {
        ...player,
        // Include all player properties including dlAlignments
      }
    };
  });
};
```

## UI/UX Design

### Alignment Options Popup
When a DL is selected and the user clicks on an OL, display a clean, minimal popup with alignment options:

```jsx
const AlignmentOptionsPopup = ({ position, onSelect, onClose }) => (
  <div 
    className="alignment-options-popup" 
    style={{ 
      position: 'absolute', 
      left: position.x + 10, 
      top: position.y - 120
    }}
  >
    <h3>Set Alignment</h3>
    <div className="alignment-buttons">
      <button onClick={() => onSelect('headup')}>
        Head-Up
        <div className="preview headup" />
      </button>
      <button onClick={() => onSelect('inside')}>
        Inside Shoulder
        <div className="preview inside" />
      </button>
      <button onClick={() => onSelect('outside')}>
        Outside Shoulder
        <div className="preview outside" />
      </button>
      <button onClick={() => onSelect('none')} className="remove">
        Remove Alignment
      </button>
    </div>
    <button className="close" onClick={onClose}>Cancel</button>
  </div>
);
```

### Defensive Front Analyzer
Add a panel that automatically analyzes the current defensive front:

```jsx
const DefensiveFrontAnalyzer = ({ players }) => {
  const frontType = detectDefensiveFront(players);
  
  return (
    <div className="defensive-front-analyzer">
      <h3>Defensive Formation</h3>
      <div className="front-type">{frontType}</div>
      {frontType !== 'Unknown' && (
        <div className="front-details">
          {/* Display details specific to the front type */}
        </div>
      )}
    </div>
  );
};
```

## Implementation Phases

### Phase 1: Core Implementation
1. Extend data model for alignments
2. Add state management for alignment actions
3. Implement basic visual indicators 
4. Create alignment tool UI in toolbar

### Phase 2: Enhanced Visualization
1. Improve visual design of alignment indicators
2. Add animations for better feedback
3. Implement highlighting for eligible OL players

### Phase 3: Formation Analysis
1. Add defensive front detection
2. Implement UI for showing formation type
3. Add ability to filter playbook by formation type

## Technical Considerations

### Performance
- Use efficient rendering for alignment indicators
- Implement memoization for complex calculations
- Ensure smooth animation during interactions

### Compatibility
- Support all modern browsers
- Ensure mobile/touch support for tablet usage

### Testing
- Create tests to verify correct alignment interactions
- Validate front detection logic
- Test with varying numbers of players

## Future Enhancements

### Phase 4: Coach Personalization System ("CoachIQ")

#### Personalized Onboarding
Implement a 5-10 step onboarding sequence that collects coach-specific preferences to tailor the application to their coaching philosophy:

1. **Coaching Philosophy Questionnaire**
   - Defensive scheme preference (4-3, 3-4, Multiple, etc.)
   - Offensive system (Spread, Pro-Style, Wing-T, etc.)
   - Level coached (Youth, High School, College, Pro)

2. **Terminology Customization**
   - Collect coach-specific terminology for alignments
   - Allow custom naming of techniques (e.g., 2i, 4i vs. inside shoulder)
   - Capture gap nomenclature preferences

3. **Visual Preference Collection**
   - Color scheme preferences for different positions/units
   - Notation style preferences
   - Diagram density preferences

4. **Implementation Architecture**
   - Store in a dedicated Zustand `coachPreferences` store
   - Persist to local storage initially, sync to Supabase when authenticated
   - Create adapter layer that translates app concepts to coach terminology

#### Dynamic Technique System
Extend the alignment system to support fully customizable techniques:

1. **Customizable Alignment Types**
   - Replace the static enum with a dynamic configuration system
   - Allow coaches to define their own alignment terminology
   - Support numbered techniques (0-9 technique system)

2. **Gap Responsibility Visualization**
   - Add visual indicators for gap responsibilities
   - Shade A/B/C gaps based on defensive alignment
   - Color-code based on primary/secondary responsibilities

3. **AI-Enhanced Front Recognition**
   - Implement pattern matching for common fronts
   - Provide suggestions based on coach's historical preferences
   - Alert when alignments create potential weaknesses

This "CoachIQ" personalization system would transform CoachSync from a football tool into a true extension of each coach's football mind - adapting to their terminology, philosophy, and approach rather than forcing them to adapt to the software.

## Conclusion
This DL-OL alignment feature will significantly enhance CoachSync's value for football coaches by:

1. Providing a level of detail in play design unavailable in other software
2. Enabling precise communication of defensive techniques
3. Supporting automatic recognition of defensive fronts
4. Creating a foundation for future defensive strategy analysis

The initial implementation using standard terminology (inside, head-up, outside) provides immediate value, while the future enhancements with coach personalization will create a truly unique product that adapts to each coach's approach rather than forcing standardization.

This implementation will set CoachSync apart as a true football-specific tool rather than just a generic diagram tool, making it invaluable for serious coaches at all levels of the game.
