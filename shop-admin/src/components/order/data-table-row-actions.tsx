"use client";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Order, OrderStatus } from "@/lib/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { apiRequest, getOrderStatusInVietnamese } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

const NewStatuses = {
  COMPLETED: "completed",
  SHIPPING: "shipping",
  PENDING: "pending",
} as const;

const ChangeStatusButtons: OrderStatus[] = [
  NewStatuses.SHIPPING,
  NewStatuses.COMPLETED,
  NewStatuses.PENDING,
];

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  setData: React.Dispatch<React.SetStateAction<Order[]>>;
}

export function OrderTableRowActions({
  row,
  setData,
}: DataTableRowActionsProps<Order>) {
  const order = row.original;
  const [newStatus, setNewStatus] = useState<OrderStatus>(NewStatuses.PENDING);

  const handleChangeOrderStatus = async () => {
    if (newStatus === order.status)
      return toast.success("Trạng thái không thay đổi.");
    try {
      const res = await apiRequest<Order>(
        `/order/change-status-by-admin`,
        "PUT",
        { ...order, new_status: newStatus }
      );
      if (res.status === 200) {
        console.log(res.data);
        setData((prev) =>
          prev.map((item) =>
            item.order_id === order.order_id ? (res.data as Order) : item
          )
        );
        toast.success(res.message);
      } else toast.error(res.message);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi yêu cầu lên server.");
    }
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {ChangeStatusButtons.map((item) => {
            let disabled = false;
            if (order.status === NewStatuses.PENDING) {
              disabled = !(item === NewStatuses.SHIPPING || item === NewStatuses.CANCELLED);
            } else if (order.status === NewStatuses.SHIPPING) {
              disabled = !(item === NewStatuses.COMPLETED || item === NewStatuses.CANCELLED);
            } else {
              disabled = true;
            }
            return (
              <DialogTrigger asChild key={item}>
                <DropdownMenuItem
                  onClick={() => {
                    setNewStatus(item);
                  }}
                  disabled={disabled || item === order.status}
                >
                  {getOrderStatusInVietnamese(item)}
                </DropdownMenuItem>
              </DialogTrigger>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Bạn chắc chắn muốn chuyển trạng thái đơn hàng sang{" "}
            <b>{getOrderStatusInVietnamese(newStatus)}</b>?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Hủy
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleChangeOrderStatus}>
            Chuyển trạng thái
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
