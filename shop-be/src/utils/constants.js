export const PORT = 5000;
export const SERVER_URL = `http://localhost:${PORT}`;

export const RES_MESSAGES = {
    SERVER_ERROR: "An unexpected error occurred",

    // USER
    USERNAME_EXIST: "Username already exists",
    PHONE_EXIST: "Phone number already exists",
    WRONG_USERNAME_PASSWORD: "Incorrect username or password",
    USER_BANNED: "Your account is banned, contact administrator for details",
    AUTHENTICATION_FAILED: "Please login to use this function",
    OLD_PASSWORD_WRONG: "Old password is incorrect",
    CHANGE_PASSWORD_SUCCESSFULLY: "Changed password successfully",
    UPDATE_USER_SUCCESSFULLY: "Updated user information successfully",
    UNVERIFIED_ACCOUNT: "Please verify your account before logging in",
    USERNAME_NOT_EXIST: "Username does not exist",
    INVALID_EMAIL: "Username must be a valid email",
    WEAK_PASSWORD: "Password must be at least 6 characters",
    FIND_PASSWORD_RESET_MAIL: "Please check your mailbox to find reset password mail",
    INVALID_USER_ROLE: "User role is invalid",

    // CATEGORY
    CATEGORY_NAME_EXIST: "Tên danh mục đã tồn tại",
    CREATE_CATEGORY_SUCCESSFULLY: "Tạo danh mục sản phẩm thành công",
    DELETE_CATEGORY_SUCCESSFULLY: "Xóa danh mục sản phẩm thành công",
    UPDATE_CATEGORY_SUCCESSFULLY: "Cập nhật danh mục sản phẩm thành công",
    CATEGORY_NAME_NOT_EXIST: "Không tồn tại danh mục sản phẩm",

    // PRODUCT
    DELETE_PRODUCT_SUCCESSFULLY: "Xóa sản phẩm thành công",
    PRODUCT_NOT_EXIST: "Không tồn tại sản phẩm",
}

export const FIREBASE_AUTH_ERROR_CODES = {
    EMAIL_ALREADY_EXISTS: "auth/email-already-in-use",
    INVALID_CREDENTIAL: "auth/invalid-credential",
    INVALID_EMAIL: "auth/invalid-email",
    WEAK_PASSWORD: "auth/weak-password",
    MISSING_EMAIL: "auth/missing-email",
    MISSING_PASSWORD: "auth/missing-password",
}