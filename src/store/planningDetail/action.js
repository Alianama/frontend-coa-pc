// Menggunakan API terpusat
import api from "@/services/api";
import { toast } from "sonner";
import { hideLoading, showLoading } from "react-redux-loading-bar";

export function setPlanningDetailActionCreator(
  data,
  totalQtyCheck,
  totalQtyPrinted,
  header
) {
  return {
    type: "SET_PLANNING_DETAIL",
    payload: { data, totalQtyCheck, totalQtyPrinted, header },
  };
}

export function asyncGetPlanningDetailByLot(lotNumber) {
  return async (dispatch) => {
    try {
      const response = await api.getDetailPlanningByLot(lotNumber);
      if (response.status === "success") {
        dispatch(
          setPlanningDetailActionCreator(
            response.data,
            response.totalQtyCheck,
            response.totalQtyPrinted,
            response.header
          )
        );
        return response;
      }
      throw new Error(response.message || "Gagal mengambil detail planning");
    } catch (error) {
      toast.error(error.message || "Gagal mengambil detail planning");
      dispatch(setPlanningDetailActionCreator(null, 0));
      throw error;
    }
  };
}

export function asyncAddPlanningDetail(data) {
  return async () => {
    try {
      const response = await api.postPlanningDetail(data);
      if (response.status === "success") {
        toast.success(response.message || "Berhasil menambah detail planning");
        return response;
      }
      throw new Error(response.message || "Gagal menambah detail planning");
    } catch (error) {
      toast.error(error.message || "Gagal menambah detail planning");
      throw error;
    }
  };
}

export function asyncDeletePlanningDetail(detailId, lotNumber) {
  return async (dispatch) => {
    try {
      const response = await api.deletePlanningDetail(detailId);
      if (response.status === "success") {
        toast.success(response.message || "Berhasil menghapus detail planning");
        // Refresh data setelah delete
        dispatch(asyncGetPlanningDetailByLot(lotNumber));
        return response;
      }
      throw new Error(response.message || "Gagal menghapus detail planning");
    } catch (error) {
      toast.error(error.message || "Gagal menghapus detail planning");
      throw error;
    }
  };
}

export function asyncUpdatePlanningDetail({ id, data, lotNumber }) {
  return async (dispatch) => {
    try {
      const response = await api.updatePlanningDetail(id, data);
      if (response.status === "success") {
        toast.success(response.message || "Berhasil update detail planning");
        // Refresh data setelah update
        dispatch(asyncGetPlanningDetailByLot(lotNumber));
        return response;
      }
      throw new Error(response.message || "Gagal update detail planning");
    } catch (error) {
      toast.error(error.message || "Gagal update detail planning");
      throw error;
    }
  };
}

export function asyncPrintCoa(planningId, quantitiy) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const response = await api.printCoa(planningId, quantitiy);
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
