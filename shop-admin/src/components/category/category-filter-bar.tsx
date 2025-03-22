import React from "react";
import { Input } from "../ui/input";
import { Category } from "@/lib/types";
import { Table } from "@tanstack/react-table";

interface CategoryFilterBarProps {
  table: Table<Category>;
}

const CategoryFilterBar = ({ table }: CategoryFilterBarProps) => {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Tìm kiếm theo tên..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </div>
  );
};

export default CategoryFilterBar;
