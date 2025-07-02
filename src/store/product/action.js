// Menggunakan API terpusat
import api from "@/services/api";
import { hideLoading, showLoading } from "react-redux-loading-bar";
import { toast } from "sonner";

const ActionType = {
  RECEIVE_PRODUCTS: "RECEIVE_PRODUCTS",
  ADD_PRODUCT: "ADD_PRODUCT",
  ROLLBACK_ADD_PRODUCT: "ROLLBACK_ADD_PRODUCT",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  ROLLBACK_UPDATE_PRODUCT: "ROLLBACK_UPDATE_PRODUCT",
  DELETE_PRODUCT: "DELETE_PRODUCT",
  ROLLBACK_DELETE_PRODUCT: "ROLLBACK_DELETE_PRODUCT",
};

function receiveProductActionCreator(products) {
  return {
    type: ActionType.RECEIVE_PRODUCTS,
    payload: products,
  };
}

function addProductActionCreator(product) {
  return {
    type: ActionType.ADD_PRODUCT,
    payload: product,
  };
}

function rollbackAddProductActionCreator(tempId) {
  return {
    type: ActionType.ROLLBACK_ADD_PRODUCT,
    payload: tempId,
  };
}

function updateProductActionCreator(product) {
  return {
    type: ActionType.UPDATE_PRODUCT,
    payload: product,
  };
}

function rollbackUpdateProductActionCreator(originalProduct) {
  return {
    type: ActionType.ROLLBACK_UPDATE_PRODUCT,
    payload: originalProduct,
  };
}

function deleteProductActionCreator(productId) {
  return {
    type: ActionType.DELETE_PRODUCT,
    payload: productId,
  };
}

function rollbackDeleteProductActionCreator(product) {
  return {
    type: ActionType.ROLLBACK_DELETE_PRODUCT,
    payload: product,
  };
}

function asyncGetProduct() {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.getProducts();
      dispatch(receiveProductActionCreator(response.data));
    } catch (error) {
      toast.error(error.message || "Gagal memuat produk");
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncAddProduct(product) {
  return async (dispatch) => {
    dispatch(showLoading());

    // Buat ID sementara untuk optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticProduct = {
      ...product,
      id: tempId,
      createdAt: new Date().toISOString(),
    };

    // Langsung tampilkan di UI (optimistic)
    dispatch(addProductActionCreator(optimisticProduct));

    try {
      const response = await api.addProduct(product);
      if (response.status === "success") {
        dispatch(asyncGetProduct());
        toast.success("Berhasil menambahkan produk");
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      toast.error(error.message || "Gagal menambahkan produk");
      dispatch(rollbackAddProductActionCreator(tempId));
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncUpdateProduct(productId, updatedData) {
  return async (dispatch, getState) => {
    dispatch(showLoading());

    // Simpan data asli untuk rollback jika diperlukan
    const state = getState();
    if (!state.products || !state.products.products) {
      toast.error("Data produk tidak tersedia");
      return;
    }

    const originalProduct = state.products.products.find(
      (p) => p.id === productId
    );

    // Kirim hanya field yang diperlukan
    const productData = {
      productName: updatedData.productName,
      resin: updatedData.resin,
      letDownRatio: updatedData.letDownRatio,
      expiredAge: Number(updatedData.expiredAge),
    };

    // Optimistic update
    const optimisticProduct = { ...originalProduct, ...productData };
    dispatch(updateProductActionCreator(optimisticProduct));

    try {
      const response = await api.updateProduct(productId, productData);
      if (response.status === "success") {
        dispatch(asyncGetProduct());
        toast.success("Berhasil memperbarui produk");
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui produk");
      dispatch(rollbackUpdateProductActionCreator(originalProduct));
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncDeleteProduct(productId) {
  return async (dispatch) => {
    dispatch(showLoading());

    try {
      const response = await api.deleteProduct(productId);
      if (response.status === "success") {
        dispatch(deleteProductActionCreator(productId));
        toast.success("Berhasil menghapus produk");
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      toast.error(error.message || "Gagal menghapus produk");
    } finally {
      dispatch(hideLoading());
    }
  };
}

export {
  ActionType,
  receiveProductActionCreator,
  addProductActionCreator,
  rollbackAddProductActionCreator,
  updateProductActionCreator,
  rollbackUpdateProductActionCreator,
  deleteProductActionCreator,
  rollbackDeleteProductActionCreator,
  asyncGetProduct,
  asyncAddProduct,
  asyncUpdateProduct,
  asyncDeleteProduct,
};
