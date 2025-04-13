import pool from "../config/database.js";
import { RES_MESSAGES } from "../utils/constants.js";

//#region Web api
export const getStatistics = async (req, res) => {
    try {
        // Order counts
        const [orderData] = await pool.query(
            `SELECT
                COUNT(*) AS total_orders,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders,
                SUM(CASE WHEN status IN ('pending', 'paid', 'shipping') THEN 1 ELSE 0 END) AS other_orders
            FROM \`order\``,
            []
        );

        // Voucher
        const [voucherData] = await pool.query(
            `SELECT COUNT(*) AS voucher_count FROM voucher;`,
            []
        )
        // User
        const [userData] = await pool.query(
            `SELECT COUNT(*) AS user_count FROM user WHERE role != 'admin'`,
            []
        )

        // Product
        const [productData] = await pool.query(
            `SELECT COUNT(*) AS product_count FROM product;`,
            []
        )

        // Category
        const [categoryData] = await pool.query(
            `SELECT COUNT(*) AS category_count FROM category;`,
            []
        )

        // Top 5 best-selling products
        const [top5SellingProducts] = await pool.query(
            `SELECT 
                p.product_id,
                p.product_name,
                pi.image_url AS product_image,
                v.variant_id,
                c.color_name,
                s.size_name,
                SUM(oi.quantity) AS total_quantity_sold
            FROM order_item oi
            JOIN \`order\` o ON oi.order_id = o.order_id
            JOIN variant v ON oi.variant_id = v.variant_id
            JOIN product p ON v.product_id = p.product_id
            LEFT JOIN color c ON v.color_id = c.color_id
            LEFT JOIN size s ON v.size_id = s.size_id
            LEFT JOIN (
                SELECT product_id, MIN(image_url) AS image_url
                FROM product_image
                GROUP BY product_id
            ) pi ON pi.product_id = p.product_id
            WHERE o.status != 'cancelled'
            GROUP BY 
                p.product_id,
                p.product_name,
                pi.image_url,
                v.variant_id,
                c.color_name,
                s.size_name
            ORDER BY total_quantity_sold DESC
            LIMIT 5`,
            []
        )
        top5SellingProducts.forEach(item => item.total_quantity_sold = Number(item.total_quantity_sold))

        // Income
        const [incomeData] = await pool.query(
            `WITH months AS (
                SELECT 1 AS month UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8
                UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12
            )
            SELECT 
                m.month,
                IFNULL(SUM(o.final_price), 0) AS income
            FROM months m
            LEFT JOIN \`order\` o
                ON MONTH(o.created_date) = m.month
                AND YEAR(o.created_date) = YEAR(CURRENT_DATE)
                AND o.status = 'completed'
            GROUP BY m.month
            ORDER BY m.month`
        )

        res.status(200).json({
            message: "",
            data: {
                order_data: orderData[0],
                user_count: userData[0].user_count,
                product_count: productData[0].product_count,
                voucher_count: voucherData[0].voucher_count,
                category_count: categoryData[0].category_count,
                income_data: incomeData,
                top_selling_products: top5SellingProducts,
            },
        });
    } catch (error) {
        console.log("dashboardController::getStatistics => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};
//#endregion