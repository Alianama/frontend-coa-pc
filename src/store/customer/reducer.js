import { ActionType } from "./action";

function customerReducer(customers = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_CUSTOMER:
      return action.payload;
    default:
      return customers;
  }
}

export default customerReducer;
