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
        coas: state.coas.map((coa) =>
          coa.isOptimistic && coa.id === action.payload.id
            ? action.payload
            : coa
        ),
      };
    case ActionType.UPDATE_COA:
      return {
        ...state,
        coas: state.coas.map((coa) =>
          coa.id === action.payload.id ? action.payload : coa
        ),
        detail_coa:
          state.detail_coa?.id === action.payload.id
            ? action.payload
            : state.detail_coa,
      };
    case ActionType.OPTIMISTIC_CREATE_COA:
      return {
        ...state,
        coas: [action.payload, ...state.coas],
      };
    case ActionType.REVERT_OPTIMISTIC_CREATE_COA:
      return {
        ...state,
        coas: state.coas.filter((coa) => coa.id !== action.payload),
      };
    case ActionType.OPTIMISTIC_REMOVE_COA:
      return {
        ...state,
        coas: state.coas.filter((coa) => coa.id !== action.payload),
        detail_coa:
          state.detail_coa?.id === action.payload ? null : state.detail_coa,
      };
    case ActionType.REVERT_OPTIMISTIC_REMOVE_COA:
      return {
        ...state,
        coas: [...state.coas, action.payload],
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
