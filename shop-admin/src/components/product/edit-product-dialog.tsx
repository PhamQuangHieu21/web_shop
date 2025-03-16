"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import EditProductForm from "./edit-product-form";
import { Product } from "@/lib/types";

interface EditProductDialogProps {
  setData: React.Dispatch<React.SetStateAction<Product[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: Product | null | undefined;
  onCloseEditDialog: () => void;
}

const EditProductDialog = ({
  setData,
  open,
  setOpen,
  selectedProduct,
  onCloseEditDialog,
}: EditProductDialogProps) => {
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
          <Plus /> Thêm sản phẩm
        </Button>
      </DialogTrigger>
      <DialogContent className="container sm:max-w-2xl overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{selectedProduct ? "Sửa" : "Thêm"} sản phẩm</DialogTitle>
          <DialogDescription>Điền thông tin về sản phẩm.</DialogDescription>
          <EditProductForm
            setData={setData}
            setOpenDialog={setOpen}
            selectedProduct={selectedProduct}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
