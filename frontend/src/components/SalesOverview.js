import React, { useState, useEffect } from "react";
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
import { Nav, Button, Card, Form, Row, Col } from "react-bootstrap";
import CarService from "../services/CarService";
import { FaCalendarAlt, FaMapMarkedAlt, FaCarSide, FaFilter } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Map countries to continents for filtering
const countryContinentMap = {
  "United States": "North America", "Canada": "North America", "Mexico": "North America",
  "Brazil": "South America", "Argentina": "South America", "Chile": "South America", 
  "Colombia": "South America", "Peru": "South America", "Venezuela": "South America",
  "United Kingdom": "Europe", "Germany": "Europe", "France": "Europe", "Italy": "Europe", 
  "Spain": "Europe", "Netherlands": "Europe", "Switzerland": "Europe", "Sweden": "Europe", 
  "Belgium": "Europe", "Austria": "Europe", "Poland": "Europe", "Portugal": "Europe", 
  "Greece": "Europe", "Denmark": "Europe", "Norway": "Europe", "Finland": "Europe", 
  "Czech Republic": "Europe", "Hungary": "Europe", "Romania": "Europe", "Ukraine": "Europe", 
  "Ireland": "Europe",
  "China": "Asia", "Japan": "Asia", "South Korea": "Asia", "India": "Asia", "Russia": "Asia", 
  "Thailand": "Asia", "Malaysia": "Asia", "Indonesia": "Asia", "Singapore": "Asia", 
  "Philippines": "Asia", "Vietnam": "Asia", "Israel": "Asia", "Qatar": "Asia", 
  "Saudi Arabia": "Asia", "United Arab Emirates": "Asia",
  "Australia": "Oceania", "New Zealand": "Oceania",
  "South Africa": "Africa", "Egypt": "Africa", "Morocco": "Africa", "Nigeria": "Africa", "Kenya": "Africa"
};

const SalesOverview = () => {
  const [allSalesData, setAllSalesData] = useState([]);
  const [annualSalesData, setAnnualSalesData] = useState([]);
  const [countrySalesData, setCountrySalesData] = useState([]);
  const [modelSalesData, setModelSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("annual");
  const [animating, setAnimating] = useState(false);
  
  // Filters
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedContinent, setSelectedContinent] = useState("all");
  const [selectedMake, setSelectedMake] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMakes, setAvailableMakes] = useState([]);
  const [continents, setContinents] = useState([]);
  const [topModelsCount, setTopModelsCount] = useState(20);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const sales = await CarService.getAllSales();
        setAllSalesData(sales);
        
        // Extract unique years, makes, and continents for filters
        const years = [...new Set(sales.map(sale => sale.sale_year))].sort();
        const makes = [...new Set(sales.map(sale => sale.make))].sort();
        const continentSet = new Set();
        
        sales.forEach(sale => {
          const continent = countryContinentMap[sale.country] || "Other";
          continentSet.add(continent);
        });
        
        setAvailableYears(years);
        setAvailableMakes(makes);
        setContinents([...continentSet].sort());
        
        // Process the data initially
        processData(sales);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  // Process data whenever filters change
  useEffect(() => {
    if (allSalesData.length > 0) {
      let filteredData = [...allSalesData];
      
      // Apply year filter if not "all"
      if (selectedYear !== "all") {
        filteredData = filteredData.filter(sale => sale.sale_year === parseInt(selectedYear));
      }
      
      // Apply continent filter if not "all"
      if (selectedContinent !== "all") {
        filteredData = filteredData.filter(sale => {
          const continent = countryContinentMap[sale.country] || "Other";
          return continent === selectedContinent;
        });
      }
      
      // Apply make filter if not "all"
      if (selectedMake !== "all") {
        filteredData = filteredData.filter(sale => sale.make === selectedMake);
      }
      
      processData(filteredData);
    }
  }, [allSalesData, selectedYear, selectedContinent, selectedMake, topModelsCount]);

  const processData = (sales) => {
    // Process annual sales data
    const annualSales = {};
    const countrySales = {};
    const modelSales = {};

    sales.forEach((sale) => {
      // Annual sales
      annualSales[sale.sale_year] =
        (annualSales[sale.sale_year] || 0) + sale.units_sold;

      // Country sales
      countrySales[sale.country] =
        (countrySales[sale.country] || 0) + sale.units_sold;

      // Model sales with release year
      const modelKey = `${sale.make} ${sale.model}`;
      if (!modelSales[modelKey]) {
        modelSales[modelKey] = {};
      }
      const yearKey = sale.release_year.toString();
      modelSales[modelKey][yearKey] =
        (modelSales[modelKey][yearKey] || 0) + sale.units_sold;
    });

    setAnnualSalesData(
      Object.entries(annualSales).sort((a, b) => a[0] - b[0])
    );

    // Sort country sales from least to most
    setCountrySalesData(
      Object.entries(countrySales).sort((a, b) => a[1] - b[1])
    );

    // Process model sales data to group by model and sort by year
    const processedModelSales = [];
    Object.entries(modelSales).forEach(([model, yearData]) => {
      // Calculate total units for this model across all years
      let totalUnits = 0;
      Object.values(yearData).forEach(units => {
        totalUnits += units;
      });
      
      Object.entries(yearData)
        .sort((a, b) => a[0] - b[0])
        .forEach(([year, units]) => {
          processedModelSales.push([
            `${model} (${year})`,
            units,
            model,
            parseInt(year),
            totalUnits // Store total units for sorting
          ]);
        });
    });

    // Sort by total units sold (descending) and limit to top N models
    const sortedModelSales = processedModelSales
      .sort((a, b) => b[4] - a[4]) // Sort by total units (descending)
      .slice(0, topModelsCount); // Take only top N models
    
    setModelSalesData(sortedModelSales);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 0,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    },
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

  const renderFilters = () => {
    return (
      <Card className="mb-4 filter-card">
        <Card.Body>
          <Card.Title>
            <FaFilter className="me-2" /> Filter Options
          </Card.Title>
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Year</Form.Label>
                <Form.Select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="all">All Years</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Continent</Form.Label>
                <Form.Select 
                  value={selectedContinent} 
                  onChange={(e) => setSelectedContinent(e.target.value)}
                >
                  <option value="all">All Continents</option>
                  {continents.map(continent => (
                    <option key={continent} value={continent}>{continent}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Make</Form.Label>
                <Form.Select 
                  value={selectedMake} 
                  onChange={(e) => setSelectedMake(e.target.value)}
                >
                  <option value="all">All Makes</option>
                  {availableMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          {activeChart === "model" && (
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Show Top Models</Form.Label>
                  <Form.Select 
                    value={topModelsCount} 
                    onChange={(e) => setTopModelsCount(parseInt(e.target.value))}
                  >
                    <option value="10">Top 10</option>
                    <option value="20">Top 20</option>
                    <option value="50">Top 50</option>
                    <option value="100">Top 100</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    );
  };

  const renderChart = () => {
    if (loading) {
      return <p className="text-center pulse">Loading sales data...</p>;
    }

    const chartClasses = `chart-container ${animating ? 'chart-exit' : 'chart-enter'}`;

    switch (activeChart) {
      case "annual":
        return (
          <div className={chartClasses}>
            <Bar
              data={{
                labels: annualSalesData.map(([year]) => year),
                datasets: [
                  {
                    label: "Total Units Sold",
                    data: annualSalesData.map(([, units]) => units),
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        );
      case "country":
        return (
          <div className={chartClasses}>
            <Bar
              data={{
                labels: countrySalesData.map(([country]) => country),
                datasets: [
                  {
                    label: "Total Units Sold",
                    data: countrySalesData.map(([, units]) => units),
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        );
      case "model":
        return (
          <div className={chartClasses}>
            <Bar
              data={{
                labels: modelSalesData.map(([label]) => label),
                datasets: [
                  {
                    label: "Total Units Sold",
                    data: modelSalesData.map(([, units]) => units),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                  },
                ],
              }}
              options={{
                ...chartOptions,
                scales: {
                  ...chartOptions.scales,
                  x: {
                    ...chartOptions.scales.x,
                    ticks: {
                      ...chartOptions.scales.x.ticks,
                      callback: function(value, index) {
                        // Shorten the labels for better display
                        const label = this.getLabelForValue(value);
                        return label.length > 15 ? label.substr(0, 15) + '...' : label;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fade-in">
      <h2 className="page-title">Sales Overview</h2>
      
      <Card className="mb-4 chart-selector-card">
        <Card.Body>
          <Nav variant="pills" className="chart-selector">
            <Nav.Item>
              <Button
                variant={activeChart === "annual" ? "primary" : "outline-primary"}
                onClick={() => handleChartChange("annual")}
                className="chart-btn"
              >
                <FaCalendarAlt className="me-2" /> Annual Sales
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button
                variant={activeChart === "country" ? "primary" : "outline-primary"}
                onClick={() => handleChartChange("country")}
                className="chart-btn"
              >
                <FaMapMarkedAlt className="me-2" /> Country Sales
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button
                variant={activeChart === "model" ? "primary" : "outline-primary"}
                onClick={() => handleChartChange("model")}
                className="chart-btn"
              >
                <FaCarSide className="me-2" /> Model Sales
              </Button>
            </Nav.Item>
          </Nav>
        </Card.Body>
      </Card>

      {renderFilters()}

      <Card>
        <Card.Body>
          <div className="chart-title">
            {activeChart === "annual" && <h3>Total Annual Sales</h3>}
            {activeChart === "country" && <h3>Sales Per Country</h3>}
            {activeChart === "model" && <h3>Sales Per Model</h3>}
            
            {/* Show filter summary */}
            <p className="filter-summary">
              {selectedYear !== "all" && `Year: ${selectedYear} | `}
              {selectedContinent !== "all" && `Continent: ${selectedContinent} | `}
              {selectedMake !== "all" && `Make: ${selectedMake} | `}
              {activeChart === "model" && `Showing top ${topModelsCount} models`}
              {selectedYear === "all" && selectedContinent === "all" && selectedMake === "all" && 
               activeChart !== "model" && "Showing all data"}
            </p>
          </div>
          <div className="chart-wrapper">
            {renderChart()}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SalesOverview;
