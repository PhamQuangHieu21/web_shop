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
import { editVoucherFormSchema } from "@/lib/schemas";
import { Voucher, VoucherForm } from "@/lib/types";
import { apiRequest, cn } from "@/lib/utils";
import { toast } from "sonner";
import { CalendarIcon, Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

interface EditVoucherFormProps {
  setData: React.Dispatch<React.SetStateAction<Voucher[]>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedVoucher: Voucher | null | undefined;
}

const EditVoucherForm = ({
  setData,
  setOpenDialog,
  selectedVoucher,
}: EditVoucherFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof editVoucherFormSchema>>({
    resolver: zodResolver(editVoucherFormSchema),
    defaultValues: selectedVoucher
      ? {
          code: selectedVoucher.code,
          description: selectedVoucher.description,
          discount_type: selectedVoucher.discount_type,
          discount_value: selectedVoucher.discount_value,
          min_order_value: selectedVoucher.min_order_value,
          max_discount: selectedVoucher.max_discount,
          quantity: selectedVoucher.quantity,
          start_date: selectedVoucher.start_date,
          end_date: selectedVoucher.end_date,
        }
      : {
          code: "",
          description: "",
          discount_type: "fixed", // Mặc định là 'fixed'
          discount_value: 0,
          min_order_value: 0,
          max_discount: 0,
          quantity: 0,
          start_date: new Date(),
          end_date: new Date(new Date().setDate(new Date().getDate() + 1)),
        },
  });

  async function updateVoucher(data: VoucherForm) {
    setLoading(true);
    try {
      const res = await apiRequest<Voucher>(
        `/voucher/update/${selectedVoucher?.voucher_id}`,
        "PUT",
        data
      );
      if (res.status === 200) {
        setData((prev) =>
          prev.map((item) =>
            item.voucher_id === selectedVoucher?.voucher_id
              ? (res.data as Voucher)
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

  async function createVoucher(data: VoucherForm) {
    setLoading(true);
    try {
      const res = await apiRequest<Voucher>("/voucher/new", "POST", data);
      if (res.status === 200) {
        setData((prev) => [res.data as Voucher, ...prev]);
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

  async function onSubmit(values: z.infer<typeof editVoucherFormSchema>) {
    console.log(values);
    if (selectedVoucher) {
      await updateVoucher(values);
    } else {
      await createVoucher(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Code */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã khuyến mãi</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả mã khuyến mãi..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Discount Type */}
        <FormField
          control={form.control}
          name="discount_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại khuyến mãi</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại khuyến mãi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fixed">Cố định</SelectItem>
                  <SelectItem value="percentage">Phần trăm</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Discount Value */}
        <FormField
          control={form.control}
          name="discount_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá trị khuyến mãi</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Min Order Value */}
        <FormField
          control={form.control}
          name="min_order_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đơn hàng tối thiểu</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Max Discount */}
        <FormField
          control={form.control}
          name="min_order_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khuyến mãi tối đa</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Quantity */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Start Date */}
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader className="animate-spin" />}{" "}
          {selectedVoucher ? "Cập nhật" : "Thêm"} voucher
        </Button>
      </form>
    </Form>
  );
};

export default EditVoucherForm;
