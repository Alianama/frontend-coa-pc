// Action Types
export const FETCH_PRODUCT_STANDARD_REQUEST = "FETCH_PRODUCT_STANDARD_REQUEST";
export const FETCH_PRODUCT_STANDARD_SUCCESS = "FETCH_PRODUCT_STANDARD_SUCCESS";
export const FETCH_PRODUCT_STANDARD_FAILURE = "FETCH_PRODUCT_STANDARD_FAILURE";

import api from "@/services/api";
import { hideLoading, showLoading } from "react-redux-loading-bar";
import { toast } from "sonner";

const ActionType = {
  RECEIVE_PRODUCT_STANDARDS: "RECEIVE_PRODUCT_STANDARDS",
  ADD_PRODUCT_STANDARD: "ADD_PRODUCT_STANDARD",
  UPDATE_PRODUCT_STANDARD: "UPDATE_PRODUCT_STANDARD",
  DELETE_PRODUCT_STANDARD: "DELETE_PRODUCT_STANDARD",
};

function receiveProductStandardActionCreator(standards) {
  return {
    type: ActionType.RECEIVE_PRODUCT_STANDARDS,
    payload: standards,
  };
}

function addProductStandardActionCreator(standard) {
  return {
    type: ActionType.ADD_PRODUCT_STANDARD,
    payload: standard,
  };
}

function updateProductStandardActionCreator(standard) {
  return {
    type: ActionType.UPDATE_PRODUCT_STANDARD,
    payload: standard,
  };
}

function deleteProductStandardActionCreator(standardId) {
  return {
    type: ActionType.DELETE_PRODUCT_STANDARD,
    payload: standardId,
  };
}

function asyncGetProductStandard(productId) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.getProductStandards(productId);
      dispatch(receiveProductStandardActionCreator(response));
    } catch (error) {
      toast.error(error.message || "Gagal memuat standar produk");
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncAddProductStandard(standard) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      await api.createProductStandard(standard);
      // Refetch data setelah tambah
      dispatch(asyncGetProductStandard(standard.product_id));
      toast.success("Berhasil menambahkan standar");
    } catch (error) {
      toast.error(error.message || "Gagal menambahkan standar");
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncUpdateProductStandard(id, updatedData) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      await api.updateProductStandard(id, updatedData);
      // Refetch data setelah update
      dispatch(asyncGetProductStandard(updatedData.product_id));
      toast.success("Berhasil update standar");
    } catch (error) {
      toast.error(error.message || "Gagal update standar");
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncDeleteProductStandard(id, product_id) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      await api.deleteProductStandard(id);
      // Refetch data setelah hapus
      dispatch(asyncGetProductStandard(product_id));
      toast.success("Berhasil hapus standar");
    } catch (error) {
      toast.error(error.message || "Gagal hapus standar");
    } finally {
      dispatch(hideLoading());
    }
  };
}

export {
  ActionType,
  receiveProductStandardActionCreator,
  addProductStandardActionCreator,
  updateProductStandardActionCreator,
  deleteProductStandardActionCreator,
  asyncGetProductStandard,
  asyncAddProductStandard,
  asyncUpdateProductStandard,
  asyncDeleteProductStandard,
};
