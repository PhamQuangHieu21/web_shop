"use client";
import { columns } from "@/components/order/columns";
import { DataTable } from "@/components/common/data-table";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/utils";
import { Order } from "@/lib/types";
import { toast } from "sonner";
import OrderFilterBar from "@/components/order/order-filter-bar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditOrderForm from "@/components/order/edit-order-form";

export default function OrderPage() {
  const [data, setData] = useState<Order[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>();

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
    <main className="container mx-auto sm:px-10">
      <div className="flex justify-between items-end">
        <p className="text-2xl">Danh sách đơn hàng</p>
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent className="container sm:max-w-sm overflow-y-auto max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Cập nhật đơn hàng</DialogTitle>
              <DialogDescription>Điền thông tin về đơn hàng.</DialogDescription>
              <EditOrderForm
                setData={setData}
                setOpenDialog={setOpenEditDialog}
                selectedOrder={selectedOrder}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        loading={loading}
        columns={columns(setOpenEditDialog, setSelectedOrder, setData)}
        data={data}
      >
        {(table) => <OrderFilterBar table={table} />}
      </DataTable>
    </main>
  );
}
