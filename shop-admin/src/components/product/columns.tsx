"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../common/data-table-column-header";
import { ProductTableRowActions } from "./data-table-row-actions";
import { Product } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const columns = (
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<Product | null | undefined>
  >,
  setData: React.Dispatch<React.SetStateAction<Product[]>>
): ColumnDef<Product>[] => [
  {
    accessorKey: "product_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
  },
  {
    accessorKey: "product_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mô tả" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Danh mục" />
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
      <ProductTableRowActions
        row={row}
        setOpenEditDialog={setOpenEditDialog}
        setSelectedProduct={setSelectedProduct}
        setData={setData}
      />
    ),
  },
];
