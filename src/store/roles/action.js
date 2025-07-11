import api from "@/services/api";
import { toast } from "sonner";

const ActionType = {
  SET_ALL_ROLES: "SET_ALL_ROLES",
};

function setAllRolesActionCreator(roles) {
  return {
    type: ActionType.SET_ALL_ROLES,
    payload: roles,
  };
}

function asyncGetAllRoles() {
  return async (dispatch) => {
    try {
      const response = await api.getAllRoles();
      if (response.status === "success") {
        dispatch(setAllRolesActionCreator(response.data));
      } else {
        toast.error(response.message || "Gagal mengambil data role");
        dispatch(setAllRolesActionCreator([]));
      }
    } catch (error) {
      toast.error(error.message || "Gagal mengambil data role");
      dispatch(setAllRolesActionCreator([]));
    }
  };
}

export { ActionType, setAllRolesActionCreator, asyncGetAllRoles };
