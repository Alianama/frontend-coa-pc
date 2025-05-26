import { ActionType } from "./action";

const initialState = {
  coas: [],
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
  },
};

const coaReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.SET_COA:
      return {
        ...state,
        coas: action.payload,
      };
    case ActionType.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };
    default:
      return state;
  }
};

export default coaReducer;
