"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../common/data-table-column-header";
import { ColorTableRowActions } from "./data-table-row-actions";
import { Color } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const columns = (
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedColor: React.Dispatch<
    React.SetStateAction<Color | null | undefined>
  >,
  setData: React.Dispatch<React.SetStateAction<Color[]>>
): ColumnDef<Color>[] => [
  {
    accessorKey: "color_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
  },
  {
    accessorKey: "color_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Màu sắc" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <p>{row.getValue("color_name")}</p>
          <div
            className="w-7 h-7 ml-2 rounded-md"
            style={{ backgroundColor: row.getValue("color_name") }}
          ></div>
        </div>
      );
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
      <ColorTableRowActions
        row={row}
        setOpenEditDialog={setOpenEditDialog}
        setSelectedColor={setSelectedColor}
        setData={setData}
      />
    ),
  },
];
