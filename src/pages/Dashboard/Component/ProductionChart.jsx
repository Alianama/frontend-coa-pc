import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as echarts from "echarts/core";
import {
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition, LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { asyncGetLotProgress } from "@/store/dashboard/action";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

echarts.use([
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  LabelLayout,
]);

const ProductionChart = () => {
  const dispatch = useDispatch();
  const { lotProgress } = useSelector((state) => state.dashboard);
  const lineChartRef = useRef(null);
  const lineChartInstance = useRef(null);

  // State untuk date range
  const [date, setDate] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  // Konfigurasi chart options
  const getChartOptions = (data) => ({
    title: {
      left: "center",
      top: 10,
      text: "Progress Produksi Lot",
      textStyle: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    legend: {
      top: 30,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    dataset: {
      source: data,
    },
    xAxis: {
      type: "category",
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
      gridIndex: 0,
    },
    grid: {
      top: 80,
      bottom: 60,
      left: 50,
      right: 20,
    },
    series: [
      {
        name: "Qty Planning",
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
        itemStyle: { color: "#1890ff" },
      },
      {
        name: "Qty Checked",
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
        itemStyle: { color: "#52c41a" },
      },
      {
        name: "Qty Printed",
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
        itemStyle: { color: "#faad14" },
      },
    ],
  });

  // Fungsi untuk mendapatkan tanggal dalam format ISO
  const formatDateToISO = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Fungsi untuk inisialisasi chart
  const initializeChart = () => {
    if (!lineChartRef.current || !lotProgress || lotProgress.length === 0)
      return;

    if (lineChartInstance.current) {
      lineChartInstance.current.dispose();
    }

    lineChartInstance.current = echarts.init(lineChartRef.current);
    const options = getChartOptions(lotProgress);
    lineChartInstance.current.setOption(options);
  };

  // Fungsi untuk handle resize
  const handleResize = () => {
    lineChartInstance.current?.resize();
  };

  // Fetch data berdasarkan date range
  const fetchData = () => {
    if (date?.from && date?.to) {
      const startDate = formatDateToISO(date.from);
      const endDate = formatDateToISO(date.to);
      dispatch(asyncGetLotProgress(startDate, endDate));
    }
  };

  // Fetch data saat komponen mount dengan default date range
  useEffect(() => {
    fetchData();
  }, [dispatch, date]);

  // Fetch data saat date range berubah
  useEffect(() => {
    try {
      if (date?.from && date?.to) {
        fetchData();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [date]);

  // Inisialisasi dan update chart
  useEffect(() => {
    initializeChart();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      lineChartInstance.current?.dispose();
    };
  }, [lotProgress]);

  const isLoading = !lotProgress || lotProgress.length === 0;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Date Range Picker */}
      <div className="flex pl-4 items-center gap-2">
        <span className="text-sm font-medium">Range Tanggal:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pilih tanggal</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from || new Date()}
              selected={date}
              onSelect={(selectedDate) => {
                try {
                  setDate(selectedDate);
                } catch (error) {
                  console.error("Error setting date:", error);
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Chart Container */}
      <div
        ref={lineChartRef}
        style={{
          width: "100%",
          height: "400px",
          background: "#fff",
          borderRadius: 8,
        }}
      >
        {isLoading && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
              fontSize: 16,
              background: "#f9f9f9",
              zIndex: 1,
            }}
          >
            Memuat data produksi...
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionChart;
