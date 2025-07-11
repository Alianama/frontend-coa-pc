import { ActionType } from "./action";

const rolesReducer = (state = [], action) => {
  switch (action.type) {
    case ActionType.SET_ALL_ROLES:
      return action.payload;
    default:
      return state;
  }
};

export default rolesReducer;
