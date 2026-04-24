// Using global fetch available in Node 18+

const BASE_URL = 'http://localhost:4000'; // Adjust port if necessary

async function triggerErrors() {
  console.log("🚀 Starting error generation script...");

  // 1. Trigger the deliberate debug error
  console.log("\n1. Triggering deliberate 500 error...");
  try {
    const res = await fetch(`${BASE_URL}/debug/error`);
    const data = await res.json();
    console.log("Response:", res.status, data.message);
  } catch (err) {
    console.log("Request failed (Is server running?):", err.message);
  }

  // 2. Trigger a 404 error
  console.log("\n2. Triggering 404 Not Found...");
  try {
    const res = await fetch(`${BASE_URL}/non-existent-route`);
    console.log("Response Status:", res.status);
  } catch (err) {
    console.log("Request failed:", err.message);
  }

  // 3. Trigger a route with missing payload (if handled by throw)
  console.log("\n3. Triggering malformed request to /auth/register...");
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'bad-email' }) // Missing password
    });
    const data = await res.json();
    console.log("Response:", res.status, data.message);
  } catch (err) {
    console.log("Request failed:", err.message);
  }

  console.log("\n✅ Done! Check your Admin Dashboard at /admin to see the logs.");
}

triggerErrors();
