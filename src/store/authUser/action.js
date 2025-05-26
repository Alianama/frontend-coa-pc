import api from "../../utils/api";
import { toast } from "sonner";
import { showLoading, hideLoading } from "react-redux-loading-bar";

const ActionType = {
  SET_AUTH_USER: "SET_AUTH_USER",
  UNSET_AUTH_USER: "UNSET_AUTH_USER",
};

function setAuthUserActionCreator(authUser) {
  return {
    type: ActionType.SET_AUTH_USER,
    payload: authUser,
  };
}

function unsetAuthUserActionCreator() {
  return {
    type: ActionType.UNSET_AUTH_USER,
  };
}

function asyncSetAuthUser({ username, password }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      await api.login(username, password);
      const authUser = await api.getOwnProfile();
      if (authUser.status === "success") {
        toast.success("Login successful");
        dispatch(setAuthUserActionCreator(authUser.data));
      } else {
        toast.error("Login failed");
        dispatch(unsetAuthUserActionCreator());
      }
    } catch (error) {
      toast.error("Login failed");
      dispatch(unsetAuthUserActionCreator());
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncUnsetAuthUser() {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      await api.clearAccessToken();
      dispatch(unsetAuthUserActionCreator());
      toast.success("Berhasil logout");
    } catch (error) {
      toast.error("Gagal logout");
      console.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };
}

export {
  setAuthUserActionCreator,
  unsetAuthUserActionCreator,
  asyncSetAuthUser,
  asyncUnsetAuthUser,
  ActionType,
};
