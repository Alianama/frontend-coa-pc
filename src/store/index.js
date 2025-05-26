import { configureStore } from "@reduxjs/toolkit";
import authUserReducer from "./authUser/reducer";
import isPreloadReducer from "./isPreload/reducer";
import {
  loadingBarReducer,
  loadingBarMiddleware,
} from "react-redux-loading-bar";
import coaReducer from "./coa/reducer";
import usersReducer from "./users/reducer";

export const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    isPreload: isPreloadReducer,
    coa: coaReducer,
    loadingBar: loadingBarReducer,
    allUsers: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
    }).concat(loadingBarMiddleware()),
});

export default store;
