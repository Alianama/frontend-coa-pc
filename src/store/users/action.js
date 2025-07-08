// Menggunakan API terpusat
import api from "@/services/api";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import { toast } from "sonner";

const ActionType = {
  SET_ALL_USERS: "SET_ALL_USERS",
  ADD_USER: "ADD_USER",
};

function setAllUserActionCreator(allUsers) {
  return {
    type: ActionType.SET_ALL_USERS,
    payload: allUsers,
  };
}

function addUserActionCreator(user) {
  return {
    type: ActionType.ADD_USER,
    payload: user,
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

function asyncAddUser(user) {
  return async (dispatch) => {
    try {
      dispatch(showLoading());
      const response = await api.addUser(user);
      if (response.status === "success") {
        dispatch(addUserActionCreator(response.data));
        console.log(response);

        toast.success(response.message);
      } else {
        console.log(response);

        toast.error(response.message);
        console.error("Failed to add user:", response.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error adding user:", error.message);
    } finally {
      dispatch(hideLoading());
    }
  };
}

export {
  ActionType,
  asyncGetAllUsers,
  setAllUserActionCreator,
  addUserActionCreator,
  asyncAddUser,
};
