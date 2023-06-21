// Import action type
import {
  SET_SELECTED_EPISODE
} from "./playerActionTypes";

/**
 * Action creator for setting the selected episode
 * @param {any} episode - The selected episode
 * @returns {Object} - Action object
 */
export const setSelectedEpisode = (episode) => ({
  // Action type: SET_SELECTED_EPISODE
  type: SET_SELECTED_EPISODE,
  // Payload: the selected episode
  payload: episode
});

