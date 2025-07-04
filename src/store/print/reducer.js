import { ActionType } from "./action";

const initialState = {
  data: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 100,
    totalPages: 0,
  },
  detail: null,
};

const printReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.RECEIVE_ALL_PRINT:
      return {
        ...state,
        data: action.payload.data,
        pagination: action.payload.pagination,
      };
    case ActionType.RECEIVE_PRINT_DETAIL:
      return {
        ...state,
        detail: action.payload,
      };
    case ActionType.OPTIMISTIC_APPROVE_PRINT_COA:
      return {
        ...state,
        data: state.data.map((item) =>
          item.id === action.payload ? { ...item, status: "approved" } : item
        ),
      };
    case ActionType.OPTIMISTIC_REJECT_PRINT_COA:
      return {
        ...state,
        data: state.data.map((item) =>
          item.id === action.payload ? { ...item, status: "rejected" } : item
        ),
      };
    default:
      return state;
  }
};

export default printReducer;
