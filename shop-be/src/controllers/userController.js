import bcrypt from "bcryptjs";
import { RES_MESSAGES } from "../utils/constants.js";
import { auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "../config/firebase.js";
import { firebaseAuthErrorHandler, isValidRole } from "../utils/validator.js";
import pool from "../config/database.js";
import {
    sendPasswordResetEmail
} from "firebase/auth";
import { adminAuth } from "../config/firebaseAdmin.js"

//#region Admin apis
export const getAllUsersByAdmin = async (req, res) => {
    try {
        const [usersList] = await pool.query("SELECT * FROM `user` WHERE role != 'admin'",);

        res.status(200).json({
            message: "",
            data: usersList,
        });
    } catch (error) {
        console.log("userController::getAllUsersByAdmin => error: " + error);
        res.status(500).send({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
}
//#endregion

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
            message: RES_MESSAGES.REGISTER_USER_SUCCESS,
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
            "SELECT * FROM `user` WHERE email = ? and role = 'user'",
            [user.email]
        );
        if (existingUser.length === 0) {
            return res.status(401).send({
                message: RES_MESSAGES.WRONG_USERNAME_PASSWORD,
                data: "",
            });
        }

        // Login
        await signInWithEmailAndPassword(auth, user.email, user.password);

        // Sync password to DB each time user logs in
        const hashedPassword = await bcrypt.hash(user.password, 12);
        await pool.query(
            "UPDATE `user` SET password = ? WHERE email = ?",
            [hashedPassword, user.email]
        );

        if (auth.currentUser && auth.currentUser.emailVerified) {
            // Save device token for firebase notification
            // await pool.query(
            //     `INSERT INTO user (user_id, token)
            //         VALUES (?, ?)
            //         ON DUPLICATE KEY UPDATE token = ?, created_date = CURRENT_TIMESTAMP`,
            //     [existingUser[0].user_id, user.token, user.token]
            // );

            delete existingUser[0].password;
            res.status(200).json({
                message: RES_MESSAGES.USER_LOGIN_SUCCESS,
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

export const updateUsers = async (req, res) => {
    const user = req.body;
    try {
        // Validate
        const [existingUser] = await pool.query(
            "SELECT * FROM `user` WHERE user_id = ?",
            [user.user_id]
        );
        if (existingUser.length === 0) {
            return res.status(400).send({
                message: RES_MESSAGES.USER_NOT_EXIST,
                data: "",
            });
        }

        // Update product
        await pool.query(
            "UPDATE `user` SET full_name = ?, phone_number = ?, address = ?, modified_date = NOW() where user_id = ?",
            [user.full_name, user.phone_number, user.address, user.user_id]
        );

        res.status(200).json({
            message: RES_MESSAGES.UPDATE_USER_SUCCESS,
            data: [],
        });
    } catch (error) {
        console.log("userController::updateUsers => error: " + error);
        res.status(500).send({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
}

export const updatedPassword = async (req, res) => {
    const { email, passwordOld, passwordNew } = req.body;
    const { id } = req.params;
    try {
        // Log input parameters for debugging
        console.log("email = " + email);
        console.log("passwordOld = " + passwordOld);

        // Validate
        const [existingUser] = await pool.query(
            "SELECT * FROM `user` WHERE user_id = ?",
            [id]
        );
        if (existingUser.length === 0) {
            return res.status(401).send({
                message: RES_MESSAGES.USER_NOT_EXIST,
                data: "",
            });
        }

        // Check if old password is correct
        const isOldPasswordCorrect = await bcrypt.compare(
            passwordOld,
            existingUser[0].password
        );
        if (!isOldPasswordCorrect) {
            return res.status(403).send({
                message: RES_MESSAGES.OLD_PASSWORD_WRONG,
                data: "",
            });
        }

        // Update password in Firebase using firebase admin
        const firebaseUser = await adminAuth.getUserByEmail(email);
        await adminAuth.updateUser(firebaseUser.uid, {
            password: passwordNew,
        });
        console.log("Password updated in Firebase Admin");

        // Hash the new password
        const hashedPassword = await bcrypt.hash(passwordNew, 12);

        // Update the password in the database
        await pool.query(
            "UPDATE `user` SET password = ?, modified_date = NOW() WHERE user_id = ?",
            [hashedPassword, id]
        );
        console.log("Password updated SUCCESS in the database");

        // Send a success response
        res.status(200).send({
            message: RES_MESSAGES.CHANGE_PASSWORD_SUCCESS,
            data: "",
        });
    } catch (error) {
        console.error("userController::updatedPassword => error: " + error);
        firebaseAuthErrorHandler(error.code, res);
    }
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const adminLogin = async (req, res) => {
    const user = req.body;
    try {
        // Validate
        const [existingUser] = await pool.query(
            "SELECT * FROM `user` WHERE email = ? AND role = 'admin'",
            [user.email]
        );
        if (existingUser.length === 0) {
            return res.status(401).send({
                message: RES_MESSAGES.WRONG_USERNAME_PASSWORD,
                data: "",
            });
        }

        // Login
        await signInWithEmailAndPassword(auth, user.email, user.password);

        // Sync password to DB each time user logs in
        const hashedPassword = await bcrypt.hash(user.password, 12);
        await pool.query(
            "UPDATE `user` SET password = ? WHERE email = ?",
            [hashedPassword, user.email]
        );

        if (auth.currentUser && auth.currentUser.emailVerified) {
            // Save device token for firebase notification
            // await pool.query(
            //     `INSERT INTO user (user_id, token)
            //         VALUES (?, ?)
            //         ON DUPLICATE KEY UPDATE token = ?, created_date = CURRENT_TIMESTAMP`,
            //     [existingUser[0].user_id, user.token, user.token]
            // );

            delete existingUser[0].password;
            res.status(200).json({
                message: RES_MESSAGES.USER_LOGIN_SUCCESS,
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

export const resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Log input parameters for debugging
        if (isValidEmail(email)) {
            sendPasswordResetEmail(auth, email).then(() => {
                // Send a success response
                res.status(200).send({
                    message: RES_MESSAGES.RESET_PASSWORD,
                    data: "",
                });
            }).catch((e) => {
                console.log("errer - ", e.code);

                if (e.code) {
                    return firebaseAuthErrorHandler(error.code, res);
                }
            })
        } else {
            res.status(500).send({
                message: "Email is invalid",
                data: "",
            });
        }



    } catch (error) {
        console.log("Error updating password:", error);
        // Handle Firebase authentication errors
        if (error.code) {
            return firebaseAuthErrorHandler(error.code, res);
        }
        // Send a general error response
        res.status(500).send({
            message: "An error occurred while updating the password",
            data: "",
        });
    }
}