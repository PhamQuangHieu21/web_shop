"use client";

import * as React from "react";
import {
  ReceiptText,
  Settings2,
  Shirt,
  SquareKanban,
  Star,
} from "lucide-react";

import { NavMain } from "@/components/common/nav-main";
import { NavUser } from "@/components/common/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "ducbh",
    email: "ducbh62workspace@gmail.com",
    avatar: "/static/avatar.jpg",
  },
  navMain: [
    {
      title: "Tổng quan",
      url: "/dashboard",
      icon: SquareKanban,
    },
    {
      title: "Sản phẩm",
      url: "/dashboard/product",
      icon: Shirt,
    },
    {
      title: "Đơn hàng",
      url: "/dashboard/order",
      icon: ReceiptText,
    },
    {
      title: "Đánh giá",
      url: "/dashboard/review",
      icon: Star,
    },
    {
      title: "Cài đặt",
      url: "/dashboard/settings",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
