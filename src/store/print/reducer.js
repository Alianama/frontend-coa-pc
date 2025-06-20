import { ActionType } from "./action";

const initialState = {
  data: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 100,
    totalPages: 0,
  },
};

const printReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.RECEIVE_ALL_PRINT:
      return {
        ...state,
        data: action.payload.data,
        pagination: action.payload.pagination,
      };
    default:
      return state;
  }
};

export default printReducer;
