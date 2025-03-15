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

export const editCategoryFormSchema = z.object({
  name: z.string().min(1, { message: "Tên danh mục không được để trống." }),
  icon: z.string().min(1, { message: "Nhập biểu tượng cho danh mục." }),
});

export const editProductFormSchema = z.object({
  product_name: z.string().min(1, "Nhập tên sản phẩm."),
  description: z.string().min(1, "Nhập mô tả sản phẩm."),
  price: z.coerce.number().positive("Giá sản phẩm không hợp lệ."),
  quantity: z.coerce
    .number()
    .int()
    .nonnegative("Số lượng sản phẩm không hợp lệ."),
  category_id: z.string().min(1, "Chọn danh mục sản phẩm."),
  images: z
    .any()
    // To not allow empty files
    .refine((files) => files?.length >= 1, {
      message: "Nhập ít nhất một ảnh sản phẩm.",
    })
    // To not allow files other than images
    .refine(
      (files) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          files?.[0]?.type
        ),
      {
        message: "Các định dạng ảnh hợp lệ: .jpg, .jpeg, .png, .webp",
      }
    )
    // To not allow files larger than 10MB
    .refine((files) => files?.[0]?.size <= 10000000, {
      message: "Kích thước ảnh tối đa là 10MB",
    }),
});
