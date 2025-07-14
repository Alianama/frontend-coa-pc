import api from "@/services/api";
import { toast } from "sonner";

const ActionType = {
  RECEIVE_LOT_PROGRESS: "RECEIVE_LOT_PROGRESS",
  RECEIVE_PLANNING_YEARLY: "RECEIVE_PLANNING_YEARLY",
  RECEIVE_LOG_HISTORY: "RECEIVE_LOG_HISTORY",
  RECEIVE_DASHBOARD_SUMMARY: "RECEIVE_DASHBOARD_SUMMARY",
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

function receiveLogHistoryActionCreator(data, pagination) {
  return {
    type: ActionType.RECEIVE_LOG_HISTORY,
    payload: { data, pagination },
  };
}
function receiveDashboardSummaryActionCreator(data) {
  return {
    type: ActionType.RECEIVE_DASHBOARD_SUMMARY,
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

function asyncGetLogHistory(params) {
  return async (dispatch) => {
    try {
      const response = await api.getLogHistory(params);
      dispatch(
        receiveLogHistoryActionCreator(response.data, response.pagination)
      );
    } catch (error) {
      toast.error(error.message);
      console.error("Error fetching log history:", error);
    }
  };
}
function asyncGetDashboardSummary() {
  return async (dispatch) => {
    try {
      const response = await api.getDashboardSummary();
      dispatch(receiveDashboardSummaryActionCreator(response.data));
    } catch (error) {
      toast.error(error.message);
      console.error("Error fetching summary:", error);
    }
  };
}

export {
  ActionType,
  receiveLotProgressActionCreator,
  asyncGetLotProgress,
  asyncGetPlanningYearly,
  receiveLogHistoryActionCreator,
  asyncGetLogHistory,
  receiveDashboardSummaryActionCreator,
  asyncGetDashboardSummary,
};
