"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../common/data-table-column-header";
import { VoucherTableRowActions } from "./data-table-row-actions";
import { Voucher } from "@/lib/types";
import { formatDate, formatDateWithoutHour, formatNumber } from "@/lib/utils";

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
    accessorKey: "discount_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Loại" />
    ),
    cell: ({ row }) => {
      return (
        <p>
          {row.getValue("discount_type") === "percentage"
            ? "Phần trăm"
            : "Cố định"}
        </p>
      );
    },
  },
  {
    accessorKey: "discount_value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giá trị" />
    ),
    cell: ({ row }) => {
      return <p>{formatNumber(row.getValue("discount_value"))}</p>;
    },
  },
  {
    accessorKey: "min_order_value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Đơn tối thiểu" />
    ),
    cell: ({ row }) => {
      return <p>{formatNumber(row.getValue("min_order_value"))}</p>;
    },
  },
  {
    accessorKey: "max_discount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Khuyến mãi tối đa" />
    ),
    cell: ({ row }) => {
      return <p>{formatNumber(row.getValue("max_discount"))}</p>;
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số lượng" />
    ),
    cell: ({ row }) => {
      return <p>{formatNumber(row.getValue("quantity"))}</p>;
    },
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày bắt đầu" />
    ),
    cell: ({ row }) => {
      return <p>{formatDateWithoutHour(row.getValue("start_date"))}</p>;
    },
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày kết thúc" />
    ),
    cell: ({ row }) => {
      return <p>{formatDateWithoutHour(row.getValue("end_date"))}</p>;
    },
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
