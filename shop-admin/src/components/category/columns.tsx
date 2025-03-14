"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../common/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Category } from "@/lib/types";

export const columns = (
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<Category | null | undefined>
  >,
  setData: React.Dispatch<React.SetStateAction<Category[]>>
): ColumnDef<Category>[] => [
  {
    accessorKey: "category_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên" />
    ),
  },
  {
    accessorKey: "icon",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Icon" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        setOpenEditDialog={setOpenEditDialog}
        setSelectedCategory={setSelectedCategory}
        setData={setData}
      />
    ),
  },
];
