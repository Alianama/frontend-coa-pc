import api from "@/services/api";
import { toast } from "sonner";

const ActionType = {
  RECEIVE_LOT_PROGRESS: "RECEIVE_LOT_PROGRESS",
  RECEIVE_PLANNING_YEARLY: "RECEIVE_PLANNING_YEARLY",
};

function receiveLotProgressActionCreator(data) {
  return {
    type: ActionType.RECEIVE_LOT_PROGRESS,
    payload: data,
  };
}
function receivePlanningYearlyActionCreator(data) {
  return {
    type: ActionType.RECEIVE_PLANNING_YEARLY,
    payload: data,
  };
}

function asyncGetLotProgress(startDate, endDate) {
  return async (dispatch) => {
    try {
      const response = await api.getLotProgress(startDate, endDate);
      dispatch(receiveLotProgressActionCreator(response.data));
    } catch (error) {
      console.error("Error fetching lot progress:", error);
      // Handle error appropriately
    }
  };
}
function asyncGetPlanningYearly(year) {
  return async (dispatch) => {
    try {
      const response = await api.getPlanningYearly(year);
      dispatch(receivePlanningYearlyActionCreator(response.data));
    } catch (error) {
      toast.error(error.message);
      console.error("Error fetching planning yearly:", error);
    }
  };
}

export {
  ActionType,
  receiveLotProgressActionCreator,
  asyncGetLotProgress,
  asyncGetPlanningYearly,
};
