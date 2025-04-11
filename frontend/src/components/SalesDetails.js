import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import CarService from "../services/CarService";

// Register the necessary scales and elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesDetails = () => {
  const { model, year } = useParams();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        let data;
        if (year) {
          data = await CarService.getSalesByModelAndYear(model, year);
        } else {
          data = await CarService.getSalesByModel(model);
        }
        setSalesData(data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [model, year]);

  const chartData = {
    labels: salesData.map((sale) => `${sale.country}`),
    datasets: [
      {
        label: "Units Sold",
        data: salesData.map((sale) => sale.units_sold),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="fade-in">
      <h2 className="page-title">
        Sales Details for {model} {year ? `(${year})` : ""}
      </h2>
      {loading ? (
        <div className="text-center">
          <p className="pulse">Loading...</p>
        </div>
      ) : error ? (
        <p className="slide-in text-danger">{error}</p>
      ) : salesData.length === 0 ? (
        <p className="slide-in">
          No sales data available for this model
          {year ? ` and year ${year}` : ""}.
        </p>
      ) : (
        <div className="slide-in">
          <Bar data={chartData} />
        </div>
      )}
    </div>
  );
};

export default SalesDetails;
