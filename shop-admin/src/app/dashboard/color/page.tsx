"use client";
import EditColorDialog from "@/components/color/edit-color-dialog";
import { columns } from "@/components/color/columns";
import { DataTable } from "@/components/common/data-table";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/utils";
import { Color } from "@/lib/types";
import { toast } from "sonner";
import ColorFilterBar from "@/components/color/color-filter-bar";

export default function ColorPage() {
  const [data, setData] = useState<Color[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<Color | null>();

  const onCloseEditDialog = () => {
    setSelectedColor(null);
  };

  useEffect(() => {
    async function fetchColors() {
      try {
        const res = await apiRequest<Color>("/color/list", "GET");
        if (res.status === 200) setData(res.data as Color[]);
        else toast.error(res.message);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy danh sách màu sản phẩm.");
      }
      setLoading(false);
    }

    fetchColors();
  }, []);

  return (
    <main className="mx-4">
      <div className="flex justify-between items-end">
        <p className="text-2xl">Danh sách màu sản phẩm</p>
        <EditColorDialog
          setData={setData}
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          selectedColor={selectedColor}
          onCloseEditDialog={onCloseEditDialog}
        />
      </div>
      <DataTable
        loading={loading}
        columns={columns(setOpenEditDialog, setSelectedColor, setData)}
        data={data}
      >
        {(table) => <ColorFilterBar table={table} />}
      </DataTable>
    </main>
  );
}
