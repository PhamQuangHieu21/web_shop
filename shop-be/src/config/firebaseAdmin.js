import admin from "firebase-admin"

import serviceAccount from "./shop-be-6b0ff-firebase-adminsdk-fbsvc-92c67dc421.json"

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://shop-be-6b0ff-default-rtdb.asia-southeast1.firebasedatabase.app"
});

async function pushNotificationToAndroid(title, content) {
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
    pushNotificationToAndroid
};

