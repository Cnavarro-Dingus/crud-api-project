import React from "react";
import { Bar } from "react-chartjs-2";
import { Spinner, Alert } from "react-bootstrap";
import { getChartOptions } from "../../utils/getChartOptions";

const SalesChart = ({
  activeChart,
  annualSalesData,
  countrySalesData,
  modelSalesData,
  loading,
  error,
  animating
}) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary" />
        <p className="mt-3">Loading sales data...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const chartClasses = `chart-container ${
    animating ? "chart-exit" : "chart-enter"
  }`;

  const chartConfigs = {
    annual: {
      labels: annualSalesData.map(([year]) => year),
      datasets: [
        {
          label: "Total Units Sold",
          data: annualSalesData.map(([, units]) => units),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
      options: getChartOptions("annual"),
    },
    country: {
      labels: countrySalesData.map(([country]) => country),
      datasets: [
        {
          label: "Total Units Sold",
          data: countrySalesData.map(([, units]) => units),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
      options: getChartOptions("country"),
    },
    model: {
      labels: modelSalesData.map(([label]) => label),
      datasets: [
        {
          label: "Total Units Sold",
          data: modelSalesData.map(([, units]) => units),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
      options: getChartOptions("model"),
    },
  };

  const config = chartConfigs[activeChart];
  if (!config) return null;

  return (
    <div className={chartClasses}>
      <Bar
        data={{
          labels: config.labels,
          datasets: config.datasets,
        }}
        options={config.options}
      />
    </div>
  );
};

export default SalesChart;