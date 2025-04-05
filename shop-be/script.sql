CREATE DATABASE shop;

USE shop;

-- User
CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    address TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Category
CREATE TABLE category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Color
CREATE TABLE color (
    color_id INT AUTO_INCREMENT PRIMARY KEY,
    color_name VARCHAR(50) NOT NULL UNIQUE,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Size
CREATE TABLE size (
    size_id INT AUTO_INCREMENT PRIMARY KEY,
    size_name VARCHAR(50) NOT NULL UNIQUE,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Voucher
CREATE TABLE voucher (
    voucher_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('fixed', 'percentage') NOT NULL,
    discount_value INT NOT NULL,
    min_order_value INT DEFAULT 0,
    max_discount INT DEFAULT 0,
    quantity INT DEFAULT 0,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User Notification
CREATE TABLE user_notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Conversation
CREATE TABLE conversation (
    conversation_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    name TEXT NOT NULL,
    last_message TEXT,
    last_message_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Product
CREATE TABLE product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INT,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE SET NULL
);

-- Product Image
CREATE TABLE product_image (
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (product_id, image_url),
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

-- Variant
CREATE TABLE variant (
    variant_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    color_id INT,
    size_id INT,
    price INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    FOREIGN KEY (color_id) REFERENCES color(color_id) ON DELETE SET NULL,
    FOREIGN KEY (size_id) REFERENCES size(size_id) ON DELETE SET NULL,
    UNIQUE (product_id, color_id, size_id),
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Product Favourite
CREATE TABLE product_favourite (
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (product_id, user_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Cart
CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES variant(variant_id) ON DELETE CASCADE,
    UNIQUE (user_id, variant_id)
);

-- Review
CREATE TABLE review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    content TEXT,
    number_of_stars INT CHECK (number_of_stars BETWEEN 1 AND 5),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Order
CREATE TABLE `order` (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price INT NOT NULL,
    discount_amount INT DEFAULT 0,
    final_price INT NOT NULL,
    voucher_id INT DEFAULT NULL,
    status ENUM('pending', 'paid', 'completed', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('cod', 'credit_card', 'paypal') NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_fee INT NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (voucher_id) REFERENCES voucher(voucher_id) ON DELETE SET NULL
);

-- Order Item
CREATE TABLE order_item (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    variant_id INT NOT NULL,
    price INT NOT NULL,
    quantity INT NOT NULL,
    subtotal INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES `order`(order_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES variant(variant_id) ON DELETE CASCADE
);

-- Voucher Usage
CREATE TABLE voucher_usage (
    usage_id INT AUTO_INCREMENT PRIMARY KEY,
    voucher_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voucher_id) REFERENCES voucher(voucher_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES `order`(order_id) ON DELETE CASCADE
);

-- Message
CREATE TABLE message (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    status ENUM('sent', 'delivered', 'read') DEFAULT 'sent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversation(conversation_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES user(user_id) ON DELETE CASCADE
);