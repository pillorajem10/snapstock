import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

//UTILS
import { formatPriceX } from '../../utils/methods'

function BarChart({ chartData }) {
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.dataset.data[context.dataIndex];
            return formatPriceX(value);
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => formatPriceX(value),
        },
      },
    },
  };

  console.log('options', options)

  return <Bar data={chartData} options={options} />;
}

export default BarChart;
