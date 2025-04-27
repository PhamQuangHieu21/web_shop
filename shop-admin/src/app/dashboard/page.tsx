"use client";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { addMonths, format, subMonths } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "date-fns/locale";
import CommonStatistic from "@/components/dashboard/common-statistic";
import OrderAndTopProductStatistic from "@/components/dashboard/order-and-top-product-statistic";
import { cn } from "@/lib/utils";
import { IncomeChart } from "@/components/dashboard/chart";

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });
  return (
    <div className="px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-5">
        <p className="text-2xl mb-2 sm:mb-0">Tổng quan</p>
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y", { locale: vi })} -{" "}
                      {format(date.to, "LLL dd, y", { locale: vi })}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y", { locale: vi })
                  )
                ) : (
                  <span>Chọn ngày</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={vi}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <CommonStatistic />
        <OrderAndTopProductStatistic date={date} />
        <IncomeChart date={date} />
      </div>
    </div>
  );
}
