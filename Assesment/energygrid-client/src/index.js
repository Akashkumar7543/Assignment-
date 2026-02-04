import { chunkArray } from "./utils.js";
import { rateLimit } from "./rateLimiter.js";
import { fetchBatch } from "./apiClient.js";

async function main() {
    console.log("Starting EnergyGrid Data Aggregator...\n");
    const serialNumbers = Array.from({ length: 500 }, (_, i) =>
        `SN-${String(i).padStart(3, "0")}`
    );

    const batches = chunkArray(serialNumbers, 10);

    const aggregatedResults = [];

    for (let i = 0; i < batches.length; i++) {
        console.log(`Fetching batch ${i + 1}/${batches.length}`);

        const batchData = await fetchBatch(batches[i]);
        aggregatedResults.push(...batchData);

        await rateLimit();
    }

    console.log("\n All devices fetched successfully!");
    console.log(`Total devices received: ${aggregatedResults.length}`);
    console.log("\n Sample device data:", aggregatedResults[0]);
}

main().catch(err => {
    console.error("Fatal error:", err.message);
});