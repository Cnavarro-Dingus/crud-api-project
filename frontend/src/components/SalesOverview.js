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
import CarService from "../services/CarService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesOverview = () => {
  const [annualSalesData, setAnnualSalesData] = useState([]);
  const [countrySalesData, setCountrySalesData] = useState([]);
  const [modelSalesData, setModelSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const sales = await CarService.getAllSales();

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
          Object.entries(yearData)
            .sort((a, b) => a[0] - b[0])
            .forEach(([year, units]) => {
              processedModelSales.push([
                `${model} (${year})`,
                units,
                model,
                parseInt(year),
              ]);
            });
        });

        // Sort by model name first, then by year
        setModelSalesData(
          processedModelSales.sort((a, b) => {
            if (a[2] === b[2]) {
              return a[3] - b[3]; // Sort by year if models are the same
            }
            return a[2].localeCompare(b[2]); // Sort by model name
          })
        );
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

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
    },
  };

  return (
    <div>
      <h2>Sales Overview</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>Total Annual Sales</h3>
          <div style={{ height: "400px" }}>
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

          <h3>Sales Per Country</h3>
          <div style={{ height: "400px" }}>
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

          <h3>Sales Per Model</h3>
          <div style={{ height: "400px" }}>
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
              options={chartOptions}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SalesOverview;
