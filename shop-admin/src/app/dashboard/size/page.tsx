"use client";
import EditSizeDialog from "@/components/size/edit-size-dialog";
import { columns } from "@/components/size/columns";
import { DataTable } from "@/components/size/data-table";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/utils";
import { Size } from "@/lib/types";
import { toast } from "sonner";

export default function SizePage() {
  const [data, setData] = useState<Size[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSize, setSelectedSize] = useState<Size | null>();

  const onCloseEditDialog = () => {
    setSelectedSize(null);
  };

  useEffect(() => {
    async function fetchSizes() {
      try {
        const res = await apiRequest<Size>("/size/list", "GET");
        if (res.status === 200) setData(res.data as Size[]);
        else toast.error(res.message);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy danh sách kích cỡ sản phẩm.");
      }
      setLoading(false);
    }

    fetchSizes();
  }, []);

  return (
    <main className="container mx-auto sm:px-10">
      <div className="flex justify-between items-end">
        <p className="text-2xl">Danh sách kích cỡ sản phẩm</p>
        <EditSizeDialog
          setData={setData}
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          selectedSize={selectedSize}
          onCloseEditDialog={onCloseEditDialog}
        />
      </div>
      <DataTable
        loading={loading}
        columns={columns(setOpenEditDialog, setSelectedSize, setData)}
        data={data}
      />
    </main>
  );
}
