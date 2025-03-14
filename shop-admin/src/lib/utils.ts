import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SERVER_URL } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  headers: HeadersInit = {}
): Promise<T | T[] | ""> {
  try {
    const res = await fetch(`${SERVER_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    const responseJson = await res.json();

    // Handle different response cases
    if (responseJson?.data) {
      return responseJson.data; // Could be T[] or T
    } else if (responseJson.data === "") {
      return ""; // If data is an empty string, return null
    }

    throw new Error("Invalid API response format");
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}
