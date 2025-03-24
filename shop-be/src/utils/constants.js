export const PORT = 5000;
export const SERVER_URL = `http://localhost:${PORT}`;

export const DISCOUNT_TYPE = {
    PERCENTAGE: "percentage",
    FIXED: "fixed",
}

export const ORDER_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
}

export function isValidOrderStatus(status) {
    return Object.values(ORDER_STATUS).includes(status);
}

export function isOrderCancellable(status) {
    return status === ORDER_STATUS.PENDING;
}

export function isValidOrderStatusToChangeByAdmin(status) {
    return status === ORDER_STATUS.PAID || status === ORDER_STATUS.COMPLETED;
}

export const RES_MESSAGES = {
    SERVER_ERROR: "Đã xảy ra lỗi từ phía server. Quý khách vui lòng thử lại sau.",

    // USER
    USER_LOGIN_SUCCESS: "Đăng nhập thành công",
    REGISTER_USER_SUCCESS: "Đăng ký tài khoản thành công. Vui lòng truy cập email đã đăng ký để xác thực tài khoản.",
    USERNAME_EXIST: "Email đã tồn tại.",
    PHONE_EXIST: "Số điện thoại đã tồn tại.",
    WRONG_USERNAME_PASSWORD: "Sai tài khoản hoặc mật khẩu.",
    USER_BANNED: "Your account is banned, contact administrator for details",
    AUTHENTICATION_FAILED: "Please login to use this function",
    OLD_PASSWORD_WRONG: "Old password is incorrect",
    CHANGE_PASSWORD_SUCCESS: "Changed password SUCCESS",
    UPDATE_USER_SUCCESS: "Updated user information SUCCESS",
    UNVERIFIED_ACCOUNT: "Vui lòng xác thực tài khoản qua email trước khi đăng nhập.",
    USERNAME_NOT_EXIST: "Username does not exist",
    INVALID_EMAIL: "Email không hợp lệ.",
    WEAK_PASSWORD: "Mật khẩu chứa ít nhất 6 kí tự.",
    FIND_PASSWORD_RESET_MAIL: "Please check your mailbox to find reset password mail",
    INVALID_USER_ROLE: "Vai trò người dùng không hợp lệ.",
    USER_NOT_EXIST: "Không tồn tại người dùng.",

    // CATEGORY
    CATEGORY_NAME_EXIST: "Tên danh mục đã tồn tại",
    CREATE_CATEGORY_SUCCESS: "Tạo danh mục sản phẩm thành công.",
    DELETE_CATEGORY_SUCCESS: "Xóa danh mục sản phẩm thành công.",
    UPDATE_CATEGORY_SUCCESS: "Cập nhật danh mục sản phẩm thành công.",
    CATEGORY_NAME_NOT_EXIST: "Không tồn tại danh mục sản phẩm.",

    // PRODUCT
    DELETE_PRODUCT_SUCCESS: "Xóa sản phẩm thành công.",
    PRODUCT_NOT_EXIST: "Không tồn tại sản phẩm.",
    CREATE_PRODUCT_SUCCESS: "Tạo sản phẩm thành công.",
    UPDATE_PRODUCT_SUCCESS: "Cập nhật sản phẩm thành công.",
    ADD_PRODUCT_TO_FAVOURITE: "Thêm sản phẩm vào danh sách yêu thích.",
    DELETE_PRODUCT_TO_FAVOURITE: "Xóa sản phẩm vào danh sách yêu thích.",
    ALL_PRODUCT: "Lấy tất cả sản phẩm vào danh sách yêu thích.",

    // COLOR
    COLOR_NOT_EXIST: "Màu sản phẩm không tồn tại.",
    COLOR_EXIST: "Màu sản phẩm đã tồn tại.",
    CREATE_COLOR_SUCCESS: "Tạo màu sản phẩm thành công.",
    DELETE_COLOR_SUCCESS: "Xóa màu sản phẩm thành công.",
    DELETE_COLOR_FAIL_VARIANT_EXIST: "Xóa màu sản phẩm thất bại, đang tồn tại loại sản phẩm dùng màu sắc này.",
    UPDATE_COLOR_SUCCESS: "Cập nhật màu sản phẩm thành công.",

    // SIZE
    SIZE_NOT_EXIST: "Kích thước sản phẩm không tồn tại.",
    SIZE_EXIST: "Kích cỡ sản phẩm đã tồn tại.",
    CREATE_SIZE_SUCCESS: "Tạo kích cỡ sản phẩm thành công.",
    DELETE_SIZE_SUCCESS: "Xóa kích cỡ sản phẩm thành công.",
    DELETE_SIZE_FAIL_VARIANT_EXIST: "Xóa kích cỡ sản phẩm thất bại, đang tồn tại loại sản phẩm dùng kích cỡ này.",
    UPDATE_SIZE_SUCCESS: "Cập nhật kích cỡ sản phẩm thành công.",

    // VARIANT
    VARIANT_NOT_EXIST: "Loại sản phẩm không tồn tại.",
    VARIANT_EXIST: "Loại sản phẩm đã tồn tại.",
    CREATE_VARIANT_SUCCESS: "Tạo loại sản phẩm thành công.",
    DELETE_VARIANT_SUCCESS: "Xóa loại sản phẩm thành công.",
    UPDATE_VARIANT_SUCCESS: "Cập nhật loại sản phẩm thành công.",

    // VOUCHER
    VOUCHER_NOT_EXIST: "Voucher không tồn tại.",
    VOUCHER_CODE_EXIST: "Mã voucher đã tồn tại.",
    CREATE_VOUCHER_SUCCESS: "Tạo voucher thành công.",
    DELETE_VOUCHER_SUCCESS: "Xóa voucher thành công.",
    UPDATE_VOUCHER_SUCCESS: "Cập nhật voucher thành công.",
    APPLY_VOUCHER_SUCCESS: "Áp dụng voucher thành công",
    VOUCHER_NOT_AVAILABLE: "Voucher này đã hết số lần sử dụng.",
    VOUCHER_EXPIRED: "Voucher này đã hạn sử dụng.",

    // REVIEW
    REVIEW_NOT_EXIST: "Đánh giá không tồn tại.",
    REVIEW_EXIST: "Không thể đánh giá sản phẩm nhiều lần.",
    CREATE_REVIEW_SUCCESS: "Đánh giá sản phẩm thành công.",
    DELETE_REVIEW_SUCCESS: "Xóa đánh giá thành công.",
    UPDATE_REVIEW_SUCCESS: "Cập nhật đánh giá thành công.",

    // CART
    CART_NOT_EXIST: "Giỏ hàng không tồn tại.",
    DELETE_CART_SUCCESS: "Xóa giỏ hàng thành công.",
    UPDATE_CART_SUCCESS: "Cập nhật giỏ hàng thành công.",

    // ORDER
    ORDER_AMOUNT_LESS_THAN_VOUCHER: "Giá trị đơn hàng không đạt yêu cầu của voucher.",
    CREATE_ORDER_SUCCESS: "Tạo đơn hàng thành công",
    INVALID_ORDER_STATUS: "Trạng thái đơn hàng gửi lên không hợp lệ.",
    ORDER_NOT_EXIST: "Đơn hàng không tồn tại",
    ORDER_NOT_CANCELLABE: "Đơn hàng không thể hủy bỏ.",
    CANCEL_ORDER_SUCCESS: "Hủy đơn hàng thành công.",
    CHANGE_ORDER_STATUS_SUCCESS: "Sửa trạng thái đơn hàng thành công.",
}

export const FIREBASE_AUTH_ERROR_CODES = {
    EMAIL_ALREADY_EXISTS: "auth/email-already-in-use",
    INVALID_CREDENTIAL: "auth/invalid-credential",
    INVALID_EMAIL: "auth/invalid-email",
    WEAK_PASSWORD: "auth/weak-password",
    MISSING_EMAIL: "auth/missing-email",
    MISSING_PASSWORD: "auth/missing-password",
}