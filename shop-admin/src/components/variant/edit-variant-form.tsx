import React, { useEffect, useState } from "react";
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
import { editVariantFormSchema } from "@/lib/schemas";
import { Variant, VariantDependencies, VariantForm } from "@/lib/types";
import { apiRequest } from "@/lib/utils";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface EditVariantFormProps {
  setData: React.Dispatch<React.SetStateAction<Variant[]>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedVariant: Variant | null | undefined;
}

const EditVariantForm = ({
  setData,
  setOpenDialog,
  selectedVariant,
}: EditVariantFormProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dependencies, setDependencies] = useState<VariantDependencies>({
    products: [],
    sizes: [],
    colors: [],
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    async function fetchDependencies() {
      try {
        const res = await apiRequest<VariantDependencies>(
          "/variant/dependencies",
          "GET"
        );
        if (res.status === 200)
          setDependencies(res.data as VariantDependencies);
        else toast.error(res.message);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi gửi yêu cầu lên server.");
      }
      setLoading(false);
    }

    fetchDependencies();
  }, []);

  const form = useForm<z.infer<typeof editVariantFormSchema>>({
    resolver: zodResolver(editVariantFormSchema),
    defaultValues: selectedVariant
      ? {
          color_id: selectedVariant.color_id.toString(),
          size_id: selectedVariant.size_id.toString(),
          product_id: selectedVariant.product_id.toString(),
          price: selectedVariant.price,
          quantity: selectedVariant.quantity,
        }
      : {
          color_id: "",
          size_id: "",
          product_id: "",
          price: 0,
          quantity: 0,
        },
  });

  async function updateVariant(data: VariantForm) {
    setIsSubmitting(true);
    try {
      const res = await apiRequest<Variant>(
        `/variant/update/${selectedVariant?.variant_id}`,
        "PUT",
        data
      );
      if (res.status === 200) {
        setData((prev) =>
          prev.map((item) =>
            item.variant_id === selectedVariant?.variant_id
              ? (res.data as Variant)
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
    setIsSubmitting(false);
  }

  async function createVariant(data: VariantForm) {
    setIsSubmitting(true);
    try {
      const res = await apiRequest<Variant>("/variant/new", "POST", data);
      if (res.status === 200) {
        setData((prev) => [res.data as Variant, ...prev]);
        toast.success(res.message);
        setOpenDialog(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi yêu cầu lên server.");
    }
    setIsSubmitting(false);
  }

  async function onSubmit(values: z.infer<typeof editVariantFormSchema>) {
    console.log(values);
    if (selectedVariant) {
      await updateVariant(values);
    } else {
      await createVariant(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Dependecies */}
        {loading ? (
          <Loader className="animate-spin" />
        ) : (
          <>
            {/* Color */}
            <FormField
              control={form.control}
              name="color_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Màu sắc</FormLabel>
                  {dependencies.colors.length > 0 ? (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn màu sản phẩm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dependencies.colors.map((item) => (
                          <SelectItem
                            key={item.color_id}
                            value={item.color_id.toString()}
                          >
                            {item.color_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="leading-7 text-red-500">
                      Vui lòng thêm màu sản phẩm.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Size */}
            <FormField
              control={form.control}
              name="size_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kích cỡ</FormLabel>
                  {dependencies.sizes.length > 0 ? (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn kích cỡ sản phẩm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dependencies.sizes.map((item) => (
                          <SelectItem
                            key={item.size_id}
                            value={item.size_id.toString()}
                          >
                            {item.size_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="leading-7 text-red-500">
                      Vui lòng thêm kích cỡ sản phẩm.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Product */}
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sản phẩm</FormLabel>
                  {dependencies.products.length > 0 ? (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn sản phẩm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dependencies.products.map((item) => (
                          <SelectItem
                            key={item.product_id}
                            value={item.product_id.toString()}
                          >
                            {item.product_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="leading-7 text-red-500">
                      Vui lòng thêm sản phẩm.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader className="animate-spin" />}{" "}
          {selectedVariant ? "Cập nhật" : "Thêm"} loại sản phẩm
        </Button>
      </form>
    </Form>
  );
};

export default EditVariantForm;
