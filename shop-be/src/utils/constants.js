export const PORT = 5000;
export const SERVER_URL = `http://localhost:${PORT}`;

export const RES_MESSAGES = {
    SERVER_ERROR: "Đã xảy ra lỗi từ phía server. Quý khách vui lòng thử lại sau.",

    // USER
    USER_LOGIN_SUCCESSFULLY: "Đăng nhập thành công",
    REGISTER_USER_SUCCESSFULLY: "Đăng ký tài khoản thành công. Vui lòng truy cập email đã đăng ký để xác thực tài khoản.",
    USERNAME_EXIST: "Email đã tồn tại.",
    PHONE_EXIST: "Số điện thoại đã tồn tại.",
    WRONG_USERNAME_PASSWORD: "Sai tài khoản hoặc mật khẩu.",
    USER_BANNED: "Your account is banned, contact administrator for details",
    AUTHENTICATION_FAILED: "Please login to use this function",
    OLD_PASSWORD_WRONG: "Old password is incorrect",
    CHANGE_PASSWORD_SUCCESSFULLY: "Changed password successfully",
    UPDATE_USER_SUCCESSFULLY: "Updated user information successfully",
    UNVERIFIED_ACCOUNT: "Vui lòng xác thực tài khoản qua email trước khi đăng nhập.",
    USERNAME_NOT_EXIST: "Username does not exist",
    INVALID_EMAIL: "Email không hợp lệ.",
    WEAK_PASSWORD: "Mật khẩu chứa ít nhất 6 kí tự.",
    FIND_PASSWORD_RESET_MAIL: "Please check your mailbox to find reset password mail",
    INVALID_USER_ROLE: "Vai trò người dùng không hợp lệ.",

    // CATEGORY
    CATEGORY_NAME_EXIST: "Tên danh mục đã tồn tại",
    CREATE_CATEGORY_SUCCESSFULLY: "Tạo danh mục sản phẩm thành công.",
    DELETE_CATEGORY_SUCCESSFULLY: "Xóa danh mục sản phẩm thành công.",
    UPDATE_CATEGORY_SUCCESSFULLY: "Cập nhật danh mục sản phẩm thành công.",
    CATEGORY_NAME_NOT_EXIST: "Không tồn tại danh mục sản phẩm.",

    // PRODUCT
    DELETE_PRODUCT_SUCCESSFULLY: "Xóa sản phẩm thành công.",
    PRODUCT_NOT_EXIST: "Không tồn tại sản phẩm.",
    CREATE_PRODUCT_SUCCESSFULLY: "Tạo sản phẩm thành công.",
    UPDATE_PRODUCT_SUCCESSFULLY: "Cập nhật sản phẩm thành công.",
    ADD_PRODUCT_TO_FAVOURITE: "Thêm sản phẩm vào danh sách yêu thích.",

    // COLOR
    COLOR_EXIST: "Màu sản phẩm đã tồn tại.",
    CREATE_COLOR_SUCCESSFULLY: "Tạo màu sản phẩm thành công.",
    DELETE_COLOR_SUCCESSFULLY: "Xóa màu sản phẩm thành công.",
    DELETE_COLOR_FAIL_VARIANT_EXIST: "Xóa màu sản phẩm thất bại, đang tồn tại loại sản phẩm dùng màu sắc này.",
    UPDATE_COLOR_SUCCESSFULLY: "Cập nhật màu sản phẩm thành công.",

    // SIZE
    SIZE_EXIST: "Kích cỡ sản phẩm đã tồn tại.",
    CREATE_SIZE_SUCCESSFULLY: "Tạo kích cỡ sản phẩm thành công.",
    DELETE_SIZE_SUCCESSFULLY: "Xóa kích cỡ sản phẩm thành công.",
    DELETE_SIZE_FAIL_VARIANT_EXIST: "Xóa kích cỡ sản phẩm thất bại, đang tồn tại loại sản phẩm dùng kích cỡ này.",
    UPDATE_SIZE_SUCCESSFULLY: "Cập nhật kích cỡ sản phẩm thành công.",
}

export const FIREBASE_AUTH_ERROR_CODES = {
    EMAIL_ALREADY_EXISTS: "auth/email-already-in-use",
    INVALID_CREDENTIAL: "auth/invalid-credential",
    INVALID_EMAIL: "auth/invalid-email",
    WEAK_PASSWORD: "auth/weak-password",
    MISSING_EMAIL: "auth/missing-email",
    MISSING_PASSWORD: "auth/missing-password",
}