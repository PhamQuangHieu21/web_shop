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
import { Category } from "@/lib/types";
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
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<TData | null | undefined>
  >;
  setData: React.Dispatch<React.SetStateAction<Category[]>>;
}

export function CategoryTableRowActions({
  row,
  setOpenEditDialog,
  setSelectedCategory,
  setData,
}: DataTableRowActionsProps<Category>) {
  const category = row.original;

  async function deleteCategory() {
    try {
      await apiRequest<Category>(
        `/category/delete/${category.category_id}`,
        "DELETE"
      );
      setData((prev) =>
        prev.filter((item) => item.category_id !== category.category_id)
      );
      toast.success("Xóa danh mục sản phẩm thành công.");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa danh mục.");
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
              setSelectedCategory(category);
              setOpenEditDialog(true);
            }}
          >
            Sửa
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>Xóa</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn chắc chắn muốn xóa danh mục sản phẩm?</DialogTitle>
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
          <Button type="button" onClick={() => deleteCategory()}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
