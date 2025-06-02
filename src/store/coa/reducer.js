import { ActionType } from "./action";

const initialState = {
  coas: [],
  detail_coa: null,
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
    case ActionType.SET_DETAIL_COA:
      return {
        ...state,
        detail_coa: action.payload,
      };
    case ActionType.CREATE_COA:
      return {
        ...state,
        coas: [action.payload, ...state.coas],
      };
    case ActionType.REMOVE_COA:
      return {
        ...state,
        coas: state.coas.filter((coa) => coa.id !== action.payload),
        detail_coa:
          state.detail_coa?.id === action.payload ? null : state.detail_coa,
      };

    default:
      return state;
  }
};

export default coaReducer;
