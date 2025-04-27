import { OrderAndProductStatistics } from "@/lib/types";
import { apiRequest, formatNumber, isValidDateRange } from "@/lib/utils";
import { FileChartPie, FileCheck2, FileClock, FileX2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../common/data-table";
import { columns } from "./columns";
import { DateRange } from "react-day-picker";

interface OrderAndTopProductStatisticProps {
  date: DateRange | undefined;
}

const OrderAndTopProductStatistic = ({
  date,
}: OrderAndTopProductStatisticProps) => {
  const [data, setData] = useState<OrderAndProductStatistics>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchOrderAndTopProductStatistic() {
      try {
        const res = await apiRequest<OrderAndProductStatistics>(
          "/dashboard/order-and-top-products",
          "POST",
          date
        );
        if (res.status === 200) setData(res.data as OrderAndProductStatistics);
        else toast.error(res.message);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy dữ liệu thống kê.");
      }
      setLoading(false);
    }

    if (isValidDateRange(date)) fetchOrderAndTopProductStatistic();
  }, [date]);
  return (
    <>
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

      {/* TOP SELLING PRODUCTS */}
      <div className="md:col-span-12 border rounded-xl p-6">
        <p className="font-bold text-gray-500 mb-5">Top 5 sản phẩm bán chạy</p>
        <DataTable
          loading={loading}
          columns={columns()}
          data={data?.top_selling_products ?? []}
          hidePagination={true}
        >
          {(_) => <></>}
        </DataTable>
      </div>
    </>
  );
};

export default OrderAndTopProductStatistic;
