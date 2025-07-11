// Menggunakan API terpusat
import api from "@/services/api";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import { toast } from "sonner";

const ActionType = {
  SET_ALL_USERS: "SET_ALL_USERS",
  ADD_USER: "ADD_USER",
  DELETE_USER: "DELETE_USER",
  UPDATE_USER: "UPDATE_USER",
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

function deleteUserActionCreator(userId) {
  return {
    type: ActionType.DELETE_USER,
    payload: userId,
  };
}

function updateUserActionCreator(user) {
  return {
    type: ActionType.UPDATE_USER,
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

function asyncDeleteUser(userId) {
  return async (dispatch) => {
    try {
      dispatch(showLoading());
      const response = await api.deleteUser(userId);
      if (response.status === "success") {
        dispatch(deleteUserActionCreator(userId));
        toast.success("User berhasil dihapus.");
        dispatch(asyncGetAllUsers());
      } else {
        toast.error("Gagal menghapus user: " + (response.message || ""));
        console.error("Gagal menghapus user:", response.message);
      }
    } catch (error) {
      toast.error("Gagal menghapus user: " + error.message);
      console.error("Error menghapus user:", error.message);
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncUpdateUser(user) {
  return async (dispatch) => {
    try {
      dispatch(showLoading());
      const response = await api.updateUser(user);
      if (response.status === "success") {
        dispatch(updateUserActionCreator(response.data));
        toast.success(response.message || "User berhasil diupdate.");
      } else {
        toast.error(response.message || "Gagal update user.");
      }
    } catch (error) {
      toast.error(error.message || "Gagal update user.");
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncResetPassword(userId, newPassword) {
  return async (dispatch) => {
    try {
      dispatch(showLoading());
      const response = await api.resetPassword(userId, newPassword);
      console.log(response);

      if (response.status === 200) {
        toast.success(response.message || "Password berhasil direset.");
      } else {
        toast.error(response.message || "Gagal reset password.");
      }
    } catch (error) {
      toast.error(error.message || "Gagal reset password.");
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
  asyncDeleteUser,
  asyncUpdateUser,
  deleteUserActionCreator,
  updateUserActionCreator,
  asyncResetPassword,
};
