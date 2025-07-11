import { ActionType } from "./action";

const usersReducer = (state = [], action) => {
  switch (action.type) {
    case ActionType.SET_ALL_USERS:
      return action.payload;
    case ActionType.ADD_USER:
      return [...state, action.payload];
    case ActionType.UPDATE_USER:
      return state.map((user) =>
        user.id === action.payload.id ? { ...user, ...action.payload } : user
      );
    case "DELETE_USER":
      // Menghapus user berdasarkan id
      return state.filter((user) => user.id !== action.payload);
    default:
      return state;
  }
};

export default usersReducer;
