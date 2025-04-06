"use client";
import { useEffect, useState } from "react";
import { IncomeChart } from "@/components/dashboard/chart";
import { DashboardStatistics } from "@/lib/types";
import { apiRequest, formatNumber } from "@/lib/utils";
import { Layers2, Ticket, UsersRound } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStatistics>();

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
    }

    fetchStatistics();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
      {/* ORDER COUNT */}
      <div className="bg-gray-100 md:col-span-3 rounded-xl p-6 border">
        <p className="font-bold text-gray-500">Tổng số đơn hàng</p>
        <p className="text-3xl mt-5">
          {formatNumber(data?.order_data.total_orders ?? 0)}
        </p>
      </div>

      {/* COMPLETED ORDER */}
      <div className="bg-green-100 md:col-span-3 rounded-xl p-6 border">
        <p className="font-bold text-gray-500">Hoàn thành</p>
        <p className="text-3xl mt-5">
          {formatNumber(data?.order_data.completed_orders ?? 0)}
        </p>
      </div>

      {/* PROCESSING ORDER */}
      <div className="bg-yellow-100 md:col-span-3 rounded-xl p-6 border">
        <p className="font-bold text-gray-500">Đang xử lý</p>
        <p className="text-3xl mt-5">
          {formatNumber(data?.order_data.other_orders ?? 0)}
        </p>
      </div>

      {/* CANCELLED ORDER */}
      <div className="bg-red-100 md:col-span-3 rounded-xl p-6 border">
        <p className="font-bold text-gray-500">Đã hủy</p>
        <p className="text-3xl mt-5">
          {formatNumber(data?.order_data.cancelled_orders ?? 0)}
        </p>
      </div>

      {/* USER COUNT */}
      <div className="bg-gray-100 border md:col-span-4 rounded-xl p-6">
        <UsersRound size={40} />
        <p className="font-bold text-gray-500 mt-5">Người dùng</p>
        <p className="text-3xl mt-2">{formatNumber(data?.user_count ?? 0)}</p>
      </div>

      {/* PRODUCT COUNT */}
      <div className="bg-gray-100 border md:col-span-4 rounded-xl p-6">
        <Layers2 size={40} />
        <p className="font-bold text-gray-500 mt-5">Sản phẩm</p>
        <p className="text-3xl mt-2">
          {formatNumber(data?.product_count ?? 0)}
        </p>
      </div>

      {/* VOUCHER COUNT */}
      <div className="bg-gray-100 border md:col-span-4 rounded-xl p-6">
        <Ticket size={40} />
        <p className="font-bold text-gray-500 mt-5">Voucher</p>
        <p className="text-3xl mt-2">
          {formatNumber(data?.voucher_count ?? 0)}
        </p>
      </div>

      <div className="bg-gray-100 md:col-span-12 border rounded-xl p-6">
        <p className="font-bold text-gray-500 mb-5">Biểu đồ doanh thu</p>
        <IncomeChart incomeData={data?.income_data ?? []} />
      </div>
    </div>
  );
}
