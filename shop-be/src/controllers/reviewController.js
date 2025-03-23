import { RES_MESSAGES } from "../utils/constants.js";
import pool from "../config/database.js";

// App api
export const getAllReviewsByProduct = async (req, res) => {
    const { product_id } = req.params;
    try {
        const [reviews] = await pool.query(
            `SELECT 
                r.review_id, 
                u.full_name AS user_name, 
                r.product_id, 
                r.content, 
                r.number_of_stars, 
                r.created_date, 
                r.modified_date
            FROM review r
            JOIN user u ON r.user_id = u.user_id
            WHERE r.product_id = ?`,
            [product_id]
        );

        res.status(200).json({
            message: "",
            data: reviews,
        });
    } catch (error) {
        console.log("reviewController::getAllReviews => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const getAllReviewsByProductByUser = async (req, res) => {
    const { id } = req.params;
    try {
        const [reviews] = await pool.query(
            `SELECT 
                r.review_id, 
                u.full_name AS user_name, 
                r.product_id, 
                p.product_name,
                (SELECT pi.image_url 
                FROM product_image pi 
                WHERE pi.product_id = p.product_id 
                LIMIT 1) AS product_image,
                r.content, 
                r.number_of_stars, 
                r.created_date, 
                r.modified_date
            FROM review r
            INNER JOIN product p on p.product_id = r.product_id
            INNER JOIN user u ON r.user_id = u.user_id
            WHERE r.user_id = ?`,
            [id]
        );

        res.status(200).json({
            message: "",
            data: reviews,
        });
    } catch (error) {
        console.log("reviewController::getAllReviews => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const createReview = async (req, res) => {
    const review = req.body;
    try {
        // Validate
        const [existingUser] = await pool.query(
            "SELECT 1 FROM user WHERE user_id = ? LIMIT 1",
            [review.user_id]
        );
        if (existingUser.length === 0)
            return res.status(404).send({
                message: RES_MESSAGES.USER_NOT_EXIST,
                data: "",
            });

        const [existingProduct] = await pool.query(
            "SELECT 1 FROM product WHERE product_id = ? LIMIT 1",
            [review.product_id]
        );
        if (existingProduct.length === 0)
            return res.status(404).send({
                message: RES_MESSAGES.PRODUCT_NOT_EXIST,
                data: "",
            });

        const [existingReview] = await pool.query(
            "SELECT 1 FROM `review` WHERE user_id = ? AND product_id = ? LIMIT 1",
            [review.user_id, review.product_id]
        );
        if (existingReview.length > 0)
            return res.status(409).send({
                message: RES_MESSAGES.REVIEW_EXIST,
                data: "",
            });

        // Create review
        const [result] = await pool.query(
            "INSERT INTO `review` (user_id, product_id, content, number_of_stars) VALUES (?, ?, ?, ?)",
            [review.user_id, review.product_id, review.content, review.number_of_stars]
        );

        const insertedId = result.insertId;
        const [rows] = await pool.query(
            `SELECT 
                r.review_id, 
                u.full_name AS user_name, 
                r.product_id, 
                r.content, 
                r.number_of_stars, 
                r.created_date, 
                r.modified_date
            FROM review r
            JOIN user u ON r.user_id = u.user_id
            WHERE r.review_id = ?`,
            [insertedId]
        );

        console.log(rows[0])

        res.status(200).json({
            message: RES_MESSAGES.CREATE_REVIEW_SUCCESS,
            data: rows[0],
        });
    } catch (error) {
        console.log("reviewController::createReview => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const deleteReview = async (req, res) => {
    let { review_id } = req.params;
    try {
        // Validate
        const [existingReview] = await pool.query(
            "SELECT 1 FROM `review` WHERE review_id = ? LIMIT 1",
            [review_id]
        );
        if (existingReview.length > 0)
            return res.status(404).send({
                message: RES_MESSAGES.REVIEW_NOT_EXIST,
                data: "",
            });

        // Delete review
        await pool.query("DELETE FROM `review` WHERE review_id = ?", [review_id]);

        res.status(200).json({
            message: RES_MESSAGES.DELETE_REVIEW_SUCCESS,
            data: "",
        });
    } catch (error) {
        console.log("reviewController::deleteReview => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const updateReview = async (req, res) => {
    const review = req.body;
    let { review_id } = req.params;
    try {
        // Validate
        const [existingReview] = await pool.query(
            "SELECT 1 FROM `review` WHERE review_id = ? LIMIT 1",
            [review_id]
        );
        if (existingReview.length > 0)
            return res.status(404).send({
                message: RES_MESSAGES.REVIEW_NOT_EXIST,
                data: "",
            });

        // Update review
        await pool.query(`UPDATE review
                        SET content = ?, number_of_stars = ?, modified_date = NOW()
                        WHERE review_id = ?`,
            [review.content, review.number_of_stars, review_id]);

        // Get updated review
        const [updatedReview] = await pool.query(
            `SELECT 
                r.review_id, 
                u.full_name AS user_name, 
                r.product_id, 
                r.content, 
                r.number_of_stars, 
                r.created_date, 
                r.modified_date
            FROM review r
            JOIN user u ON r.user_id = u.user_id
            WHERE r.review_id = ?`,
            [review_id]
        );

        res.status(200).json({
            message: RES_MESSAGES.UPDATE_REVIEW_SUCCESS,
            data: updatedReview[0],
        });
    } catch (error) {
        console.log("reviewController::updateReview => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
}