import { useState, useEffect, useCallback } from "react";
import CarService from "../services/CarService";
import { getContinentFromCountry } from "../utils/countryMapping";
import { processSalesData } from "../utils/processSalesData";

export const useSalesData = (topModelsCount) => {
  const [allSalesData, setAllSalesData] = useState([]);
  const [annualSalesData, setAnnualSalesData] = useState([]);
  const [countrySalesData, setCountrySalesData] = useState([]);
  const [modelSalesData, setModelSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedContinent, setSelectedContinent] = useState("all");
  const [selectedMake, setSelectedMake] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMakes, setAvailableMakes] = useState([]);
  const [continents, setContinents] = useState([]);

  const processData = useCallback(
    (sales) => {
      const { annualSalesData, countrySalesData, modelSalesData } =
        processSalesData(sales, topModelsCount);
      setAnnualSalesData(annualSalesData);
      setCountrySalesData(countrySalesData);
      setModelSalesData(modelSalesData);
    },
    [topModelsCount]
  );

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
  }, [processData]);

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
  ]);

  return {
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
  };
};