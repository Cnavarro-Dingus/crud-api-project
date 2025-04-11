import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Spinner, Alert, Card } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Units Sold",
        },
      },
      x: {
        title: {
          display: true,
          text: "Country",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Sales Distribution for ${model} ${year ? `(${year})` : ""}`,
      },
    },
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">
          Sales Details for {model} {year ? `(${year})` : ""}
        </h2>
        <Link to="/" className="btn btn-outline-primary">
          <FaArrowLeft className="me-2" /> Back to Cars
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-3">Loading sales data...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="slide-in">
          <Alert.Heading>Error Loading Data</Alert.Heading>
          <p>{error}</p>
        </Alert>
      ) : salesData.length === 0 ? (
        <Alert variant="info" className="slide-in">
          <Alert.Heading>No Data Available</Alert.Heading>
          <p>
            No sales data available for this model
            {year ? ` and year ${year}` : ""}.
          </p>
        </Alert>
      ) : (
        <Card className="slide-in">
          <Card.Body>
            <div style={{ height: "400px" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default SalesDetails;
