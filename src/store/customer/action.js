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

export { receiveCustomerActionCreator, ActionType, asyncGetCustomer };
