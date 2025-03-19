import React from "react";
import { Input } from "../ui/input";
import { Variant } from "@/lib/types";
import { Table } from "@tanstack/react-table";

interface VariantFilterBarProps {
  table: Table<Variant>;
}

const VariantFilterBar = ({ table }: VariantFilterBarProps) => {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Tìm kiếm theo tên sản phẩm..."
        value={
          (table.getColumn("product_name")?.getFilterValue() as string) ?? ""
        }
        onChange={(event) =>
          table.getColumn("product_name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </div>
  );
};

export default VariantFilterBar;
