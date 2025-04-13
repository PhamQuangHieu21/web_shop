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
import { accountInfoFormSchema } from "@/lib/schemas";
import { z } from "zod";
import { apiRequest } from "@/lib/utils";
import { User } from "@/lib/types";
import { toast } from "sonner";
import { PatternFormat } from "react-number-format";

const AccountInfoTab = () => {
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

  const form = useForm<z.infer<typeof accountInfoFormSchema>>({
    resolver: zodResolver(accountInfoFormSchema),
    defaultValues: {
      email: accountInfo.email,
      full_name: accountInfo.full_name,
      phone_number: accountInfo.phone_number,
      address: accountInfo.address,
    },
  });

  async function onSubmit(values: z.infer<typeof accountInfoFormSchema>) {
    setLoading(true);
    try {
      const res = await apiRequest<User>("/user/update", "POST", {
        ...values,
        user_id: accountInfo.user_id,
      });
      if (res.status === 200) {
        localStorage.setItem(
          "user_info",
          JSON.stringify({
            user_id: accountInfo.user_id,
            full_name: values.full_name,
            phone_number: values.phone_number,
            address: values.address,
            email: values.email,
            role: accountInfo.role,
          })
        );
        toast.success(res.message);
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
          Thay đổi thông tin tài khoản. Chọn lưu khi hoàn thành.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Full Name */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Phone */}
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <PatternFormat
                      customInput={Input}
                      format="#### ### ###"
                      mask="_"
                      value={field.value}
                      onValueChange={(values) => {
                        field.onChange(values.value);
                      }}
                      name={field.name}
                    />
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

export default AccountInfoTab;
