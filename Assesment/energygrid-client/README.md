# EnergyGrid Data Aggregator

## Overview
This project is a client-side application that fetches real-time telemetry data for 500 solar inverters from the EnergyGrid API.  
The API enforces strict constraints on rate limiting, batch size, and request signing, all of which are handled explicitly in the code without using external tools or libraries.

The provided mock server simulates the EnergyGrid backend and is used only for testing.

---

## Tech Stack
- Node.js (v18+)
- Native `fetch`
- Built-in `crypto` module

No external libraries are used for rate limiting, retries, or cryptographic signing.

---

## Project Structure
```
energygrid-client/
│
├── src/
│ ├── index.js # Main entry point (business logic)
│ ├── apiClient.js # API request & retry handling
│ ├── utils.js # Helper functions (sleep, batching, signature)
│ └── rateLimiter.js # Manual rate-limiting logic
│
├── package.json
└── README.md
```

## Sample output
```
Processing batch 1/50
Processing batch 2/50
...
Processing batch 50/50

All devices fetched Successfully!
Total devices fetched: 500

Sample device data: {
  sn: 'SN-000',
  power: '4.43kw',
  status: 'Online',
  last_updated: '2026-02-04T19:34:13.208Z'
}
```
## Run the Client Application
```
cd energrid-client
npm install
npm start
```
## Approach & Design

1. Serial Number Generation

    Generates 500 dummy serial numbers: SN-000 to SN-499.

2. Batching

    Serial numbers are split into batches of 10 to respect the API batch limit.

    Total requests: 50 (500 ÷ 10).

3. Rate Limiting

    A strict 1 request per second rate limit is enforced using an explicit sleep(1000) delay.

    Requests are processed sequentially to avoid HTTP 429 errors.

4. Cryptographic Signature

    Each request includes a custom Signature header.

    Signature format:
       MD5(url + token + timestamp)

5. Error Handling & Retries

    If the API returns HTTP 429 or a network error occurs:

    The request is retried after a 1-second delay.

    Retries are capped to avoid infinite loops.

6. Aggregation

    All successful responses are combined into a single aggregated result containing data for all 500 devices.

## Assumptions

Node.js version supports native fetch (Node 18+).

The mock API behaves consistently with the provided constraints.

Sequential processing is acceptable to guarantee strict rate limiting.
