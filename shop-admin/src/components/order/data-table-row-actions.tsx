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
import { Order } from "@/lib/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { apiRequest } from "@/lib/utils";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedOrder: React.Dispatch<
    React.SetStateAction<TData | null | undefined>
  >;
  setData: React.Dispatch<React.SetStateAction<Order[]>>;
}

export function OrderTableRowActions({
  row,
  setOpenEditDialog,
  setSelectedOrder,
  setData,
}: DataTableRowActionsProps<Order>) {
  const order = row.original;

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
          <DropdownMenuItem
            onClick={() => {
              setSelectedOrder(order);
              setOpenEditDialog(true);
            }}
          >
            Cập nhật trạng thái
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>Xóa</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Bạn chắc chắn muốn chuyển trạng thái đơn hàng?
          </DialogTitle>
          <DialogDescription>
            Hành động này sẽ không thể thu hồi.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Hủy
            </Button>
          </DialogClose>
          <Button type="button" onClick={() => {}}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
