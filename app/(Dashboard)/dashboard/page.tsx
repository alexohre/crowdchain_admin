"use client";
import React, { useState } from "react";
import { FaArrowUpLong } from "react-icons/fa6";
import { FaArrowDownLong } from "react-icons/fa6";
import { CiClock1 } from "react-icons/ci";
import { RiErrorWarningLine } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  status?: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

type TimePeriodsType = "24h" | "7D" | "30D" | "ALL";
type TransactionTimePeriod = "This Week" | "This Month" | "This Year";

interface PeriodDataType {
  labels: string[];
  values: number[];
}

interface ChartDataType {
  [key: string]: PeriodDataType;
}

interface TransactionVolumeChartProps {
  // Optional props if you want to control the chart from parent
  initialPeriod?: "This Week" | "This Month" | "This Year";
}

const chartData: ChartDataType = {
  "24h": {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
    values: [400, 200, 600, 500, 500, 700, 900],
  },
  "7D": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [500, 650, 400, 700, 550, 800, 750],
  },
  "30D": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    values: [2400, 1900, 3100, 2700],
  },
  ALL: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    values: [
      5000, 4500, 6000, 7500, 8000, 7000, 6500, 7800, 8500, 9000, 8700, 9500,
    ],
  },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  status,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{title}</span>
        {change && (
          <span
            className={`text-xs flex items-center ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? <FaArrowUpLong /> : <FaArrowDownLong />}
            {change}
          </span>
        )}
        {status && (
          <span className="text-xs flex items-center text-green-500">
            <FaArrowUpLong />
            {status}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

// Transaction Volume Chart Component
const TransactionVolumeChart: React.FC<TransactionVolumeChartProps> = ({
  initialPeriod = "This Week",
}) => {
  const [activeTransactionPeriod, setActiveTransactionPeriod] =
    useState<TransactionTimePeriod>(initialPeriod);

  const transactionChartData = {
    "This Week": {
      labels: ["1", "2", "3", "4", "5", "6", "7"],
      values: [40, 30, 60, 80, 50, 70, 90],
    },
    "This Month": {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      values: [45, 65, 55, 75],
    },
    "This Year": {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      values: [35, 40, 45, 50, 60, 70, 65, 75, 80, 85, 90, 95],
    },
  };

  const data: ChartData<"line"> = {
    labels: transactionChartData[activeTransactionPeriod].labels,
    datasets: [
      {
        label: "Transaction Volume",
        data: transactionChartData[activeTransactionPeriod].values,
        borderColor: "#15803d",
        backgroundColor: "rgba(21, 128, 61, 0.1)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "#15803d",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "rgba(21, 128, 61, 0.3)",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: () => "",
          label: (context) => `Volume: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          // borderDash: [5, 5],
        },
        ticks: {
          color: "#666",
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          color: "#666",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          // borderDash: [5, 5],
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xl font-bold text-gray-800">Transaction Volume</h2>
        <div className="flex space-x-2">
          {(Object.keys(transactionChartData) as TransactionTimePeriod[]).map(
            (period) => (
              <button
                key={period}
                className={`px-4 py-1 text-sm rounded-md ${
                  activeTransactionPeriod === period
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTransactionPeriod(period)}
              >
                {period}
              </button>
            )
          )}
        </div>
      </div>
      <div className="h-[250px]">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

const CrowdChainDashboard: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState<TimePeriodsType>("24h");

  const data: ChartData<"line"> = {
    labels: chartData[activePeriod].labels,
    datasets: [
      {
        label: "Platform Activity",
        data: chartData[activePeriod].values,
        fill: true,
        backgroundColor: "rgba(21, 128, 61, 0.1)",
        borderColor: "#15803d",
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max:
          activePeriod === "ALL" ? 10000 : activePeriod === "30D" ? 4000 : 1000,
        ticks: {
          stepSize:
            activePeriod === "ALL" ? 2000 : activePeriod === "30D" ? 1000 : 200,
        },
        grid: {
          color: "#e5e7eb",
        },
      },
    },
  };

  return (
    <div className="bg-gray-50 p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Users"
          value="24,582"
          change="+12.5%"
          isPositive={true}
        />
        <StatCard
          title="Active Projects"
          value="1,245"
          change="+5.3%"
          isPositive={true}
        />
        <StatCard
          title="Total Value Locked"
          value="$5.2M"
          change="-2.1%"
          isPositive={false}
        />
        <StatCard title="Network Status" value="98.7%" status="Uptime" />
      </div>

      {/* Chart Placeholders */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* First chart */}
        <div className="w-full lg:w-1/2 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col">
            <div className="flex items-center space-x-10 mb-4">
              <h2 className="text-lg font-medium">Platform Activity</h2>
              <div className="flex gap-2 text-sm">
                {(Object.keys(chartData) as TimePeriodsType[]).map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-1 rounded ${
                      activePeriod === period
                        ? "bg-green-700 text-white"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActivePeriod(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <Line options={options} data={data} />
            </div>
          </div>
        </div>

        {/* Second chart - Transaction Volume Chart */}
        <div className="w-full lg:w-1/2">
          <TransactionVolumeChart initialPeriod="This Week" />
        </div>
      </div>

      {/* Recent Transactions & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="font-medium text-gray-700 mb-4">
            Recent Transactions
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-800">0x8f3...b2e</div>
                <div className="text-sm text-gray-500">12.5 ETH</div>
              </div>
              <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full flex items-center space-x-2">
                <IoMdCheckmarkCircleOutline />
                <span> Completed</span>
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-800">0x7e1...c4d</div>
                <div className="text-sm text-gray-500">8.2 ETH</div>
              </div>
              <span className="bg-yellow-100 text-yellow-600 text-xs px-3 py-1 rounded-full flex items-center">
                <CiClock1 />
                <span> Pending</span>
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <div>
                <div className="font-medium text-gray-800">0x9e2...f5a</div>
                <div className="text-sm text-gray-500">3.7 ETH</div>
              </div>
              <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full flex items-center space-x-2">
                <IoMdCheckmarkCircleOutline />
                <span> Completed </span>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="font-medium text-gray-700 mb-4">System Alerts</h2>
          <div className="space-y-3">
            <div className="flex items-start py-3 border-b border-gray-100">
              <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
                <RiErrorWarningLine />
              </div>
              <div className="ml-3 flex-1">
                <div className="font-medium text-gray-800">
                  High network load detected
                </div>
                <div className="text-xs text-gray-500">2 minutes ago</div>
              </div>
            </div>

            <div className="flex items-start py-3 border-b border-gray-100">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                <IoMdCheckmarkCircleOutline />
              </div>
              <div className="ml-3 flex-1">
                <div className="font-medium text-gray-800">
                  New smart contract deployed
                </div>
                <div className="text-xs text-gray-500">2 minutes ago</div>
              </div>
            </div>

            <div className="flex items-start py-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <RxDashboard />
              </div>
              <div className="ml-3 flex-1">
                <div className="font-medium text-gray-800">
                  System maintenance scheduled
                </div>
                <div className="text-xs text-gray-500">2 minutes ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdChainDashboard;
