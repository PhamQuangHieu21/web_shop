"use client";
import EditProductDialog from "@/components/product/edit-product-dialog";
import { columns } from "@/components/product/columns";
import { DataTable } from "@/components/product/data-table";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/utils";
import { Product } from "@/lib/types";
import { toast } from "sonner";

export default function ProductPage() {
  const [data, setData] = useState<Product[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>();

  const onCloseEditDialog = () => {
    setSelectedProduct(null);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await apiRequest<Product>("/product/list", "GET");
        setData(categories as Product[]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Đã xảy ra lỗi khi lấy danh sách sản phẩm.");
      }
    }

    fetchCategories();
  }, []);

  return (
    <main className="container mx-auto sm:px-10">
      <div className="flex justify-between items-end">
        <p className="text-2xl">Danh sách sản phẩm</p>
        <EditProductDialog
          setData={setData}
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          selectedProduct={selectedProduct}
          onCloseEditDialog={onCloseEditDialog}
        />
      </div>
      <DataTable
        loading={loading}
        columns={columns(setOpenEditDialog, setSelectedProduct, setData)}
        data={data}
      />
    </main>
  );
}
