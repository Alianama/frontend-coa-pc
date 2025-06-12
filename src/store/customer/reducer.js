import { ActionType } from "./action";

const customerReducer = (state = [], action) => {
  switch (action.type) {
    case ActionType.RECEIVE_CUSTOMER:
      return {
        ...state,
        customers: action.payload,
      };
    default:
      return state;
  }
};

export default customerReducer;
