import React from "react";
import { Order } from "@/lib/types";
import { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";

interface OrderFilterBarProps {
  table: Table<Order>;
}

const OrderFilterBar = ({ table }: OrderFilterBarProps) => {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Tìm kiếm theo mã đơn..."
        value={(table.getColumn("order_id")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("order_id")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </div>
  );
};

export default OrderFilterBar;
