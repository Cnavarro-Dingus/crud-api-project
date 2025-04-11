import React, { useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
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
import { Card, Spinner, Alert, Button } from "react-bootstrap";
import CarService from "../services/CarService";
import {
  FaDownload,
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaCarSide
} from "react-icons/fa";
import FilterCard from "./FilterCard";
import { getContinentFromCountry } from "../utils/countryMapping";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesOverview = () => {
  const [allSalesData, setAllSalesData] = useState([]);
  const [annualSalesData, setAnnualSalesData] = useState([]);
  const [countrySalesData, setCountrySalesData] = useState([]);
  const [modelSalesData, setModelSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("annual");
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedContinent, setSelectedContinent] = useState("all");
  const [selectedMake, setSelectedMake] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMakes, setAvailableMakes] = useState([]);
  const [continents, setContinents] = useState([]);
  const [topModelsCount, setTopModelsCount] = useState(20);

  // Wrap processData in useCallback to prevent unnecessary recreations
  const processData = useCallback(
    (sales) => {
      // Use reduce for better performance
      const { annualSales, countrySales, modelSales } = sales.reduce(
        (acc, sale) => {
          // Annual sales
          acc.annualSales[sale.sale_year] =
            (acc.annualSales[sale.sale_year] || 0) + sale.units_sold;

          // Country sales
          acc.countrySales[sale.country] =
            (acc.countrySales[sale.country] || 0) + sale.units_sold;

          // Model sales with release year
          const modelKey = `${sale.make} ${sale.model}`;
          if (!acc.modelSales[modelKey]) {
            acc.modelSales[modelKey] = {};
          }
          const yearKey = sale.release_year.toString();
          acc.modelSales[modelKey][yearKey] =
            (acc.modelSales[modelKey][yearKey] || 0) + sale.units_sold;

          return acc;
        },
        { annualSales: {}, countrySales: {}, modelSales: {} }
      );

      // Sort annual sales by year
      setAnnualSalesData(
        Object.entries(annualSales).sort((a, b) => a[0] - b[0])
      );

      // Sort country sales from least to most
      setCountrySalesData(
        Object.entries(countrySales).sort((a, b) => a[1] - b[1])
      );

      // Process model sales data more efficiently
      const processedModelSales = [];

      Object.entries(modelSales).forEach(([model, yearData]) => {
        // Calculate total units once
        const totalUnits = Object.values(yearData).reduce(
          (sum, units) => sum + units,
          0
        );

        Object.entries(yearData)
          .sort((a, b) => a[0] - b[0])
          .forEach(([year, units]) => {
            processedModelSales.push([
              `${model} (${year})`,
              units,
              model,
              parseInt(year),
              totalUnits,
            ]);
          });
      });

      // Sort and limit model sales
      setModelSalesData(
        processedModelSales.sort((a, b) => b[4] - a[4]).slice(0, topModelsCount)
      );
    },
    [topModelsCount]
  ); // Add topModelsCount as a dependency

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const sales = await CarService.getAllSales();

        if (!sales || sales.length === 0) {
          setError("No sales data available. Please check your database.");
          return;
        }

        setAllSalesData(sales);

        // Extract unique years, makes, and continents for filters
        const years = [...new Set(sales.map((sale) => sale.sale_year))].sort();
        const makes = [...new Set(sales.map((sale) => sale.make))].sort();
        const continentSet = new Set();

        sales.forEach((sale) => {
          const continent = getContinentFromCountry(sale.country);
          continentSet.add(continent);
        });

        setAvailableYears(years);
        setAvailableMakes(makes);
        setContinents([...continentSet].sort());

        // Process the data initially
        processData(sales);
        setError(null);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setError("Failed to load sales data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [processData]); // Add processData as a dependency

  // Process data whenever filters change
  useEffect(() => {
    if (allSalesData.length > 0) {
      let filteredData = [...allSalesData];

      // Apply year filter if not "all"
      if (selectedYear !== "all") {
        filteredData = filteredData.filter(
          (sale) => sale.sale_year === parseInt(selectedYear)
        );
      }

      // Apply continent filter if not "all"
      if (selectedContinent !== "all") {
        filteredData = filteredData.filter((sale) => {
          return getContinentFromCountry(sale.country) === selectedContinent;
        });
      }

      // Apply make filter if not "all"
      if (selectedMake !== "all") {
        filteredData = filteredData.filter(
          (sale) => sale.make === selectedMake
        );
      }

      processData(filteredData);
    }
  }, [
    allSalesData,
    selectedYear,
    selectedContinent,
    selectedMake,
    processData,
  ]); // Add processData as a dependency

  const getChartOptions = (chartType) => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 20,
          right: 25,
          bottom: 20,
          left: 25
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)"
          },
          ticks: {
            font: {
              size: 12
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: 11
            }
          }
        }
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
              size: 14
            },
            padding: 20
          }
        },
        title: {
          display: true,
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 30
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 13
          },
          padding: 15,
          displayColors: false
        }
      }
    };

    // Add chart-specific options
    if (chartType === "model") {
      return {
        ...baseOptions,
        scales: {
          ...baseOptions.scales,
          x: {
            ...baseOptions.scales.x,
            ticks: {
              ...baseOptions.scales.x.ticks,
              callback: function (value, index) {
                const label = this.getLabelForValue(value);
                return label.length > 15 ? label.substr(0, 15) + "..." : label;
              },
            },
          },
        },
      };
    }

    return baseOptions;
  };

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

  const renderFilters = () => {
    return (
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
    );
  };

  // Update the renderChart function to show a better loading state
  const renderChart = () => {
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

  // Function to render the chart selector buttons
  const renderChartSelector = () => {
    return (
      <Card className="chart-selector-card mb-4">
        <Card.Body>
          <div className="d-flex justify-content-center">
            <div className="btn-group">
              <Button
                variant={activeChart === "annual" ? "primary" : "outline-primary"}
                onClick={() => handleChartChange("annual")}
                className="d-flex align-items-center"
              >
                <FaCalendarAlt className="me-2" /> Annual Sales
              </Button>
              <Button
                variant={activeChart === "country" ? "primary" : "outline-primary"}
                onClick={() => handleChartChange("country")}
                className="d-flex align-items-center"
              >
                <FaMapMarkedAlt className="me-2" /> Country Sales
              </Button>
              <Button
                variant={activeChart === "model" ? "primary" : "outline-primary"}
                onClick={() => handleChartChange("model")}
                className="d-flex align-items-center"
              >
                <FaCarSide className="me-2" /> Model Sales
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Sales Overview</h2>
        <Link to="/" className="btn btn-outline-primary">
          <FaArrowLeft className="me-2" /> Back to Cars
        </Link>
      </div>
      
      {renderFilters()}
      
      {renderChartSelector()}
      
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
            {renderChart()}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SalesOverview;
