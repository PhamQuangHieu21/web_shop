"use client";
import EditCategoryDialog from "@/components/category/edit-category-dialog";
import CategoryToolbar from "@/components/category/category-toolbar";
import { Category, columns } from "@/components/category/columns";
import { DataTable } from "@/components/category/data-table";
import { useEffect, useState } from "react";

async function getData(): Promise<Category[]> {
  return Array.from({ length: 1000 }, (_, i) => ({
    id: `${i + 1}`,
    name: `Quần ${i + 1}`,
  }));
}

export default function CategoryPage() {
  const [data, setData] = useState<Category[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const temp = await getData();
      setTimeout(() => {
        setData(temp);
        setLoading(false);
      }, 1500);
    };

    fetchData();
  }, []);

  return (
    <main className="container mx-auto sm:px-10">
      <div className="flex justify-between items-end mb-7">
        <p className="text-2xl">Danh mục sản phẩm</p>
        <EditCategoryDialog
          setData={setData}
          open={openEditDialog}
          setOpen={setOpenEditDialog}
        />
      </div>
      <CategoryToolbar />
      <DataTable loading={loading} columns={columns} data={data} />
    </main>
  );
}
