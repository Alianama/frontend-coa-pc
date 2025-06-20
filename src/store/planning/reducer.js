import { ActionType } from "./action";

const initialState = {
  plannings: [],
};

const planningReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.SET_PLANNING:
      return {
        ...state,
        plannings: action.payload,
      };
    case ActionType.CREATE_PLANNING:
      return {
        ...state,
        plannings: [action.payload, ...state.plannings],
      };
    case ActionType.UPDATE_PLANNING:
      return {
        ...state,
        plannings: state.plannings.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case ActionType.REMOVE_PLANNING:
      return {
        ...state,
        plannings: state.plannings.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
};

export default planningReducer;
