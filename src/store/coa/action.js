import api from "@/utils/api";
import { showLoading, hideLoading } from "react-redux-loading-bar";

const ActionType = {
  SET_COA: "SET_COA",
  SET_PAGINATION: "SET_PAGINATION",
  SET_DETAIL_COA: "SET_DETAIL_COA",
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

function setDetailCoaActionCreator(detail_coa) {
  return {
    type: ActionType.SET_DETAIL_COA,
    payload: detail_coa,
  };
}

function asyncGetDetailCOA(coaId) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.getCoaDetail(coaId);
      if (response.status === "success") {
        dispatch(setDetailCoaActionCreator(response.data));
        return response;
      }
      throw new Error(response.message || "Gagal mengambil detail COA");
    } catch (error) {
      console.error("Error fetching COA detail:", error.message);
      dispatch(setDetailCoaActionCreator({}));
      throw error;
    } finally {
      dispatch(hideLoading());
    }
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
        return response;
      }
      throw new Error(response.message || "Gagal mengambil data COA");
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
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}

export const asyncRequestApprovalCOA = (coaId) => {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.requestApprovalCOA(coaId);

      if (response.status === "success") {
        await dispatch(asyncGetCOA());
        return response;
      }

      throw new Error(response.message || "Gagal Request Approval COA");
    } catch (error) {
      console.error("Error Approval request COA:", error.message);
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
};

export const asyncApproveCOA = (coaId) => {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.approveCOA(coaId);

      if (response.status === "success") {
        await dispatch(asyncGetCOA());
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
  asyncGetDetailCOA,
};
