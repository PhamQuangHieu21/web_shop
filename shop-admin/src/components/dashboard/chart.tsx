"use client";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IncomeData } from "@/lib/types";
import { apiRequest, formatNumber, isValidDateRange } from "@/lib/utils";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

const chartConfig = {
  income: {
    label: "Doanh thu",
    color: "#000000",
  },
} satisfies ChartConfig;

interface IncomeChartProps {
  date: DateRange | undefined;
}

export function IncomeChart({ date }: IncomeChartProps) {
  const [data, setData] = useState<IncomeData[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCommonStatistics() {
      try {
        const res = await apiRequest<IncomeData>("/dashboard/income", "POST", {
          date_range: date,
        });
        if (res.status === 200) setData(res.data as IncomeData[]);
        else toast.error(res.message);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy dữ liệu thống kê.");
      }
      setLoading(false);
    }

    if (isValidDateRange(date)) fetchCommonStatistics();
  }, [date]);

  return (
    <div className="md:col-span-12 border rounded-xl p-6 mb-5">
      <p className="font-bold text-gray-500">Biểu đồ doanh thu</p>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <AreaChart data={data}>
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
          <CartesianGrid vertical={true} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(val) => val}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideIndicator
                formatter={(value) => {
                  return `Doanh thu ${formatNumber(Number(value))} vnđ`;
                }}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="income"
            fill="url(#fillIncome)"
            stroke="var(--color-income)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
