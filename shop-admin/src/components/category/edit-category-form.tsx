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
import { editCategoryFormSchema } from "@/lib/schemas";
import { Category, CategoryForm } from "@/lib/types";
import { apiRequest } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditCategoryFormProps {
  setData: React.Dispatch<React.SetStateAction<Category[]>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategory: Category | null | undefined;
}

const EditCategoryForm = ({
  setData,
  setOpenDialog,
  selectedCategory,
}: EditCategoryFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof editCategoryFormSchema>>({
    resolver: zodResolver(editCategoryFormSchema),
    defaultValues: selectedCategory
      ? {
          name: selectedCategory.name,
          icon: selectedCategory.icon,
        }
      : {
          name: "",
          icon: "",
        },
  });

  async function updateCategory(data: CategoryForm) {
    setLoading(true);
    try {
      const res = await apiRequest<Category>(
        `/category/update/${selectedCategory?.category_id}`,
        "PUT",
        data
      );
      if (res.status === 200) {
        setData((prev) =>
          prev.map((item) =>
            item.category_id === selectedCategory?.category_id
              ? (res.data as Category)
              : item
          )
        );
        toast.success(res.message);
        setOpenDialog(false);
      } else toast.error(res.message);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi yêu cầu lên server.");
    }
    setLoading(false);
  }

  async function createCategory(data: CategoryForm) {
    setLoading(true);
    try {
      const res = await apiRequest<Category>("/category/new", "POST", data);
      if (res.status === 200) {
        setData((prev) => [res.data as Category, ...prev]);
        toast.success(res.message);
        setOpenDialog(false);
      } else toast.error(res.message);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi yêu cầu lên server.");
    }
    setLoading(false);
  }

  async function onSubmit(values: z.infer<typeof editCategoryFormSchema>) {
    if (selectedCategory) await updateCategory(values);
    else await createCategory(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Icon */}
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biểu tượng</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}{" "}
          {selectedCategory ? "Cập nhật" : "Thêm"} danh mục
        </Button>
      </form>
    </Form>
  );
};

export default EditCategoryForm;
