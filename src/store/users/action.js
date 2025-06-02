import api from "@/services/api";
import { showLoading, hideLoading } from "react-redux-loading-bar";

const ActionType = {
  SET_ALL_USERS: "SET_ALL_USERS",
};

function setAllUserActionCreator(allUsers) {
  return {
    type: ActionType.SET_ALL_USERS,
    payload: allUsers,
  };
}

function asyncGetAllUsers() {
  return async (dispatch) => {
    try {
      dispatch(showLoading());
      const response = await api.getAllUser();
      if (response.status === "success") {
        dispatch(setAllUserActionCreator(response.data));
      } else {
        console.error("Failed to fetch users:", response.message);
        dispatch(setAllUserActionCreator([]));
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
      dispatch(setAllUserActionCreator([]));
    } finally {
      dispatch(hideLoading());
    }
  };
}

export { ActionType, asyncGetAllUsers, setAllUserActionCreator };
