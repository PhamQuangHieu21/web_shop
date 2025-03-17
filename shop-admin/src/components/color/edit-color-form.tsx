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
import { editColorFormSchema } from "@/lib/schemas";
import { Color, ColorForm } from "@/lib/types";
import { apiRequest } from "@/lib/utils";
import { toast } from "sonner";
import { Loader } from "lucide-react";

interface EditColorFormProps {
  setData: React.Dispatch<React.SetStateAction<Color[]>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedColor: Color | null | undefined;
}

const EditColorForm = ({
  setData,
  setOpenDialog,
  selectedColor,
}: EditColorFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof editColorFormSchema>>({
    resolver: zodResolver(editColorFormSchema),
    defaultValues: selectedColor
      ? {
          color_name: selectedColor.color_name,
        }
      : {
          color_name: "",
        },
  });

  async function updateColor(data: ColorForm) {
    setLoading(true);
    try {
      const res = await apiRequest<Color>(
        `/color/update/${selectedColor?.color_id}`,
        "PUT",
        data
      );
      if (res.status === 200) {
        setData((prev) =>
          prev.map((item) =>
            item.color_id === selectedColor?.color_id
              ? (res.data as Color)
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

  async function createColor(data: ColorForm) {
    setLoading(true);
    try {
      const res = await apiRequest<Color>("/color/new", "POST", data);
      if (res.status === 200) {
        setData((prev) => [res.data as Color, ...prev]);
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

  async function onSubmit(values: z.infer<typeof editColorFormSchema>) {
    if (selectedColor) {
      await updateColor(values);
    } else {
      await createColor(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Color */}
        <FormField
          control={form.control}
          name="color_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Màu sắc</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              {!form.getFieldState("color_name").error &&
                field.value?.match(/^#([A-Fa-f0-9]{6})$/) && (
                  <div
                    className="w-[50px] h-[50px] rounded-[25px] border"
                    style={{ backgroundColor: field.value }}
                  ></div>
                )}
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader className="animate-spin" />}{" "}
          {selectedColor ? "Cập nhật" : "Thêm"} màu sắc
        </Button>
      </form>
    </Form>
  );
};

export default EditColorForm;
