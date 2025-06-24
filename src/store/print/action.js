import api from "@/services/api";
import { hideLoading, showLoading } from "react-redux-loading-bar";
import { toast } from "sonner";

const ActionType = {
  RECEIVE_ALL_PRINT: "RECEIVE_ALL_PRINT",
};

function receiveAllPrintActionCreator(allPrint) {
  return {
    type: ActionType.RECEIVE_ALL_PRINT,
    payload: allPrint,
  };
}

function asyncGetAllPrint(page = 1, limit = 100, search = "") {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.getAllPrint(page, limit, search);
      if (response.status === "success") {
        dispatch(receiveAllPrintActionCreator(response));
        return response;
      }
      throw new Error(response.message || "Gagal mendapatkan data print");
    } catch (error) {
      toast.error(error.message || "Gagal mendapatkan data print");
      console.error("Error getting print:", error.message);
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}

export { ActionType, receiveAllPrintActionCreator, asyncGetAllPrint };
