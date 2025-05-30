"use client";

import {
  ChartBarStacked,
  ChevronRight,
  MessagesSquare,
  ReceiptText,
  ShoppingBag,
  SquareKanban,
  TicketPercent,
  Users,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { usePathname } from "next/navigation";

const navMain = [
  {
    title: "Tổng quan",
    url: "/dashboard",
    icon: SquareKanban,
  },
  {
    title: "Người dùng",
    url: "/dashboard/user",
    icon: Users,
  },
  {
    title: "Danh mục",
    url: "/dashboard/category",
    icon: ChartBarStacked,
  },
  {
    title: "Sản phẩm",
    url: "#",
    icon: ShoppingBag,
    items: [
      {
        title: "Danh sách",
        url: "/dashboard/product",
      },
      {
        title: "Kích cỡ",
        url: "/dashboard/size",
      },
      {
        title: "Màu sắc",
        url: "/dashboard/color",
      },
      {
        title: "Loại",
        url: "/dashboard/variant",
      },
    ],
  },
  {
    title: "Đơn hàng",
    url: "/dashboard/order",
    icon: ReceiptText,
  },
  {
    title: "Voucher",
    url: "/dashboard/voucher",
    icon: TicketPercent,
  },
  {
    title: "Chat",
    url: "/dashboard/chat",
    icon: MessagesSquare,
  },
];

export function NavMain() {
  const pathName = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {navMain.map((item) => {
          if (item.items) {
            return (
              <Collapsible
                key={item.title}
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            isActive={pathName === subItem.url}
                            asChild
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          } else {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={pathName === item.url}
                  asChild
                  tooltip={item.title}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
