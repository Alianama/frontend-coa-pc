// import { ActionType } from "./action"; // Sudah tidak digunakan

const initialState = {
  data: [],
  totalQtyCheck: 0,
  header: null,
};

const planningDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PLANNING_DETAIL":
      return {
        ...state,
        data: action.payload.data,
        totalQtyCheck: action.payload.totalQtyCheck,
        header: action.payload.header,
      };
    default:
      return state;
  }
};

export default planningDetailReducer;
