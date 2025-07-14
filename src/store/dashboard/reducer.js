import { ActionType } from "./action";

const initialState = {
  lotProgress: [],
  planningYearly: {},
  logHistory: [],
  logHistoryPagination: {},
  dashboardSummary: {},
};

function dashboardReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_LOT_PROGRESS:
      return {
        ...state,
        lotProgress: action.payload,
      };
    case ActionType.RECEIVE_PLANNING_YEARLY:
      return {
        ...state,
        planningYearly: action.payload,
      };
    case ActionType.RECEIVE_LOG_HISTORY:
      return {
        ...state,
        logHistory: action.payload.data,
        logHistoryPagination: action.payload.pagination,
      };
    case ActionType.RECEIVE_DASHBOARD_SUMMARY:
      return {
        ...state,
        dashboardSummary: action.payload,
      };
    default:
      return state;
  }
}

export default dashboardReducer;
