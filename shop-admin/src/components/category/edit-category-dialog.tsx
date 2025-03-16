"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Category } from "@/lib/types";
import EditCategoryForm from "./edit-category-form";
import { Plus } from "lucide-react";

interface EditCategoryDialogProps {
  setData: React.Dispatch<React.SetStateAction<Category[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategory: Category | null | undefined;
  onCloseEditDialog: () => void;
}

const EditCategoryDialog = ({
  setData,
  open,
  setOpen,
  selectedCategory,
  onCloseEditDialog,
}: EditCategoryDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) onCloseEditDialog();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus /> Thêm danh mục
        </Button>
      </DialogTrigger>
      <DialogContent className="container max-w-xs">
        <DialogHeader>
          <DialogTitle>
            {selectedCategory ? "Cập nhật" : "Thêm"} danh mục
          </DialogTitle>
          <DialogDescription>Điền thông tin về danh mục.</DialogDescription>
        </DialogHeader>
        <EditCategoryForm
          setData={setData}
          setOpenDialog={setOpen}
          selectedCategory={selectedCategory}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
