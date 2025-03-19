export type Category = {
  category_id: string;
  name: string;
  icon: string;
  modified_date: Date;
  created_date: Date;
};

export type CategoryForm = {
  name: string;
  icon: string;
};

export type Product = {
  product_id: number;
  product_name: string;
  description: string;
  current_images: string[];
  category: string;
  category_id: string;
  modified_date: Date;
  created_date: Date;
};

export type ProductForm = {
  product_name: string;
  description: string;
  category_id: string;
};

export type ApiResponse<T> = {
  message: string;
  data: T | T[] | "";
  status: number;
};

export type UserSignupForm = {
  full_name: string;
  phone_number: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type User = {
  user_id: number;
  full_name: string;
  phone_number: string;
  address: string;
  email: string;
  role: string;
};

export type Color = {
  color_id: number;
  color_name: string;
  modified_date: Date;
};

export type ColorForm = {
  color_name: string;
};

export type Size = {
  size_id: number;
  size_name: string;
  modified_date: Date;
};

export type SizeForm = {
  size_name: string;
};

// For select
export type ProductForSelect = {
  product_id: string;
  product_name: string;
};

export type ColorForSelect = {
  color_id: string;
  color_name: string;
};

export type SizeForSelect = {
  size_id: string;
  size_name: string;
};

export type Variant = {
  variant_id: string;
  size_id: string;
  size_name: string;
  color_id: string;
  color_name: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  created_date: Date;
  modified_date: Date;
};

export type VariantForm = {
  size_id: string;
  color_id: string;
  product_id: string;
  price: number;
  quantity: number;
};

export type VariantDependencies = {
  products: ProductForSelect[];
  colors: ColorForSelect[];
  sizes: SizeForSelect[];
};

export type Voucher = {
  voucher_id: number;
  code: string;
  description: string;
  discount_type: "percentage" | "fixed"; // Defines whether it's a percentage or fixed amount
  discount_value: number; // Value of discount (percentage or fixed amount)
  min_order_value: number; // Optional: Minimum order value to apply the voucher
  max_discount: number; // Optional: Max discount amount (useful for percentage-based discounts)
  quantity: number; // Total times the voucher can be used
  start_date: Date; // Start validity date
  end_date: Date; // End validity date
  created_at: Date;
  updated_at: Date;
};

export type VoucherForm = {
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_value: number;
  max_discount: number;
  quantity: number;
  start_date: Date;
  end_date: Date;
};
