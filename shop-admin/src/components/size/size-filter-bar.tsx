import React from "react";
import { Size } from "@/lib/types";
import { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";

interface SizeFilterBarProps {
  table: Table<Size>;
}

const SizeFilterBar = ({ table }: SizeFilterBarProps) => {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Tìm kiếm theo tên..."
        value={(table.getColumn("size_name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("size_name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </div>
  );
};

export default SizeFilterBar;
