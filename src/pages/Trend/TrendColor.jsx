import { useState, useEffect, useRef, useCallback } from "react";
import ReactECharts from "echarts-for-react";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetTrendData } from "@/store/trend/action";
import { asyncGetProduct } from "@/store/product/action";
import { Combobox } from "@/components/ui/combo-box";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

const ColorTrendChart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    productId: 1,
    parameter: "colorDeltaE",
    lotNumber: "",
    startDate: "",
    endDate: "",
  });
  const dispatch = useDispatch();
  const data = useSelector((state) => state.trend.trendData);
  const { products } = useSelector((state) => state.products);
  const chartRef = useRef(null);

  console.log(data);

  useEffect(() => {
    dispatch(asyncGetProduct());
  }, [dispatch]);

  // Available parameters
  const parameters = [
    { value: "colorDeltaL", label: "Color Delta L*" },
    { value: "colorDeltaA", label: "Color Delta a*" },
    { value: "colorDeltaB", label: "Color Delta b*" },
    { value: "colorDeltaE", label: "Color Delta E*" },
    { value: "tintDeltaL", label: "Tint Delta L*" },
    { value: "tintDeltaA", label: "Tint Delta a*" },
    { value: "tintDeltaB", label: "Tint Delta b*" },
    { value: "tintDeltaE", label: "Tint Delta E*" },
    { value: "density", label: "Density (g/cm³)" },
    { value: "mfr", label: "MFR (g/10min)" },
    { value: "pelletDiameter", label: "Pellet Diameter (mm)" },
    { value: "pelletLength", label: "Pellet Length (mm)" },
  ];

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      dispatch(
        asyncGetTrendData({
          productId: filters.productId,
          parameter: filters.parameter,
          lotNumber: filters.lotNumber,
          startDate: filters.startDate,
          endDate: filters.endDate,
        })
      );
    } catch (err) {
      setError(err.message);
      console.error("Error fetching chart data:", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, filters]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRefresh = () => {
    fetchChartData();
  };

  const handleDownloadChart = () => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance();
      const dataURL = chartInstance.getDataURL({
        type: "png",
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      // Buat nama file yang dinamis
      const selectedProduct = products?.find(
        (p) => p.id.toString() === filters.productId?.toString()
      );
      const productName = selectedProduct
        ? selectedProduct.productName.replace(/[^a-zA-Z0-9]/g, "_")
        : "chart";
      const parameterName = filters.parameter.replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `trend_${productName}_${parameterName}_${
        new Date().toISOString().split("T")[0]
      }.png`;

      // Download file
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">
          <div className="text-lg font-bold">Error</div>
          <div>{error}</div>
          <button
            onClick={handleRefresh}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product
          </label>
          <Combobox
            items={products
              ?.filter((product) => product.status === "active")
              .map((product) => ({
                value: product.id.toString(),
                label: product.productName,
              }))}
            value={filters.productId?.toString()}
            onValueChange={(value) => handleFilterChange("productId", value)}
            placeholder="Pilih produk..."
            searchPlaceholder="Cari produk..."
            emptyMessage="Produk tidak ditemukan."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parameter
          </label>
          <select
            value={filters.parameter}
            onChange={(e) => handleFilterChange("parameter", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {parameters.map((param) => (
              <option key={param.value} value={param.value}>
                {param.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lot Number (Optional)
          </label>
          <input
            type="text"
            value={filters.lotNumber}
            onChange={(e) => handleFilterChange("lotNumber", e.target.value)}
            placeholder="e.g., LOT001"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date (Optional)
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date (Optional)
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chart */}
      {data &&
        data.xAxis &&
        data.series &&
        data.xAxis.length > 0 &&
        data.series.length > 0 && (
          <div>
            {/* Download Button */}
            <div className="mb-4 flex justify-end">
              <Button className="shadow-2xl" onClick={handleDownloadChart}>
                <DownloadIcon /> PNG
              </Button>
            </div>

            <ReactECharts
              ref={chartRef}
              option={{
                title: {
                  text: `${data.yAxisLabel || filters.parameter} Trend`,
                  left: "center",
                  textStyle: {
                    fontSize: 16,
                    fontWeight: "bold",
                  },
                },
                tooltip: {
                  trigger: "axis",
                },
                xAxis: {
                  type: "category",
                  data: data.xAxis,
                  axisLabel: {
                    rotate: 45,
                    fontSize: 10,
                  },
                },
                yAxis: {
                  type: "value",
                  name: data.yAxisLabel || filters.parameter,
                  nameLocation: "middle",
                  nameGap: 40,
                  axisLabel: {
                    fontSize: 10,
                  },
                },
                series: data.series.map((series) => ({
                  name: series.name,
                  type: "line",
                  data: series.data.map((value) => Number(value.toFixed(2))),
                  smooth: true,
                  lineStyle: {
                    color: "#007bff",
                    width: 2,
                  },
                  itemStyle: {
                    color: "#007bff",
                  },
                  areaStyle: {
                    color: {
                      type: "linear",
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        {
                          offset: 0,
                          color: "rgba(0, 123, 255, 0.3)",
                        },
                        {
                          offset: 1,
                          color: "rgba(0, 123, 255, 0.05)",
                        },
                      ],
                    },
                  },
                  markLine: {
                    data: [
                      {
                        type: "average",
                        name: "Rata-rata",
                        lineStyle: {
                          color: "#ff6b6b",
                          type: "dashed",
                        },
                        label: {
                          formatter: "Rata-rata: {c}",
                        },
                      },
                    ],
                  },
                  markPoint: {
                    data: [
                      {
                        type: "max",
                        name: "Maksimum",
                      },
                      {
                        type: "min",
                        name: "Minimum",
                      },
                    ],
                  },
                })),
                grid: {
                  left: "10%",
                  right: "10%",
                  bottom: "15%",
                  top: "15%",
                  containLabel: true,
                },
              }}
              style={{ height: "500px" }}
              opts={{ renderer: "canvas" }}
            />

            {/* Statistics */}
            {data.series && data.series[0] && data.series[0].data && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(
                      data.series[0].data.reduce((a, b) => a + b, 0) /
                      data.series[0].data.length
                    ).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Rata-rata</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.min(...data.series[0].data).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Minimum</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {Math.max(...data.series[0].data).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Maksimum</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {data.series[0].data.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Data</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {(() => {
                      const values = data.series[0].data;
                      const mean =
                        values.reduce((a, b) => a + b, 0) / values.length;
                      const variance =
                        values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
                        values.length;
                      return Math.sqrt(variance).toFixed(2);
                    })()}
                  </div>
                  <div className="text-sm text-gray-600">Std Dev</div>
                </div>
              </div>
            )}
          </div>
        )}

      {/* No Data */}
      {data && (data.xAxis.length === 0 || data.series.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            Tidak ada data untuk parameter yang dipilih
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorTrendChart;
