import { z } from "zod";

export const signupFormSchema = z
  .object({
    full_name: z.string().min(1, { message: "Nhập họ và tên." }),
    phone_number: z
      .string()
      .regex(/^\+?[0-9]\d{1,10}$/, { message: "Số điện thoại không hợp lệ." }),
    address: z.string().min(1, { message: "Nhập địa chỉ." }),
    email: z.string().email({ message: "Email không hợp lệ." }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có độ dài từ 6 đến 15 ký tự." })
      .max(15, { message: "Mật khẩu phải có độ dài từ 6 đến 15 ký tự." }),
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
    message: "Mật khẩu không khớp.",
    path: ["confirmPassword"], // Attaches error to confirmPassword field
  });

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có độ dài từ 1 đến 15 ký tự" })
    .max(15, { message: "Mật khẩu phải có độ dài từ 1 đến 15 ký tự." }),
});

export const editCategoryFormSchema = z.object({
  name: z.string().min(1, { message: "Tên danh mục không được để trống." }),
  icon: z.string().min(1, { message: "Nhập biểu tượng cho danh mục." }),
});

export const editProductFormSchema = z
  .object({
    action: z.enum(["add", "update"]),
    product_name: z.string().min(1, "Nhập tên sản phẩm."),
    description: z.string().min(1, "Nhập mô tả sản phẩm."),
    category_id: z.string().min(1, "Chọn danh mục sản phẩm."),
    current_images: z.array(z.string()).optional(),
    new_images: z.any(),
  })
  .refine(
    (data) => {
      // console.log("Current Images:", data.current_images);
      // console.log("New Images:", data.new_images);

      if (data.action === "add") {
        return data.new_images && data.new_images?.length > 0;
      }
      if (data.action === "update") {
        return (
          (data.new_images && data.new_images.length > 0) ||
          (data.current_images && data.current_images.length > 0)
        );
      }
      return false;
    },
    {
      message: "Nhập ít nhất một ảnh sản phẩm.",
      path: ["new_images"],
    }
  )
  .refine(
    (data) => {
      // Ensure all files are valid images
      if (data.new_images?.length > 0) {
        return Array.from(data.new_images).every(
          (file) =>
            file &&
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
              file.type
            )
        );
      }
      return true;
    },
    {
      message: "Các định dạng ảnh hợp lệ: .jpg, .jpeg, .png, .webp",
      path: ["new_images"],
    }
  )
  .refine(
    (data) => {
      if (data.new_images?.length > 0) {
        return Array.from(data.new_images).every(
          (file) => file && file.size <= 10000000 // Ensure all files are under 10MB
        );
      }

      return true;
    },
    {
      message: "Kích thước ảnh tối đa là 10MB",
      path: ["new_images"],
    }
  );

export const editColorFormSchema = z.object({
  color_name: z.string().regex(/^#([A-Fa-f0-9]{6})$/, {
    message: "Mã màu không hợp lệ. Vui lòng nhập đúng định dạng #XXXXXX.",
  }),
});

export const editSizeFormSchema = z.object({
  size_name: z.string().min(1, { message: "kích cỡ không được để trống." }),
});

export const editVariantFormSchema = z.object({
  color_id: z.string().min(1, "Chọn màu sản phẩm."),
  size_id: z.string().min(1, "Chọn kích cỡ sản phẩm."),
  product_id: z.string().min(1, "Chọn sản phẩm."),
  price: z.coerce.number().positive("Giá sản phẩm không hợp lệ."),
  quantity: z.coerce.number().positive("Số lượng sản phẩm không hợp lệ."),
});

export const editVoucherFormSchema = z
  .object({
    code: z
      .string()
      .min(3, { message: "Mã voucher phải có ít nhất 3 ký tự." })
      .max(20, { message: "Mã voucher không được vượt quá 20 ký tự." }),
    discount_type: z.enum(["percentage", "fixed"], {
      message:
        "Loại giảm giá không hợp lệ. Chỉ chấp nhận phần trăm hoặc cố định.",
    }),
    discount_value: z.coerce
      .number()
      .min(1, { message: "Giá trị khuyến mãi phải lớn hơn 0." }),
    min_order_value: z.coerce
      .number()
      .min(0, { message: "Đơn hàng tối thiểu phải lớn hơn hoặc bằng 0." }),
    max_discount: z.coerce
      .number()
      .min(0, { message: "Khuyến mãi tối đa phải lớn hơn hoặc bằng 0." }),
    quantity: z.coerce
      .number()
      .min(0, { message: "Số lượng phải lớn hơn hoặc bằng 0." }),
    valid_date: z.object({
      from: z.date().optional(),
      to: z.date().optional(),
    }),
  })
  .refine(
    (data) => {
      return (
        data.valid_date.from &&
        data.valid_date.to &&
        new Date(data.valid_date.from) < new Date(data.valid_date.to)
      );
    },
    {
      message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc.",
      path: ["valid_date"],
    }
  );

export const editOrderFormSchema = z.object({
  order_id: z.string(),
  payment_method: z.enum(["cod", "credit_card", "paypal"]),
});

export const accountInfoFormSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ." }),
  full_name: z.string().min(1, { message: "Nhập họ và tên." }),
  phone_number: z
    .string()
    .regex(/^\+?[0-9]\d{1,10}$/, { message: "Số điện thoại không hợp lệ." }),
  address: z.string().min(1, { message: "Nhập địa chỉ." }),
});

export const changePasswordFormSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, { message: "Mật khẩu phải có độ dài từ 6 đến 15 ký tự." })
      .max(15, { message: "Mật khẩu phải có độ dài từ 6 đến 15 ký tự." }),
    newPassword: z
      .string()
      .min(6, { message: "Mật khẩu phải có độ dài từ 6 đến 15 ký tự." })
      .max(15, { message: "Mật khẩu phải có độ dài từ 6 đến 15 ký tự." }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmNewPassword."],
  });
