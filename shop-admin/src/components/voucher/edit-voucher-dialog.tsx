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
import EditVoucherForm from "./edit-voucher-form";
import { Voucher } from "@/lib/types";

interface EditVoucherDialogProps {
  setData: React.Dispatch<React.SetStateAction<Voucher[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedVoucher: Voucher | null | undefined;
  onCloseEditDialog: () => void;
}

const EditVoucherDialog = ({
  setData,
  open,
  setOpen,
  selectedVoucher,
  onCloseEditDialog,
}: EditVoucherDialogProps) => {
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
          <Plus /> Thêm voucher
        </Button>
      </DialogTrigger>
      <DialogContent className="container sm:max-w-sm overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {selectedVoucher ? "Cập nhật" : "Thêm"} voucher
          </DialogTitle>
          <DialogDescription>Điền thông tin về voucher.</DialogDescription>
          <EditVoucherForm
            setData={setData}
            setOpenDialog={setOpen}
            selectedVoucher={selectedVoucher}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditVoucherDialog;
