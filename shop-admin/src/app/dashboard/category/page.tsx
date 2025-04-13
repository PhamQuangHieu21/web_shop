"use client";
import EditCategoryDialog from "@/components/category/edit-category-dialog";
import { columns } from "@/components/category/columns";
import { DataTable } from "@/components/common/data-table";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/utils";
import { Category } from "@/lib/types";
import { toast } from "sonner";
import CategoryFilterBar from "@/components/category/category-filter-bar";

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
        const res = await apiRequest<Category>("/category/list", "GET");
        if (res.status === 200) setData(res.data as Category[]);
        else toast.error(res.message);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi gửi yêu cầu lên server.");
      }
      setLoading(false);
    }

    fetchCategories();
  }, []);

  return (
    <main className="mx-4">
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
      >
        {(table) => <CategoryFilterBar table={table} />}
      </DataTable>
    </main>
  );
}
