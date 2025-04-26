import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("./shop-be-6b0ff-firebase-adminsdk-fbsvc-92c67dc421.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://shop-be-6b0ff-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const adminAuth = admin.auth();

async function pushNotificationToAndroid(title, content, tokenDevice) {
    const message = {
        android: {
            priority: "High",
            ttl: '360000',
            data: {
                title: title,
                content: content
            }
        },
        token: tokenDevice
    }
    await admin.messaging().send(message);
}

export {
    pushNotificationToAndroid,
    adminAuth
};

