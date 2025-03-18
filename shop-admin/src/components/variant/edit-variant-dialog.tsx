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
import { Plus } from "lucide-react";
import EditVariantForm from "./edit-variant-form";
import { Variant } from "@/lib/types";

interface EditVariantDialogProps {
  setData: React.Dispatch<React.SetStateAction<Variant[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedVariant: Variant | null | undefined;
  onCloseEditDialog: () => void;
}

const EditVariantDialog = ({
  setData,
  open,
  setOpen,
  selectedVariant,
  onCloseEditDialog,
}: EditVariantDialogProps) => {
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
          <Plus /> Thêm loại sản phẩm
        </Button>
      </DialogTrigger>
      <DialogContent className="container sm:max-w-sm overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {selectedVariant ? "Cập nhật" : "Thêm"} loại sản phẩm
          </DialogTitle>
          <DialogDescription>
            Điền thông tin về loại sản phẩm.
          </DialogDescription>
          <EditVariantForm
            setData={setData}
            setOpenDialog={setOpen}
            selectedVariant={selectedVariant}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditVariantDialog;
