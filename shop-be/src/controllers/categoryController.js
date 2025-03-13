import { RES_MESSAGES } from "../utils/constants.js";

const tempData = Array.from({ length: 100 }, (_, i) => ({
    category_id: `${i + 1}`,
    name: `Quần ${i + 1}`,
    icon: "stepforward",
}))

export const getAllCategories = async (req, res) => {
    try {
        setTimeout(() => {
            res.status(200).json({
                message: "",
                data: tempData,
            });
        }, 500);
    } catch (error) {
        console.log("categoryController::ping => error: " + error);
        res.status(500).send({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};
