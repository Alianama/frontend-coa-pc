import { configureStore } from "@reduxjs/toolkit";
import authUserReducer from "./authUser/reducer";
import isPreloadReducer from "./isPreload/reducer";
import {
  loadingBarReducer,
  loadingBarMiddleware,
} from "react-redux-loading-bar";
import coaReducer from "./coa/reducer";
import usersReducer from "./users/reducer";
import customerReducer from "./customer/reducer";
import productReducer from "./product/reducer";
import printReducer from "./print/reducer";
import planningReducer from "./planning/reducer";
import planningDetailReducer from "./planningDetail/reducer";

export const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    isPreload: isPreloadReducer,
    coa: coaReducer,
    loadingBar: loadingBarReducer,
    allUsers: usersReducer,
    customers: customerReducer,
    products: productReducer,
    prints: printReducer,
    planning: planningReducer,
    planningDetail: planningDetailReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
    }).concat(loadingBarMiddleware()),
});

export default store;
