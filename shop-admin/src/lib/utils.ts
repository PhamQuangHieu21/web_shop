import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SERVER_URL } from "./data";
import { ApiResponse, OrderStatus } from "./types";
import { DateRange } from "react-day-picker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  headers: HeadersInit = {}
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${SERVER_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    const responseJson = await res.json();

    return {
      message:
        responseJson?.message || "Đã có lỗi xảy ra khi gửi yêu cầu lên server.",
      data: responseJson?.data ?? "",
      status: res.status,
    };
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}

export async function apiRequestWithFormData<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  headers: HeadersInit = {}
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${SERVER_URL}${endpoint}`, {
      method,
      headers: {
        ...headers,
      },
      body: body ? body : undefined,
    });

    const responseJson = await res.json();

    return {
      message:
        responseJson?.message || "Đã có lỗi xảy ra khi gửi yêu cầu lên server.",
      data: responseJson?.data ?? "",
      status: res.status,
    };
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date
    .toLocaleString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(",", ""); // Remove comma
}

export const formatDateWithoutHour = (date: string | Date): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

export function formatNumber(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const isValidDateRange = (date?: DateRange) => {
  if (!date || !date.from || !date.to) return false;
  return date.to > date.from;
};

const ORDER_STATUS_VIETNAMESE: Record<string, string> = {
  pending: "Đang xử lý",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  shipping: "Đang vận chuyển",
};

export const PAYMENT_METHOD_VIETNAMESE: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng",
  credit_card: "Thẻ tín dụng",
  paypal: "PayPal",
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "#2196F3",
  completed: "#4CAF50",
  shipping: "#FF9800",
  cancelled: "#F44336",
};

export function getOrderStatusInVietnamese(preOrderStatus: OrderStatus) {
  return ORDER_STATUS_VIETNAMESE[preOrderStatus] || "Không xác định";
}

export function getPaymenMethodInVietnamese(prePaymentMethod: OrderStatus) {
  return PAYMENT_METHOD_VIETNAMESE[prePaymentMethod] || "Không xác định";
}

export function getUserId() {
  const userData = localStorage.getItem("user_info");
  return userData ? JSON.parse(userData).user_id : 0;
}
