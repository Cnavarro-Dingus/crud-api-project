export const getChartOptions = (chartType) => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        right: 25,
        bottom: 20,
        left: 25,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        padding: 15,
        displayColors: false,
      },
    },
  };

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