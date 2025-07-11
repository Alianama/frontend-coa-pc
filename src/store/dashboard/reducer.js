import { ActionType } from "./action";

const initialState = {
  lotProgress: [],
};

function dashboardReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_LOT_PROGRESS:
      return {
        ...state,
        lotProgress: action.payload,
      };

    default:
      return state;
  }
}

export default dashboardReducer;
