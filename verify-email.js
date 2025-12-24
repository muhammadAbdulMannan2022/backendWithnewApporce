import "dotenv/config";
import nodemailer from "nodemailer";

async function verifyConnection() {
  console.log("🔍 Checking Email Configuration...\n");

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const service = process.env.EMAIL_SERVICE;

  if (!user || !pass) {
    console.error("❌ Missing EMAIL_USER or EMAIL_PASS in .env file");
    return;
  }

  // Check for hidden spaces
  if (user.trim() !== user) console.warn("⚠️ WARNING: Your EMAIL_USER has leading/trailing spaces in .env!");
  if (pass.trim() !== pass) console.warn("⚠️ WARNING: Your EMAIL_PASS has leading/trailing spaces in .env!");

  console.log(`User: ${user.replace(/(?<=^.{3}).*(?=@)/, "****")}`); // Masked
  console.log(`Pass length: ${pass.length} characters`);
  console.log(`Service: ${service || "Not set (will try generic)"}`);

  const transporter = nodemailer.createTransport({
    service: service || "gmail",
    auth: {
      user: user.trim(), // We trim here to see if it fixes it
      pass: pass.trim(),
    },
  });

  try {
    console.log("\nAttempting to connect to Google...");
    await transporter.verify();
    console.log("✅ Success! Your email credentials are working.");
    console.log("If this works but the app fails, check for spaces in your .env file.");
  } catch (error) {
    console.error("❌ Auth Failed:");
    if (error.code === 'EAUTH') {
        console.error("   Reason: Invalid username or password.");
        console.error("   1. Make sure you are using an 'App Password', NOT your main Google password.");
        console.error("   2. Generate a new App Password here: https://myaccount.google.com/apppasswords");
        console.error("   3. Ensure you entered your full gmail address.");
    } else {
        console.error(error.message);
    }
  }
}

verifyConnection();
