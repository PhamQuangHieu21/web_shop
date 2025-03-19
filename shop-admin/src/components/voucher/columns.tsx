"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../common/data-table-column-header";
import { VoucherTableRowActions } from "./data-table-row-actions";
import { Voucher } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils";

export const columns = (
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedVoucher: React.Dispatch<
    React.SetStateAction<Voucher | null | undefined>
  >,
  setData: React.Dispatch<React.SetStateAction<Voucher[]>>
): ColumnDef<Voucher>[] => [
  {
    accessorKey: "voucher_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã khuyến mãi" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Loại" />
    ),
  },
  {
    accessorKey: "discount_value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giá trị" />
    ),
  },
  {
    accessorKey: "min_order_value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Đơn tối thiểu" />
    ),
  },
  {
    accessorKey: "max_discount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Khuyến mãi tối đa" />
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số lượng" />
    ),
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày bắt đầu" />
    ),
  },
  {
    accessorKey: "expiry_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày kết thúc" />
    ),
  },
  {
    accessorKey: "modified_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chỉnh sửa" />
    ),
    cell: ({ row }) => {
      return <p>{formatDate(row.getValue("modified_date"))}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <VoucherTableRowActions
        row={row}
        setOpenEditDialog={setOpenEditDialog}
        setSelectedVoucher={setSelectedVoucher}
        setData={setData}
      />
    ),
  },
];
