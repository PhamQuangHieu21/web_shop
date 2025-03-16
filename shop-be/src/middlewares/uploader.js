import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";

const productImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "STATIC/images");
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + path.extname(file.originalname);
        if (!(req.body.new_images instanceof Array)) req.body.new_images = [];

        const REQUIRED_PATH = path.join("STATIC", "images");
        if (!existsSync(REQUIRED_PATH))
            mkdirSync(REQUIRED_PATH, { recursive: true });

        req.body.new_images.push(`images/${fileName}`);
        cb(null, fileName);
    },
});

export const productImageUploader = multer({ storage: productImageStorage });