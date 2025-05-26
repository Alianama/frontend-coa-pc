import { ActionType } from "./action";

const usersReducer = (state = [], action) => {
  switch (action.type) {
    case ActionType.SET_ALL_USERS:
      return action.payload;
    default:
      return state;
  }
};

export default usersReducer;
