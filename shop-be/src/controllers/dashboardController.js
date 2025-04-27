import pool from "../config/database.js";
import { convertDateToUTC7, RES_MESSAGES } from "../utils/constants.js";
import dayjs from "dayjs"

//#region Web api
export const getCommonStatistics = async (req, res) => {
    try {
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

        res.status(200).json({
            message: "",
            data: {
                user_count: userData[0].user_count,
                product_count: productData[0].product_count,
                voucher_count: voucherData[0].voucher_count,
                category_count: categoryData[0].category_count,
            },
        });
    } catch (error) {
        console.log("dashboardController::getCommonStatistics => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const getOrderAndTopProductStatistics = async (req, res) => {
    const { from, to } = req.body;
    const fromUTC7 = convertDateToUTC7(from);
    const toUTC7 = convertDateToUTC7(to);
    try {
        // Order counts
        const [orderData] = await pool.query(
            `SELECT 
                COUNT(*) AS total_orders,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders,
                SUM(CASE WHEN status IN ('pending', 'shipping') THEN 1 ELSE 0 END) AS other_orders
            FROM \`order\`
            WHERE created_date >= ? AND created_date < ?`,
            [fromUTC7, toUTC7]
        );

        // Top 5 best-selling products
        const [top5SellingProducts] = await pool.query(
            `SELECT 
                p.product_id,
                p.product_name,
                pi.image_url AS product_image,
                c.color_name,
                s.size_name,
                SUM(oi.quantity) AS total_quantity_sold
            FROM 
                order_item oi
            JOIN 
                \`order\` o ON oi.order_id = o.order_id
            JOIN 
                variant v ON oi.variant_id = v.variant_id
            JOIN 
                product p ON v.product_id = p.product_id
            LEFT JOIN 
                product_image pi ON pi.product_id = p.product_id
            LEFT JOIN 
                color c ON v.color_id = c.color_id
            LEFT JOIN 
                size s ON v.size_id = s.size_id
            WHERE 
                o.created_date BETWEEN ? AND ?
                AND o.status IN ('shipping', 'completed')
            GROUP BY 
                p.product_id, p.product_name, pi.image_url, c.color_name, s.size_name
            ORDER BY 
                total_quantity_sold DESC
            LIMIT 5`,
            [fromUTC7, toUTC7]
        )
        top5SellingProducts.forEach(item => item.total_quantity_sold = Number(item.total_quantity_sold))

        res.status(200).json({
            message: "",
            data: {
                order_data: orderData[0],
                top_selling_products: top5SellingProducts,
            },
        });
    } catch (error) {
        console.log("dashboardController::getOrderAndTopProductStatistics => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const getIncomeData = async (req, res) => {
    const { date_range } = req.body;
    const fromUTC7 = convertDateToUTC7(date_range.from);
    const toUTC7 = convertDateToUTC7(date_range.to);
    try {
        const [rows] = await pool.query(
            `SELECT 
                DATE(created_date) AS day,
                SUM(final_price) AS income
            FROM 
                \`order\`
            WHERE 
                created_date BETWEEN ? AND ?
                AND status IN ('shipping', 'completed')
            GROUP BY 
                day
            ORDER BY 
                day`,
            [fromUTC7, toUTC7]
        )

        const incomeMap = {};
        rows.forEach(row => {
            incomeMap[dayjs(row.day).format('DD-MM-YYYY')] = Number(row.income);
        });

        const incomeData = [];
        let current = dayjs(fromUTC7);
        const end = dayjs(toUTC7);

        while (current.isBefore(end) || current.isSame(end)) {
            const day = current.format('DD-MM-YYYY');
            incomeData.push({
                day,
                income: incomeMap[day] || 0
            });
            current = current.add(1, 'day');
        }

        res.status(200).json({
            message: "",
            data: incomeData,
        });
    } catch (error) {
        console.log("dashboardController::getIncomeData => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

//#endregion