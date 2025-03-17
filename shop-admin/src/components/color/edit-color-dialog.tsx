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
import EditColorForm from "./edit-color-form";
import { Color } from "@/lib/types";

interface EditColorDialogProps {
  setData: React.Dispatch<React.SetStateAction<Color[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedColor: Color | null | undefined;
  onCloseEditDialog: () => void;
}

const EditColorDialog = ({
  setData,
  open,
  setOpen,
  selectedColor,
  onCloseEditDialog,
}: EditColorDialogProps) => {
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
          <Plus /> Thêm màu sản phẩm
        </Button>
      </DialogTrigger>
      <DialogContent className="container sm:max-w-sm overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {selectedColor ? "Cập nhật" : "Thêm"} màu sản phẩm
          </DialogTitle>
          <DialogDescription>Điền thông tin về màu sản phẩm.</DialogDescription>
          <EditColorForm
            setData={setData}
            setOpenDialog={setOpen}
            selectedColor={selectedColor}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditColorDialog;
