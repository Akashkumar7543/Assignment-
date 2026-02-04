import fetch from "node-fetch";
import { generateSignature, sleep } from "./utils.js";

const API_URL = "http://localhost:3000/device/real/query";
const API_PATH = "/device/real/query";
const TOKEN = "interview_token_123";

export async function fetchBatch(snList, retryCount = 0) {
    const timestamp = Date.now().toString();
    const signature = generateSignature(API_PATH, TOKEN, timestamp);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "timestamp": timestamp,
                "signature": signature
            },
            body: JSON.stringify({ sn_list: snList })
        });

        if (response.status === 429) {
            console.log("429 received. Retrying after 1 second...");
            await sleep(1000);
            return fetchBatch(snList, retryCount + 1);
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.data;

    } catch (error) {
        if (retryCount < 3) {
            console.log("⚠️ Network error. Retrying...");
            await sleep(1000);
            return fetchBatch(snList, retryCount + 1);
        }
        throw error;
    }
}