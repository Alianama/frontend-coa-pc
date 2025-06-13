import api from "@/services/api";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import { toast } from "sonner";

const ActionType = {
  RECEIVE_CUSTOMER: "RECEIVE_CUSTOMER",
};

function receiveCustomerActionCreator(customers) {
  return {
    type: ActionType.RECEIVE_CUSTOMER,
    payload: customers,
  };
}

function asyncGetCustomer() {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.getCustomer();
      if (response.status === "success") {
        dispatch(receiveCustomerActionCreator(response.data));
        return response;
      }
      throw new Error(response.message || "Gagal mengambil data customer");
    } catch (error) {
      toast.error(error.message || "Gagal mengambil data customer");
      console.error("Error fetching customer:", error.message);
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncAddCustomer(customer) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.addCustomer(customer);
      if (response.status === "success") {
        dispatch(asyncGetCustomer());
        toast.success("Berhasil menambahkan customer");
        return response;
      }
      throw new Error(response.message || "Gagal menambahkan customer");
    } catch (error) {
      toast.error(error.message || "Gagal menambahkan customer");
      console.error("Error adding customer:", error.message);
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncUpdateCustomer(customer) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.UpdateCustomer(customer);
      if (response.status === "success") {
        dispatch(asyncGetCustomer());
        toast.success("Berhasil Perbarui customer");
        return response;
      }
      throw new Error(response.message || "Gagal Perbarui customer");
    } catch (error) {
      toast.error(error.message || "Gagal Perbarui customer");
      console.error("Error Update customer:", error.message);
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncDeleteCustomer(customerId) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.deleteCustomer(customerId);
      if (response.status === "success") {
        dispatch(asyncGetCustomer());
        toast.success("Berhasil menghapus customer");
        return response;
      }
      throw new Error(response.message || "Gagal menghapus customer");
    } catch (error) {
      toast.error(error.message || "Gagal menghapus customer");
      console.error("Error deleting customer:", error.message);
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}

export {
  receiveCustomerActionCreator,
  ActionType,
  asyncGetCustomer,
  asyncAddCustomer,
  asyncUpdateCustomer,
  asyncDeleteCustomer,
};
