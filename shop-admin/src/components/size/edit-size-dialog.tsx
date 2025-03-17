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
import EditSizeForm from "./edit-size-form";
import { Size } from "@/lib/types";

interface EditSizeDialogProps {
  setData: React.Dispatch<React.SetStateAction<Size[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSize: Size | null | undefined;
  onCloseEditDialog: () => void;
}

const EditSizeDialog = ({
  setData,
  open,
  setOpen,
  selectedSize,
  onCloseEditDialog,
}: EditSizeDialogProps) => {
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
          <Plus /> Thêm kích cỡ sản phẩm
        </Button>
      </DialogTrigger>
      <DialogContent className="container sm:max-w-sm overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {selectedSize ? "Cập nhật" : "Thêm"} kích cỡ sản phẩm
          </DialogTitle>
          <DialogDescription>
            Điền thông tin về kích cỡ sản phẩm.
          </DialogDescription>
          <EditSizeForm
            setData={setData}
            setOpenDialog={setOpen}
            selectedSize={selectedSize}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditSizeDialog;
