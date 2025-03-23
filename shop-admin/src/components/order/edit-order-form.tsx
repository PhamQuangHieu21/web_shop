import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { editOrderFormSchema } from "@/lib/schemas";
import { Order, OrderForm } from "@/lib/types";
import { apiRequest } from "@/lib/utils";
import { toast } from "sonner";
import { Loader } from "lucide-react";

interface EditOrderFormProps {
  setData: React.Dispatch<React.SetStateAction<Order[]>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOrder: Order | null | undefined;
}

const EditOrderForm = ({
  setData,
  setOpenDialog,
  selectedOrder,
}: EditOrderFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof editOrderFormSchema>>({
    resolver: zodResolver(editOrderFormSchema),
    defaultValues: selectedOrder
      ? {
          order_id: selectedOrder.order_id,
          user_id: "",
          total_price: 0,
          status: "pending",
          payment_method: "cod",
          shipping_address: "",
          created_date: new Date(),
          modified_date: new Date(),
          voucher_id: undefined,
        }
      : {
          order_id: "",
          user_id: "",
          total_price: 0,
          status: "pending",
          payment_method: "cod",
          shipping_address: "",
          created_date: new Date(),
          modified_date: new Date(),
          voucher_id: undefined,
        },
  });

  async function updateOrder(data: OrderForm) {
    setLoading(true);
    try {
      const res = await apiRequest<Order>(
        `/order/update-status/${selectedOrder?.order_id}`,
        "PUT",
        data
      );
      if (res.status === 200) {
        setData((prev) =>
          prev.map((item) =>
            item.order_id === selectedOrder?.order_id
              ? (res.data as Order)
              : item
          )
        );
        toast.success(res.message);
        setOpenDialog(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi yêu cầu lên server.");
    }
    setLoading(false);
  }

  async function onSubmit(values: OrderForm) {
    if (selectedOrder) {
      await updateOrder(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader className="animate-spin" />}{" "}
          {selectedOrder ? "Cập nhật" : "Thêm"} đơn hàng
        </Button>
      </form>
    </Form>
  );
};

export default EditOrderForm;
