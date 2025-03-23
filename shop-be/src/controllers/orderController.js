import { RES_MESSAGES } from "../utils/constants.js";
import pool from "../config/database.js";

//#region Web api
export const getAllOrdersByAdmin = async (req, res) => {
    try {
        const [orders] = await pool.query(
            "SELECT * FROM `order`",
        );

        res.status(200).json({
            message: "",
            data: orders,
        });
    } catch (error) {
        console.log("orderController::getAllOrdersByAdmin => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};
//#endregion

//#region App api
