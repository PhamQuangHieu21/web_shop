import { existsSync, unlinkSync } from "fs";

export const deleteImages = (images) => {
    if (images) {
        if (images instanceof Array) {
            images.forEach((image) => existsSync(`./static/${image}`) && unlinkSync(`./static/${image}`));
        }
    }
};

export const formatDateForMySQL = (isoString) => {
    const receivedDate = new Date(isoString);
    // we plus 7 hours to convert the datetime to UTC+7 because Nodejs set the datetime to UTC
    return new Date(receivedDate.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 19).replace("T", " ");
}

export const convertVndToUsd = (amountVnd, exchangeRate = 25000) => {
    return (amountVnd / exchangeRate).toFixed(2); // Convert and round to 2 decimal places
};