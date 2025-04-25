"use client"

import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string; 
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5"
        placeholder="Search campaigns"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
