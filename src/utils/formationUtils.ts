import { Action } from '../store/toolState'

/**
 * Extracts the current player positions from the action history
 * @param history Array of actions from toolState
 * @param currentIndex Current index in the history
 * @returns Array of player positions
 */
export function extractPlayersFromHistory(history: Action[], currentIndex: number) {
  return history
    .slice(0, currentIndex + 1)
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
}
