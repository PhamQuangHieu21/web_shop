import React, { useState, useEffect } from "react";
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
import { editProductFormSchema } from "@/lib/schemas";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Category, Product } from "@/lib/types";
import { apiRequest, apiRequestWithFormData } from "@/lib/utils";
import { toast } from "sonner";
import { Loader, Loader2 } from "lucide-react";

interface EditProductFormProps {
  setData: React.Dispatch<React.SetStateAction<Product[]>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: Product | null | undefined;
}

const EditProductForm = ({
  setData,
  setOpenDialog,
  selectedProduct,
}: EditProductFormProps) => {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof editProductFormSchema>>({
    resolver: zodResolver(editProductFormSchema),
    defaultValues: selectedProduct
      ? {
          product_name: selectedProduct.product_name,
          description: selectedProduct.description,
          price: selectedProduct.price,
          quantity: selectedProduct.quantity,
          category_id: selectedProduct.category_id.toString(),
          images: [],
        }
      : {
          product_name: "",
          description: "",
          price: 0,
          quantity: 0,
          category_id: "",
          images: [],
        },
  });

  async function updateProduct(data: FormData) {
    setIsSubmitting(true);
    try {
      const product = await apiRequestWithFormData<Product>(
        `/product/update/${selectedProduct?.product_id}`,
        "PUT",
        data
      );
      setData((prev) =>
        prev.map((item) =>
          item.product_id === selectedProduct?.product_id
            ? (product as Product)
            : item
        )
      );
      toast.success("Sửa sản phẩm thành công.");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi sửa sản phẩm.");
    }
    setIsSubmitting(false);
  }

  async function createProduct(data: FormData) {
    setIsSubmitting(true);
    try {
      const product = await apiRequestWithFormData<Product>(
        "/product/new",
        "POST",
        data
      );
      setData((prev) => [product as Product, ...prev]);
      toast.success("Thêm sản phẩm thành công.");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tạo sản phẩm.");
    }
    setIsSubmitting(false);
  }

  async function onSubmit(values: z.infer<typeof editProductFormSchema>) {
    let formData = new FormData();
    for (let key in values) {
      if (key !== "images") formData.append(key, values[key]);
    }
    if (selectedProduct) await updateProduct(formData);
    else {
      for (let i = 0; i < values.images.length; i++) {
        formData.append("images", values.images[i]);
      }
      await createProduct(formData);
    }
    setOpenDialog(false);
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await apiRequest<Category>("/category/list", "GET");
        setCategoryList(categories as Category[]);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy danh sách danh mục sản phẩm.");
      }
      setLoading(false);
    }

    fetchCategories();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <FormField
          control={form.control}
          name="product_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sản phẩm</FormLabel>
              <FormControl>
                <Input {...field} />
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
                  placeholder="Thêm mô tả sản phẩm..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá</FormLabel>
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
        {/* Category */}
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              {loading ? (
                <Loader className="animate-spin" />
              ) : categoryList.length > 0 ? (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục sản phẩm" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryList.map((item) => (
                      <SelectItem
                        key={item.category_id}
                        value={item.category_id.toString()}
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="leading-7 text-red-500">
                  Vui lòng thêm danh mục sản phẩm.
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Image Upload */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng</FormLabel>
              <FormControl>
                <Input
                  accept=".jpg, .jpeg, .png, .webp"
                  type="file"
                  multiple
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files : null)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {isSubmitting && <Loader2 className="animate-spin" />}{" "}
          {selectedProduct ? "Sửa" : "Thêm"} sản phẩm
        </Button>
      </form>
    </Form>
  );
};

export default EditProductForm;
