"use client";
import EditCategoryDialog from "@/components/category/edit-category-dialog";
import { columns } from "@/components/category/columns";
import { DataTable } from "@/components/category/data-table";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/utils";
import { Category } from "@/lib/types";
import { toast } from "sonner";

export default function CategoryPage() {
  const [data, setData] = useState<Category[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>();

  const onCloseEditDialog = () => {
    setSelectedCategory(null);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await apiRequest<Category>("/category/list", "GET");
        setData(categories as Category[]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Đã xảy ra lỗi khi lấy danh sách danh mục sản phẩm.");
      }
    }

    fetchCategories();
  }, []);

  return (
    <main className="container mx-auto sm:px-10">
      <div className="flex justify-between items-end">
        <p className="text-2xl">Danh mục sản phẩm</p>
        <EditCategoryDialog
          setData={setData}
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          selectedCategory={selectedCategory}
          onCloseEditDialog={onCloseEditDialog}
        />
      </div>
      <DataTable
        loading={loading}
        columns={columns(setOpenEditDialog, setSelectedCategory, setData)}
        data={data}
      />
    </main>
  );
}
