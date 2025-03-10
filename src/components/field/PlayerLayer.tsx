import { Circle, Group, Line, Rect, Text, RegularPolygon } from 'react-konva';
import React, { useState } from 'react';
import { useToolState } from '../../store/toolState';
import { LOS_Y_POSITION, GRID_SIZE, GRID_SNAP_THRESHOLD } from './Field';

interface PlayerLayerProps {
  width: number;
  height: number;
}

export function PlayerLayer({ width, height }: PlayerLayerProps) {
  const { currentTool, editingState, addAction, gridEnabled, alignmentGuidesEnabled, history, currentIndex } = useToolState();
  const [alignmentGuides, setAlignmentGuides] = useState<{ x?: number, y?: number }>({});
  const [hoveredPlayer, setHoveredPlayer] = useState<any>(null);
  
  // Constants for player dimensions
  const PLAYER_RADIUS = width * 0.013; // 1.3% of field width
  const DEFENSE_RADIUS_MULTIPLIER = 1.3; // Visual adjustment for triangle size relative to circles
  
  // Function to snap a position to the nearest grid point
  const snapToGrid = (position: { x: number, y: number }): { x: number, y: number } => {
    if (!gridEnabled) return position;
    
    // Calculate the nearest grid point
    const snappedX = Math.round(position.x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(position.y / GRID_SIZE) * GRID_SIZE;
    
    // Only snap if the cursor is within the snap threshold
    const snapX = Math.abs(position.x - snappedX) <= GRID_SNAP_THRESHOLD ? snappedX : position.x;
    const snapY = Math.abs(position.y - snappedY) <= GRID_SNAP_THRESHOLD ? snappedY : position.y;
    
    return { x: snapX, y: snapY };
  };
  
  // Function to generate alignment guides based on other players
  const getAlignmentGuides = (player: any, allPlayers: any[]): { x?: number, y?: number } => {
    if (!alignmentGuidesEnabled) return {};
    
    const guides = { x: undefined, y: undefined };
    const threshold = GRID_SNAP_THRESHOLD;
    
    // Filter out the current player from the list
    const otherPlayers = allPlayers.filter(p => p !== player);
    
    // Find horizontal (x) alignments
    for (const otherPlayer of otherPlayers) {
      if (Math.abs(player.y() - otherPlayer.y()) < threshold) {
        guides.y = otherPlayer.y();
        break;
      }
    }
    
    // Find vertical (y) alignments
    for (const otherPlayer of otherPlayers) {
      if (Math.abs(player.x() - otherPlayer.x()) < threshold) {
        guides.x = otherPlayer.x();
        break;
      }
    }
    
    return guides;
  };
  
  const isValidPosition = (y: number, type: string): boolean => {
    const losY = height * LOS_Y_POSITION;
    
    // Add a small buffer (0.2% of height) to prevent edge cases
    const buffer = height * 0.002;
    
    // Use player radius to prevent edge from crossing LOS
    // For triangle shapes, the radius is the distance from center to corner
    
    // Offensive players must keep edge below LOS
    if ((type === 'offense' || type === 'oline') && y - PLAYER_RADIUS < losY + buffer) {
      return false;
    }
    
    // Defensive players must keep edge above LOS
    if (type === 'defense' && y + PLAYER_RADIUS > losY - buffer) {
      return false;
    }
    
    return true;
  };

  // Function to place offensive linemen in a row
  const placeOffensiveLine = (centerX: number, y: number) => {
    // Calculate spacing based on edge-to-edge distance
    // Use a small gap between players (20% of radius) based on screenshot
    const gapBetweenPlayers = PLAYER_RADIUS * 0.2;
    
    // Total distance from center to center = (radius of player 1) + gap + (radius of player 2)
    // For same-sized players: center-to-center = 2*PLAYER_RADIUS + gap
    const spacing = 2 * PLAYER_RADIUS + gapBetweenPlayers;
    
    // Calculate positions for 5 offensive linemen
    const positions = [
      { x: centerX - spacing * 2, y }, // Left Tackle
      { x: centerX - spacing, y },     // Left Guard
      { x: centerX, y },               // Center
      { x: centerX + spacing, y },     // Right Guard
      { x: centerX + spacing * 2, y }  // Right Tackle
    ];
    
    console.log('Placing 5 offensive linemen at positions:', positions);
    
    // Add all 5 offensive linemen
    positions.forEach((pos, index) => {
      addAction(
        'PLAYER_ADD',
        {
          type: 'oline',
          x: pos.x,
          y: pos.y,
          radius: PLAYER_RADIUS,
          position: index // 0-4 representing LT, LG, C, RG, RT
        },
        { position: { x: pos.x, y: pos.y } }
      );
    });
  };

  const handleClick = (e: any) => {
    console.log('Click event:', e);
    console.log('Current tool:', currentTool);
    
    const stage = e.target.getStage();
    console.log('Stage:', stage);
    
    const point = stage.getPointerPosition();
    console.log('Click position:', point);

    // Handle remove tool - find and remove clicked player
    if (currentTool === 'remove') {
      console.log('Remove tool active, checking for player intersection');
      
      // Check if click intersects with a player
      const clickedNode = stage.getIntersection(point);
      console.log('Clicked node:', clickedNode);
      
      // If we clicked a player (Circle), remove it
      if (clickedNode && clickedNode.getClassName() === 'Circle') {
        const player = clickedNode;
        console.log('Player to remove:', player);
        
        // Add delete action to history for undo/redo support
        addAction(
          'PLAYER_DELETE',
          {
            id: player.id(),
            type: player.attrs.playerType,
            x: player.x(),
            y: player.y(),
            radius: player.radius()
          },
          { position: { x: player.x(), y: player.y() } }
        );
        
        console.log('Player removed:', player.id());
        return;
      }
      
      console.log('No player found at click position');
      return;
    }
    
    // Exit if not using a player placement tool
    if (currentTool !== 'offense' && currentTool !== 'defense' && currentTool !== 'oline') {
      console.log('Tool not for player placement, exiting handler');
      return;
    }
    
    // Apply grid snapping if enabled
    const snappedPoint = snapToGrid(point);
    console.log('Snapped position:', snappedPoint);

    // Validate position before adding player
    const isValid = isValidPosition(snappedPoint.y, currentTool);
    console.log('Position valid:', isValid);
    
    if (!isValid) return;
    
    // Special handling for offensive line - place 5 players at once
    if (currentTool === 'oline') {
      placeOffensiveLine(snappedPoint.x, snappedPoint.y);
      return;
    }
    
    // Regular player placement for offense and defense
    console.log('Adding player action to state');
    addAction(
      'PLAYER_ADD',
      {
        type: currentTool,
        x: snappedPoint.x,
        y: snappedPoint.y,
        radius: PLAYER_RADIUS
      },
      { position: { x: snappedPoint.x, y: snappedPoint.y } }
    );
    
    console.log('Current history after adding:', history);
    console.log('Current index after adding:', currentIndex);
  };

  const handleDragStart = (e: any) => {
    const player = e.target;
    // Store initial position
    player.attrs.lastY = player.y();
  };

  const handleDragMove = (e: any) => {
    const player = e.target;
    const type = player.attrs.playerType;
    
    // Get all players from the stage
    const stage = player.getStage();
    const playerNodes = stage.find('Circle');
    
    // Apply grid snapping if enabled and shift key is not pressed
    // Shift key allows free movement (fine control)
    if (gridEnabled && !e.evt.shiftKey) {
      const snappedPosition = snapToGrid({ x: player.x(), y: player.y() });
      player.position(snappedPosition);
    }
    
    // Apply alignment guides if enabled and alt key is not pressed
    // Alt key disables alignment guides temporarily
    if (alignmentGuidesEnabled && !e.evt.altKey) {
      const guides = getAlignmentGuides(player, playerNodes);
      
      // Apply the alignment if found
      if (guides.x !== undefined) player.x(guides.x);
      if (guides.y !== undefined) player.y(guides.y);
      
      // Update the guides state to render visual guides
      setAlignmentGuides(guides);
    } else {
      setAlignmentGuides({});
    }
    
    // Validate new position
    if (!isValidPosition(player.y(), type)) {
      // Reset to last valid position
      player.y(player.attrs.lastY);
      return;
    }
    
    // Store last valid position
    player.attrs.lastY = player.y();
  };

  const handleDragEnd = (e: any) => {
    const player = e.target;
    // Clear alignment guides
    setAlignmentGuides({});
    // Add move action to history
    addAction(
      'PLAYER_MOVE',
      {
        id: player.id(),
        type: player.attrs.playerType,
        x: player.x(),
        y: player.y(),
        radius: player.attrs.playerType === 'defense' ? 
          player.radius() / DEFENSE_RADIUS_MULTIPLIER : player.radius() // Store original radius
      },
      { position: { x: player.x(), y: player.y() } }
    );
  };

  // Render alignment guides
  const renderAlignmentGuides = () => {
    if (!alignmentGuidesEnabled) return null;
    
    const guides = [];
    
    if (alignmentGuides.x !== undefined) {
      guides.push(
        <Line
          key="guide-x"
          points={[alignmentGuides.x, 0, alignmentGuides.x, height]}
          stroke="#00FF00" // Green color
          strokeWidth={1}
          dash={[5, 5]} // Dashed line
        />
      );
    }
    
    if (alignmentGuides.y !== undefined) {
      guides.push(
        <Line
          key="guide-y"
          points={[0, alignmentGuides.y, width, alignmentGuides.y]}
          stroke="#00FF00" // Green color
          strokeWidth={1}
          dash={[5, 5]} // Dashed line
        />
      );
    }
    
    return guides;
  };
  
  // Handle mouse over player (for potential hover effects)
  const handleMouseOver = (e: any) => {
    setHoveredPlayer(e.target);
  };
  
  // Handle mouse out
  const handleMouseOut = () => {
    setHoveredPlayer(null);
  };

  // Extract current players from history
  const renderPlayers = () => {
    console.log('Rendering players from history:', history);
    console.log('Current index:', currentIndex);
    
    // Get players from history up to the current index
    const playerActions = history
      .slice(0, currentIndex + 1)
      .filter(action => 
        action.type === 'PLAYER_ADD' || 
        action.type === 'PLAYER_MOVE' ||
        action.type === 'PLAYER_DELETE'
      );
    
    console.log('Player actions found:', playerActions);
    
    // Create a map of the latest player positions
    const playerMap = new Map();
    
    // Process player actions to get the latest state of each player
    playerActions.forEach(action => {
      console.log('Processing action:', action);
      
      if (action.type === 'PLAYER_ADD') {
        // Add new player with an ID
        const playerId = action.payload.id || action.id;
        console.log('Adding player with ID:', playerId);
        
        playerMap.set(playerId, {
          ...action.payload,
          id: playerId
        });
      } else if (action.type === 'PLAYER_MOVE') {
        // Update existing player position
        console.log('Moving player with ID:', action.payload.id);
        
        playerMap.set(action.payload.id, {
          ...action.payload
        });
      } else if (action.type === 'PLAYER_DELETE') {
        // Remove player from map when deleted
        console.log('Deleting player with ID:', action.payload.id);
        playerMap.delete(action.payload.id);
      }
    });
    
    console.log('Final player map:', playerMap);
    
    // Convert map to array and render players
    const players = Array.from(playerMap.values());
    console.log('Players to render:', players);
    
    return players.map(player => {
      console.log('Rendering player:', player);
      
      // Position info is still tracked in state but labels are removed per user request
      
      return (
        <React.Fragment key={player.id}>
          {player.type === 'defense' ? (
            <RegularPolygon
              id={player.id}
              x={player.x}
              y={player.y}
              sides={3}
              radius={(player.radius || PLAYER_RADIUS) * DEFENSE_RADIUS_MULTIPLIER} /* Display-only multiplier */
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth={2}
              rotation={180} /* Point the triangle apex towards LOS */
              draggable={true}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={(e) => {
                // Handle player click based on current tool
                if (currentTool === 'remove') {
                  // Add delete action to history for undo/redo support
                  addAction(
                    'PLAYER_DELETE',
                    {
                      id: e.target.id(),
                      type: e.target.attrs.playerType,
                      x: e.target.x(),
                      y: e.target.y(),
                      radius: e.target.radius() / DEFENSE_RADIUS_MULTIPLIER // Store normalized radius
                    },
                    { position: { x: e.target.x(), y: e.target.y() } }
                  );
                  console.log('Player removed:', e.target.id());
                }
              }}
              // Store custom data in attrs for event handlers to access
              attrs={{
                playerType: player.type,
                playerPosition: player.position
              }}
            />
          ) : (
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
              onClick={(e) => {
                // Handle player click based on current tool
                if (currentTool === 'remove') {
                  // Add delete action to history for undo/redo support
                  addAction(
                    'PLAYER_DELETE',
                    {
                      id: e.target.id(),
                      type: e.target.attrs.playerType,
                      x: e.target.x(),
                      y: e.target.y(),
                      radius: e.target.radius()
                    },
                    { position: { x: e.target.x(), y: e.target.y() } }
                  );
                  console.log('Player removed:', e.target.id());
                }
              }}
              // Store custom data in attrs for event handlers to access
              attrs={{
                playerType: player.type,
                playerPosition: player.position
              }}
            />
          )}
        </React.Fragment>
      );
    });
  };

  // Create a transparent overlay for capturing clicks
  // This ensures clicks are properly captured across the entire field
  return (
    <Group>
      {/* Transparent overlay to capture clicks */}
      <Rect
        width={width}
        height={height}
        fill="transparent"
        onMouseDown={handleClick}
        onTouchStart={handleClick}
        perfectDrawEnabled={false}
      />
      
      {/* Alignment guides */}
      {renderAlignmentGuides()}
      
      {/* Players rendered from state */}
      <Group
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        {renderPlayers()}
      </Group>
    </Group>
  );
}
