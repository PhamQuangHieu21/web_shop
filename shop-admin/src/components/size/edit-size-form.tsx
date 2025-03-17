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
import { editSizeFormSchema } from "@/lib/schemas";
import { Size, SizeForm } from "@/lib/types";
import { apiRequest } from "@/lib/utils";
import { toast } from "sonner";
import { Loader } from "lucide-react";

interface EditSizeFormProps {
  setData: React.Dispatch<React.SetStateAction<Size[]>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSize: Size | null | undefined;
}

const EditSizeForm = ({
  setData,
  setOpenDialog,
  selectedSize,
}: EditSizeFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof editSizeFormSchema>>({
    resolver: zodResolver(editSizeFormSchema),
    defaultValues: selectedSize
      ? {
          size_name: selectedSize.size_name,
        }
      : {
          size_name: "",
        },
  });

  async function updateSize(data: SizeForm) {
    setLoading(true);
    try {
      const res = await apiRequest<Size>(
        `/size/update/${selectedSize?.size_id}`,
        "PUT",
        data
      );
      if (res.status === 200) {
        setData((prev) =>
          prev.map((item) =>
            item.size_id === selectedSize?.size_id ? (res.data as Size) : item
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

  async function createSize(data: SizeForm) {
    setLoading(true);
    try {
      const res = await apiRequest<Size>("/size/new", "POST", data);
      if (res.status === 200) {
        setData((prev) => [res.data as Size, ...prev]);
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

  async function onSubmit(values: z.infer<typeof editSizeFormSchema>) {
    if (selectedSize) {
      await updateSize(values);
    } else {
      await createSize(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Size */}
        <FormField
          control={form.control}
          name="size_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kích cỡ</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              {!form.getFieldState("size_name").error &&
                field.value?.match(/^#([A-Fa-f0-9]{6})$/) && (
                  <div
                    className="w-[50px] h-[50px] rounded-[25px] border"
                    style={{ backgroundSize: field.value }}
                  ></div>
                )}
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader className="animate-spin" />}{" "}
          {selectedSize ? "Cập nhật" : "Thêm"} kích cỡ
        </Button>
      </form>
    </Form>
  );
};

export default EditSizeForm;
