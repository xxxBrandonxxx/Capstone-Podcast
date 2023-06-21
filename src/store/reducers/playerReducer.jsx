// Import action type
import {
  SET_SELECTED_EPISODE
} from "../actions/playerActionTypes";

// Initial state for the player reducer
const initialState = {
  // Holds the currently selected episode
  selectedEpisode: null
};

/**
 * Reducer function for the player state
 * @param {Object} state - Current state
 * @param {Object} action - Action object
 * @returns {Object} - Updated state
 */
const playerReducer = (state = initialState, action) => {
  // Determine which action type is being performed
  switch (action.type) {
    // Action type: SET_SELECTED_EPISODE
    case SET_SELECTED_EPISODE:
      // Return updated state with selected episode set to the payload value
      return {
        ...state,
        // Update the selected episode
        selectedEpisode: action.payload
      };
    // Default case: return the current state
    default:
      // No action performed, return the current state
      return state;
  }
};

// Export the player reducer as the default export
export default playerReducer;
