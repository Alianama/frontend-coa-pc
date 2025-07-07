import { ActionType } from "./action";

const initialState = {
  trendData: null,
};

export default function trendReducer(state = initialState, action) {
  switch (action.type) {
    case ActionType.RECEIVE_TREND_DATA:
      return {
        ...state,
        trendData: action.payload,
      };
    default:
      return state;
  }
}
