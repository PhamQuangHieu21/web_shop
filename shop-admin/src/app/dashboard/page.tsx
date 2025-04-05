import { IncomeChart } from "@/components/dashboard/chart";
import { formatNumber } from "@/lib/utils";
import { Layers2, Ticket, UsersRound } from "lucide-react";

const data = {
  order: [
    {
      text: "Tổng số đơn hàng",
      quantity: 150000,
      bgColor: "bg-gray-100",
    },
    {
      text: "Hoàn thành",
      quantity: 150000,
      bgColor: "bg-green-100",
    },
    {
      text: "Đang xử lý",
      quantity: 120000,
      bgColor: "bg-yellow-100",
    },
    {
      text: "Đã hủy",
      quantity: 150000,
      bgColor: "bg-red-100",
    },
  ],
  others: [
    {
      icon: <UsersRound size={40} />,
      text: "Người dùng",
      quantity: 150000,
    },
    {
      icon: <Layers2 size={40} />,
      text: "Sản phẩm",
      quantity: 150000,
    },
    {
      icon: <Ticket size={40} />,
      text: "Voucher",
      quantity: 150000,
    },
  ],
};

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
      {data.order.map((item) => (
        <div
          key={item.text}
          className={`${item.bgColor} md:col-span-3 rounded-xl p-6 shadow-md`}
        >
          <p className="font-bold text-gray-500">{item.text}</p>
          <p className="text-3xl mt-5">{formatNumber(item.quantity)}</p>
        </div>
      ))}
      {data.others.map((item) => (
        <div
          key={item.text}
          className="bg-gray-100 shadow-md md:col-span-4 rounded-xl p-6"
        >
          {item.icon}
          <p className="font-bold text-gray-500 mt-5">{item.text}</p>
          <p className="text-3xl mt-2">{formatNumber(item.quantity)}</p>
        </div>
      ))}
      <div className="bg-gray-100 md:col-span-12 shadow-md rounded-xl p-6">
        <p className="font-bold text-gray-500 mb-5">Biểu đồ doanh thu</p>
        <IncomeChart />
      </div>
    </div>
  );
}
