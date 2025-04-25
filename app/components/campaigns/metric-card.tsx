// components/campaigns/metric-card.tsx
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  data: number[];
  isActive?: boolean;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  data, 
  isActive = false 
}: MetricCardProps) {
  // Chart data configuration
  const chartData = {
    labels: Array(data.length).fill(""),
    datasets: [
      {
        data: data,
        fill: true,
        backgroundColor: trend === "up" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
        borderColor: trend === "up" ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div 
      className={`bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
        isActive ? 'ring-2 text-green-800 ring-offset-2' : ''
      } cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            trend === "up"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {change}
        </span>
      </div>
      <div className="h-12">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}