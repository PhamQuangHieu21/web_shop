"use client";
import EditVoucherDialog from "@/components/voucher/edit-voucher-dialog";
import { columns } from "@/components/voucher/columns";
import { DataTable } from "@/components/common/data-table";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/utils";
import { Voucher } from "@/lib/types";
import { toast } from "sonner";
import VoucherFilterBar from "@/components/voucher/voucher-filter-bar";

export default function VoucherPage() {
  const [data, setData] = useState<Voucher[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>();

  const onCloseEditDialog = () => {
    setSelectedVoucher(null);
  };

  useEffect(() => {
    async function fetchVouchers() {
      try {
        const res = await apiRequest<Voucher>("/voucher/list", "GET");
        if (res.status === 200) setData(res.data as Voucher[]);
        else toast.error(res.message);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy danh sách mã khuyến mãi.");
      }
      setLoading(false);
    }

    fetchVouchers();
  }, []);

  return (
    <main className="mx-8">
      <div className="flex justify-between items-end">
        <p className="text-2xl">Danh sách voucher</p>
        <EditVoucherDialog
          setData={setData}
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          selectedVoucher={selectedVoucher}
          onCloseEditDialog={onCloseEditDialog}
        />
      </div>
      <DataTable
        loading={loading}
        columns={columns(setOpenEditDialog, setSelectedVoucher, setData)}
        data={data}
      >
        {(table) => <VoucherFilterBar table={table} />}
      </DataTable>
    </main>
  );
}
