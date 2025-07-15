import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { useSelector, useDispatch } from "react-redux";
import { asyncGetPlanningYearly } from "@/store/dashboard/action";
import { Combobox } from "@/components/ui/combo-box";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getCurrentYear = () => new Date().getFullYear();

const TotalPlanningYear = () => {
  const chartRef = useRef(null);
  const dispatch = useDispatch();
  const { planningYearly } = useSelector((state) => state.dashboard);
  const [year, setYear] = useState(getCurrentYear().toString());

  useEffect(() => {
    dispatch(asyncGetPlanningYearly(year.toString()));
  }, [dispatch, year]);

  useEffect(() => {
    let chartInstance = null;
    if (chartRef.current) {
      chartInstance = echarts.init(chartRef.current);

      const data =
        planningYearly?.result?.length === 12
          ? planningYearly.result.map((item) => item.total)
          : Array(12).fill(0);

      const option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["Total Planning"],
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: months,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Total Planning",
            type: "bar",
            data: data,
            markPoint: {
              data: [
                { type: "max", name: "Max" },
                { type: "min", name: "Min" },
              ],
            },
            // markLine: {
            //   data: [{ type: "average", name: "Avg" }],
            // },
          },
        ],
      };

      chartInstance.setOption(option);
      return () => {
        chartInstance && chartInstance.dispose();
      };
    }
  }, [planningYearly, year]);

  // Pilihan tahun: 5 tahun ke belakang sampai 2 tahun ke depan

  const yearOptions = Array.from({ length: 7 }, (_, i) =>
    (getCurrentYear() - 4 + i).toString()
  );
  const yearItems = yearOptions.map((y) => ({ value: y, label: y }));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="year-select">Tahun: </label>
        <div style={{ minWidth: 120, display: "inline-block" }}>
          <Combobox
            items={yearItems}
            value={year}
            onValueChange={setYear}
            placeholder="Pilih tahun..."
            searchPlaceholder="Cari tahun..."
            emptyMessage="Tahun tidak ditemukan."
            className="min-w-[120px]"
          />
        </div>
      </div>
      <div
        ref={chartRef}
        style={{ width: "100%", height: "400px" }}
        id="main"
      />
    </div>
  );
};

export default TotalPlanningYear;
