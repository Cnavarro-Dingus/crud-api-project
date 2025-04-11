export const processSalesData = (sales, topModelsCount) => {
  const { annualSales, countrySales, modelSales } = sales.reduce(
    (acc, sale) => {
      acc.annualSales[sale.sale_year] =
        (acc.annualSales[sale.sale_year] || 0) + sale.units_sold;

      acc.countrySales[sale.country] =
        (acc.countrySales[sale.country] || 0) + sale.units_sold;

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

  const processedModelSales = [];
  Object.entries(modelSales).forEach(([model, yearData]) => {
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

  return {
    annualSalesData: Object.entries(annualSales).sort((a, b) => a[0] - b[0]),
    countrySalesData: Object.entries(countrySales).sort((a, b) => a[1] - b[1]),
    modelSalesData: processedModelSales
      .sort((a, b) => b[4] - a[4])
      .slice(0, topModelsCount),
  };
};