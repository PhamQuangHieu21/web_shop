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
import { Loader, Loader2, RotateCw, Trash2, X } from "lucide-react";
import { SERVER_URL } from "@/lib/data";

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
  const [previewImages, setPreviewImages] = useState<any[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>(
    selectedProduct ? selectedProduct.current_images : []
  );
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      // Cleanup only when the component unmounts
      previewImages.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, []);

  const handleRemoveImage = (index: number) => {
    // Copy from the state
    const newImages = Array.from(previewImages).filter((_, i) => i !== index);
    // Revoke the deleted image blob object
    URL.revokeObjectURL(previewImages[index].preview);
    // Update field value
    form.setValue(
      "new_images",
      newImages.map((img) => img.file)
    );
    // Update preview image
    setPreviewImages(newImages);
  };

  const form = useForm<z.infer<typeof editProductFormSchema>>({
    resolver: zodResolver(editProductFormSchema),
    defaultValues: selectedProduct
      ? {
          product_name: selectedProduct.product_name,
          description: selectedProduct.description,
          price: selectedProduct.price,
          quantity: selectedProduct.quantity,
          category_id: selectedProduct.category_id.toString(),
          new_images: [],
          current_images: selectedProduct.current_images,
          action: "update",
        }
      : {
          product_name: "",
          description: "",
          price: 0,
          quantity: 0,
          category_id: "",
          new_images: [],
          current_images: [],
          action: "add",
        },
  });

  async function updateProduct(data: FormData) {
    setIsSubmitting(true);
    try {
      const res = await apiRequestWithFormData<Product>(
        `/product/update/${selectedProduct?.product_id}`,
        "PUT",
        data
      );
      if (res.status === 200) {
        setData((prev) =>
          prev.map((item) =>
            item.product_id === selectedProduct?.product_id
              ? (res.data as Product)
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

  async function createProduct(data: FormData) {
    setIsSubmitting(true);
    try {
      const res = await apiRequestWithFormData<Product>(
        "/product/new",
        "POST",
        data
      );
      if (res.status === 200) {
        setData((prev) => [res.data as Product, ...prev]);
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

  async function onSubmit(values: z.infer<typeof editProductFormSchema>) {
    let formData = new FormData();
    for (let key in values) {
      if (key !== "new_images") formData.append(key, values[key]);
    }
    for (let image of values.new_images) {
      formData.append("new_images", image);
    }
    if (selectedProduct) {
      for (let image of deletedImages) {
        formData.append("deleted_images", image);
      }
      await updateProduct(formData);
    } else {
      await createProduct(formData);
    }
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await apiRequest<Category>("/category/list", "GET");
        if (res.status === 200) setCategoryList(res.data as Category[]);
        else toast.error(res.message);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi gửi yêu cầu lên server.");
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
        {/* Upload Image */}
        <FormField
          control={form.control}
          name="new_images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ảnh sản phẩm</FormLabel>
              <FormControl>
                <Input
                  accept=".jpg, .jpeg, .png, .webp"
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      field.onChange(e.target.files ? e.target.files : null);
                      setPreviewImages(
                        [...e.target.files].map((file) => ({
                          file: file,
                          preview: URL.createObjectURL(file),
                        }))
                      );
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Deleted Images */}
        {deletedImages.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <p>Ảnh cần xóa ({deletedImages.length})</p>
              <Button
                className="bg-green-600"
                onClick={() => {
                  form.setValue("current_images", [
                    ...currentImages,
                    ...deletedImages,
                  ]);
                  setCurrentImages((prev) => [...prev, ...deletedImages]);
                  setDeletedImages([]);
                }}
              >
                <RotateCw /> Khôi phục tất cả
              </Button>
            </div>
            <div className="grid sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-4 w-full mx-auto">
              {deletedImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative py-0 overflow-hidden rounded-sm shadow-xl"
                >
                  <img
                    src={`${SERVER_URL}/${imageUrl}`}
                    alt="Project"
                    className="w-full h-[80px] object-cover"
                  />
                  <Button
                    type="button"
                    variant="default"
                    className="absolute top-[2px] right-[2px] hover:bg-green-600 w-5 h-5 rounded-sm"
                    onClick={() => {
                      setCurrentImages((prev) => [...prev, imageUrl]);
                      setDeletedImages((prev) =>
                        prev.filter((item) => item !== imageUrl)
                      );
                      form.setValue("current_images", [
                        ...currentImages,
                        imageUrl,
                      ]);
                    }}
                  >
                    <RotateCw color="#FFF" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Current Images */}
        {currentImages.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <p>Ảnh hiện tại ({currentImages.length})</p>
              <Button
                className="bg-red-600"
                onClick={() => {
                  setDeletedImages((prev) => [...prev, ...currentImages]);
                  setCurrentImages([]);
                  form.setValue("current_images", []);
                }}
              >
                <Trash2 /> Xóa tất cả
              </Button>
            </div>
            <div className="grid sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-4 w-full mx-auto">
              {currentImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative py-0 overflow-hidden rounded-sm shadow-xl"
                >
                  <img
                    src={`${SERVER_URL}/${imageUrl}`}
                    alt="Project"
                    className="w-full h-[80px] object-cover"
                  />
                  <Button
                    type="button"
                    variant="default"
                    className="absolute top-[2px] right-[2px] hover:bg-red-500 w-5 h-5 rounded-sm"
                    onClick={() => {
                      setDeletedImages((prev) => [...prev, imageUrl]);
                      setCurrentImages((prev) =>
                        prev.filter((item) => item !== imageUrl)
                      );
                      form.setValue(
                        "current_images",
                        currentImages.filter((item) => item !== imageUrl)
                      );
                    }}
                  >
                    <X color="#FFF" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Preview Image */}
        {previewImages.length > 0 && (
          <div>
            {previewImages.length > 0 && (
              <div className="flex justify-between items-center mb-2">
                <p>Ảnh thêm mới ({previewImages.length})</p>
                <Button
                  className="bg-red-600"
                  onClick={() => {
                    previewImages.forEach((image) =>
                      URL.revokeObjectURL(image.preview)
                    );
                    form.setValue("new_images", []);
                    setPreviewImages([]);
                  }}
                >
                  <Trash2 /> Xóa tất cả
                </Button>
              </div>
            )}
            <div className="grid sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-4 w-full mx-auto">
              {previewImages.map((image, index) => (
                <div
                  key={index}
                  className="relative py-0 overflow-hidden rounded-sm shadow-xl"
                >
                  <img
                    src={image.preview}
                    alt="Project"
                    className="w-full h-[80px] object-cover"
                  />
                  <Button
                    type="button"
                    variant="default"
                    className="absolute top-[2px] right-[2px] hover:bg-red-500 w-5 h-5 rounded-sm"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X color="#FFF" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {isSubmitting && <Loader2 className="animate-spin" />}{" "}
          {selectedProduct ? "Cập nhật" : "Thêm"} sản phẩm
        </Button>
      </form>
    </Form>
  );
};

export default EditProductForm;
