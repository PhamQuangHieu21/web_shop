import { RES_MESSAGES } from "../utils/constants.js";

const tempData = Array.from({ length: 100 }, (_, i) => ({
    product_id: i + 1,
    product_name: `Quần ${i + 1}`,
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    price: 100000,
    quantity: i + 1,
    category: "Quần áo",
    img: Array(8).fill(0).map((_, i) => `http://localhost:5000/images/${i + 2}.jpg`),
    modified_date: new Date(),
    created_date: new Date(),
    isFavourite: false,
}))

export const getAllProducts = async (req, res) => {
    try {
        setTimeout(() => {
            res.status(200).json({
                message: "",
                data: tempData,
            });
        }, 500);
    } catch (error) {
        console.log("productController::ping => error: " + error);
        res.status(500).send({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const likeProduct = async (req, res) => {
    const data = req.body;
    if (!data.user_id || !data.product_id) {
        res.status(400).send({
            message: "Bad request",
            data: "",
        });
    }
    try {
        setTimeout(() => {
            res.status(200).json({
                message: "Thêm sản phẩm vào mục yêu thích.",
                data: "",
            });
        }, 500);
    } catch (error) {
        console.log("productController::ping => error: " + error);
        res.status(500).send({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};
