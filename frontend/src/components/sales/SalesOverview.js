import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, Button } from "react-bootstrap";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import FilterCard from "./FilterCard";
import SalesChart from "./SalesChart";
import ChartSelector from "./ChartSelector";
import { useSalesData } from "../../hooks/useSalesData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesOverview = () => {
  const [activeChart, setActiveChart] = useState("annual");
  const [animating, setAnimating] = useState(false);
  const [topModelsCount, setTopModelsCount] = useState(20);

  const {
    annualSalesData,
    countrySalesData,
    modelSalesData,
    loading,
    error,
    selectedYear,
    setSelectedYear,
    selectedContinent,
    setSelectedContinent,
    selectedMake,
    setSelectedMake,
    availableYears,
    availableMakes,
    continents
  } = useSalesData(topModelsCount);

  const handleChartChange = (chartType) => {
    if (chartType !== activeChart) {
      setAnimating(true);
      setTimeout(() => {
        setActiveChart(chartType);
        setTimeout(() => {
          setAnimating(false);
        }, 50);
      }, 300);
    }
  };

  // Function to export chart data
  const exportChartData = () => {
    let dataToExport;
    let filename;

    switch (activeChart) {
      case "annual":
        dataToExport = annualSalesData.map(([year, units]) => ({
          Year: year,
          "Units Sold": units,
        }));
        filename = "annual_sales_data.csv";
        break;
      case "country":
        dataToExport = countrySalesData.map(([country, units]) => ({
          Country: country,
          "Units Sold": units,
        }));
        filename = "country_sales_data.csv";
        break;
      case "model":
        dataToExport = modelSalesData.map(([label, units]) => ({
          Model: label,
          "Units Sold": units,
        }));
        filename = "model_sales_data.csv";
        break;
      default:
        return;
    }

    // Convert to CSV
    const headers = Object.keys(dataToExport[0]);
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((row) =>
        headers.map((header) => row[header]).join(",")
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Sales Overview</h2>
        <Link to="/" className="btn btn-outline-primary">
          <FaArrowLeft className="me-2" /> Back to Cars
        </Link>
      </div>
      
      <FilterCard
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedContinent={selectedContinent}
        setSelectedContinent={setSelectedContinent}
        selectedMake={selectedMake}
        setSelectedMake={setSelectedMake}
        availableYears={availableYears}
        availableMakes={availableMakes}
        continents={continents}
        activeChart={activeChart}
        topModelsCount={topModelsCount}
        setTopModelsCount={setTopModelsCount}
      />
      
      <ChartSelector 
        activeChart={activeChart} 
        onChartChange={handleChartChange} 
      />
      
      <Card>
        <Card.Body>
          <div className="chart-title d-flex justify-content-between align-items-center">
            <div>
              {activeChart === "annual" && <h3>Total Annual Sales</h3>}
              {activeChart === "country" && <h3>Sales Per Country</h3>}
              {activeChart === "model" && <h3>Sales Per Model</h3>}

              <p className="filter-summary">
                {selectedYear !== "all" && `Year: ${selectedYear} | `}
                {selectedContinent !== "all" &&
                  `Continent: ${selectedContinent} | `}
                {selectedMake !== "all" && `Make: ${selectedMake} | `}
                {activeChart === "model" &&
                  `Showing top ${topModelsCount} models`}
                {selectedYear === "all" &&
                  selectedContinent === "all" &&
                  selectedMake === "all" &&
                  activeChart !== "model" &&
                  "Showing all data"}
              </p>
            </div>

            <Button
              variant="btn btn-outline-primary"
              size="sm"
              onClick={exportChartData}
              disabled={loading || error}
            >
              <FaDownload className="me-1" /> Export Data
            </Button>
          </div>
          
          <div className="chart-wrapper" style={{ height: "600px" }}>
            <SalesChart
              activeChart={activeChart}
              annualSalesData={annualSalesData}
              countrySalesData={countrySalesData}
              modelSalesData={modelSalesData}
              loading={loading}
              error={error}
              animating={animating}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SalesOverview;