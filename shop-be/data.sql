use shop;
-- Category
INSERT INTO category (name, icon)
VALUES 
('Áo Thun', 'tshirt'),
('Giày', 'shoe'),
('Đồng Hồ', 'watch'),
('Áo Khoác', 'jacket'),
('Túi Xách', 'bag'),
('Phụ Kiện', 'accessory'),
('Mũ', 'hat'),
('Kính Mát', 'sunglasses');

-- Color
INSERT INTO color (color_name)
VALUES 
('#FF0000'),('#0000FF'), ('#000000'), ('#FFFFFF'), ('#008000'), ('#FFD700'), ('#800080'), ('#FFA500'), ('#A52A2A'), ('#808080'); 

-- Size
INSERT INTO size (size_name)
VALUES 
('XS'), ('S'), ('M'), ('L'), ('XL'), ('XXL'), ('39'), ('40'), ('41'), ('42'), ('43'), ('44');

-- Product, product image and variant
INSERT INTO product (product_name, description, category_id)
VALUES
('Áo Thun Basic Cổ Tròn', 'Áo thun cotton 100% mềm mại, thoáng mát, phù hợp cho mọi hoạt động hàng ngày.', 1),
('Giày Sneaker Thể Thao Nam', 'Giày sneaker thiết kế năng động, êm ái, hỗ trợ tốt cho việc tập luyện và di chuyển.', 2),
('Đồng Hồ Nam Dây Da Lịch Lãm', 'Đồng hồ nam mặt tròn, dây da cao cấp, hiển thị lịch ngày, mang đến vẻ ngoài lịch lãm.', 3),
('Áo Khoác Gió Chống Nước', 'Áo khoác gió nhẹ, có khả năng chống thấm nước, bảo vệ bạn khỏi thời tiết xấu.', 4),
('Túi Xách Nữ Thời Trang', 'Túi xách nữ thiết kế hiện đại, nhiều ngăn tiện lợi, phù hợp để đi làm hoặc dạo phố.', 5),
('Kính Râm Phân Cực Chống UV', 'Kính râm gọng kim loại, tròng kính phân cực chống tia UV, bảo vệ mắt tối ưu.', 8),
('Mũ Lưỡi Trai Thêu Logo', 'Mũ lưỡi trai phong cách casual, chất liệu thoáng khí, có thể điều chỉnh kích cỡ.', 7),
('Áo Thun Oversize Unisex', 'Áo thun form rộng unisex, chất liệu cotton thoải mái, dễ dàng phối đồ.', 1),
('Giày Sandal Nữ Đi Biển', 'Sandal nữ đế bằng, chất liệu chống trơn trượt, thích hợp cho các hoạt động ngoài trời.', 2),
('Đồng Hồ Nữ Dây Kim Loại Sang Trọng', 'Đồng hồ nữ mặt nhỏ, dây kim loại sáng bóng, tôn lên vẻ đẹp quý phái.', 3),
('Áo Khoác Bomber Cá Tính', 'Áo khoác bomber dáng ngắn, chất liệu kaki bền bỉ, mang đến phong cách trẻ trung.', 4),
('Túi Đeo Chéo Mini Da Thật', 'Túi đeo chéo nhỏ gọn làm từ da thật, thiết kế đơn giản nhưng tinh tế.', 5),
('Phụ Kiện Tóc Dây Buộc Nhiều Màu', 'Set dây buộc tóc nhiều màu sắc, chất liệu co giãn tốt, không gây đau tóc.', 6),
('Mũ Bucket Vải Canvas', 'Mũ bucket thời trang, chất liệu canvas mềm mại, phù hợp cho cả nam và nữ.', 7),
('Kính Cận Gọng Nhựa Tròn', 'Kính cận gọng nhựa dáng tròn, nhẹ nhàng và thoải mái khi đeo.', 6),
('Áo Polo Nam Có Cổ', 'Áo polo chất liệu pique, lịch sự và thoải mái, phù hợp để đi làm hoặc đi chơi.', 1),
('Giày Thể Thao Chạy Bộ Êm Ái', 'Giày thể thao chuyên dụng cho chạy bộ, đệm khí giúp giảm chấn tốt.', 2),
('Đồng Hồ Thông Minh Theo Dõi Sức Khỏe', 'Đồng hồ thông minh nhiều tính năng, theo dõi sức khỏe, thông báo cuộc gọi và tin nhắn.', 3),
('Áo Vest Công Sở Thanh Lịch', 'Áo vest nữ dáng ôm, chất liệu cao cấp, tạo vẻ ngoài chuyên nghiệp.', 4),
('Balo Đa Năng Chống Trộm', 'Balo thiết kế nhiều ngăn, có khóa chống trộm, phù hợp cho việc đi học hoặc du lịch.', 5),
('Vòng Tay Bạc 925 Thiết Kế Tinh Xảo', 'Vòng tay bạc ta 925, thiết kế độc đáo và tinh xảo, làm điểm nhấn cho cổ tay.', 6),
('Mũ Fedora Vành Rộng', 'Mũ fedora phong cách cổ điển, chất liệu nỉ hoặc cói, tạo vẻ ngoài lịch lãm.', 7),
('Kính Mát Gọng Vuông Thời Trang', 'Kính mát gọng vuông bản lớn, che chắn tốt và mang đến vẻ ngoài thời thượng.', 8),
('Áo Sơ Mi Trắng Dài Tay', 'Áo sơ mi trắng basic, dễ phối đồ, phù hợp cho nhiều dịp khác nhau.', 1),
('Giày Cao Gót Dự Tiệc Sang Trọng', 'Giày cao gót mũi nhọn, chất liệu da bóng, tôn dáng và quý phái.', 2),
('Đồng Hồ Điện Tử Thể Thao', 'Đồng hồ điện tử hiển thị số, nhiều chức năng bấm giờ, báo thức.', 3),
('Áo Len Cardigan Mỏng Nhẹ', 'Áo len cardigan dệt kim mỏng, giữ ấm nhẹ nhàng trong tiết trời se lạnh.', 4),
('Ví Cầm Tay Nữ Da PU', 'Ví cầm tay nhỏ gọn, chất liệu da PU bền đẹp, nhiều ngăn đựng thẻ và tiền.', 5),
('Dây Chuyền Bạc Mặt Đá Nhỏ', 'Dây chuyền bạc sợi mảnh, mặt đá nhỏ lấp lánh, tạo vẻ thanh lịch.', 6),
('Mũ Beret Phong Cách Pháp', 'Mũ beret làm từ len hoặc dạ, mang đậm phong cách lãng mạn của Pháp.', 7),
('Kính Mát Mắt Mèo Cổ Điển', 'Kính mát gọng mắt mèo, kiểu dáng retro quyến rũ.', 8),
('Áo Tank Top Tập Gym', 'Áo ba lỗ chất liệu thấm hút mồ hôi tốt, thoải mái vận động.', 1),
('Giày Bệt Mũi Nhọn Thanh Lịch', 'Giày bệt mũi nhọn, kiểu dáng đơn giản nhưng vẫn giữ được nét thanh lịch.', 2),
('Đồng Hồ Cơ Lộ Máy Tinh Xảo', 'Đồng hồ cơ với thiết kế lộ máy, thể hiện sự tinh tế trong từng chi tiết.', 3),
('Áo Hoodie Có Mũ Trùm Đầu', 'Áo hoodie nỉ mềm mại, ấm áp, có mũ trùm đầu tiện lợi.', 4),
('Túi Tote Vải Bố In Hình', 'Túi tote làm từ vải bố dày dặn, in hình ngộ nghĩnh, thân thiện với môi trường.', 5),
('Khuyên Tai Bạc Hình Học', 'Khuyên tai bạc thiết kế hình học đơn giản nhưng hiện đại.', 6),
('Mũ Snapback Cá Tính', 'Mũ snapback với phần lưỡi trai phẳng, phong cách hip-hop.', 7),
('Kính Mát Phi Công Cổ Điển', 'Kính mát kiểu phi công, gọng kim loại mảnh, không bao giờ lỗi mốt.', 8),
('Quần Short Thể Thao Thoáng Mát', 'Quần short thể thao chất liệu nhanh khô, thoải mái khi vận động.', 1),
('Giày Lười Da Nam Công Sở', 'Giày lười da trơn, kiểu dáng lịch sự, dễ dàng xỏ vào.', 2),
('Đồng Hồ Quả Quýt Cổ Điển', 'Đồng hồ quả quýt bỏ túi, mang đậm phong cách vintage.', 3),
('Áo Blazer Nữ Form Rộng', 'Áo blazer dáng rộng, dễ dàng phối với nhiều loại trang phục.', 4),
('Ví Dài Nữ Nhiều Ngăn', 'Ví dài có nhiều ngăn đựng tiền, thẻ và giấy tờ cá nhân.', 5),
('Nhẫn Bạc Đính Đá Zirconia', 'Nhẫn bạc 925 đính đá zirconia lấp lánh.', 6),
('Mũ Cói Đi Biển Vành Rộng', 'Mũ cói vành rộng, giúp che nắng tốt khi đi biển.', 7),
('Kính Mát Gọng Gỗ Tự Nhiên', 'Kính mát với gọng làm từ gỗ tự nhiên độc đáo.', 8),
('Áo Thun Tay Lỡ Street Style', 'Áo thun tay lỡ phong cách đường phố, in hình cá tính.', 1),
('Giày Oxford Da Bóng Lịch Lãm', 'Giày oxford da bóng, kiểu dáng cổ điển và sang trọng.', 2),
('Đồng Hồ Bấm Giờ Thể Thao Chuyên Nghiệp', 'Đồng hồ bấm giờ điện tử với nhiều chức năngChronograph.', 3),
('Áo Phao Siêu Nhẹ Giữ Ấm', 'Áo phao không tay siêu nhẹ, giữ ấm hiệu quả trong mùa đông.', 4),
('Túi Clutch Dự Tiệc Lấp Lánh', 'Túi clutch nhỏ cầm tay, đính đá hoặc kim sa lấp lánh.', 5),
('Lắc Chân Bạc Hình Ngôi Sao', 'Lắc chân bạc nhỏ nhắn với charm hình ngôi sao.', 6),
('Mũ Len Trùm Đầu Ấm Áp', 'Mũ len dày dặn, giữ ấm tốt trong thời tiết lạnh giá.', 7),
('Kính Mát Gradient Ombre', 'Kính mát với tròng kính màu gradient ombre thời trang.', 8),
('Áo Croptop Năng Động', 'Áo croptop khoe eo thon, phù hợp với phong cách trẻ trung.', 1),
('Giày Mule Thoải Mái', 'Giày mule hở gót, dễ dàng mang vào và cởi ra.', 2),
('Đồng Hồ Lặn Chuyên Dụng Chống Nước', 'Đồng hồ lặn chịu được áp lực nước ở độ sâu nhất định.', 3),
('Áo Dạ Tweed Sang Trọng', 'Áo khoác dạ tweed cổ điển, mang đến vẻ đẹp quý phái.', 4),
('Túi Satchel Da Cổ Điển', 'Túi satchel làm từ da, kiểu dáng cổ điển và bền bỉ.', 5),
('Kẹp Tóc Kim Loại Đơn Giản', 'Kẹp tóc kim loại thiết kế tối giản nhưng tinh tế.', 6),
('Mũ Tai Bèo Vải Denim', 'Mũ tai bèo làm từ vải denim cá tính.', 7),
('Kính Mát Không Gọng Hiện Đại', 'Kính mát thiết kế không gọng, mang đến vẻ ngoài hiện đại.', 8),
('Áo Thun Graphic In Hình Độc Đáo', 'Áo thun in hình đồ họa độc đáo và ấn tượng.', 1),
('Giày Boot Cổ Ngắn Cá Tính', 'Giày boot cổ ngắn với nhiều kiểu dáng và chất liệu khác nhau.', 2),
('Đồng Hồ Năng Lượng Mặt Trời Thân Thiện Môi Trường', 'Đồng hồ hoạt động bằng năng lượng mặt trời, không cần thay pin.', 3),
('Áo Parka Ấm Áp Mùa Đông', 'Áo parka dày dặn, có lớp lót lông ấm áp cho mùa đông.', 4),
('Túi Messenger Tiện Dụng', 'Túi đeo vai messenger với nhiều ngăn đựng đồ.', 5),
('Bông Tai Ngọc Trai Thanh Lịch', 'Bông tai ngọc trai tự nhiên hoặc nhân tạo, mang vẻ đẹp thanh lịch.', 6),
('Khăn Choàng Cổ Len Mềm Mại', 'Khăn choàng cổ làm từ len mềm mại, giữ ấm và tạo điểm nhấn cho trang phục.', 7),
('Kính Mát Thể Thao Chống Trượt', 'Kính mát thiết kế ôm sát khuôn mặt, chống trượt khi vận động.', 8),
('Áo Thun Raglan Tay Phối Màu', 'Áo thun tay raglan với phần tay áo phối màu nổi bật.', 1),
('Giày Slip-On Vải Thoáng Khí', 'Giày slip-on làm từ vải mềm mại, thoáng khí, dễ dàng mang.', 2),
('Đồng Hồ Dạ Quang Dễ Nhìn Trong Bóng Tối', 'Đồng hồ có kim và vạch số dạ quang, dễ dàng xem giờ trong điều kiện thiếu sáng.', 3),
('Áo Gile Len Thanh Lịch', 'Áo gile len mặc ngoài áo sơ mi hoặc áo thun, tạo phong cách lịch sự.', 4),
('Túi Đựng Mỹ Phẩm Chống Thấm Nước', 'Túi đựng mỹ phẩm nhỏ gọn, chất liệu chống thấm nước.', 5),
('Trâm Cài Tóc Đính Hạt Lấp Lánh', 'Trâm cài tóc với các hạt đá hoặc cườm lấp lánh.', 6),
('Găng Tay Len Cảm Ứng Điện Thoại', 'Găng tay len có đầu ngón tay đặc biệt để sử dụng màn hình cảm ứng.', 7),
('Kính Bảo Hộ Lao Động Chống Bụi', 'Kính bảo hộ trong suốt, bảo vệ mắt khỏi bụi bẩn và các tác nhân gây hại.', 8),
('Áo Thun Henley Cổ Trụ', 'Áo thun henley với hàng cúc nhỏ ở cổ, mang đến vẻ ngoài nam tính.', 1),
('Giày Tây Da Thật Thủ Công', 'Giày tây làm từ da thật, được gia công tỉ mỉ bằng tay.', 2),
('Đồng Hồ Báo Thức Để Bàn Cổ Điển', 'Đồng hồ báo thức cơ học để bàn với kiểu dáng vintage.', 3),
('Áo Choàng Tắm Cotton Mềm Mại', 'Áo choàng tắm làm từ cotton mềm mại, thấm hút tốt.', 4),
('Ốp Điện Thoại Thời Trang In Hình', 'Ốp lưng điện thoại với nhiều họa tiết và hình ảnh độc đáo.', 6),
('Thắt Lưng Da Nam Mặt Khóa Kim Loại', 'Thắt lưng da thật cho nam, mặt khóa kim loại chắc chắn.', 6),
('Ô (Dù) Che Mưa Gấp Gọn', 'Ô (dù) có thể gấp gọn, tiện lợi mang theo khi trời mưa.', 6),
('Bịt Mắt Ngủ Êm Ái', 'Bịt mắt ngủ giúp bạn dễ dàng đi vào giấc ngủ trong môi trường có ánh sáng.', 6),
('Nút Bịt Tai Chống Ồn', 'Nút bịt tai bằng silicon mềm mại, giúp giảm tiếng ồn hiệu quả.', 6),
('Miếng Lót Giày Tăng Chiều Cao', 'Miếng lót giày giúp tăng thêm vài centimet chiều cao một cách kín đáo.', 6),
('Kính Lúp Cầm Tay Tiện Lợi', 'Kính lúp nhỏ gọn, hữu ích khi đọc sách hoặc xem các chi tiết nhỏ.', 6),
('Bình Nước Giữ Nhiệt In Logo', 'Bình nước giữ nhiệt có khả năng giữ nóng và lạnh, in logo thương hiệu.', 6),
('Túi Vải Không Dệt Thân Thiện Môi Trường', 'Túi vải không dệt có thể tái sử dụng nhiều lần, thân thiện với môi trường.', 5),
('Khăn Mặt Cotton Mềm Mại', 'Khăn mặt làm từ cotton 100%, mềm mại và thấm hút tốt.', 6),
('Bộ Kim Chỉ Đa Năng', 'Bộ kim chỉ với nhiều màu sắc và dụng cụ cần thiết cho việc may vá.', 6),
('Nến Thơm Thư Giãn Tinh Thần', 'Nến thơm với nhiều mùi hương dịu nhẹ, giúp thư giãn tinh thần.', 6),
('Móc Khóa Kim Loại Hình Dáng Độc Đáo', 'Móc khóa làm từ kim loại với nhiều hình dáng và thiết kế độc đáo.', 6),
('Dây Cáp Sạc Điện Thoại Đa Năng', 'Dây cáp sạc có nhiều đầu kết nối khác nhau, phù hợp với nhiều loại thiết bị.', 6),
('Giá Đỡ Điện Thoại Để Bàn Tiện Lợi', 'Giá đỡ điện thoại giúp bạn dễ dàng xem phim hoặc làm việc trên điện thoại.', 6),
('Tai Nghe Nhét Tai Chống Ồn', 'Tai nghe nhét tai với khả năng chống ồn hiệu quả.', 6),
('Sổ Tay Bỏ Túi Kích Thước Nhỏ Gọn', 'Sổ tay nhỏ gọn, tiện lợi để ghi chú mọi lúc mọi nơi.', 6),
('Bút Bi Mực Đen Chất Lượng Cao', 'Bút bi mực đen viết trơn tru và êm ái.', 6),
('Thẻ Nhớ MicroSD Dung Lượng Lớn', 'Thẻ nhớ microSD với dung lượng lớn để lưu trữ dữ liệu.', 6),
('Pin Dự Phòng Dung Lượng Cao', 'Pin sạc dự phòng giúp bạn sạc điện thoại và các thiết bị khác khi không có nguồn điện.', 6),
('Loa Bluetooth Mini Di Động', 'Loa bluetooth nhỏ gọn, dễ dàng mang theo và thưởng thức âm nhạc.', 6);

-- Insert 100 records into the product_image table with image URLs from 1.png to 100.png
INSERT INTO product_image (product_id, image_url)
SELECT p.product_id, CONCAT(seq.n, '.png')
FROM (SELECT product_id FROM product LIMIT 100) p
JOIN (SELECT @row := @row + 1 as n FROM information_schema.columns, (SELECT @row := 0) r LIMIT 100) seq
ON p.product_id = seq.n;

-- Insert 100 unique records into the variant table
INSERT INTO variant (product_id, color_id, size_id, price, quantity)
SELECT
    p.product_id,
    c.color_id,
    s.size_id,
    FLOOR(RAND() * 500000) + 100000, -- Giá từ 100.000 đến 600.000
    FLOOR(RAND() * 50) + 10 -- Số lượng từ 10 đến 60
FROM (SELECT product_id FROM product ORDER BY RAND() LIMIT 20) p -- Select a limited number of products
CROSS JOIN (SELECT color_id FROM color ORDER BY RAND() LIMIT 5) c -- Select a limited number of colors
CROSS JOIN (SELECT size_id FROM size ORDER BY RAND() LIMIT 4) s -- Select a limited number of sizes
ORDER BY RAND()
LIMIT 100;

-- To add more unique variants (if the initial cross join doesn't provide enough unique combinations)
-- This approach tries to generate more unique combinations by iterating through products
INSERT IGNORE INTO variant (product_id, color_id, size_id, price, quantity)
SELECT
    p.product_id,
    (SELECT color_id FROM color ORDER BY RAND() LIMIT 1),
    (SELECT size_id FROM size ORDER BY RAND() LIMIT 1),
    FLOOR(RAND() * 500000) + 100000,
    FLOOR(RAND() * 50) + 10
FROM product p
ORDER BY RAND()
LIMIT 100;

-- Order
-- Assuming you have a 'user' table populated with user_id values
-- and optionally a 'voucher' table with voucher_id values

-- Insert data into the 'order' table (100 records)
INSERT INTO `order` (user_id, total_price, discount_amount, final_price, voucher_id, status, payment_method, shipping_address, shipping_fee)
SELECT
    (SELECT user_id FROM user ORDER BY RAND() LIMIT 1), -- Randomly select a user
    FLOOR(RAND() * 1000000) + 200000, -- Random total price between 200,000 and 1,200,000
    FLOOR(RAND() * 200000), -- Random discount amount up to 200,000
    FLOOR(RAND() * 800000) + 100000, -- Random final price (should ideally be calculated based on total and discount)
    CASE WHEN RAND() < 0.3 THEN (SELECT voucher_id FROM voucher ORDER BY RAND() LIMIT 1) ELSE NULL END, -- Randomly assign a voucher (if voucher table exists)
    CASE FLOOR(RAND() * 4)
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'shipping'
        WHEN 2 THEN 'completed'
        ELSE 'cancelled'
    END,
    CASE FLOOR(RAND() * 3)
        WHEN 0 THEN 'cod'
        WHEN 1 THEN 'credit_card'
        ELSE 'paypal'
    END,
    CONCAT('Số ', FLOOR(RAND() * 100), ', Đường ', FLOOR(RAND() * 50), ' ',
           CASE FLOOR(RAND() * 3)
               WHEN 0 THEN 'Phường/Xã A'
               WHEN 1 THEN 'Phường/Xã B'
               ELSE 'Phường/Xã C'
           END, ', Quận/Huyện ', CHAR(65 + FLOOR(RAND() * 5)), ', Hà Nội'), -- Random Hà Nội address
    FLOOR(RAND() * 50000) + 20000 -- Random shipping fee between 20,000 and 70,000
FROM (SELECT 1 FROM information_schema.columns LIMIT 100) AS dummy;

-- Insert data into the 'order_item' table (around 200-300 records, assuming 1-3 items per order)
INSERT INTO order_item (order_id, variant_id, price, quantity, subtotal)
SELECT
    o.order_id,
    (SELECT variant_id FROM variant ORDER BY RAND() LIMIT 1), -- Randomly select a variant
    v.price, -- Use the price from the selected variant
    FLOOR(RAND() * 3) + 1, -- Random quantity (1 to 3)
    0 -- Subtotal will be calculated later
FROM `order` o
CROSS JOIN (SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS item_count -- Simulate 1 to 3 items per order
JOIN variant v ON (SELECT variant_id FROM variant ORDER BY RAND() LIMIT 1) = v.variant_id -- Join to get variant price (selecting a random variant again for simplicity)
WHERE RAND() < 0.7 -- Adjust probability to control the number of items per order
LIMIT 300;

-- Update the subtotal in 'order_item'
UPDATE order_item
SET subtotal = price * quantity;

-- Update the total_price and final_price in 'order' based on 'order_item'
UPDATE `order` o
SET
    o.total_price = COALESCE((SELECT SUM(oi.subtotal) FROM order_item oi WHERE oi.order_id = o.order_id), 0),
    o.final_price = COALESCE((SELECT SUM(oi.subtotal) FROM order_item oi WHERE oi.order_id = o.order_id), 0) - o.discount_amount + o.shipping_fee;

-- Ensure final_price is not negative
UPDATE `order`
SET final_price = 0
WHERE final_price < 0;
