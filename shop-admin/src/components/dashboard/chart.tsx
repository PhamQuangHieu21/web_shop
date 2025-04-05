"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: 1, income: 150000 },
  { month: 2, income: 150000 },
  { month: 3, income: 150000 },
  { month: 4, income: 150000 },
  { month: 5, income: 150000 },
  { month: 6, income: 150000 },
  { month: 7, income: 150000 },
  { month: 8, income: 150000 },
  { month: 9, income: 150000 },
  { month: 10, income: 150000 },
  { month: 11, income: 150000 },
  { month: 12, income: 150000 },
];

const chartConfig = {
  income: {
    label: "Doanh thu",
    color: "#000000",
  },
} satisfies ChartConfig;

export function IncomeChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-desktop)"
              stopOpacity={1.0}
            />
            <stop
              offset="95%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" hideLabel />}
        />
        <Area
          dataKey="income"
          type="natural"
          fill="url(#fillIncome)"
          stroke="var(--color-income)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
