"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../common/data-table-column-header";
import { SizeTableRowActions } from "./data-table-row-actions";
import { Size } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const columns = (
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedSize: React.Dispatch<
    React.SetStateAction<Size | null | undefined>
  >,
  setData: React.Dispatch<React.SetStateAction<Size[]>>
): ColumnDef<Size>[] => [
  {
    accessorKey: "size_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
  },
  {
    accessorKey: "size_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên" />
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
      <SizeTableRowActions
        row={row}
        setOpenEditDialog={setOpenEditDialog}
        setSelectedSize={setSelectedSize}
        setData={setData}
      />
    ),
  },
];
