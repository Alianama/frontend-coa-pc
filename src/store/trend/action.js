import { getTrendData } from "@/services/api/trend";

const ActionType = {
  RECEIVE_TREND_DATA: "RECEIVE_TREND_DATA",
};

function receiveTrendDataActionCreator(data) {
  return {
    type: ActionType.RECEIVE_TREND_DATA,
    payload: data,
  };
}

function asyncGetTrendData({
  productId,
  parameter,
  lotNumber,
  startDate,
  endDate,
}) {
  return async (dispatch) => {
    try {
      const response = await getTrendData({
        productId,
        parameter,
        lotNumber,
        startDate,
        endDate,
      });
      dispatch(receiveTrendDataActionCreator(response.data));
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export { ActionType, receiveTrendDataActionCreator, asyncGetTrendData };
