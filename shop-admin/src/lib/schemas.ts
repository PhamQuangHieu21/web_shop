import { z } from "zod";

export const signupFormSchema = z
  .object({
    name: z.string().min(1, { message: "Nhập họ và tên" }),
    phone: z
      .string()
      .regex(/^\+?[0-9]\d{1,10}$/, { message: "Số điện thoại không hợp lệ" }),
    address: z.string().min(1, { message: "Nhập địa chỉ" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z
      .string()
      .min(1, { message: "Mật khẩu phải có độ dài từ 1 đến 15 ký tự" })
      .max(15, { message: "Mật khẩu phải có độ dài từ 1 đến 15 ký tự" }),
    // .regex(/[A-Z]/, {
    //   message: "Password must contain at least one uppercase letter",
    // })
    // .regex(/[a-z]/, {
    //   message: "Password must contain at least one lowercase letter",
    // })
    // .regex(/[0-9]/, { message: "Password must contain at least one number" })
    // .regex(/[^A-Za-z0-9]/, {
    //   message: "Password must contain at least one special character",
    // }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"], // Attaches error to confirmPassword field
  });

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z
    .string()
    .min(1, { message: "Mật khẩu phải có độ dài từ 1 đến 15 ký tự" })
    .max(15, { message: "Mật khẩu phải có độ dài từ 1 đến 15 ký tự" }),
});

export const editProductFormSchema = z.object({
  product_name: z.string().min(1, "Nhập tên sản phẩm."),
  description: z.string().optional(),
  price: z.number().positive("Giá sản phẩm không hợp lệ."),
  quantity: z.number().int().nonnegative("Số lượng sản phẩm không hợp lệ."),
  category: z.string().min(1, "Chọn danh mục sản phẩm."),
  img: z.instanceof(File, { message: "Chọn ít nhất một ảnh sản phẩm" }),
});
