import React from "react";
import { Input } from "../ui/input";
import { Voucher } from "@/lib/types";
import { Table } from "@tanstack/react-table";

interface VoucherFilterBarProps {
  table: Table<Voucher>;
}

const VoucherFilterBar = ({ table }: VoucherFilterBarProps) => {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Tìm kiếm theo mã khuyến mãi..."
        value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("code")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </div>
  );
};

export default VoucherFilterBar;
