import api from "@/services/api";
import { toast } from "sonner";

export function setPlanningDetailActionCreator(data, totalQtyCheck, header) {
  return {
    type: "SET_PLANNING_DETAIL",
    payload: { data, totalQtyCheck, header },
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
