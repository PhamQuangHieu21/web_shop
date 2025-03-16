import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SERVER_URL } from "./data";
import { ApiResponse } from "./types";

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
