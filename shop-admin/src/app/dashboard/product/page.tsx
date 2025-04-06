"use client";
import EditProductDialog from "@/components/product/edit-product-dialog";
import { columns } from "@/components/product/columns";
import { DataTable } from "@/components/common/data-table";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/utils";
import { Product } from "@/lib/types";
import { toast } from "sonner";
import ProductFilterBar from "@/components/product/product-filter-bar";

export default function ProductPage() {
  const [data, setData] = useState<Product[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>();

  const onCloseEditDialog = () => {
    setSelectedProduct(null);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await apiRequest<Product>("/product/list-by-admin", "GET");
        if (res.status === 200) setData(res.data as Product[]);
        else toast.error(res.message);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy danh sách sản phẩm.");
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  return (
    <main className="mx-8">
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
      >
        {(table) => <ProductFilterBar table={table} />}
      </DataTable>
    </main>
  );
}
