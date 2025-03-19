import React from "react";
import { Product } from "@/lib/types";
import { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";

interface ProductFilterBarProps {
  table: Table<Product>;
}

const ProductFilterBar = ({ table }: ProductFilterBarProps) => {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Tìm kiếm theo tên..."
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

export default ProductFilterBar;
