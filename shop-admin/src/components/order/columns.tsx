"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../common/data-table-column-header";
import { OrderTableRowActions } from "./data-table-row-actions";
import { Order } from "@/lib/types";
import {
  formatDate,
  formatNumber,
  getOrderStatusInVietnamese,
  getPaymenMethodInVietnamese,
} from "@/lib/utils";

export const columns = (
  setData: React.Dispatch<React.SetStateAction<Order[]>>
): ColumnDef<Order>[] => [
  {
    accessorKey: "order_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã đơn" />
    ),
  },
  {
    accessorKey: "user_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã người dùng" />
    ),
  },
  {
    accessorKey: "total_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng đơn" />
    ),
    cell: ({ row }) => {
      return <p>{formatNumber(row.getValue("total_price"))}</p>;
    },
  },
  {
    accessorKey: "discount_amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Khuyến mãi" />
    ),
    cell: ({ row }) => {
      return <p>{formatNumber(row.getValue("discount_amount"))}</p>;
    },
  },
  {
    accessorKey: "final_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng đơn sau K/M" />
    ),
    cell: ({ row }) => {
      return <p>{formatNumber(row.getValue("final_price"))}</p>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      return <p>{getOrderStatusInVietnamese(row.getValue("status"))}</p>;
    },
  },
  {
    accessorKey: "payment_method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phương thức thanh toán" />
    ),
    cell: ({ row }) => {
      return (
        <p>{getPaymenMethodInVietnamese(row.getValue("payment_method"))}</p>
      );
    },
  },
  {
    accessorKey: "shipping_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Địa chỉ giao hàng" />
    ),
  },
  {
    accessorKey: "created_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      return <p>{formatDate(row.getValue("created_date"))}</p>;
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
    cell: ({ row }) => <OrderTableRowActions row={row} setData={setData} />,
  },
];
