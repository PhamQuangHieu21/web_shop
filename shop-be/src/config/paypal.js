import fetch from 'node-fetch';
import { RES_MESSAGES, SERVER_URL } from '../utils/constants';

const PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";

// Get PayPal Access Token
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

const createOrder = async () => {
    try {
        // Fetch access token
        const accessToken = await getPaypalAccessToken();
        if (!accessToken) {
            console.error("getPaypalAccessToken() failed: ", error);
            return {
                status: 500,
                message: RES_MESSAGES.PAYMENT_ERROR,
                data: "",
            }
        }

        // Create order
        const order = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [{ amount: { currency_code: "USD", value: amount } }],
                application_context: {
                    return_url: `${SERVER_URL}/success`,
                    cancel_url: `${SERVER_URL}/cancel`,
                },
            })
        });

        // Fetch approval url to re-direct end-user
        const approvalUrl = order.data.links.find(link => link.rel === "approve").href;
        if (!approvalUrl) {
            console.error("get approval link failed: ");
            return {
                status: 500,
                message: RES_MESSAGES.PAYMENT_ERROR,
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
        console.error("createOrder() failed: ", error);
        return {
            status: 500,
            message: RES_MESSAGES.PAYMENT_ERROR,
            data: "",
        }
    }
}

export {
    createOrder
}