import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./reducers/playerReducer";

const store = configureStore({
  reducer: {
    player: playerReducer,
  },
});

export default store;
