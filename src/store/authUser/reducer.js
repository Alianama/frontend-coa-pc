import { ActionType } from "./action";

function authUserReducer(state = null, action) {
  switch (action.type) {
    case ActionType.SET_AUTH_USER:
      return action.payload;
    case ActionType.UNSET_AUTH_USER:
      return null;
    default:
      return state;
  }
}

export default authUserReducer;
