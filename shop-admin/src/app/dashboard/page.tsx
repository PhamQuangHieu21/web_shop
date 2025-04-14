"use client";
import { useEffect, useState } from "react";
import { IncomeChart } from "@/components/dashboard/chart";
import { DashboardStatistics } from "@/lib/types";
import { apiRequest, cn, formatNumber } from "@/lib/utils";
import {
  CalendarIcon,
  ChartBarStacked,
  FileChartPie,
  FileCheck2,
  FileClock,
  FileX2,
  ShoppingBag,
  Ticket,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/data-table";
import { columns } from "@/components/dashboard/columns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "date-fns/locale";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStatistics>();
  const [loading, setLoading] = useState<boolean>(true);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });

  useEffect(() => {
    console.log(date);
  }, [date]);

  useEffect(() => {
    async function fetchStatistics() {
      try {
        const res = await apiRequest<DashboardStatistics>(
          "/dashboard/statistics",
          "GET"
        );
        if (res.status === 200) setData(res.data as DashboardStatistics);
        else toast.error(res.message);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy dữ liệu thống kê.");
      }
      setLoading(false);
    }

    fetchStatistics();
  }, []);

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
        {/* ORDER COUNT */}
        <div className="md:col-span-6 lg:col-span-3 rounded-xl p-6 border">
          <FileChartPie className="text-gray-500" size={40} />
          <p className="font-bold text-gray-500 mt-3">Tổng số đơn hàng</p>
          <p className="text-3xl mt-5">
            {formatNumber(data?.order_data.total_orders ?? 0)}
          </p>
        </div>

        {/* COMPLETED ORDER */}
        <div className="bg-green-100 md:col-span-6 lg:col-span-3 rounded-xl p-6 border">
          <FileCheck2 className="text-gray-500" size={40} />
          <p className="font-bold text-gray-500 mt-3">Đơn hoàn thành</p>
          <p className="text-3xl mt-5">
            {formatNumber(data?.order_data.completed_orders ?? 0)}
          </p>
        </div>

        {/* PROCESSING ORDER */}
        <div className="bg-yellow-100 md:col-span-6 lg:col-span-3 rounded-xl p-6 border">
          <FileClock className="text-gray-500" size={40} />
          <p className="font-bold text-gray-500 mt-3">Đơn đang xử lý</p>
          <p className="text-3xl mt-5">
            {formatNumber(data?.order_data.other_orders ?? 0)}
          </p>
        </div>

        {/* CANCELLED ORDER */}
        <div className="bg-red-100 md:col-span-6 lg:col-span-3 rounded-xl p-6 border">
          <FileX2 className="text-gray-500" size={40} />
          <p className="font-bold text-gray-500 mt-3">Đơn đã hủy</p>
          <p className="text-3xl mt-5">
            {formatNumber(data?.order_data.cancelled_orders ?? 0)}
          </p>
        </div>

        {/* USER COUNT */}
        <div className="border md:col-span-6 lg:col-span-3 rounded-xl p-6">
          <UsersRound className="text-gray-500" size={40} />
          <p className="font-bold text-gray-500 mt-3">Người dùng</p>
          <p className="text-3xl mt-5">{formatNumber(data?.user_count ?? 0)}</p>
        </div>

        {/* CATEGORY COUNT */}
        <div className="border md:col-span-6 lg:col-span-3 rounded-xl p-6">
          <ChartBarStacked className="text-gray-500" size={40} />
          <p className="font-bold text-gray-500 mt-3">Danh mục sản phẩm</p>
          <p className="text-3xl mt-5">
            {formatNumber(data?.category_count ?? 0)}
          </p>
        </div>

        {/* PRODUCT COUNT */}
        <div className="border md:col-span-6 lg:col-span-3 rounded-xl p-6">
          <ShoppingBag className="text-gray-500" size={40} />
          <p className="font-bold text-gray-500 mt-3">Sản phẩm</p>
          <p className="text-3xl mt-5">
            {formatNumber(data?.product_count ?? 0)}
          </p>
        </div>

        {/* VOUCHER COUNT */}
        <div className="border md:col-span-6 lg:col-span-3 rounded-xl p-6">
          <Ticket className="text-gray-500" size={40} />
          <p className="font-bold text-gray-500 mt-3">Voucher</p>
          <p className="text-3xl mt-5">
            {formatNumber(data?.voucher_count ?? 0)}
          </p>
        </div>

        {/* INCOME CHART */}
        <div className="md:col-span-12 border rounded-xl p-6">
          <p className="font-bold text-gray-500 mb-5">Biểu đồ doanh thu</p>
          <IncomeChart incomeData={data?.income_data ?? []} />
        </div>

        {/* TOP SELLING PRODUCTS */}
        <div className="md:col-span-12 border rounded-xl p-6">
          <p className="font-bold text-gray-500 mb-5">
            Top 5 sản phẩm bán chạy
          </p>
          <DataTable
            loading={loading}
            columns={columns()}
            data={data?.top_selling_products ?? []}
            hidePagination={true}
          >
            {(_) => <></>}
          </DataTable>
        </div>
      </div>
    </div>
  );
}
