// Menggunakan API terpusat
import api from "@/services/api";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import { toast } from "sonner";

const ActionType = {
  RECEIVE_CUSTOMER: "RECEIVE_CUSTOMER",
};

// Daftar field yang dianggap mandatory (harus sama dengan di CustomerList.jsx)
const availableFields = [
  "pelletLength",
  "pelletDiameter",
  "visualCheck",
  "colorCheck",
  "dispersibility",
  "mfr",
  "density",
  "moisture",
  "carbonContent",
  "mfgDate",
  "expiryDate",
  "analysisDate",
  "foreignMatter",
  "weightOfChips",
  "intrinsicViscosity",
  "ashContent",
  "heatStability",
  "lightFastness",
  "granule",
  "tintDeltaE",
  "colorDeltaE",
  "deltaP",
  "macaroni",
  "caCO3",
  "odor",
  "nucleatingAgent",
  "hals",
  "hiding",
  "dispersion",
  "contamination",
];

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
        // Mapping: jika mandatoryFields tidak ada, buat dari field boolean di root
        const mappedData = response.data.map((customer) => {
          if (customer.mandatoryFields) return customer;
          const mandatoryFields = {};
          availableFields.forEach((field) => {
            if (customer[field]) mandatoryFields[field] = true;
          });
          return { ...customer, mandatoryFields };
        });
        dispatch(receiveCustomerActionCreator(mappedData));
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
