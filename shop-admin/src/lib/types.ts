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
  price: number;
  quantity: number;
  current_images: string[];
  category: string;
  category_id: string;
  modified_date: Date;
  created_date: Date;
};

export type ProductForm = {
  product_name: string;
  description: string;
  price: number;
  quantity: number;
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
