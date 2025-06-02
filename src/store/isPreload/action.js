import api from "../../services/api";
import { setAuthUserActionCreator } from "../authUser/action";
import { setAllUserActionCreator } from "../users/action";

const ActionType = {
  SET_IS_PRELOAD: "SET_IS_PRELOAD",
};

function setIsPreloadActionCreator(isPreload) {
  return {
    type: ActionType.SET_IS_PRELOAD,
    payload: {
      isPreload,
    },
  };
}

function asyncPreloadProcess() {
  return async (dispatch) => {
    try {
      const authUser = await api.getOwnProfile();
      dispatch(setAuthUserActionCreator(authUser.data));

      const allUsers = await api.getAllUser();
      dispatch(setAllUserActionCreator(allUsers.data));
    } catch (error) {
      console.error(error.message);
    } finally {
      dispatch(setIsPreloadActionCreator(false));
    }
  };
}
export { ActionType, setIsPreloadActionCreator, asyncPreloadProcess };
