import React from "react";
import { Input } from "../ui/input";
import { Table } from "@tanstack/react-table";
import { Color } from "@/lib/types";

interface ColorFilterBarProps {
  table: Table<Color>;
}

export default function ColorFilterBar({ table }: ColorFilterBarProps) {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Tìm kiếm theo tên..."
        value={
          (table.getColumn("color_name")?.getFilterValue() as string) ?? ""
        }
        onChange={(event) =>
          table.getColumn("color_name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </div>
  );
}
