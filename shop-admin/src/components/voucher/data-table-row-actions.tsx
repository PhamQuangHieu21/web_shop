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
import { Voucher } from "@/lib/types";
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
  setSelectedVoucher: React.Dispatch<
    React.SetStateAction<TData | null | undefined>
  >;
  setData: React.Dispatch<React.SetStateAction<Voucher[]>>;
}

export function VoucherTableRowActions({
  row,
  setOpenEditDialog,
  setSelectedVoucher,
  setData,
}: DataTableRowActionsProps<Voucher>) {
  const voucher = row.original;

  async function deleteVoucher() {
    try {
      const res = await apiRequest<Voucher>(
        `/voucher/delete/${voucher.voucher_id}`,
        "DELETE"
      );
      if (res.status === 200) {
        setData((prev) =>
          prev.filter((item) => item.voucher_id !== voucher.voucher_id)
        );
        toast.success(res.message);
      } else toast.error(res.message);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi yêu cầu lên server.");
    }
  }

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
              setSelectedVoucher(voucher);
              setOpenEditDialog(true);
            }}
          >
            Cập nhật
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>Xóa</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn chắc chắn muốn xóa voucher?</DialogTitle>
          <DialogDescription>
            Hành động này sẽ xóa vĩnh viễn bản ghi và không thể thu hồi.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Hủy
            </Button>
          </DialogClose>
          <Button type="button" onClick={() => deleteVoucher()}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
