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
        console.log(`Fetching sales data for model: ${model}, year: ${year}`);
        let data;
        if (year) {
          data = await CarService.getSalesByModelAndYear(model, year);
        } else {
          data = await CarService.getSalesByModel(model);
        }
        console.log("Received sales data:", data);
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
    <div>
      <h2>
        Sales Details for {model} {year ? `(${year})` : ""}
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : salesData.length === 0 ? (
        <p>
          No sales data available for this model
          {year ? ` and year ${year}` : ""}.
        </p>
      ) : (
        <Bar data={chartData} />
      )}
    </div>
  );
};

export default SalesDetails;
