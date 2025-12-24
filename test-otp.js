#!/usr/bin/env node

/**
 * Test script for OTP registration flow
 * Run with: node test-otp.js
 */

const BASE_URL = 'http://localhost:4000';
const testEmail = `test${Date.now()}@example.com`;
const testPassword = 'SecurePassword123!';

// Helper to make requests
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });
  
  const data = await response.json();
  return { response, data };
}

// Helper to prompt for user input
async function prompt(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      readline.close();
      resolve(answer);
    });
  });
}

async function testOTPFlow() {
  console.log('🧪 Testing OTP Registration Flow\n');
  console.log('═'.repeat(50));
  
  try {
    // Test 1: Register and send OTP
    console.log('\n📝 Step 1: Register new user');
    console.log(`Email: ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    
    const { response: registerRes, data: registerData } = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    
    if (registerRes.ok) {
      console.log('✅', registerData.message);
      console.log('\n⚠️  NOTE: In development, OTP emails may not actually send.');
      console.log('Check your console logs for the OTP code, or check your email.');
    } else {
      console.log('❌ Registration failed:', registerData.message);
      return;
    }
    
    // Wait for user to enter OTP
    console.log('\n📧 Step 2: Enter OTP from email');
    const otp = await prompt('Enter the 6-digit OTP: ');
    
    if (!otp || otp.length !== 6) {
      console.log('❌ Invalid OTP format. OTP must be 6 digits.');
      return;
    }
    
    // Test 2: Verify OTP
    console.log('\n🔍 Verifying OTP...');
    const { response: verifyRes, data: verifyData } = await makeRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        otp: otp,
      }),
    });
    
    if (verifyRes.ok) {
      console.log('✅', verifyData.message);
      console.log('User:', verifyData.user);
      console.log('Cookies received:', verifyRes.headers.get('set-cookie') ? 'Yes' : 'No');
    } else {
      console.log('❌ OTP verification failed:', verifyData.message);
      
      // Offer to resend OTP
      const resend = await prompt('\nWould you like to resend OTP? (y/n): ');
      if (resend.toLowerCase() === 'y') {
        console.log('\n📤 Resending OTP...');
        const { response: resendRes, data: resendData } = await makeRequest('/auth/resend-otp', {
          method: 'POST',
          body: JSON.stringify({ email: testEmail }),
        });
        
        if (resendRes.ok) {
          console.log('✅', resendData.message);
          console.log('Please run the script again and use the new OTP.');
        } else {
          console.log('❌ Failed to resend OTP:', resendData.message);
        }
      }
      return;
    }
    
    // Test 3: Try to access protected route
    console.log('\n🔒 Step 3: Access protected route (/auth/me)');
    const { response: meRes, data: meData } = await makeRequest('/auth/me');
    
    if (meRes.ok) {
      console.log('✅ Successfully accessed protected route');
      console.log('User data:', meData.user);
    } else {
      console.log('❌ Failed to access protected route:', meData.message);
    }
    
    // Test 4: Try to register again with same email
    console.log('\n🔁 Step 4: Try to register with same email (should fail)');
    const { response: dupRes, data: dupData } = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    
    if (!dupRes.ok) {
      console.log('✅ Correctly prevented duplicate registration');
      console.log('Error:', dupData.message);
    } else {
      console.log('❌ Should not allow duplicate registration');
    }
    
    console.log('\n' + '═'.repeat(50));
    console.log('✅ OTP flow test completed!\n');
    
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    console.error('Make sure the server is running on', BASE_URL);
    console.error('Also ensure email configuration is set up in .env file');
  }
}

// Run tests
testOTPFlow();
