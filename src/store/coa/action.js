import api from "@/utils/api";
import { showLoading, hideLoading } from "react-redux-loading-bar";

const ActionType = {
  SET_COA: "SET_COA",
  SET_PAGINATION: "SET_PAGINATION",
};

function setCOAActionCreator(coa) {
  return {
    type: ActionType.SET_COA,
    payload: coa,
  };
}

function setPaginationActionCreator(pagination) {
  return {
    type: ActionType.SET_PAGINATION,
    payload: pagination,
  };
}

function asyncGetCOA(page = 0, limit = 0, search = "") {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.getCOA(page, limit, search);
      if (response.status === "success") {
        dispatch(setCOAActionCreator(response.data.coas));
        dispatch(
          setPaginationActionCreator({
            totalItems: response.data.totalItems,
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage,
            itemsPerPage: response.data.itemsPerPage,
          })
        );
      }
    } catch (error) {
      console.error("Error fetching COA:", error.message);
      dispatch(setCOAActionCreator([]));
      dispatch(
        setPaginationActionCreator({
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          itemsPerPage: limit,
        })
      );
    } finally {
      dispatch(hideLoading());
    }
  };
}

export const asyncApproveCOA = (coaId) => {
  return async (dispatch) => {
    try {
      dispatch(showLoading());
      const response = await api.approveCOA(coaId);

      if (response.status === "success") {
        // Refresh data COA setelah approve berhasil
        dispatch(asyncGetCOA());
        return response;
      }

      throw new Error(response.message || "Gagal menyetujui COA");
    } catch (error) {
      console.error("Error approving COA:", error.message);
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
};

export {
  ActionType,
  setCOAActionCreator,
  setPaginationActionCreator,
  asyncGetCOA,
};
