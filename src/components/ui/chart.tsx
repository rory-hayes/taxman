"use client"

import { createContext, useContext } from "react"
import { Legend, Tooltip } from "recharts"

export type ChartConfig = Record<string, { label: string; color: string }>

const ChartContext = createContext<{ config: ChartConfig } | null>(null)

interface ChartContainerProps {
  config: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({ config, children }: ChartContainerProps) {
  return (
    <ChartContext.Provider value={{ config }}>
      <style>
        {Object.entries(config).map(
          ([key, value]) => `
            :root {
              --color-${key}: ${value.color};
            }
          `
        )}
      </style>
      <div className="w-full">{children}</div>
    </ChartContext.Provider>
  )
}

export function ChartLegendContent() {
  const context = useContext(ChartContext)
  if (!context) return null

  return (
    <div className="flex flex-wrap gap-4 text-sm">
      {Object.entries(context.config).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: value.color }}
          />
          <span>{value.label}</span>
        </div>
      ))}
    </div>
  )
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
}: any) {
  const context = useContext(ChartContext)
  if (!active || !context) return null

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      {!hideLabel && <div className="mb-2 font-medium">{label}</div>}
      <div className="flex flex-col gap-1">
        {payload.map((item: any) => (
          <div key={item.dataKey} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-sm text-muted-foreground">
              {context.config[item.dataKey].label}:
            </span>
            <span className="text-sm font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { Legend as ChartLegend, Tooltip as ChartTooltip } 