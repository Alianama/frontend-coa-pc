import api from "@/services/api/report";
import { toast } from "sonner";

const ActionType = {
  RECEIVE_REPORT_HISTORY: "RECEIVE_REPORT_HISTORY",
};

function receiveReportHistoryActionCreator(data) {
  return {
    type: ActionType.RECEIVE_REPORT_HISTORY,
    payload: data,
  };
}

function asyncGetReportHistory() {
  return async (dispatch) => {
    try {
      const data = await api.getReportHistory();
      dispatch(receiveReportHistoryActionCreator(data));
    } catch (error) {
      toast.error(error.message);
      console.error("Error fetching report history:", error);
    }
  };
}

function asyncGenerateReportByDate(startDate, endDate) {
  return async () => {
    try {
      const result = await api.getReportExcelByDate(startDate, endDate);
      toast.success(`Report generated successfully! File: ${result.filename}`);
    } catch (error) {
      toast.error(error.message || "Failed to generate report");
      throw error;
    }
  };
}

function asyncGenerateReportByMonthYear(month, year) {
  return async () => {
    try {
      const result = await api.getReportExcelByMonthYear(month, year);
      toast.success(`Report generated successfully! File: ${result.filename}`);
    } catch (error) {
      toast.error(error.message || "Failed to generate report");
      throw error;
    }
  };
}

function asyncDownloadReportById(id) {
  return async () => {
    try {
      const result = await api.downloadReportById(id);
      toast.success(`Downloading ${result.filename}...`);
    } catch (error) {
      toast.error(error.message || "Gagal download file");
      throw error;
    }
  };
}

// Untuk download dan export excel, biasanya langsung dipakai di komponen, tapi bisa juga dibuat async function jika ingin loading state

export {
  ActionType,
  receiveReportHistoryActionCreator,
  asyncGetReportHistory,
  asyncGenerateReportByDate,
  asyncGenerateReportByMonthYear,
  asyncDownloadReportById,
};
