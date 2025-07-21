import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const StockPredictionChart = ({ stockId }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = {
      usage_trend: [
        { date: '2025-07-10', available_stock: 120, type: 'actual', upper_bound: 125, lower_bound: 115 },
        { date: '2025-07-11', available_stock: 110, type: 'actual', upper_bound: 115, lower_bound: 105 },
        { date: '2025-07-12', available_stock: 105, type: 'actual', upper_bound: 110, lower_bound: 100 },
        { date: '2025-07-13', available_stock: 98, type: 'actual', upper_bound: 104, lower_bound: 92 },
        { date: '2025-07-14', available_stock: 92, type: 'actual', upper_bound: 98, lower_bound: 86 },
        { date: '2025-07-15', available_stock: 87, type: 'forecast', upper_bound: 95, lower_bound: 80 },
        { date: '2025-07-16', available_stock: 81, type: 'forecast', upper_bound: 90, lower_bound: 73 },
        { date: '2025-07-17', available_stock: 76, type: 'forecast', upper_bound: 85, lower_bound: 67 },
        { date: '2025-07-18', available_stock: 70, type: 'forecast', upper_bound: 80, lower_bound: 60 },
        { date: '2025-07-19', available_stock: 65, type: 'forecast', upper_bound: 75, lower_bound: 55 }
      ]
    };

    const data = mockData.usage_trend;

    const labels = data.map(d => d.date);
    const values = data.map(d => d.available_stock);
    const upperBounds = data.map(d => d.upper_bound);
    const lowerBounds = data.map(d => d.lower_bound);
    const types = data.map(d => d.type);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Availability',
          data: values,
          borderColor: 'orange',
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.4,
          segment: {
            borderDash: ctx => types[ctx.p0DataIndex] === 'forecast' ? [5, 5] : undefined,
            borderColor: ctx => types[ctx.p0DataIndex] === 'forecast' ? 'orange' : 'blue',
          }
        },
        {
          label: 'Upper Bound',
          data: upperBounds,
          borderColor: 'transparent',
          backgroundColor: 'rgba(255,165,0,0.2)',
          fill: '-1', // fill to the previous dataset (Lower Bound)
          tension: 0.4,
        },
        {
          label: 'Lower Bound',
          data: lowerBounds,
          borderColor: 'transparent',
          backgroundColor: 'rgba(255,165,0,0.2)',
          fill: '-1', // no fill below lower bound
          tension: 0.4,
        }
      ]
    });

    setLoading(false);
  }, [stockId]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Available Stock' } },
    },
  };

  if (loading) return <p>Loading...</p>;
  if (!chartData) return <p>No data available.</p>;

  return <Line data={chartData} options={options} />;
};

export default StockPredictionChart;
