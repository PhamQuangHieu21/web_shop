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
                SUM(CASE WHEN status NOT IN ('pending', 'paid') THEN 1 ELSE 0 END) AS other_orders
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

        console.log({
            order_data: orderData[0],
            userCount: userData[0].user_count,
            productCount: productData[0].product_count,
            voucherCount: voucherData[0].voucher_count,
            income_data: incomeData,
        })

        res.status(200).json({
            message: "",
            data: {
                order_data: orderData[0],
                user_count: userData[0].user_count,
                product_count: productData[0].product_count,
                voucher_count: voucherData[0].voucher_count,
                income_data: incomeData
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