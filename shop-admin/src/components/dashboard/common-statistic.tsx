"use client";
import { CommonStatistics } from "@/lib/types";
import { apiRequest, formatNumber } from "@/lib/utils";
import { ChartBarStacked, ShoppingBag, Ticket, UsersRound } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const CommonStatistic = () => {
  const [data, setData] = useState<CommonStatistics>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCommonStatistics() {
      try {
        const res = await apiRequest<CommonStatistics>(
          "/dashboard/common-statistics",
          "GET"
        );
        if (res.status === 200) setData(res.data as CommonStatistics);
        else toast.error(res.message);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy dữ liệu thống kê.");
      }
      setLoading(false);
    }

    fetchCommonStatistics();
  }, []);

  return (
    <>
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
    </>
  );
};

export default CommonStatistic;
