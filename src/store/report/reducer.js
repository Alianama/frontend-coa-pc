import { ActionType } from "./action";

const initialState = {
  reportHistory: [],
};

function reportReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_REPORT_HISTORY:
      return {
        ...state,
        reportHistory: action.payload,
      };
    default:
      return state;
  }
}

export default reportReducer;
