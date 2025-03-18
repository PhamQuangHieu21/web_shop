"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../common/data-table-column-header";
import { VariantTableRowActions } from "./data-table-row-actions";
import { Variant } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils";

export const columns = (
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedVariant: React.Dispatch<
    React.SetStateAction<Variant | null | undefined>
  >,
  setData: React.Dispatch<React.SetStateAction<Variant[]>>
): ColumnDef<Variant>[] => [
  {
    accessorKey: "variant_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
  },
  {
    accessorKey: "product_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="product_name" />
    ),
  },
  {
    accessorKey: "color_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="color_name" />
    ),
  },
  {
    accessorKey: "size_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="size_name" />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giá" />
    ),
    cell: ({ row }) => {
      return <p>{formatNumber(row.getValue("price"))}</p>;
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
      <VariantTableRowActions
        row={row}
        setOpenEditDialog={setOpenEditDialog}
        setSelectedVariant={setSelectedVariant}
        setData={setData}
      />
    ),
  },
];
