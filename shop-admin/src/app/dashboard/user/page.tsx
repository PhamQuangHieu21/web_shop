"use client";
import { columns } from "@/components/user/columns";
import { DataTable } from "@/components/common/data-table";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/utils";
import { User } from "@/lib/types";
import { toast } from "sonner";
import UserFilterBar from "@/components/user/user-filter-bar";

export default function UserPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await apiRequest<User>("/user/users-by-admin", "GET");
        if (res.status === 200) setData(res.data as User[]);
        else toast.error(res.message);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lấy danh sách người dùng.");
      }
      setLoading(false);
    }

    fetchUsers();
  }, []);

  return (
    <main className="mx-8">
      <p className="text-2xl">Danh sách người dùng</p>
      <DataTable loading={loading} columns={columns()} data={data}>
        {(table) => <UserFilterBar table={table} />}
      </DataTable>
    </main>
  );
}
