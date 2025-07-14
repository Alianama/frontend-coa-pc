import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  asyncGetReportHistory,
  asyncGenerateReportByDate,
  asyncGenerateReportByMonthYear,
  asyncDownloadReportById,
} from "@/store/report/action";
import ReportHeader from "./ReportHeader";
import ReportGenerateForm from "./ReportGenerateForm";
import ReportHistoryTable from "./ReportHistoryTable";

export default function ReportGenerator() {
  const [activeTab, setActiveTab] = useState("daterange");
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState({
    from: undefined,
    to: undefined,
  });
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const dispatch = useDispatch();
  const reportHistoryRaw = useSelector((state) => state.report.reportHistory);

  useEffect(() => {
    dispatch(asyncGetReportHistory());
  }, [dispatch]);

  // Filter & search logic
  const filteredHistory = reportHistoryRaw.filter((report) => {
    // Search by fileName or username
    const searchLower = search.toLowerCase();
    const matchSearch =
      report.fileName.toLowerCase().includes(searchLower) ||
      report.username.toLowerCase().includes(searchLower);
    // Filter by date range
    if (filterDate?.from && filterDate?.to) {
      const createdAt = new Date(report.createdAt);
      return (
        matchSearch &&
        createdAt >= filterDate.from &&
        createdAt <= filterDate.to
      );
    }
    return matchSearch;
  });

  // Pagination logic
  const totalPage = Math.max(1, Math.ceil(filteredHistory.length / perPage));
  const paginatedHistory = filteredHistory.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Reset page if filter/search changes
  useEffect(() => {
    setPage(1);
  }, [search, filterDate]);

  // Handle date range selection
  const handleDateRangeChange = (selectedRange) => {
    try {
      if (!selectedRange) {
        setDateRange({ from: undefined, to: undefined });
        return;
      }
      if (typeof selectedRange === "object" && "from" in selectedRange) {
        setDateRange({
          from: selectedRange.from || undefined,
          to: selectedRange.to || undefined,
        });
      }
    } catch (error) {
      console.error(error);
      setDateRange({ from: undefined, to: undefined });
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      if (activeTab === "daterange") {
        if (!dateRange.from || !dateRange.to) {
          toast.error("Please select both start and end dates");
          setIsGenerating(false);
          return;
        }
        if (
          !(dateRange.from instanceof Date) ||
          !(dateRange.to instanceof Date)
        ) {
          toast.error("Invalid date format selected");
          setIsGenerating(false);
          return;
        }
        const formattedStartDate = format(dateRange.from, "yyyy-MM-dd");
        const formattedEndDate = format(dateRange.to, "yyyy-MM-dd");
        await dispatch(
          asyncGenerateReportByDate(formattedStartDate, formattedEndDate)
        );
      } else {
        if (!selectedMonth || !selectedYear) {
          toast.error("Please select both month and year");
          setIsGenerating(false);
          return;
        }
        await dispatch(
          asyncGenerateReportByMonthYear(selectedMonth, selectedYear)
        );
      }
      dispatch(asyncGetReportHistory());
      setDateRange({ from: undefined, to: undefined });
      setSelectedMonth("");
      setSelectedYear("");
    } catch (error) {
      toast.error(error.message || "Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = useCallback(
    (report) => {
      dispatch(asyncDownloadReportById(report.id));
    },
    [dispatch]
  );

  return (
    <div className="container mx-auto p-0 max-w-6xl space-y-8">
      <ReportHeader />
      <ReportGenerateForm
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        isGenerating={isGenerating}
        handleGenerateReport={handleGenerateReport}
        handleDateRangeChange={handleDateRangeChange}
      />
      <ReportHistoryTable
        reportHistory={paginatedHistory}
        handleDownload={handleDownload}
        search={search}
        setSearch={setSearch}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        page={page}
        setPage={setPage}
        totalPage={totalPage}
      />
    </div>
  );
}
