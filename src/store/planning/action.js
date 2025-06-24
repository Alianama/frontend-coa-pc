// Menggunakan API terpusat
import api from "@/services/api";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import { toast } from "sonner";

export const ActionType = {
  SET_PLANNING: "SET_PLANNING",
  CREATE_PLANNING: "CREATE_PLANNING",
  REMOVE_PLANNING: "REMOVE_PLANNING",
  UPDATE_PLANNING: "UPDATE_PLANNING",
  CLOSE_PLANNING: "CLOSE_PLANNING",
  REOPEN_PLANNING: "REOPEN_PLANNING",
};

export function setPlanningActionCreator(plannings) {
  return {
    type: ActionType.SET_PLANNING,
    payload: plannings,
  };
}

export function createPlanningActionCreator(planning) {
  return {
    type: ActionType.CREATE_PLANNING,
    payload: planning,
  };
}

export function removePlanningActionCreator(planningId) {
  return {
    type: ActionType.REMOVE_PLANNING,
    payload: planningId,
  };
}

export function updatePlanningActionCreator(planning) {
  return {
    type: ActionType.UPDATE_PLANNING,
    payload: planning,
  };
}

export function closePlanningActionCreator(planning) {
  return {
    type: ActionType.CLOSE_PLANNING,
    payload: planning,
  };
}

export function reopenPlanningActionCreator(planning) {
  return {
    type: ActionType.REOPEN_PLANNING,
    payload: planning,
  };
}

export function asyncGetPlanning(page = 1, limit = 100, search = "") {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.getPlanning(page, limit, search);
      if (response.status === "success") {
        dispatch(setPlanningActionCreator(response.data));
        return { ...response };
      }
      throw new Error(response.message || "Failed fetch Planning");
    } catch (error) {
      toast.error(error.message || "Failed fetch Planning");
      dispatch(setPlanningActionCreator([]));
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}

export function asyncCreatePlanning(planning) {
  return async (dispatch) => {
    try {
      const response = await api.createPlanning(planning);
      if (response.status === "success") {
        toast.success("Planning Created");
        dispatch(createPlanningActionCreator(response.data));
        return response;
      }
      throw new Error(response.message || "Error Create Planning");
    } catch (error) {
      toast.error(error.message || "Failed Create Planning");
      throw error;
    }
  };
}

export function asyncRemovePlanning(planningId) {
  return async (dispatch) => {
    try {
      const response = await api.deletePlanning(planningId);
      if (response.status === "success") {
        toast.success("Planning berhasil dihapus");
        dispatch(removePlanningActionCreator(planningId));
        dispatch(asyncGetPlanning());
        return response;
      }
      throw new Error(response.message || "Failed Delete Planning");
    } catch (error) {
      toast.error(error.message || "Failed Delete Planning");
      throw error;
    }
  };
}

export function asyncUpdatePlanning(planningId, planning) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.updatePlanning(planningId, planning);
      if (response.status === "success") {
        toast.success("Planning berhasil diperbarui");
        dispatch(updatePlanningActionCreator(response.data));
        dispatch(asyncGetPlanning());
        return response;
      }
      throw new Error(response.message || "Gagal memperbarui Planning");
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui Planning");
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}

export function asyncClosePlanning(planningId) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.planningClose(planningId);
      if (response.status === "success") {
        toast.success("Planning berhasil di-close");
        dispatch(closePlanningActionCreator(response.data));
        dispatch(asyncGetPlanning());
        return response;
      }
      throw new Error(response.message || "Gagal close planning");
    } catch (error) {
      toast.error(error.message || "Gagal close planning");
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}

export function asyncReopenPlanning(planningId) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.planningReOpen(planningId);
      if (response.status === "success") {
        toast.success("Planning berhasil di-reopen");
        dispatch(reopenPlanningActionCreator(response.data));
        dispatch(asyncGetPlanning());
        return response;
      }
      throw new Error(response.message || "Gagal reopen planning");
    } catch (error) {
      toast.error(error.message || "Gagal reopen planning");
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}
