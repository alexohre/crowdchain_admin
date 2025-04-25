import  {SparklineChart}  from "../../components/sparkline-chart";

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  data: number[]
}

export function MetricCard({ title, value, change, trend, data }: MetricCardProps) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
      <h3 className="text-xs sm:text-sm text-gray-500 font-medium mb-1">{title}</h3>
      <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
        <span className="text-xl sm:text-2xl font-bold">{value}</span>
        <span className={`text-xs font-medium ${trend === "up" ? "text-green-500" : "text-red-500"}`}>{change}</span>
      </div>
      <SparklineChart data={data} color={trend === "up" ? "#10B981" : "#EF4444"} />
    </div>
  )
}
