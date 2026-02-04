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
![alt text](https://file%2B.vscode-resource.vscode-cdn.net/Users/akashkumar/Desktop/Screenshot%202026-02-05%20at%201.06.13%E2%80%AFAM.png?version%3D1770233952170)

## Sample output

![alt text](https://file%2B.vscode-resource.vscode-cdn.net/Users/akashkumar/Desktop/Screenshot%202026-02-05%20at%201.05.56%E2%80%AFAM.png?version%3D1770234059193)

## Run the Client Application

npm install
npm start

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
