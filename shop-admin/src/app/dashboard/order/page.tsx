"use client";
import { columns } from "@/components/order/columns";
import { DataTable } from "@/components/common/data-table";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/utils";
import { Order } from "@/lib/types";
import { toast } from "sonner";
import OrderFilterBar from "@/components/order/order-filter-bar";

export default function OrderPage() {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await apiRequest<Order>("/order/list-by-admin", "GET");
        if (res.status === 200) setData(res.data as Order[]);
        else toast.error(res.message);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy danh sách đơn hàng.");
      }
      setLoading(false);
    }

    fetchOrders();
  }, []);

  return (
    <main className="mx-4">
      <div className="flex justify-between items-end">
        <p className="text-2xl">Danh sách đơn hàng</p>
      </div>
      <DataTable loading={loading} columns={columns(setData)} data={data}>
        {(table) => <OrderFilterBar table={table} />}
      </DataTable>
    </main>
  );
}
