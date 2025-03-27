import fetch from 'node-fetch';
import { RES_MESSAGES, SERVER_URL } from '../utils/constants.js';
import { convertVndToUsd } from '../utils/operator.js';

const PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";

const getPaypalAccessToken = async () => {
    const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`).toString("base64");

    try {
        const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials"
        });

        const data = await response.json();
        console.log("Access Token:", data.access_token);
        return data.access_token;
    } catch (error) {
        return null;
    }
};

const createPaypalOrder = async (amount, orderId) => {
    try {
        // Fetch access token
        const accessToken = await getPaypalAccessToken();
        if (!accessToken) {
            console.log("getPaypalAccessToken() failed: ", error);
            return {
                status: 500,
                message: RES_MESSAGES.INITIALIZE_PAYPAL_FAIL,
                data: "",
            }
        }

        // Create order
        const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [{ amount: { currency_code: "USD", value: convertVndToUsd(amount) } }],
                application_context: {
                    return_url: `${SERVER_URL}/payment/paypal-success?orderId=${orderId}`,
                    cancel_url: `${SERVER_URL}/payment/paypal-cancel?orderId=${orderId}`,
                },
            })
        });

        // Fetch approval url to re-direct end-user
        const data = await response.json()
        const approvalUrl = data.links.find(link => link.rel === "approve").href;
        if (!approvalUrl) {
            console.log("get approval link failed");
            return {
                status: 500,
                message: RES_MESSAGES.INITIALIZE_PAYPAL_FAIL,
                data: "",
            }
        }

        // Return url to client
        return {
            status: 200,
            message: "",
            data: approvalUrl,
        }
    } catch (error) {
        console.log("createOrder() failed: ", error);
        return {
            status: 500,
            message: RES_MESSAGES.INITIALIZE_PAYPAL_FAIL,
            data: "",
        }
    }
}

const capturePaypalOrder = async (paypalOrderId) => {
    try {
        if (!paypalOrderId) {
            console.log("capturePaypalOrder() failed: invalid paypalOrderId");
            return { status: 500, message: RES_MESSAGES.INITIALIZE_PAYPAL_FAIL, data: "" };
        }
        // Fetch access token
        const accessToken = await getPaypalAccessToken();
        if (!accessToken) {
            console.log("getPaypalAccessToken() failed");
            return { status: 500, message: RES_MESSAGES.INITIALIZE_PAYPAL_FAIL, data: "" };
        }

        // Capture order
        const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        const result = await response.json();
        if (result.status === "COMPLETED") {
            console.log(RES_MESSAGES.PAYPAL_PAYMENT_SUCCESS)
            return { status: 200, message: RES_MESSAGES.PAYPAL_PAYMENT_SUCCESS, data: result };
        } else {
            console.log(RES_MESSAGES.PAYPAL_PAYMENT_FAIL)
            return { status: 500, message: RES_MESSAGES.PAYPAL_PAYMENT_FAIL, data: result };
        }
    } catch (error) {
        console.log("capturePaypalOrder() failed:", error);
        return { status: 500, message: RES_MESSAGES.PAYPAL_PAYMENT_FAIL, data: "" };
    }
};

export {
    createPaypalOrder,
    capturePaypalOrder
}