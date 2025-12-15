#!/usr/bin/env node

/**
 * API Authentication Test Script
 * Tests login and authenticated API calls through Kong
 */

const { execSync } = require('child_process');

async function testAuthentication() {
  console.log('🔐 Testing Authentication Flow');
  console.log('==============================');

  try {
    // First, login to get JWT token
    console.log('1. Logging in...');
    const loginCommand = `curl -s -X POST http://localhost:3001/auth/login \\
      -H "Content-Type: application/json" \\
      -d '{"email":"admin@grcplatform.com","password":"password123"}'`;

    const loginOutput = execSync(loginCommand, { encoding: 'utf8' });
    const loginData = JSON.parse(loginOutput);

    if (!loginData.accessToken) {
      throw new Error('Login failed - no access token received');
    }

    const { accessToken } = loginData;
    console.log('✅ Login successful, got JWT token');

    // Now test API call through Kong with the token
    console.log('2. Testing authenticated API call through Kong...');
    const apiCommand = `curl -s -H "Authorization: Bearer ${accessToken}" \\
      http://localhost:8001/api/dashboard/overview`;

    const apiOutput = execSync(apiCommand, { encoding: 'utf8' });
    const apiData = JSON.parse(apiOutput);

    console.log('✅ API call successful!');
    console.log('Response preview:', JSON.stringify(apiData, null, 2).substring(0, 200) + '...');

  } catch (error) {
    console.log('❌ Test failed:', error.message);
    if (error.stdout) {
      console.log('Response:', error.stdout);
    }
  }
}

if (require.main === module) {
  testAuthentication().catch(console.error);
}

module.exports = { testAuthentication };