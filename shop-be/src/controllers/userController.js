import bcrypt from "bcryptjs";
import { RES_MESSAGES } from "../utils/constants.js";
import { auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "../../firebase.js";
import { firebaseAuthErrorHandler, isValidRole } from "../utils/validator.js";
import pool from "../config/database.js";

export const ping = async (req, res) => {
    try {
        res.status(200).send("OKAY");
    } catch (error) {
        console.log("userController::ping => error: " + error);
        res.status(500).send("ERROR");
    }
};

export const register = async (req, res) => {
    const user = req.body;
    try {
        // Validate
        if (isValidRole(user.role))
            return res.status(400).send({
                message: RES_MESSAGES.INVALID_USER_ROLE,
                data: "",
            });

        const [existingPhone] = await pool.query(
            "SELECT * FROM `user` WHERE phone_number = ?",
            [user.phone_number]
        );
        if (existingPhone.length > 0)
            return res.status(409).send({
                message: RES_MESSAGES.PHONE_EXIST,
                data: "",
            });

        // Register
        await createUserWithEmailAndPassword(auth, user.email, user.password);
        await sendEmailVerification(auth.currentUser);

        const hashedPassword = await bcrypt.hash(user.password, 12);
        await pool.query(
            "INSERT INTO `user` (full_name, email, password, phone_number, address, role) VALUES (?, ?, ?, ?, ?, ?)",
            [user.full_name, user.email, hashedPassword, user.phone_number, user.address, user.role]
        );

        res.status(200).json({
            message: RES_MESSAGES.REGISTER_USER_SUCCESSFULLY,
            data: "",
        });
    } catch (error) {
        console.log("userController::register => error: " + error);
        firebaseAuthErrorHandler(error.code, res);
    }
}

export const login = async (req, res) => {
    const user = req.body;
    try {
        // Validate
        const [existingUser] = await pool.query(
            "SELECT * FROM `user` WHERE email = ?",
            [user.email]
        );
        if (existingUser.length === 0) {
            return res.status(401).send({
                message: RES_MESSAGES.WRONG_USERNAME_PASSWORD,
                data: "",
            });
        }
        const isPasswordCorrect = await bcrypt.compare(user.password, existingUser[0].password);
        if (!isPasswordCorrect)
            return res.status(401).send({
                message: RES_MESSAGES.WRONG_USERNAME_PASSWORD,
                data: "",
            });

        // Login
        await signInWithEmailAndPassword(auth, user.email, user.password);

        if (auth.currentUser && auth.currentUser.emailVerified) {
            delete existingUser[0].password;
            res.status(200).json({
                message: RES_MESSAGES.USER_LOGIN_SUCCESSFULLY,
                data: existingUser[0],
            });
        }
        else res.status(401).send({
            message: RES_MESSAGES.UNVERIFIED_ACCOUNT,
            data: "",
        });
    } catch (error) {
        console.log("userController::login => error: " + error);
        firebaseAuthErrorHandler(error.code, res);
    }
}