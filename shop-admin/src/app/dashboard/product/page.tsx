"use client";
import EditProductDialog from "@/components/product/edit-product-dialog";
import { Product, columns } from "@/components/product/columns";
import { DataTable } from "@/components/product/data-table";
import { useEffect, useState } from "react";

async function getData(): Promise<Product[]> {
  return Array.from({ length: 1000 }, (_, i) => ({
    product_id: i + 1,
    product_name: `Quần ${i + 1}`,
    description: `Quần đẹp ${i + 1}`,
    price: i + 1,
    quantity: i + 1,
    category: `Quần áo`,
    img: "abc",
    modified_date: Date.now().toString(),
    created_date: Date.now().toString(),
  }));
}

export default function ProductPage() {
  const [data, setData] = useState<Product[]>([]);
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
      <div className="flex justify-between items-end">
        <p className="text-2xl">Danh sách sản phẩm</p>
        <EditProductDialog
          setData={setData}
          open={openEditDialog}
          setOpen={setOpenEditDialog}
        />
      </div>
      <DataTable loading={loading} columns={columns} data={data} />
    </main>
  );
}
