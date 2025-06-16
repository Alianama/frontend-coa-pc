import api from "@/services/api";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import { toast } from "sonner";

const ActionType = {
  SET_COA: "SET_COA",
  SET_PAGINATION: "SET_PAGINATION",
  SET_DETAIL_COA: "SET_DETAIL_COA",
  CREATE_COA: "CREATE_COA",
  REMOVE_COA: "REMOVE_COA",
  OPTIMISTIC_CREATE_COA: "OPTIMISTIC_CREATE_COA",
  OPTIMISTIC_REMOVE_COA: "OPTIMISTIC_REMOVE_COA",
  REVERT_OPTIMISTIC_CREATE_COA: "REVERT_OPTIMISTIC_CREATE_COA",
  REVERT_OPTIMISTIC_REMOVE_COA: "REVERT_OPTIMISTIC_REMOVE_COA",
};

function setCOAActionCreator(coas) {
  return {
    type: ActionType.SET_COA,
    payload: coas,
  };
}

function createCOAActionCreator(coa) {
  return {
    type: ActionType.CREATE_COA,
    payload: coa,
  };
}

function removeCOAActionCreator(coaId) {
  return {
    type: ActionType.REMOVE_COA,
    payload: coaId,
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

function optimisticCreateCOAActionCreator(coa) {
  return {
    type: ActionType.OPTIMISTIC_CREATE_COA,
    payload: coa,
  };
}

function revertOptimisticCreateCOAActionCreator(coaId) {
  return {
    type: ActionType.REVERT_OPTIMISTIC_CREATE_COA,
    payload: coaId,
  };
}

function optimisticRemoveCOAActionCreator(coaId) {
  return {
    type: ActionType.OPTIMISTIC_REMOVE_COA,
    payload: coaId,
  };
}

function revertOptimisticRemoveCOAActionCreator(coa) {
  return {
    type: ActionType.REVERT_OPTIMISTIC_REMOVE_COA,
    payload: coa,
  };
}

function asyncRemoveCoa(coaId) {
  return async (dispatch) => {
    const coaToRemove = dispatch(optimisticRemoveCOAActionCreator(coaId));
    try {
      const response = await api.deleteCOA(coaId);
      if (response.status === "success") {
        toast.success("COA berhasil dihapus");
        dispatch(removeCOAActionCreator(coaId));
        return response;
      }
      throw new Error(response.message || "Failed Delete COA");
    } catch (error) {
      toast.error(error.message || "Failed Delete COA");
      console.error("Error deleting COA:", error.message);
      dispatch(revertOptimisticRemoveCOAActionCreator(coaToRemove));
      throw error;
    }
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

function asyncCreateCoa(coa) {
  return async (dispatch) => {
    const tempId = Date.now().toString();
    const optimisticCoa = { ...coa, id: tempId, isOptimistic: true };

    dispatch(optimisticCreateCOAActionCreator(optimisticCoa));

    try {
      const response = await api.createCOA(coa);
      if (response.status === "success") {
        toast.success("COA Created");
        dispatch(createCOAActionCreator(response.data));
        return response;
      }
      throw new Error(response.message || "Error Create COA");
    } catch (error) {
      toast.error(error.message || "Failed Create COA");
      console.error("Error creating COA:", error.message);
      dispatch(revertOptimisticCreateCOAActionCreator(tempId));
      throw error;
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
      throw new Error(response.message || "Failed fetch COA");
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
        toast.success("Request Approval success");
        await dispatch(asyncGetCOA());
        return response;
      }

      throw new Error(response.message || "Failed Request Approval COA");
    } catch (error) {
      toast.error(error.message || "Failed Request Approval");
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
        toast.success("COA Approved Successfully");
        await dispatch(asyncGetCOA());
        return response;
      }

      throw new Error(response.message || "Gagal Approved COA");
    } catch (error) {
      toast.error(error.message || "Failed Approved COA");
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
  asyncCreateCoa,
  createCOAActionCreator,
  asyncRemoveCoa,
  removeCOAActionCreator,
  optimisticCreateCOAActionCreator,
  optimisticRemoveCOAActionCreator,
  revertOptimisticCreateCOAActionCreator,
  revertOptimisticRemoveCOAActionCreator,
};
