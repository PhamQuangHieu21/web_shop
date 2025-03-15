import { existsSync, unlinkSync } from "fs";

export const deleteImages = (images) => {
    if (images) {
        if (images instanceof Array) {
            images.forEach((image) => existsSync(`./static/${image}`) && unlinkSync(`./static/${image}`));
        } else {
            const linkToDelete = "./static/" + images.slice(22);
            if (existsSync(linkToDelete)) unlinkSync(linkToDelete);
        }
    }
};