import { ActionType } from "./action";

const initialState = {
  lotProgress: [],
  planningYearly: {},
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
    default:
      return state;
  }
}

export default dashboardReducer;
