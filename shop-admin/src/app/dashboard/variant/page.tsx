"use client";
import EditVariantDialog from "@/components/variant/edit-variant-dialog";
import { columns } from "@/components/variant/columns";
import { DataTable } from "@/components/common/data-table";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/utils";
import { Variant } from "@/lib/types";
import { toast } from "sonner";
import VariantFilterBar from "@/components/variant/variant-filter-bar";

export default function VariantPage() {
  const [data, setData] = useState<Variant[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>();

  const onCloseEditDialog = () => {
    setSelectedVariant(null);
  };

  useEffect(() => {
    async function fetchVariants() {
      try {
        const res = await apiRequest<Variant>("/variant/list", "GET");
        if (res.status === 200) setData(res.data as Variant[]);
        else toast.error(res.message);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy danh sách loại sản phẩm.");
      }
      setLoading(false);
    }

    fetchVariants();
  }, []);

  return (
    <main className="container mx-auto sm:px-10">
      <div className="flex justify-between items-end">
        <p className="text-2xl">Danh sách loại sản phẩm</p>
        <EditVariantDialog
          setData={setData}
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          selectedVariant={selectedVariant}
          onCloseEditDialog={onCloseEditDialog}
        />
      </div>
      <DataTable
        loading={loading}
        columns={columns(setOpenEditDialog, setSelectedVariant, setData)}
        data={data}
      >
        {(table) => <VariantFilterBar table={table} />}
      </DataTable>
    </main>
  );
}
