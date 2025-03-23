import React from "react";
import { User } from "@/lib/types";
import { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";

interface UserFilterBarProps {
  table: Table<User>;
}

const UserFilterBar = ({ table }: UserFilterBarProps) => {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Tìm kiếm theo email..."
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("email")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </div>
  );
};

export default UserFilterBar;
