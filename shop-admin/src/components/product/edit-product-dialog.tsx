"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { Product } from "./columns";
import { toast } from "sonner";
import EditProductForm from "./edit-product-form";

interface EditProductDialogProps {
  setData: React.Dispatch<React.SetStateAction<Product[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProductDialog = ({
  setData,
  open,
  setOpen,
}: EditProductDialogProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Thêm sản phẩm
        </Button>
      </DialogTrigger>
      <DialogContent className="container">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm</DialogTitle>
          <DialogDescription>
            Điền thông tin về sản phẩm muốn thêm.
          </DialogDescription>
        </DialogHeader>
        <EditProductForm />
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
