import { FIREBASE_AUTH_ERROR_CODES, RES_MESSAGES } from "./constants.js"

const responseObject = (message) => ({ message, data: "" })

export const firebaseAuthErrorHandler = (code, res) => {
    switch (code) {
        case FIREBASE_AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS:
            return res.status(409).send(responseObject(RES_MESSAGES.USERNAME_EXIST));

        case FIREBASE_AUTH_ERROR_CODES.INVALID_CREDENTIAL:
            return res.status(401).send(responseObject(RES_MESSAGES.WRONG_USERNAME_PASSWORD));

        case FIREBASE_AUTH_ERROR_CODES.INVALID_EMAIL:
            return res.status(400).send(responseObject(RES_MESSAGES.INVALID_EMAIL));

        case FIREBASE_AUTH_ERROR_CODES.WEAK_PASSWORD:
            return res.status(400).send(responseObject(RES_MESSAGES.WEAK_PASSWORD));

        case FIREBASE_AUTH_ERROR_CODES.MISSING_EMAIL:
            return res.status(400).send(responseObject(RES_MESSAGES.INVALID_EMAIL));

        case FIREBASE_AUTH_ERROR_CODES.MISSING_PASSWORD:
            return res.status(400).send(responseObject(RES_MESSAGES.WEAK_PASSWORD));

        default:
            res.status(500).send(responseObject(RES_MESSAGES.SERVER_ERROR));
    }
}

export const isValidRole = (role) => role !== "user" && role !== "admin";