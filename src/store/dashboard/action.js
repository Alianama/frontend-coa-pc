import api from "@/services/api";

const ActionType = {
  RECEIVE_LOT_PROGRESS: "RECEIVE_LOT_PROGRESS",
};

function receiveLotProgressActionCreator(data) {
  return {
    type: ActionType.RECEIVE_LOT_PROGRESS,
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

export { ActionType, receiveLotProgressActionCreator, asyncGetLotProgress };
