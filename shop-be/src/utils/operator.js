import { existsSync, unlinkSync } from "fs";

export const deleteImages = (images) => {
    if (images) {
        if (images instanceof Array) {
            images.forEach((image) => existsSync(`./static/${image}`) && unlinkSync(`./static/${image}`));
        }
    }
};