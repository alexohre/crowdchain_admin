"use client"

import { useEffect, useRef } from "react"

interface SparklineChartProps {
  data: number[]
  color: string
  height?: number
}

export function SparklineChart({ data, color, height = 40 }: SparklineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw sparkline
    const drawSparkline = () => {
      if (!ctx) return

      const width = canvas.offsetWidth
      const chartHeight = height - 10 // Leave some padding

      // Find min and max values
      const min = Math.min(...data)
      const max = Math.max(...data)
      const range = max - min || 1 // Avoid division by zero

      // Calculate points
      const points = data.map((value, index) => ({
        x: (index / (data.length - 1)) * width,
        y: chartHeight - ((value - min) / range) * chartHeight + 5, // +5 for padding
      }))

      // Draw line
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }

      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Fill area under the line
      ctx.lineTo(points[points.length - 1].x, height)
      ctx.lineTo(points[0].x, height)
      ctx.closePath()

      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, `${color}20`) // 20% opacity
      gradient.addColorStop(1, `${color}05`) // 5% opacity

      ctx.fillStyle = gradient
      ctx.fill()
    }

    drawSparkline()

    // Redraw on window resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth * dpr
      drawSparkline()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [data, color, height])

  return <canvas ref={canvasRef} className="w-full h-10" />
}
