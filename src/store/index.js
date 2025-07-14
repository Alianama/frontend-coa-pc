import { configureStore } from "@reduxjs/toolkit";
import authUserReducer from "./authUser/reducer";
import isPreloadReducer from "./isPreload/reducer";
import {
  loadingBarReducer,
  loadingBarMiddleware,
} from "react-redux-loading-bar";
import usersReducer from "./users/reducer";
import customerReducer from "./customer/reducer";
import productReducer from "./product/reducer";
import printReducer from "./print/reducer";
import planningReducer from "./planning/reducer";
import planningDetailReducer from "./planningDetail/reducer";
import productStandardReducer from "./productStandard/reducer";
import trendReducer from "./trend/reducer";
import rolesReducer from "./roles/reducer";
import dashboardReducer from "./dashboard/reducer";
import reportReducer from "./report/reducer";

export const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    isPreload: isPreloadReducer,
    loadingBar: loadingBarReducer,
    allUsers: usersReducer,
    customers: customerReducer,
    products: productReducer,
    prints: printReducer,
    planning: planningReducer,
    planningDetail: planningDetailReducer,
    productStandard: productStandardReducer,
    trend: trendReducer,
    roles: rolesReducer,
    dashboard: dashboardReducer,
    report: reportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
    }).concat(loadingBarMiddleware()),
});

export default store;
