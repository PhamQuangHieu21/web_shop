"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../common/data-table-column-header";
import { TopSellingProduct } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { SERVER_URL } from "@/lib/data";

export const columns = (): ColumnDef<TopSellingProduct>[] => [
  {
    accessorKey: "product_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã sản phẩm" />
    ),
  },
  {
    accessorKey: "product_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên sản phẩm" />
    ),
  },
  {
    accessorKey: "product_image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ảnh mô tả" />
    ),
    cell: ({ row }) => {
      return (
        <img
          src={`${SERVER_URL}/${row.getValue("product_image")}`}
          alt="Product"
          className="w-2.5 h-2.5 object-cover"
        />
      );
    },
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
            className="w-7 h-7 ml-2 rounded-md shadow-md"
            style={{
              backgroundColor: row.getValue("color_name"),
            }}
          ></div>
        </div>
      );
    },
  },
  {
    accessorKey: "size_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kích thước" />
    ),
  },
  {
    accessorKey: "total_quantity_sold",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng đã bán" />
    ),
    cell: ({ row }) => {
      return <p>{formatNumber(row.getValue("total_quantity_sold"))}</p>;
    },
  },
];
