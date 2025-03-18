import bcrypt from "bcryptjs";
import { RES_MESSAGES } from "../utils/constants.js";
import { auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "../../firebase.js";
import { firebaseAuthErrorHandler, isValidRole } from "../utils/validator.js";
import pool from "../config/database.js";
import { EmailAuthCredential, EmailAuthProvider, getAuth, reauthenticateWithCredential, updateCurrentUser, updatePassword } from "firebase/auth";
import { log } from "console";

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

export const getAllUsers = async (req, res) => {
    const user = req.body;
    try {
        // Validate
        const [usersList] = await pool.query("SELECT * FROM `user`",);

        res.status(200).json({
            message: "",
            data: usersList,
        });
    } catch (error) {
        console.log("userController::getAllUsers => error: " + error);
    }
}

export const updateUsers = async (req, res) => {
    const user = req.body;
    const { id } = req.params;
    try {
        console.log("user = " + user);
        console.log("id = " + id);

        console.log("id = " + user.user_id);
        // Validate
        const [existingCategory] = await pool.query(
            "SELECT * FROM `user` WHERE user_id = ?",
            [user.user_id]
        );
        if (existingCategory.length === 0) {
            console.log("updateUsers")
            return res.status(400).send({
                message: RES_MESSAGES.CATEGORY_NAME_NOT_EXIST,
                data: "",
            });
        }

        // Update product
        await pool.query(
            "UPDATE `user` SET full_name = ?, phone_number = ?, address = ?, modified_date = NOW() where user_id = ?",
            [user.full_name, user.phone_number, user.address, user.user_id]
        );

        res.status(200).json({
            message: RES_MESSAGES.UPDATE_PRODUCT_SUCCESSFULLY,
            data: [],
        });
    } catch (error) {
        console.log("productController::updateUsers => error: " + error);
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

        // Authenticate the user with the old password
        const userCredential = await signInWithEmailAndPassword(auth, email, passwordOld);
        const currentUser = auth.currentUser;

        if (!currentUser) {
            return res.status(401).send({
                message: "Authentication failed. No current user found.",
                data: "",
            });
        }

        // Reauthenticate the user
        const credentials = EmailAuthProvider.credential(email, passwordOld);
        await reauthenticateWithCredential(currentUser, credentials);

        // Update the password
        await updatePassword(currentUser, passwordNew);
        console.log("Password updated successfully in Firebase");

        // Hash the new password
        const hashedPassword = await bcrypt.hash(passwordNew, 12);

        // Update the password in the database
        await pool.query(
            "UPDATE `user` SET password = ?, modified_date = NOW() WHERE user_id = ?",
            [hashedPassword, id]
        );

        console.log("Password updated successfully in the database");

        // Send a success response
        res.status(200).send({
            message: "Password updated successfully",
            data: "",
        });
    } catch (error) {
        console.error("Error updating password:", error);
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