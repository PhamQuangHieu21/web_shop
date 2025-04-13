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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { NumericFormat } from "react-number-format";

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
          discount_type: selectedVoucher.discount_type,
          discount_value: selectedVoucher.discount_value,
          min_order_value: selectedVoucher.min_order_value,
          max_discount: selectedVoucher.max_discount,
          quantity: selectedVoucher.quantity,
          valid_date: {
            from: new Date(selectedVoucher.start_date),
            to: new Date(selectedVoucher.end_date),
          },
        }
      : {
          code: "",
          discount_type: "fixed",
          discount_value: 0,
          min_order_value: 0,
          max_discount: 0,
          quantity: 0,
          valid_date: {
            from: new Date(),
            to: new Date(Date.now() + 86400000),
          },
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
                <NumericFormat
                  customInput={Input}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  decimalScale={0}
                  fixedDecimalScale
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.value);
                  }}
                  name={field.name}
                />
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
                <NumericFormat
                  customInput={Input}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  decimalScale={0}
                  fixedDecimalScale
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.value);
                  }}
                  name={field.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Max Discount */}
        <FormField
          control={form.control}
          name="max_discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khuyến mãi tối đa</FormLabel>
              <FormControl>
                <NumericFormat
                  customInput={Input}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  decimalScale={0}
                  fixedDecimalScale
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.value);
                  }}
                  name={field.name}
                />
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
                <NumericFormat
                  customInput={Input}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  decimalScale={0}
                  fixedDecimalScale
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.value);
                  }}
                  name={field.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Date Picker */}
        <FormField
          control={form.control}
          name="valid_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ngày hiệu lực</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value.from ? (
                      field.value.to ? (
                        <>
                          {format(field.value.from, "LLL dd, y", {
                            locale: vi,
                          })}{" "}
                          -{" "}
                          {format(field.value.to, "LLL dd, y", {
                            locale: vi,
                          })}
                        </>
                      ) : (
                        format(field.value.from, "LLL dd, y", { locale: vi })
                      )
                    ) : (
                      <span>Chọn một ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value.from!}
                    selected={{ from: field.value.from!, to: field.value.to! }}
                    onSelect={(range) => {
                      field.onChange(range);
                    }}
                    numberOfMonths={2}
                    locale={vi}
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
