interface StatusBadgeProps {
    status: string
  }
  
  export function StatusBadge({ status }: StatusBadgeProps) {
    let bgColor = ""
    const textColor = "text-white"
  
    switch (status) {
      case "Active":
        bgColor = "bg-green-600"
        break
      case "Pending":
        bgColor = "bg-orange-500"
        break
      case "Flagged":
        bgColor = "bg-red-500"
        break
      case "Completed":
        bgColor = "bg-blue-500"
        break
      default:
        bgColor = "bg-gray-500"
    }
  
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
        {status}
      </span>
    )
  }
  