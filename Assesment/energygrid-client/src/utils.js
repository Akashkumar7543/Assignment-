import crypto from "crypto";

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function generateSignature(url, token, timestamp) {
    return crypto
        .createHash("md5")
        .update(url + token + timestamp)
        .digest("hex");
}

export function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}