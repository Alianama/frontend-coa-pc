import api from "@/services/api";
import { hideLoading, showLoading } from "react-redux-loading-bar";
import { toast } from "sonner";

const ActionType = {
  RECEIVE_ALL_PRINT: "RECEIVE_ALL_PRINT",
  OPTIMISTIC_APPROVE_PRINT_COA: "OPTIMISTIC_APPROVE_PRINT_COA",
  OPTIMISTIC_REJECT_PRINT_COA: "OPTIMISTIC_REJECT_PRINT_COA",
  RECEIVE_PRINT_DETAIL: "RECEIVE_PRINT_DETAIL",
};

function receiveAllPrintActionCreator(allPrint) {
  return {
    type: ActionType.RECEIVE_ALL_PRINT,
    payload: allPrint,
  };
}

function receivePrintDetailActionCreator(detail) {
  return {
    type: ActionType.RECEIVE_PRINT_DETAIL,
    payload: detail,
  };
}

function asyncPrintCoa(planningId, quantitiy, remarks, shippedToCustomerId) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.printCoa(
        planningId,
        quantitiy,
        remarks,
        shippedToCustomerId
      );
      if (response.status === "success") {
        toast.success(response.message || "COA berhasil dicetak");
        return response;
      }
      throw new Error(response.message || "Gagal mencetak COA");
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan saat mencetak COA");
      throw error;
    } finally {
      dispatch(hideLoading());
    }
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

function asyncApprovePrintCoa(id) {
  return async (dispatch) => {
    dispatch(optimisticApprovePrintCoa(id));
    dispatch(showLoading());
    try {
      const response = await api.approvePrintCoa(id);
      if (response.status === "success") {
        toast.success(response.message || "Print COA berhasil di-approve");
        dispatch(asyncGetAllPrint());
        return response;
      }
      throw new Error(response.message || "Gagal approve Print COA");
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan saat approve Print COA");
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncRejectPrintCoa(id) {
  return async (dispatch) => {
    dispatch(optimisticRejectPrintCoa(id));
    dispatch(showLoading());
    try {
      const response = await api.rejectPrintCoa(id);
      if (response.status === "success") {
        toast.success(response.message || "Print COA berhasil di-reject");
        dispatch(asyncGetAllPrint());
        return response;
      }
      throw new Error(response.message || "Gagal reject Print COA");
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan saat reject Print COA");
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncGetPrintByID(id) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.getPrintByID(id);
      if (response.status === "success") {
        dispatch(receivePrintDetailActionCreator(response.data));
        return response.data;
      }
      throw new Error(response.message || "Gagal mendapatkan detail print");
    } catch (error) {
      toast.error(error.message || "Gagal mendapatkan detail print");
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}

function optimisticApprovePrintCoa(id) {
  return {
    type: ActionType.OPTIMISTIC_APPROVE_PRINT_COA,
    payload: id,
  };
}

function optimisticRejectPrintCoa(id) {
  return {
    type: ActionType.OPTIMISTIC_REJECT_PRINT_COA,
    payload: id,
  };
}

export {
  ActionType,
  receiveAllPrintActionCreator,
  asyncGetAllPrint,
  asyncPrintCoa,
  asyncApprovePrintCoa,
  asyncRejectPrintCoa,
  optimisticApprovePrintCoa,
  optimisticRejectPrintCoa,
  receivePrintDetailActionCreator,
  asyncGetPrintByID,
};
