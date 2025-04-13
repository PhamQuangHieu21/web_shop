"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordFormSchema } from "@/lib/schemas";
import { z } from "zod";
import { apiRequest } from "@/lib/utils";
import { User } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ChangePasswordTab = () => {
  const router = useRouter();
  const localData = localStorage.getItem("user_info");
  const accountInfo = localData
    ? JSON.parse(localData)
    : {
        user_id: 0,
        full_name: "",
        phone_number: "",
        address: "",
        email: "",
        role: "",
      };

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof changePasswordFormSchema>) {
    setLoading(true);
    try {
      const res = await apiRequest<User>(
        `/user/updatePassword/${accountInfo.user_id}`,
        "POST",
        {
          passwordOld: values.oldPassword,
          passwordNew: values.newPassword,
          email: accountInfo.email,
        }
      );
      if (res.status === 200) {
        toast.success(res.message);
        localStorage.clear();
        router.replace("/login");
      } else toast.error(res.message);
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi gửi yêu cầu lên server.");
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Thay đổi thông tin mật khẩu. Sau khi thay đổi, bạn sẽ tự động đăng
          xuất.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Old password */}
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu cũ</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* New password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Confirm password */}
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading && <Loader className="animate-spin" />} Lưu thay đổi
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordTab;
